import React from "react";
import { Menu, Icon, Label } from "semantic-ui-react";

import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../redux/actions";
import ChannelForm from "./ChannelForm";
class Channels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      channels: props.channels || [],
      oldChannel: null,
      channel: null,
      notifications: [],
      channelRef: firebase.database().ref("channels"),
      messageRef: firebase.database().ref("messages"),
      typingRef: firebase.database().ref("typing"),
      firstLoad: true,
    };
  }

  componentDidMount() {
    this.addChannelListener();
  }

  componentWillUnmount() {
    this.removeChannelListener();
  }

  setInitialChannel = (channelList) => {
    if (this.state.firstLoad && channelList.length > 0) {
      this.props.setCurrentChannel(channelList[0]);
      this.setState({ channel: channelList[0] });
    }
    this.setState({ firstLoad: false });
  };

  addChannelListener = () => {
    let channelList = [];
    this.state.channelRef.on("child_added", (snap) => {
      channelList.push(snap.val());
      this.setState({ channels: [...channelList] });
      this.setInitialChannel(channelList);
      this.setMessageListener(snap.key);
    });
  };

  setMessageListener = (newMsgChannelId) => {
    // console.log("setMessageListener triggerred", newMsgChannelId);
    this.state.messageRef.child(newMsgChannelId).on("value", (snap) => {
      if (this.state.channel) {
        this.handleNotifactions(newMsgChannelId, snap);
      }
    });
  };

  handleNotifactions = (newMsgChannelId, snap) => {
    // console.log("handlenotification trigged");
    const index = this.state.notifications.findIndex(
      (notification) => notification.id === newMsgChannelId
    );

    if (index !== -1) {
      if (newMsgChannelId !== this.state.channel.id) {
        const newNotifications = this.state.notifications.map(
          (notification) => {
            if (notification.id === newMsgChannelId) {
              return {
                ...notification,
                lastKnownTotal: snap.numChildren(),
                count:
                  snap.numChildren() - notification.totalSeen > 0
                    ? snap.numChildren() - notification.totalSeen
                    : notification.count,
              };
            }
            return notification;
          }
        );
        this.setState({ notifications: newNotifications });
      }
    } else {
      this.setState({
        notifications: [
          ...this.state.notifications,
          {
            id: newMsgChannelId,
            totalSeen: snap.numChildren(),
            lastKnownTotal: snap.numChildren(),
            count: 0,
          },
        ],
      });
    }
  };

  removeChannelListener = () => {
    this.state.channelRef.off();
    this.state.channels.forEach((chl) => {
      this.state.messageRef.child(chl.id).off();
    });
  };

  openModal = () => {
    this.setState({ open: true });
  };

  closeModal = () => {
    this.setState({ open: false });
  };

  getNotificationCount = (channelId) => {
    const notification = this.state.notifications.find(
      (notification) => notification.id === channelId
    );
    return notification && notification.count > 0 ? notification.count : null;
  };

  changeChannel = (channel) => {
    this.setState({ oldChannel: this.state.channel }, () => {
      this.clearTyping();
    });
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel: channel });
    this.clearNotification(channel);
  };

  clearTyping = () => {
    this.state.typingRef
      .child(this.state.oldChannel.id)
      .child(this.props.user.uid)
      .remove();
  };

  clearNotification = (channel) => {
    this.setState({
      notifications: this.state.notifications.map((notification) => {
        if (notification.id === channel.id) {
          return {
            ...notification,
            totalSeen: notification.lastKnownTotal,
            count: 0,
          };
        }
        return notification;
      }),
    });
  };

  renderChannels = () => {
    return this.state.channels.map((channel, index) => (
      <Menu.Item
        key={channel.id}
        onClick={() => {
          this.changeChannel(channel);
        }}
        name={channel.name}
        style={{ opacity: 0.7 }}
        active={
          channel.id ===
          (this.props.currentChannel && this.props.currentChannel.id)
        }
      >
        # {channel.name}
        {this.getNotificationCount(channel.id) && (
          <Label color="red">{this.getNotificationCount(channel.id)}</Label>
        )}
      </Menu.Item>
    ));
  };

  render() {
    return (
      <React.Fragment>
        <Menu.Menu className="channel_menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" />
              CHANNELS{" "}
            </span>
            ({this.state.channels.length})
            <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.renderChannels()}
        </Menu.Menu>
        <ChannelForm
          closeModal={this.closeModal}
          open={this.state.open}
          channelRef={this.state.channelRef}
          user={this.props.user}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ currentChannel }) => ({
  currentChannel: currentChannel.channel,
});

export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel,
})(Channels);
