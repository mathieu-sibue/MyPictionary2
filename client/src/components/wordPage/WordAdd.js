import React from "react";
import API from "../../utils/API";
import { Button, FormGroup, FormControl, ControlLabel, Panel } from "react-bootstrap";


export class WordAdd extends React.Component {
    constructor() {
        super()
        this.state = {
            word: "",
            description: "",
            author: JSON.parse(localStorage.getItem("userInfo")).username
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value.toLowerCase()
        })
    }

    createWord = async () => {
        try {
            await API.createWord(this.state.author, this.state.word.toLowerCase(), this.state.description.toLowerCase());
            this.props.setWordAdded(true);
            this.setState({ word:"", description:"" })
        } catch(error){
            console.log(error)
        }
    }

    render() {
        return(
            <div className="WordAddDiv">
                <Panel className="WordAddPanel">
                    <Panel.Title>
                        <h2>Add a new word to the dictionary:</h2>
                    </Panel.Title>
                    <br/>
                    <Panel.Body>
                        <FormGroup controlId="word" bsSize="large">
                            <ControlLabel>Word</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.word}
                                onChange={this.handleChange}
                                maxLength="50"
                            />
                        </FormGroup>
                        <FormGroup controlId="description" bsSize="large">
                            <ControlLabel>Description</ControlLabel>
                            <FormControl
                                value={this.state.description}
                                onChange={this.handleChange}
                                type="text"
                                componentClass="textarea"
                                maxLength="250"
                                style={{resize: "none"}}
                            />
                        </FormGroup>               

                        <Button onClick={this.createWord} bsSize="large" type="submit">Create Word</Button>
                    </Panel.Body>
                </Panel>

            </div>
        )
    }
}