import * as actionTypes from "../Types";

const initState = {
  primary: "#4c3c4c",
  secondary: "#eee",
};

export const ColorReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_COLOR:
      return { ...action.payload };
    default:
      return state;
  }
};
