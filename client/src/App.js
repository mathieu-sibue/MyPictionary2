import React, { Component } from "react";
import { Redirect, Route, Switch, BrowserRouter } from "react-router-dom";
import "./App.css";
import { DashboardPage } from "./components/dashboardPage/DashboardPage.js";
import { LoginPage } from "./components/loginPage/LoginPage";
import { SignupPage } from "./components/signupPage/SignupPage";
import { PrivateRoute } from "./components/privateRoutes/PrivateRoute.js";
import { PublicRoute } from "./components/privateRoutes/PublicRoute.js";
import { PrivateRouteUser } from "./components/privateRoutes/PrivateRouteUser";
import { PrivateRouteAdmin } from "./components/privateRoutes/PrivateRouteAdmin";
import { PrivateRouteInGame } from "./components/privateRoutes/PrivateRouteInGame";

import { WordPage } from "./components/wordPage/WordPage";
import { JoinAndCreateGamePage } from "./components/joinAndCreateGamePage/JoinAndCreateGamePage";
import { DeleteGamesPage } from "./components/deleteGamePage/DeleteGamesPage";
import { GamesCreatedPage } from "./components/gamesCreatedPage/GamesCreatedPage";
import { PictionaryPage } from "./components/LobbyPage/PictionaryPage";
import { HomePage } from "./components/homePage/HomePage";
import { MyFooter } from "./components/basicComponents/MyFooter";
import MyNavbar from "./components/basicComponents/MyNavbar";
import { AboutPage } from "./components/aboutPage/AboutPage";

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserRouter basename="/">
          <div className="App-content">
            <MyNavbar/>
            <Switch>
              <Route path="/about" component={AboutPage} />
              <PublicRoute exact path="/" component={HomePage} />
              <PublicRoute exact path="/login" component={LoginPage} />
              <PublicRoute exact path="/signup" component={SignupPage} />
              <PrivateRoute path="/dashboard" component={DashboardPage} />
              <PrivateRouteAdmin path="/viewwords" component={WordPage} />
              <PrivateRouteUser path="/games" component={JoinAndCreateGamePage} />
              <PrivateRouteUser path="/gamescreated" component={GamesCreatedPage} />
              <PrivateRouteInGame path="/play/:id" component={PictionaryPage} />
              <PrivateRouteAdmin path="/viewgames" component={DeleteGamesPage} />     {/*à changer dans les routes*/}
              <Redirect from='*' to='/dashboard' />
            </Switch>
            <MyFooter/>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
export default App;
