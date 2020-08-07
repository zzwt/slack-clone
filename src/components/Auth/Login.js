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
import { showErrorMsg } from "../../utils";
import classnames from "classnames";
import { Link } from "react-router-dom";
import firebase from "../../firebase";
import { connect } from "react-redux";
import { setCurrentUser } from "../../redux/actions/UserAction";

const Login = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = ({ email, password }) => {
    setLoading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then((currentUser) => {
        // props.setCurrentUser(currentUser.user);
        // props.history.push("/");
      })
      .catch((err) => {
        console.log(err);
        setLoginError(err);
        setLoading(false);
      });
  };

  return (
    <Grid textAlign="center" verticalAlign="middle" className="app">
      {console.log(errors)}
      <Grid.Column style={{ width: "450px" }}>
        <Header size="huge" color="orange" textAlign="center">
          <Icon name="sign-in" />
          Login
        </Header>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Segment stacked>
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
                  ref={register({ required: true })}
                  className={classnames({
                    inputError: errors.password,
                  })}
                />
                <i className="lock icon"></i>
              </div>
              {showErrorMsg(errors, "password")}
            </Form.Field>
            <Button
              loading={loading}
              disabled={loading}
              content="Login"
              color="orange"
              fluid
              size="large"
            ></Button>
            {loginError ? (
              <Message color="red">{loginError.message}</Message>
            ) : (
              ""
            )}
            <Message size="small">
              Not acocunt yet? <Link to="/register">Register</Link>
            </Message>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default connect(null, { setCurrentUser })(Login);
