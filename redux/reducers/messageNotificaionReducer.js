const initialstate = [];
export const messageNotificaionReducer = (state = initialstate, action) => {
  switch (action.type) {
    case "NEW_MESSAGE":
      return [...state, action.data];
    case "NEW_MESSAGE_RESET":
      return initialstate;
    default:
      return state;
  }
};
