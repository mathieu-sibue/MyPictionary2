import React from "react";
import API from "../../utils/API.js";
import { Route, Redirect } from "react-router-dom";
import { CircularProgress } from "@material-ui/core";
import { Grid, Row } from "react-bootstrap";


export class PrivateRouteInGame extends React.Component {
  state = { 
    loaded: false,
    userInUnfinishedGame: false,
    id: this.props.computedMatch.params.id
  }
  

  async componentDidMount() {
    try {
      const userRes = await API.isUserInGameOrGameUnfinished(JSON.parse(localStorage.getItem("userInfo")).id, this.state.id);
      this.setState({
        loaded: true,
        userInUnfinishedGame: userRes
      })
    } catch(err) {
      this.setState({
        loaded: true,
        userInUnfinishedGame: false
      })
    }
  }

  render() {
    const { component: Component, ...rest } = this.props;
    if (this.state.loaded) {
      return (  
        <Route
          {...rest}       
          render={(props) => {
            if (this.state.userInUnfinishedGame) {
              return <Component {...props} />;
            } else {
              return <Redirect to="/dashboard" />;
            }
          }}
        />
      );      
    } else {
      return (
        <Grid>
          <Row className="FillMoreEmptySpace">
          </Row>
          <Row>
            <CircularProgress style={{margin: "auto"}} color="black"/> 
          </Row>  
        </Grid>
      )
    }
  }
}
