import * as actionTypes from "../Types";

const initState = {
  currentUser: null,
  loading: true,
};

export const UserReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_USER:
      return { currentUser: action.payload, loading: false };
    case actionTypes.CLEAR_USER:
      return { currentUser: null, loading: false };
    default:
      return state;
  }
};
