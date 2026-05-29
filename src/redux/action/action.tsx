export function addHabit(item) {
  return {
    type: 'add_Habit',
    data: item,
  };
}
export function removeHabit(item) {
  return {
    type: 'remove_Habit',
    data: item,
  };
}
export function editHabit(item) {
  return {
    type: 'edit_Habit',
    data: item,
  };
}
export function toggleCompleteHabits(item) {
  return {
    type: 'toggle_complete',
    data: item,
  };
}
export function hydrateHabits(item) {
  return {
    type: 'hydrateHabits',
    data: item,
  };
}
export function setLoadFalse() {
  return {
    type: 'set_load_false',
  };
}
