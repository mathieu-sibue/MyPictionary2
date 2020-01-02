import React from "react";
import { Navbar, Nav, NavItem, Button, Glyphicon } from "react-bootstrap";
import API from "../../utils/API";


export default class MyNavbar extends React.Component {
    disconnect = () => {
        API.logout();
        window.location = "/";
    };

    render() {
        if ((window.location).toString().substring(0,26)==='http://localhost:3000/play') {
            return (<div></div>);
        }
        if (!API.isAuth()) {
            return (
                <Navbar inverse collapseOnSelect className="Navbar">
                    <Navbar.Header>
                        <Navbar.Brand>
                        <a href="/" id="Title">MyPictionary</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Nav pullRight>
                            <NavItem eventKey={1} href="/signup">
                                Sign up
                            </NavItem>
                            <NavItem eventKey={2} href="/login">
                                Log in
                            </NavItem>
                            <NavItem eventKey={3} href="/about">
                                About the game
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            )
        }
        if (API.isAdmin()) {
            return (
                <Navbar inverse collapseOnSelect className="Navbar">
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/dashboard" id="Title">MyPictionary</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>
                        <Navbar.Form pullRight> 
                            <Button onClick={this.disconnect}>Log Out <Glyphicon glyph="align-right glyphicon-log-out"></Glyphicon></Button>
                        </Navbar.Form>                        
                        <Nav pullRight>
                            <NavItem eventKey={1} href="/viewwords">
                                Words
                            </NavItem>
                            <NavItem eventKey={2} href="/viewgames">
                                Games
                            </NavItem>
                            <NavItem eventKey={3} href="/about">
                                About the game
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            )
        }
        if (!API.isAdmin()) {           //ou on aurait pu mettre else
            return (
                <Navbar inverse collapseOnSelect className="Navbar">
                    <Navbar.Header>
                        <Navbar.Brand>
                            <a href="/dashboard" id="Title">MyPictionary</a>
                        </Navbar.Brand>
                        <Navbar.Toggle />
                    </Navbar.Header>
                    <Navbar.Collapse>  
                        <Navbar.Form pullRight> 
                            <Button onClick={this.disconnect}>Log Out <Glyphicon glyph="align-right glyphicon-log-out"></Glyphicon></Button>
                        </Navbar.Form>                                              
                        <Nav pullRight>
                            <NavItem eventKey={1} href="/games">
                                Join or create a lobby
                            </NavItem>
                            <NavItem eventKey={2} href="/gamescreated">
                                Games created
                            </NavItem>
                            <NavItem eventKey={3} href="/about">
                                About the game
                            </NavItem>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            )
        }
    }
}


