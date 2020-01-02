import React from "react";
import API from "../../utils/API";
import { Button, Row, Col, Grid, Panel } from "react-bootstrap";


export class GameToJoinItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lobbyName: props.info.lobbyName,
            participants: props.info.participants,
            roundNb: props.info.roundNb,
            id: props.info._id,
            wordsUsed: props.info.wordsUsed,
            maxNbParticipants: props.info.maxNbParticipants,
            creatorId: props.info.creator,
            creatorUsername: "",
            playerId: JSON.parse(localStorage.getItem("userInfo")).id,
            playerUsername: JSON.parse(localStorage.getItem("userInfo")).username,
            CreatedOn: (props.info.createdAt).substring(0,10)+" at "+(props.info.createdAt).substring(11,19),
        }
    }

    handleJoinGame = async () => {
        try {
            await API.joinGame(this.state.id, this.state.playerId, this.state.playerUsername);
            window.location = '/play/'+ (this.state.id).toString()
        } catch(error){
            console.log(error)
        }
    }

    async componentDidMount () {
        try {
            const username = await API.getUsernames([this.state.creatorId]);
            this.setState({ creatorUsername: username })
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        return(
            <div>
                <Grid>
                    <Row>
                        <Col mdOffset={3} md={6} xsOffset={1} xs={10}>
                            <Panel>
                                <Panel.Heading>
                                    <Row>
                                        <Col xs={9}>
                                            <Col xsOffset={4}>
                                                <Panel.Title toggle style={{paddingBottom: "5%"}}>
                                                    <h3>{this.state.lobbyName}</h3>
                                                </Panel.Title> 
                                            </Col>
                                        </Col>
                                        <Col xsPush>
                                            <Button bsStyle="primary" onClick={this.handleJoinGame} bsSize="large" type="submit"><strong>Join!</strong></Button>
                                        </Col>
                                    </Row>                            
                                </Panel.Heading> 

                                <Panel.Body collapsible>
                                    <div><strong>Current round: </strong>{this.state.wordsUsed.length}/{this.state.roundNb}</div>
                                    <br/>    
                                    <div><strong>Number of players:</strong> {this.state.participants.length}/{this.state.maxNbParticipants}</div>
                                    <br/>                   
                                    <div><strong>Created by:</strong> {this.state.creatorUsername}</div>
                                    <br/>
                                    <div><strong>Added on:</strong> {this.state.CreatedOn}</div>
                                    <br/>                                                    
                                </Panel.Body>                
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>
        )
       
    }
}