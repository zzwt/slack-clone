import React, { Component } from "react";
import { Switch, Route, withRouter } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Main from "./components/Main";
import Spinner from "./components/Spinner";

import firebase from "./firebase";

import { connect } from "react-redux";
import { setCurrentUser, clearUser } from "./redux/actions/UserAction";

class App extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.photoURL) {
          this.props.setCurrentUser(user);
          this.props.history.push("/");
        }
      } else {
        this.props.clearUser();
        this.props.history.push("/login");
      }
    });
  }

  render() {
    return this.props.loading ? (
      <Spinner />
    ) : (
      <Switch>
        <Route exact path="/" component={Main} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
      </Switch>
    );
  }
}

const mapStateToProps = ({ user: { loading } }) => ({
  loading,
});

export default withRouter(
  connect(mapStateToProps, { setCurrentUser, clearUser })(App)
);
