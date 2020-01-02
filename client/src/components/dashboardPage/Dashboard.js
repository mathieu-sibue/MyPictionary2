import React from "react";
import { Button } from "react-bootstrap";
import API from "../../utils/API";

export class Dashboard extends React.Component {
  disconnect = () => {
    API.logout();
    window.location = "/login";
  };

  

  render() {
    const userData = JSON.parse(localStorage.getItem("userInfo"));

    if (userData.admin === true) {
      return (
        <div className="Home">
          <h1>Welcome back, {userData.username}!</h1>
          <br/>
          <div className="Box">
            <Button href="/viewgames" bsSize="large">View Games</Button>
            <Button href="/viewwords" bsSize="large">Edit dictionary</Button>
          </div>
        </div>
      );
    } else {
      return (
        <div className="Home">
          <h1>Welcome back, {userData.username}!</h1>
          <br/>
          <Button href="/games" bsSize="large">
            Join or create a game
          </Button>
        </div>
      )
    };
  }
}