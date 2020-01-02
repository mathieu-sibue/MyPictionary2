import React from "react";
import API from "../../utils/API";
import { Button, FormGroup, FormControl, ControlLabel, Panel } from "react-bootstrap";


export class GameCreate extends React.Component {
    constructor() {
        super()
        this.state = {
            lobbyName: "",
            roundNb: 3,
            maxNbParticipants: 5,
            creatorId: JSON.parse(localStorage.getItem("userInfo")).id,
            wordCount: 0
        }
    }

    async componentDidMount() {
        let wordCountInDict = (await API.getWords()).length;
        this.setState({ wordCount: wordCountInDict })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        })
    }

    createGame = async () => {
        try {
            const createdGameId = await API.createGame(this.state.lobbyName, this.state.roundNb, this.state.maxNbParticipants, this.state.creatorId);
            window.location = '/play/'+ createdGameId.toString();
        } catch(error){
            console.log(error)
        }
    }

    render() {
        return(
            <div className="GameCreateDiv">
                <Panel className="GameCreatePanel">
                    <Panel.Title>
                        <h2>Create a new lobby!</h2>
                    </Panel.Title>


                    <Panel.Body>
                        <p>(Current number of words in dictionary: {this.state.wordCount})</p>
                        <FormGroup controlId="lobbyName" bsSize="large">
                        <ControlLabel>Lobby name</ControlLabel>
                            <FormControl
                                type="text"
                                placeholder="leLobbyDesNuls"
                                value={this.state.lobbyName}
                                onChange={this.handleChange}
                                maxLength="50"
                                required=""
                            />
                        </FormGroup>

                        <FormGroup controlId="roundNb" bsSize="large">
                            <ControlLabel>Round number</ControlLabel>
                            <FormControl
                                value={this.state.roundNb}
                                onChange={this.handleChange}
                                type="number"
                                min="1"
                                max={Math.min(10,this.state.wordCount)}
                                step="1"
                                componentClass="input"
                            />
                        </FormGroup> 

                        <FormGroup controlId="maxNbParticipants" bsSize="large">
                            <ControlLabel>Max number of players</ControlLabel>
                            <FormControl
                                value={this.state.maxNbParticipants}
                                onChange={this.handleChange}
                                type="number"
                                min="2"
                                max="10"
                                step="1"
                                componentClass="input"
                            />
                        </FormGroup>                
                        <Button onClick={this.createGame} bsSize="large" type="submit">Create Game</Button>
                    </Panel.Body>
                </Panel>
            </div>
        )
    }
}