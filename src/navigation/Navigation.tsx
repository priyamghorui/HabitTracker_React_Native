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
        const savedState = await loadHabit();
        console.log(savedState);
        const date = new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        savedState?.forEach(element => {
          if (
            element.createdAt != date &&
            element.completedDays != element.targetDays
          ) {
            const start = dayjs(element.createdAt, 'MMM D, YYYY');
            const end = dayjs();
            const totalDays = end.diff(start, 'day') - 1;
            // const end = new Date(endDateStr);
            console.log(totalDays);
            for (let i = 0; i <= totalDays; i++) {
              const formattedDate = start.add(i, 'day').format('MMM D, YYYY');
              if (!element?.habitsLog.includes(formattedDate)) {
                saveHabit(
                  savedState.map(Habit =>
                    Habit.id === element?.id
                      ? {
                          ...Habit,
                          status: false,
                          completedDays: 0,
                          createdAt: formattedDate,
                          updatedAt: formattedDate,
                        }
                      : Habit,
                  ),
                );
                break;
              }
            }
          }
          if (!element.habitsLog.includes(date)) {
            saveHabit(
              savedState.map(Habit =>
                Habit.id === element?.id
                  ? { ...Habit, isCompletedToday: false }
                  : Habit,
              ),
            );
          }
        });
        if (savedState) {
          store.dispatch(hydrateHabits(savedState));
        }
      } catch (e) {
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
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="History" component={History} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
export default Navigation;
