import React, { useEffect, useState } from "react";
import { Menu, Icon } from "semantic-ui-react";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentChannel, setPrivateChannel } from "../../redux/actions";

const DirectMessages = ({ user, setCurrentChannel, setPrivateChannel }) => {
  const [users, setUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [userRef] = useState(firebase.database().ref("users"));
  const [connectRef] = useState(firebase.database().ref(".info/connected"));
  const [presenceRef] = useState(firebase.database().ref("presence"));

  useEffect(() => {
    if (user) {
      addListener(user.uid);
    }
    return () => {
      if (user) {
        removeListener();
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    updateUserStatus();
    // eslint-disable-next-line
  }, [users, onlineUsers]);

  const addListener = (currentUserId) => {
    addUsersListener(currentUserId);
    addConnectListener(currentUserId);
    addPresenceListener(currentUserId);
  };

  const addUsersListener = (currentUserId) => {
    const loadedUsers = [];
    userRef.on("child_added", (snap) => {
      if (snap.key !== currentUserId) {
        loadedUsers.push({ ...snap.val(), uid: snap.key, status: "offline" });
        setUsers([...loadedUsers]);
      }
    });
  };

  const addConnectListener = (currentUserId) => {
    connectRef.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUserId);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err) console.log(err);
        });
      }
    });
  };

  const addPresenceListener = (currentUserId) => {
    let loadedOnlineUsers = [];
    presenceRef.on("child_added", (snap) => {
      if (currentUserId !== snap.key) {
        loadedOnlineUsers.push(snap.key);
        setOnlineUsers([...loadedOnlineUsers]);
      }
    });
    presenceRef.on("child_removed", (snap) => {
      if (currentUserId !== snap.key) {
        loadedOnlineUsers = loadedOnlineUsers.filter((id) => {
          return id !== snap.key;
        });
        setOnlineUsers([...loadedOnlineUsers]);
      }
    });
  };

  const removeListener = () => {
    userRef.off();
    connectRef.off();
    presenceRef.off();
  };

  const updateUserStatus = () => {
    if (!users) return;
    const usersWithUpdatedStatus = users.map((user) => {
      let newUser = { ...user };
      const oldStatus = newUser.status;
      if (onlineUsers.includes(newUser.uid)) {
        newUser.status = "online";
      } else {
        newUser.status = "offline";
      }
      newUser.changed = oldStatus === newUser.status ? false : true;
      return newUser;
    });
    const needUpdate = usersWithUpdatedStatus.some((user) => {
      return user.changed === true;
    });
    if (needUpdate) {
      setUsers([...usersWithUpdatedStatus]);
    }
  };

  const isOnline = (user) => {
    return user.status === "online";
  };

  const changeChannel = (selectedUser) => {
    const privateChannelId = getPrivateChannelId(selectedUser);
    const privateChannelData = {
      id: privateChannelId,
      name: selectedUser.displayName,
    };
    setCurrentChannel(privateChannelData);
    setPrivateChannel(true);
  };

  const getPrivateChannelId = (selectedUser) => {
    return user.uid < selectedUser.uid
      ? `${user.uid}/${selectedUser.uid}`
      : `${selectedUser.uid}/${user.uid}`;
  };

  const renderUsers = () => {
    return (
      users &&
      users.map((user) => {
        return (
          <Menu.Item
            key={user.uid}
            onClick={() => {
              changeChannel(user);
            }}
          >
            {user.displayName}{" "}
            <Icon name="circle" color={isOnline(user) ? "green" : "red"}></Icon>
          </Menu.Item>
        );
      })
    );
  };

  return (
    <Menu.Menu className="channel_menu">
      <Menu.Item>
        <span>
          <Icon name="mail" />
          DIRECT MESSAGES{" "}
        </span>
      </Menu.Item>
      {renderUsers()}
    </Menu.Menu>
  );
};

const mapStateToProps = ({ currentChannel }) => ({
  currentChannel: currentChannel.channel,
});

export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel,
})(DirectMessages);
