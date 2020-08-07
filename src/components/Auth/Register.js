import React, { useState } from "react";
import {
  Grid,
  Form,
  Segment,
  Button,
  Header,
  Icon,
  Message,
} from "semantic-ui-react";
import { useForm } from "react-hook-form";
import firebase from "../../firebase";
import classnames from "classnames";
import { showErrorMsg } from "../../utils";
import { Link } from "react-router-dom";
import md5 from "md5";
import { connect } from "react-redux";
import { setCurrentUser } from "../../redux/actions/UserAction";

const Register = (props) => {
  const { register, handleSubmit, errors, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [regError, setRegError] = useState(null);
  const [userRef] = useState(firebase.database().ref("users"));
  const saveUser = (createdUser) => {
    return userRef.child(createdUser.user.uid).set({
      displayName: createdUser.user.displayName,
      avatar: createdUser.user.photoURL,
    });
  };
  const onSubmit = ({ username, email, password }) => {
    setLoading(true);
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((createdUser) => {
        console.log(createdUser);
        createdUser.user
          .updateProfile({
            displayName: username,
            photoURL: `http://gravatar.com/avatar/${md5(email)}?d=identicon`,
          })
          .then(() => {
            saveUser(createdUser).then(() => {
              // props.setCurrentUser(createdUser.user);
              // props.history.push("/");
            });
          })
          .catch((err) => {
            // Handle Errors here.
            setRegError(err);
            setLoading(false);
            console.log(err);
          });
      })
      .catch((err) => {
        // Handle Errors here.
        setRegError(err);
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      {console.log(errors)}
      <Grid.Column style={{ width: "450px" }}>
        <Header size="huge" color="orange" textAlign="center">
          <Icon name="registered" />
          Register
        </Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Segment stacked>
            <Form.Field>
              <div className="ui left icon input">
                <input
                  placeholder="Username"
                  name="username"
                  ref={register({ required: true })}
                  className={classnames({
                    inputError: errors.username,
                  })}
                  // style={{ borderColor: "blue" }}
                />
                <i className="user icon"></i>
              </div>
              {showErrorMsg(errors, "username")}
            </Form.Field>
            <Form.Field>
              <div className="ui left icon input">
                <input
                  placeholder="Email"
                  name="email"
                  ref={register({
                    required: true,
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={classnames({
                    inputError: errors.email,
                  })}
                />
                <i className="mail icon"></i>
              </div>
              {showErrorMsg(errors, "email")}
            </Form.Field>
            <Form.Field>
              <div className="ui left icon input">
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  ref={register({
                    required: true,
                    minLength: {
                      value: 6,
                      message: "Password at least 6 characters long",
                    },
                  })}
                  className={classnames({
                    inputError: errors.password,
                  })}
                />
                <i className="lock icon"></i>
              </div>
              {showErrorMsg(errors, "password")}
            </Form.Field>
            <Form.Field>
              <div className="ui left icon input">
                <input
                  type="password"
                  placeholder="Password Confirmation"
                  name="passwordConfirmation"
                  ref={register({
                    required: "Password Confirmation is required",
                    validate: (value) =>
                      value === watch("password") ||
                      "Password and Confirmation is different",
                  })}
                  className={classnames({
                    inputError: errors.passwordConfirmation,
                  })}
                />
                <i className="repeat icon"></i>
              </div>
              {showErrorMsg(errors, "passwordConfirmation")}
            </Form.Field>
            <Button
              disabled={loading}
              loading={loading}
              content="Register"
              color="orange"
              fluid
              size="large"
            ></Button>
            {regError ? <Message color="red">{regError.message}</Message> : ""}
            <Message size="small">
              Already a user? <Link to="/login">Login</Link>
            </Message>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser,
});

export default connect(mapStateToProps, { setCurrentUser })(Register);
