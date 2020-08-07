import React from "react";
import { Menu } from "semantic-ui-react";
import UserPanel from "./UserPanel";
import Channels from "./Channels";
import DirectMessages from "./DirectMessages";
import Starred from "./Starred";

export default function SidePanel(props) {
  return (
    <Menu
      vertical
      size="large"
      inverted
      fixed="left"
      style={{ background: props.color.primary, fontSize: "1.2rem" }}
    >
      <UserPanel user={props.user}></UserPanel>
      <Starred user={props.user} channel={props.channel}></Starred>
      <Channels channels={[]} user={props.user}></Channels>
      <DirectMessages user={props.user}></DirectMessages>
    </Menu>
  );
}
