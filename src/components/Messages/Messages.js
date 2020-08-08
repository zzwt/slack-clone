import React, { useState, useEffect, useRef } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessageHeader from "./MessageHeader";
import MessageForm from "./MessageForm";
import Message from "./Message";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setUserPosts } from "../../redux/actions";
import Typing from "./Typing";
import Skeleton from "./Skeleton";

const Messages = ({ channel, user, isPrivateChannel, setUserPosts }) => {
  const [messages, setMessages] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [isChannelStarred, setIsChannelStarred] = useState(null);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [listeners, setListeners] = useState([]);
  const bottomRef = useRef();
  const [messageRef] = useState(firebase.database().ref("messages"));
  const [userRef] = useState(firebase.database().ref("users"));
  const [typingRef] = useState(firebase.database().ref("typing"));
  const [connectRef] = useState(firebase.database().ref(".info/connected"));
  const [privateMessageRef] = useState(
    firebase.database().ref("privateMessages")
  );

  useEffect(() => {
    if (channel && user) {
      removeListener();
      addListener(channel.id);
    }
    return () => {
      removeListener();
      connectRef.off();
    };
    //eslint-disable-next-line
  }, [channel, user]);

  useEffect(() => {
    if (isChannelStarred !== null && channel && user) {
      if (isChannelStarred) {
        userRef.child(`${user.uid}/starred`).update({
          [channel.id]: {
            name: channel.name,
            details: channel.details,
            createdBy: {
              name: channel.createdBy.name,
              avatar: channel.createdBy.avatar,
            },
          },
        });
      } else {
        userRef
          .child(`${user.uid}/starred`)
          .child(channel.id)
          .remove((err) => {
            if (err !== null) {
              console.log(err);
            }
          });
      }
    }
    //eslint-disable-next-line
  }, [isChannelStarred]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      return filterMessages();
    }
    setTimeout(() => {
      setSearchLoading(false);
    }, 200);
    //eslint-disable-next-line
  }, [searchTerm]);

  useEffect(() => {
    if (bottomRef) {
      bottomRef.current.scrollIntoView({
        bahavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

  const addListener = (channelId) => {
    addMessageListener(channelId);
    addUserStarredListener();
    addTypingUsersListener(channelId);
  };

  const removeListener = () => {
    listeners.forEach((listener) => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  // keep a track of all database listners to
  // be closed off when component disposed.
  const recordListeners = (id, ref, event) => {
    const index = listeners.findIndex((listener) => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });
    if (index === -1) {
      setListeners([...listeners, { id, ref, event }]);
    }
  };

  const getMessageRef = () => {
    return isPrivateChannel ? privateMessageRef : messageRef;
  };

  const addMessageListener = (channelId) => {
    let loadedMessages = [];
    getMessageRef()
      .child(channelId)
      .on("child_added", (snap) => {
        loadedMessages.push(snap.val());
        setMessages([...loadedMessages]);
        setMessagesLoading(false);
        aggregateUserPost(loadedMessages);
      });
    setTimeout(() => {
      if (messagesLoading && messages.length === 0) {
        setMessagesLoading(false);
      }
    }, 2000);
    recordListeners(channelId, getMessageRef(), "child_added");
  };

  const addTypingUsersListener = (channelId) => {
    let loadedTypingUsers = [];
    typingRef.child(channelId).on("child_added", (snap) => {
      if (user.uid !== snap.key) {
        loadedTypingUsers.push({ id: snap.key, name: snap.val() });
        setTypingUsers([...loadedTypingUsers]);
      }
    });
    recordListeners(channelId, typingRef, "child_added");

    typingRef.child(channelId).on("child_removed", (snap) => {
      loadedTypingUsers = loadedTypingUsers.filter((typingUser) => {
        return typingUser.id !== snap.key;
      });
      setTypingUsers([...loadedTypingUsers]);
    });
    recordListeners(channelId, typingRef, "child_removed");

    connectRef.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = typingRef.child(channelId).child(user.uid);
        ref.onDisconnect().remove((err) => {
          if (err) console.log(err);
        });
      }
    });
  };

  const aggregateUserPost = (loadedMessages) => {
    const aggregated = loadedMessages.reduce((acc, msg) => {
      if (msg.user.name in acc) {
        acc[msg.user.name].count += 1;
      } else {
        acc[msg.user.name] = {
          avatar: msg.user.avatar,
          count: 1,
        };
      }
      return acc;
    }, {});
    const aggregatedArray = Object.keys(aggregated)
      .map((key) => ({
        name: key,
        ...aggregated[key],
      }))
      .sort((a, b) => {
        return b.count - a.count;
      });
    setUserPosts(aggregatedArray);
  };

  const addUserStarredListener = () => {
    userRef.child(`${user.uid}/starred`).once("value", (snap) => {
      if (snap.val() !== null) {
        const channelIds = Object.keys(snap.val());
        const preStarred = channelIds.includes(channel.id);
        setIsChannelStarred(preStarred);
      }
    });
  };

  const renderTypingUsers = () => {
    return (
      typingUsers.length > 0 &&
      typingUsers.map((typingUser) => {
        return (
          <div
            style={{ display: "flex", alignItems: "center" }}
            key={typingUser.id}
          >
            <span className="user__typing">{typingUser.name} is typing</span>
            <Typing />
          </div>
        );
      })
    );
  };

  const renderSkeleton = () => {
    return (
      messagesLoading && (
        <React.Fragment>
          {[...Array(10)].map((_, index) => {
            return <Skeleton key={index}></Skeleton>;
          })}
        </React.Fragment>
      )
    );
  };

  const renderMessages = () => {
    let msgList;
    if (searchTerm.length > 0) {
      msgList = searchResult.map((message) => (
        <Message key={message.timestamps} message={message} user={user} />
      ));
    } else {
      msgList = messages.map((message) => (
        <Message key={message.timestamps} message={message} user={user} />
      ));
    }
    return (
      <React.Fragment>
        {renderSkeleton()}
        {msgList}
        {renderTypingUsers()}
        <div ref={bottomRef}></div>
      </React.Fragment>
    );
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSearchLoading(true);
  };

  const filterMessages = () => {
    const regExp = new RegExp(searchTerm, "gi");
    setSearchResult(
      messages.filter((message) => {
        return (
          (message.content && message.content.match(regExp)) ||
          message.user.name.match(regExp)
        );
      })
    );
    setTimeout(() => {
      setSearchLoading(false);
    }, 200);
  };

  const handleStar = () => {
    setIsChannelStarred(!isChannelStarred);
  };

  return (
    <React.Fragment>
      <MessageHeader
        channel={channel}
        isPrivateChannel={isPrivateChannel}
        messages={messages}
        handleSearchChange={handleSearchChange}
        searchLoading={searchLoading}
        isChannelStarred={isChannelStarred}
        handleStar={handleStar}
      />
      <Segment>
        <Comment.Group className="messages">{renderMessages()}</Comment.Group>{" "}
      </Segment>
      <MessageForm
        isPrivateChannel={isPrivateChannel}
        getMessageRef={getMessageRef}
        channel={channel}
        user={user}
      />
    </React.Fragment>
  );
};

export default connect(null, { setUserPosts })(Messages);
