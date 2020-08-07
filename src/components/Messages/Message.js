import React from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";

const timeFromNow = (timestamps) => {
  return moment(timestamps).fromNow();
};

const ownMessage = (user, message) => {
  return user && user.uid === message.user.id ? "message__self" : "";
};

const isImage = (message) => {
  return message.hasOwnProperty("image") && !message.hasOwnProperty("content");
};

export default function Message({ user, message }) {
  return (
    <Comment>
      <Comment.Avatar src={message.user.avatar} />
      <Comment.Content className={ownMessage(user, message)}>
        <Comment.Author as="a">{message.user.name}</Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamps)}</Comment.Metadata>
        {isImage(message) ? (
          <Image src={message.image} className="message__image" />
        ) : (
          <Comment.Text>{message.content}</Comment.Text>
        )}
      </Comment.Content>
    </Comment>
  );
}
