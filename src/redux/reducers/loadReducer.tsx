
const initialstate: any = true;
export const loadReducer = (state = initialstate, action: any) => {

  switch (action.type) {
    case 'set_load_false':
      return false;
    default:
      return state;
  }
};
