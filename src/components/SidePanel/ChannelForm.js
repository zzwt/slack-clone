import React from "react";
import { useForm } from "react-hook-form";
import { showErrorMsg } from "../../utils";
import { Modal, Form, Button } from "semantic-ui-react";

export default function ChannelForm({ user, open, closeModal, channelRef }) {
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = ({ name, channelDetails }) => {
    const key = channelRef.push().key;
    const newChannel = {
      id: key,
      name,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    };

    channelRef
      .child(key)
      .update(newChannel)
      .then((data) => {
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal basic open={open} onClose={closeModal}>
      <Modal.Header>Add a New Channel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <input
              name="name"
              placeholder="Channel Name"
              ref={register({ required: "Channel Name is required" })}
            ></input>
            {showErrorMsg(errors, "name")}
          </Form.Field>
          <Form.Field>
            <input
              name="channelDetails"
              placeholder="Channel Details"
              ref={register()}
            ></input>
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Add"
          size="large"
          color="green"
          onClick={handleSubmit(onSubmit)}
        ></Button>
        <Button
          content="Cancel"
          size="large"
          color="red"
          inverted
          onClick={closeModal}
        ></Button>
      </Modal.Actions>
    </Modal>
  );
}
