import React, { useState } from "react";
import { Modal, Input, Button } from "semantic-ui-react";
import mime from "mime-types";

const supportedFileTypes = ["image/jpeg", "image/png"];

export default function FileModal(props) {
  const [file, setFile] = useState(null);

  const onChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const isSupportedFileTypes = (fileName) => {
    return supportedFileTypes.includes(mime.lookup(fileName));
  };

  const sendFile = () => {
    if (file && isSupportedFileTypes(file.name)) {
      const metaData = { contentType: mime.lookup(file.name) };
      props.uploadFile(file, metaData);
      props.onModalClose();
      setFile(null);
    }
  };

  return (
    <Modal basic open={props.open}>
      <Modal.Header>Select Image File</Modal.Header>
      <Modal.Content>
        <Input
          onChange={onChange}
          type="file"
          fluid
          name="file"
          label="File types: jpg, png"
        ></Input>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Upload"
          color="green"
          inverted
          icon="checkmark"
          onClick={sendFile}
        ></Button>
        <Button
          content="Cancel"
          color="red"
          onClick={props.onModalClose}
          inverted
          icon="remove"
        ></Button>
      </Modal.Actions>
    </Modal>
  );
}
