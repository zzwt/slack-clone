import React, { useState, useRef, useEffect } from "react";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from "semantic-ui-react";
import firebase from "../../firebase";
import AvatarEditor from "react-avatar-editor";

const UserPanel = (props) => {
  const [user, setUser] = useState(props.user);
  const [modal, setModal] = useState(false);
  const [file, setFile] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [blob, setBlob] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const [userRef] = useState(firebase.auth().currentUser);
  const [usersRef] = useState(firebase.database().ref("users"));
  const [storageRef] = useState(firebase.storage().ref());
  const avatarEditorRef = useRef(null);

  useEffect(() => {
    if (downloadURL) {
      changeAvatar();
    }
    //eslint-disable-next-line
  }, [downloadURL]);

  // useEffect(() => {
  //   console.log("ssssssssssssssss");
  //   if (props.user) {
  //     console.log("reset user triggered");

  //   }
  // }, [props.user.photoURL]);

  const renderOptions = () => [
    {
      key: "user",
      text: (
        <span>
          Sign in as <strong>{user && user.displayName}</strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: <span onClick={openModal}>Change avatar</span>,
    },
    {
      key: "signout",
      text: <span onClick={handleSignout}>Sign out</span>,
    },
  ];

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    setFile(null);
    setCroppedImage(null);
    setBlob(null);
    setDownloadURL(null);
  };

  const handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("signed out");
      });
  };

  const onChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    if (selectedFile) {
      fileReader.readAsDataURL(selectedFile);
      fileReader.addEventListener("load", () => {
        setFile(fileReader.result);
      });
    }
  };

  const previewImage = () => {
    if (avatarEditorRef && avatarEditorRef.current) {
      avatarEditorRef.current.getImageScaledToCanvas().toBlob((blob) => {
        let imageUrl = URL.createObjectURL(blob);
        setCroppedImage(imageUrl);
        setBlob(blob);
      });
    }
  };

  const UploadAvatar = () => {
    storageRef
      .child(`avatars/users-${userRef.uid}`)
      .put(blob, { contentType: "image/jpeg" })
      .then((snap) => {
        snap.ref
          .getDownloadURL()
          .then((downloadURL) => {
            setDownloadURL(downloadURL);
          })
          .catch((err) => {
            console.log(err);
          });
        closeModal();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const changeAvatar = () => {
    console.log("downloadURL", downloadURL);
    userRef
      .updateProfile({
        photoURL: downloadURL,
      })
      .then(() => {
        console.log("user photoUrl updated");
        setUser({ ...props.user });
      })
      .catch((err) => {
        console.log(err);
      });

    usersRef
      .child(userRef.uid)
      .update({
        avatar: downloadURL,
      })
      .then(() => {
        console.log("user avatar updated");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Grid>
      <Grid.Column>
        <Grid.Row style={{ padding: "1.2rem", margin: 0 }}>
          <Header inverted float="left" as="h2">
            <Icon name="code"></Icon>
            <Header.Content>DevChat</Header.Content>
          </Header>
        </Grid.Row>
        {/* {userdrop down} */}
        <Header inverted as="h4" style={{ padding: "0.2rem" }}>
          <Dropdown
            options={renderOptions()}
            trigger={
              <span>
                <Image src={user && user.photoURL} avatar spaced="right" />

                {user && user.displayName}
              </span>
            }
          ></Dropdown>
        </Header>
        <Modal basic open={modal}>
          <Modal.Header>Choose Avatar Image</Modal.Header>
          <Modal.Content>
            <Input
              onChange={onChange}
              type="file"
              fluid
              name="file"
              label="File types: jpg, png"
            ></Input>
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column style={{ textAlign: "center" }}>
                  {file && (
                    <AvatarEditor
                      ref={avatarEditorRef}
                      image={file}
                      width={120}
                      height={120}
                      border={50}
                      // color={[255, 255, 255, 0.6]} // RGBA
                      scale={1.2}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {croppedImage && (
                    <Image
                      style={{ margin: "3.5rem auto" }}
                      width={100}
                      height={100}
                      src={croppedImage}
                    ></Image>
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {croppedImage && (
              <Button
                content="Upload"
                color="green"
                inverted
                icon="checkmark"
                onClick={UploadAvatar}
              ></Button>
            )}
            <Button
              content="Preview"
              color="green"
              inverted
              icon="eye"
              onClick={previewImage}
            ></Button>
            <Button
              content="Cancel"
              color="red"
              onClick={closeModal}
              inverted
              icon="remove"
            ></Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

export default UserPanel;
