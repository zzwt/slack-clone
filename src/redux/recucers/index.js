import { combineReducers } from "redux";
import { UserReducer } from "./UserReducer";
import { ChannelReducer } from "./ChannelReducer";
import { ColorReducer } from "./ColorReducer";

export default combineReducers({
  user: UserReducer,
  currentChannel: ChannelReducer,
  color: ColorReducer,
});
