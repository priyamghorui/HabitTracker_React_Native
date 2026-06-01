import React, { useEffect } from 'react';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from '../redux/store/store';

import Home from '../screens/Home';
import History from '../screens/History';
import { loadHabit, saveHabit } from '../utils/persistence';
import { hydrateHabits, setLoadFalse } from '../redux/action/action';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

const Stack = createStackNavigator();

function Navigation(): React.JSX.Element {
  useEffect(() => {
    const init = async () => {
      try {
        const loadedState = await loadHabit();
        if (!loadedState || loadedState.length === 0) {
          store.dispatch(hydrateHabits([]));
          return;
        }

        const todayStr = dayjs().format('MMM D, YYYY');
        // const todayStr =dayjs("Jun 6, 2026", 'MMM D, YYYY').format('MMM D, YYYY');
        // console.log(todayStr);

        let updatedState = JSON.parse(JSON.stringify(loadedState));
        let stateNeedsDiskSync = false;

        updatedState = updatedState.map(element => {
          let updatedElement = { ...element };

          if (
            element.createdAt !== todayStr &&
            element.completedDays !== element.targetDays
          ) {
            console.log('<>');

            const start = dayjs(element.createdAt, 'MMM D, YYYY');
            const end = dayjs();
            // const end =dayjs("Jun 6, 2026", 'MMM D, YYYY');

            const totalDays = end.diff(start, 'day') - 1;

            const habitsLogSet = new Set(element.habitsLog || []);

            for (let i = 0; i <= totalDays; i++) {
              const formattedDate = start.add(i, 'day').format('MMM D, YYYY');

              if (!habitsLogSet.has(formattedDate)) {
                updatedElement.status = false;
                updatedElement.completedDays = 0;
                updatedElement.createdAt = formattedDate;
                updatedElement.updatedAt = formattedDate;
                stateNeedsDiskSync = true;
                break;
              }
            }
          }

          const habitsLogSetAfterReset = new Set(
            updatedElement.habitsLog || [],
          );
          if (
            !habitsLogSetAfterReset.has(todayStr) &&
            updatedElement.isCompletedToday !== false
          ) {
            updatedElement.isCompletedToday = false;
            stateNeedsDiskSync = true;
          }

          return updatedElement;
        });

        if (stateNeedsDiskSync) {
          await saveHabit(updatedState);
        }

        store.dispatch(hydrateHabits(updatedState));
      } catch (e) {
        console.error('Hydration Error:', e);
        store.dispatch(hydrateHabits([]));
      } finally {
        store.dispatch(setLoadFalse());
      }
    };

    init();
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer
        theme={{
          ...DefaultTheme,
          colors: {
            ...DefaultTheme.colors,
            background: '#fff',
          },
        }}
      >
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="History" component={History} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}

export default Navigation;
