import React from "react";
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from "../../utils/API";


export class Signup extends React.Component {
    constructor () {
        super()
        this.state = {
            email: "",
            password: "",
            cpassword: "",
            username: ""
        }
        this.send = this.send.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    async send () {
        const { email, password, cpassword, username } = this.state;
        if (!email || email.length === 0) {
            return
        }
        if (!password || password.length === 0 || password !== cpassword) {
            return
        }
        try {
            const { data } = await API.signup({ email, password, username });
            localStorage.setItem("token", data.token);
            localStorage.setItem("userInfo", JSON.stringify(data.userInfo));
            window.location = "/dashboard";
        } catch (err) {
            console.log(err);
        }
    }

    handleChange (event) {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    render() {
        const { email, password, cpassword, username } = this.state;
        return (
            <div className="Signup">
                <h1>Sign Up!</h1>
                <br/>
                <FormGroup controlId="email" bsSize="large">
                    <ControlLabel>Email</ControlLabel>
                    <FormControl
                        placeholder="example@mail.com"
                        autoFocus
                        type="email"
                        value={email}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="username" bsSize="large">
                    <ControlLabel>Username</ControlLabel>
                    <FormControl
                        placeholder="PictoTueur"
                        type="text"
                        value={username}
                        onChange={this.handleChange}
                    />
                </FormGroup>
                <FormGroup controlId="password" bsSize="large">
                    <ControlLabel>Password</ControlLabel>
                    <FormControl
                        value={password}
                        onChange={this.handleChange}
                        type="password"
                    />
                </FormGroup>
                <FormGroup controlId="cpassword" bsSize="large">
                    <ControlLabel>Confirm password</ControlLabel>
                    <FormControl
                        value={cpassword}
                        onChange={this.handleChange}
                        type="password"
                    />
                </FormGroup>
                <a href="/login">Already have an account? Click here!</a>
                <Button onClick={this.send} block bsSize="large" type="submit">
                    Inscription
                </Button>
            </div>
        )
    }
};
