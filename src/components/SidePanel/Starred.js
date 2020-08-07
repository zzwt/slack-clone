import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { connect } from "react-redux";
import firebase from "../../firebase";
import { setCurrentChannel } from "../../redux/actions";
class Starred extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      oldChannel: null,
      starred: [],
      userRef: firebase.database().ref("users"),
      typingRef: firebase.database().ref("typing"),
    };
  }

  componentDidMount() {
    if (this.state.user) {
      this.addListener();
    }
  }

  componentWillUnmount() {
    if (this.state.user) {
      this.removeListener();
    }
  }

  addListener = () => {
    this.state.userRef
      .child(`${this.state.user.uid}/starred`)
      .on("child_added", (snap) => {
        const starredChannel = { id: snap.key, ...snap.val() };
        this.setState({ starred: [...this.state.starred, starredChannel] });
      });
    this.state.userRef
      .child(`${this.state.user.uid}/starred`)
      .on("child_removed", (snap) => {
        const starredChannel = { id: snap.key, ...snap.val() };
        this.setState({
          starred: this.state.starred.filter(
            (star) => star.id !== starredChannel.id
          ),
        });
      });
  };

  removeListener = () => {
    this.state.userRef.child(`${this.state.user.uid}/starred`).off();
  };

  renderStarred = () => {
    return this.state.starred.map((star, index) => (
      <Menu.Item
        key={star.id}
        onClick={() => {
          this.setState({ oldChannel: this.props.channel }, () => {
            this.clearTyping();
          });
          this.props.setCurrentChannel(star);
        }}
        name={star.name}
        style={{ opacity: 0.7 }}
        active={
          star.id ===
          (this.props.currentChannel && this.props.currentChannel.id)
        }
      >
        # {star.name}
        {/* {this.getNotificationCount(channel.id) && (
          <Label color="red">{this.getNotificationCount(channel.id)}</Label>
        )} */}
      </Menu.Item>
    ));
  };

  clearTyping = () => {
    this.state.typingRef
      .child(this.state.oldChannel.id)
      .child(this.state.user.uid)
      .remove();
  };

  render() {
    return (
      <React.Fragment>
        <Menu.Menu>
          <Menu.Item>
            <span>
              <Icon name="star" />
              STARRED{" "}
            </span>
            ({this.state.starred.length})
          </Menu.Item>
          {this.renderStarred()}
        </Menu.Menu>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ currentChannel }) => ({
  currentChannel: currentChannel.channel,
});

export default connect(mapStateToProps, { setCurrentChannel })(Starred);
