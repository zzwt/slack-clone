import * as actionTypes from "../Types";

export const changeColor = (color) => {
  return {
    type: actionTypes.CHANGE_COLOR,
    payload: color,
  };
};
