import React from "react";
import { Grid } from "semantic-ui-react";
import ColorPanel from "./ColorPanel/ColorPanel";
import SidePanel from "./SidePanel/SidePanel";
import Messages from "./Messages/Messages";
import MetaPanel from "./MetaPanel/MetaPanel";
import { connect } from "react-redux";

const Main = ({ user, channel, isPrivateChannel, userPosts, color }) => {
  return (
    <Grid
      columns="equal"
      className="app"
      style={{ background: color.secondary, marginTop: 0 }}
    >
      <ColorPanel user={user}></ColorPanel>
      <SidePanel
        key={user && user.id}
        user={user}
        color={color}
        channel={channel}
      ></SidePanel>
      <Grid.Column style={{ marginLeft: 320, paddingTop: "2rem" }}>
        <Messages
          key={channel && channel.id}
          channel={channel}
          user={user}
          isPrivateChannel={isPrivateChannel}
        ></Messages>
      </Grid.Column>
      <Grid.Column
        width={4}
        style={{ paddingTop: "2rem", paddingRight: "3rem" }}
      >
        <MetaPanel
          isPrivateChannel={isPrivateChannel}
          channel={channel}
          userPosts={userPosts}
        ></MetaPanel>
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = ({
  user: { currentUser },
  currentChannel: { channel, isPrivateChannel, userPosts },
  color,
}) => ({
  user: currentUser,
  channel: channel,
  isPrivateChannel,
  userPosts,
  color,
});

export default connect(mapStateToProps, null)(Main);
