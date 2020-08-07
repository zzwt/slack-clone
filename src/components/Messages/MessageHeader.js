import React from "react";
import { Header, Segment, Icon, Input } from "semantic-ui-react";

export default function MessageHeader({
  channel,
  messages,
  handleSearchChange,
  searchLoading,
  isPrivateChannel,
  isChannelStarred,
  handleStar,
}) {
  const uniqueUsers = () => {
    const reduced = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.id)) {
        acc.push(message.user.id);
      }
      return acc;
    }, []);
    return reduced.length;
  };

  const isPlural = () => {
    return uniqueUsers() === 1 ? false : true;
  };

  const displayChannelName = () => {
    return channel ? `${isPrivateChannel ? "@" : "#"} ${channel.name}` : "";
  };
  return (
    <Segment clearing>
      <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
        <span>
          {displayChannelName()}
          {!isPrivateChannel && (
            <Icon
              color={isChannelStarred ? "yellow" : "black"}
              name={isChannelStarred ? "star" : "star outline"}
              onClick={() => {
                handleStar();
              }}
            ></Icon>
          )}
        </span>
        <Header.Subheader>
          {uniqueUsers()} {isPlural ? "Users" : "User"}
        </Header.Subheader>
      </Header>
      <Header fluid="true" floated="right">
        <Input
          loading={searchLoading}
          type="text"
          placeholder="Search Message"
          icon="search"
          size="small"
          onChange={handleSearchChange}
        />
      </Header>
    </Segment>
  );
}
