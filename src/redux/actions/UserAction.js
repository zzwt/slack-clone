import * as actionTypes from "../Types";

export const setCurrentUser = (user) => {
  return {
    type: actionTypes.SET_CURRENT_USER,
    payload: user,
  };
};

export const clearUser = () => {
  return {
    type: actionTypes.CLEAR_USER,
  };
};
