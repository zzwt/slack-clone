import * as actionTypes from "../Types";

export const setCurrentChannel = (channel) => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: channel,
  };
};

export const setPrivateChannel = (isPrivateChannel) => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL,
    payload: {
      isPrivateChannel,
    },
  };
};

export const setUserPosts = (userPosts) => {
  return {
    type: actionTypes.SET_USER_POSTS,
    payload: userPosts,
  };
};
