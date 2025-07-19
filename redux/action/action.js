export function sendChat(item) {
  return {
    type: 'send_chat',
    data: item,
  };
}
export function newMessage(item) {
  return {
    type: 'NEW_MESSAGE',
    data: item,
  };
}
export function sendChatReset() {
  return {
    type: 'send_chat_reset',
  };
}
export function newMessageReset() {
  return {
    type: 'NEW_MESSAGE_RESET',
  };
}
