import * as actionTypes from "../Types";

const initState = {
  channel: null,
  isPrivateChannel: false,
  userPosts: null,
};

export const ChannelReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return { ...state, channel: action.payload };
    case actionTypes.SET_PRIVATE_CHANNEL:
      return { ...state, isPrivateChannel: action.payload.isPrivateChannel };
    case actionTypes.SET_USER_POSTS:
      return { ...state, userPosts: action.payload };
    default:
      return state;
  }
};
