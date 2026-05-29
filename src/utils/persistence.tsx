import { createMMKV, MMKV } from 'react-native-mmkv';

const storage = createMMKV();

const KEY = 'HABITTRACKER';

export const saveHabit = (habit: any) => {

  storage.set(KEY, JSON.stringify(habit));
};

export const loadHabit = () => {
  const data = storage.getString(KEY);

  return data ? JSON.parse(data) : [];
};
