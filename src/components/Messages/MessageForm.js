import React, { useState, useEffect, useRef } from "react";
import { Segment, Input, Button, ButtonGroup } from "semantic-ui-react";
import firebase from "../../firebase";
import FileModal from "./FileModal";
import uuidv4 from "uuid/dist/v4";
import ProgressBar from "./ProgressBar";
import { Picker, emojiIndex } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";

export default function MessageForm({
  user,
  channel,
  getMessageRef,
  isPrivateChannel,
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [upLoading, setUpLoading] = useState(false);
  const [upLoadTask, setUpLoadTask] = useState(null);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [percentUploaded, setPercentUploaded] = useState(0);
  const [openEmoji, setOpenEmoji] = useState(false);
  const formRef = useRef();
  const [typingRef] = useState(firebase.database().ref("typing"));
  const [storageRef] = useState(firebase.storage().ref());

  useEffect(() => {
    if (channel && user) {
      if (message.length > 0) {
        typingRef.child(channel.id).child(user.uid).set(user.displayName);
      } else clearTyping();
    }
    //eslint-disable-next-line
  }, [message]);

  const onChange = (event) => {
    setMessage(event.target.value);
  };

  const createMessage = (fileURL = null) => {
    const msg = {
      timestamps: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
      },
    };
    if (fileURL) {
      msg.image = fileURL;
    } else {
      msg.content = message;
    }
    return msg;
  };

  const addReply = () => {
    setLoading(true);
    if (message) {
      getMessageRef()
        .child(channel.id)
        .push()
        .set(createMessage())
        .then(() => {
          setMessage("");
          setError(null);
        })
        .catch((err) => {
          setMessage("");
          setError(err);
          console.log(err);
        });
      clearTyping();
    } else {
      setError({ message: "Add a message" });
    }
    setLoading(false);
  };

  const uploadMedia = () => {
    setModal(true);
  };
  const onModalClose = () => {
    setModal(false);
  };

  const getBucketPath = () => {
    return isPrivateChannel ? `chat/private-${channel.id}` : "chat/public";
  };

  const uploadFile = (file, metaData) => {
    const filePath = `${getBucketPath()}/${uuidv4()}.jpg`;

    setUpLoading(true);
    setUpLoadTask(storageRef.child(filePath).put(file, metaData));
  };

  const sendFileMessage = (downloadURL) => {
    getMessageRef()
      .child(channel.id)
      .push()
      .set(createMessage(downloadURL))
      .then(() => {
        // setMessage("");
        setUpLoading(false);
        setError(null);
      })
      .catch((err) => {
        // setMessage("");
        setError(err);
        console.log(err);
      });
  };

  useEffect(() => {
    if (upLoadTask) {
      upLoadTask.on(
        "state_changed",
        (snap) => {
          const upLoadPercentage = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          console.log(upLoadPercentage);
          setPercentUploaded(upLoadPercentage);
        },
        // error handling
        (err) => {
          setUpLoading(false);
          setUpLoadTask(null);
          setError(err);
          console.log(err);
        },
        // on successful upload
        () => {
          upLoadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              sendFileMessage(downloadURL);
            })
            .catch((err) => {
              setUpLoading(false);
              setUpLoadTask(null);
              setError(err);
              console.log(err);
            });
        }
      );
    }
    return () => {
      if (upLoadTask !== null) {
        upLoadTask.cancel();
        setUpLoadTask(null);
      }
    };
    //eslint-disable-next-line
  }, [upLoadTask]);

  const clearTyping = () => {
    typingRef.child(channel.id).child(user.uid).remove();
  };

  const toggleEmoji = () => {
    setOpenEmoji(!openEmoji);
  };

  const handleEmojiSelect = (emoji) => {
    const newMsg = colonToUnicode(`${message} ${emoji.colons} `);
    console.log(message, emoji, emoji.colons, newMsg);
    setMessage(newMsg);
    setOpenEmoji(false);
    formRef.current.focus();
  };

  const colonToUnicode = (message) => {
    return message.replace(/:[A-Za-z0-9_+-]+:/g, (x) => {
      x = x.replace(/:/g, "");
      let emoji = emojiIndex.emojis[x];
      if (typeof emoji !== "undefined") {
        let unicode = emoji.native;
        if (typeof unicode !== "undefined") {
          return unicode;
        }
      }
      x = ":" + x + ":";
      return x;
    });
  };

  const handleKeyDown = (event) => {
    if (event.ctrlKey && event.keyCode === 13) {
      addReply();
    }
  };
  return (
    <Segment className="messages__form">
      {openEmoji && (
        <Picker
          set="apple"
          style={{ position: "relative" }}
          onSelect={handleEmojiSelect}
        ></Picker>
      )}
      <Input
        fluid
        name="message"
        style={{ marginBottom: "0.7rem" }}
        labelPosition="left"
        ref={formRef}
        label={
          openEmoji ? (
            <Button icon="close" content="Close" onClick={toggleEmoji}></Button>
          ) : (
            <Button icon="add" onClick={toggleEmoji}></Button>
          )
        }
        placeholder="Write a Message"
        onChange={onChange}
        onKeyDown={handleKeyDown}
        value={message}
        className={
          error && error.message && error.message.includes("message")
            ? "error"
            : ""
        }
      ></Input>
      <ButtonGroup widths="2">
        <Button
          content="Add Reply"
          color="orange"
          icon="edit"
          labelPosition="left"
          onClick={addReply}
          disabled={loading}
          loading={loading}
        ></Button>
        <Button
          content="Upload Media"
          color="teal"
          icon="cloud upload"
          labelPosition="right"
          onClick={uploadMedia}
          disabled={upLoading}
          loading={upLoading}
        ></Button>
      </ButtonGroup>
      <ProgressBar
        percentUploaded={percentUploaded}
        upLoading={upLoading}
      ></ProgressBar>
      <FileModal
        open={modal}
        onModalClose={onModalClose}
        uploadFile={uploadFile}
      ></FileModal>
    </Segment>
  );
}
