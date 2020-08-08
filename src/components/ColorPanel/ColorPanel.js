import React from "react";
import {
  Menu,
  Sidebar,
  Divider,
  Button,
  Modal,
  Segment,
  Label,
} from "semantic-ui-react";
import { SliderPicker } from "react-color";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { changeColor } from "../../redux/actions";

class ColorPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      modal: false,
      primary: "",
      secondary: "",
      userRef: firebase.database().ref("users"),
      colorPallets: [],
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
    let colorsLoaded = [];
    this.state.userRef
      .child(`${this.state.user.uid}/colors`)
      .on("child_added", (snap) => {
        colorsLoaded.unshift(snap.val());
        this.setState({ colorPallets: colorsLoaded });
      });
  };

  removeListener = () => {
    this.state.userRef.child(`${this.state.user.uid}/colors`).off();
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false, primary: "", secondary: "" });
  };

  handlePrimaryChange = (color) => {
    this.setState({ primary: color.hex });
  };

  handleSecondaryChange = (color) => {
    this.setState({ secondary: color.hex });
  };

  saveColors = () => {
    const { primary, secondary, userRef } = this.state;
    if (primary && secondary) {
      userRef
        .child(`${this.state.user.uid}/colors`)
        .push()
        .update({
          primary,
          secondary,
        })
        .then(() => {
          // console.log("color added");
        })
        .catch((err) => {
          console.log(err);
        });
    }
    this.closeModal();
  };

  renderColorPallets = () => {
    const { colorPallets } = this.state;
    return (
      colorPallets.length > 0 &&
      colorPallets.map((color, i) => {
        return (
          <React.Fragment key={i}>
            <Divider />
            <div
              className="color__container"
              onClick={(event) => this.props.changeColor(color)}
            >
              <div
                className="color__square"
                style={{ background: color.primary }}
              >
                <div
                  className="color__overlay"
                  style={{ background: color.secondary }}
                ></div>
              </div>
            </div>
          </React.Fragment>
        );
      })
    );
  };

  render() {
    const { primary, secondary } = this.state;

    return (
      <Sidebar
        width="very thin"
        as={Menu}
        visible
        inverted
        icon="labeled"
        vertical
      >
        <Divider></Divider>
        <Button
          icon="add"
          size="small"
          color="blue"
          onClick={() => this.openModal()}
        ></Button>
        {this.renderColorPallets()}
        <Modal basic open={this.state.modal}>
          <Modal.Header>Please Choose App Colors</Modal.Header>
          <Modal.Content>
            <Segment inverted>
              <Label content="Primary Color"></Label>
              <SliderPicker
                color={primary}
                onChange={this.handlePrimaryChange}
              ></SliderPicker>
            </Segment>
            <Segment inverted>
              <Label content="Secondary Color"></Label>
              <SliderPicker
                color={secondary}
                onChange={this.handleSecondaryChange}
              ></SliderPicker>
            </Segment>
          </Modal.Content>
          <Modal.Actions>
            <Button
              icon="checkmark"
              color="green"
              content="Save Colors "
              onClick={this.saveColors}
            />
            <Button
              content="Cancel"
              color="red"
              icon="remove"
              inverted
              onClick={() => {
                this.closeModal();
              }}
            />
          </Modal.Actions>
        </Modal>
      </Sidebar>
    );
  }
}

export default connect(null, { changeColor })(ColorPanel);
