import React, { useState } from "react";
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List,
} from "semantic-ui-react";

export default function MetaPanel({ isPrivateChannel, channel, userPosts }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;

    const newIndex = activeIndex === index ? -1 : index;

    setActiveIndex(newIndex);
  };

  const renderTopPosters = () => {
    return userPosts.map((userPost, index) => {
      return (
        <List.Item key={index}>
          <Image avatar src={userPost.avatar}></Image>
          <List.Content>
            <List.Header as="a">{userPost.name}</List.Header>
            <List.Description>
              {userPost.count} {userPost.count === 1 ? "Post" : "Posts"}
            </List.Description>
          </List.Content>
        </List.Item>
      );
    });
  };

  return (
    !isPrivateChannel &&
    channel &&
    userPosts && (
      <Segment>
        <Header as="h3" attached="top">
          About #Channel
        </Header>
        <Accordion styled>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={handleClick}
          >
            <Icon name="dropdown" />
            <Icon name="info"></Icon>
            About # {channel.name}
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <p> {channel.details}</p>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={handleClick}
          >
            <Icon name="dropdown" />
            <Icon name="user"></Icon>
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <List>{renderTopPosters()}</List>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={handleClick}
          >
            <Icon name="dropdown" />
            <Icon name="edit"></Icon>
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <Header as="h3">
              <Image avatar src={channel.createdBy.avatar} />
              {channel.createdBy.name}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    )
  );
}
