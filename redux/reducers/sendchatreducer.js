const initialstate = [];
export const sendchatreducer = (state = initialstate, action) => {
  switch (action.type) {
    case "send_chat":
      return [...state, action.data];
    case "send_chat_reset":
      return initialstate;
    default:
      return state;
  }
};
