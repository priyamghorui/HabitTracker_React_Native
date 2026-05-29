import { saveHabit } from "../../utils/persistence";

const initialstate: any = [];
export const habitReducer = (state = initialstate, action: any) => {
  // console.log(">>",state,this);
  switch (action.type) {
    case 'add_Habit':
      saveHabit([...state, action.data]);
      return [...state, action.data];
    case 'remove_Habit':
      // console.log('>', action.data);
      const dataAfterRemoveItem = state.filter(e => e.id != action.data);
      // console.log(dataAfterRemoveItem);
      saveHabit(dataAfterRemoveItem);
      return dataAfterRemoveItem;
    case 'edit_Habit':
      saveHabit(
        state.map(Habit =>
          Habit.id === action.data.id
            ? { ...Habit, name: action.data.name, targetDays: action.data.targetDays }
            : Habit,
        ),
      );
      return state.map(Habit =>
        Habit.id === action.data.id
          ? { ...Habit, name: action.data.name, targetDays: action.data.targetDays }
          : Habit,
      );
    case 'toggle_complete':
      if(action.data.makeAdd){
        saveHabit(
          state.map(Habit =>
            Habit.id === action.data.id
              ? { ...Habit,isCompletedToday:true,completedDays:Habit.completedDays+1,  habitsLog: [...Habit.habitsLog,new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })]}
              : Habit,
          ),
        );
        return state.map(Habit =>
          Habit.id === action.data.id
            ? { ...Habit,isCompletedToday:true,completedDays:Habit.completedDays+1, habitsLog: [...Habit.habitsLog,new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })] }
            : Habit,
        );
        
      }else{
        saveHabit(
          state.map(Habit =>
            Habit.id === action.data.id
              ? { ...Habit,isCompletedToday:false,completedDays:Habit.completedDays-1,habitsLog: Habit.habitsLog.slice(0,Habit.habitsLog.length-1) }
              : Habit,
          ),
        );
        return state.map(Habit =>
          Habit.id === action.data.id
            ? { ...Habit,isCompletedToday:false,completedDays:Habit.completedDays-1,habitsLog: Habit.habitsLog.slice(0,Habit.habitsLog.length-1)    }
            : Habit,
        );

      }
    case 'hydrateHabits':
      // console.log('<>', action.data);

      return action.data;
    default:
      return state;
  }
};
