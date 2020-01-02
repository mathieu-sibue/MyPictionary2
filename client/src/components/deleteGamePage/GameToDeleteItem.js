import React from "react";
import API from "../../utils/API";
import { Button, Panel, Grid, Row, Col } from "react-bootstrap";


export class GameToDeleteItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lobbyName: props.info.lobbyName,
            participants: [],
            roundNb: props.info.roundNb,
            id: props.info._id,
            wordsUsed: props.info.wordsUsed,
            maxNbParticipants: props.info.maxNbParticipants,
            creatorId: "",
            finished: props.info.finished,
            creatorUsername: "",
            currentRound: props.info.currentRound,
            playerId: JSON.parse(localStorage.getItem("userInfo")).id,
            CreatedOn: (props.info.createdAt).substring(0,10)+" at "+(props.info.createdAt).substring(11,19)
        }
    }

    handleDeleteGame = async () => {
        try {
            let updatedGames = await API.deleteGameAndFetchUpdatedOnes(this.state.id);
            this.props.setGames(updatedGames); 
            //window.location.reload(true)               
        } catch(error){
            console.log(error)
        }
    }

    async componentDidMount () {
        try {
            const username = await API.getUsernames([this.props.info.creator]);     //il faut faire 2 fetch différents puisque la méthode mongoose avec $in renvoie les utilisateurs dans n'imp quel ordre
            this.setState({ creatorUsername: username })

            const playerList = await API.getUsernames(this.props.info.participants);
            this.setState({ participants: playerList })
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
                                                <Panel.Title toggle style={!this.state.finished? {paddingBottom: "5%", color:"rgb(169,169,169)"}: {paddingBottom: "5%"}}>
                                                    <h3>{this.state.lobbyName}</h3>
                                                </Panel.Title> 
                                            </Col>
                                        </Col>
                                        <Col xsPush>
                                            {this.state.finished && <Button onClick={this.handleDeleteGame} bsSize="large" bsStyle="danger">Delete</Button>}
                                        </Col>
                                    </Row>    
                                </Panel.Heading>                              
                                <Panel.Body collapsible>
                                    <div><strong>Final round:</strong> {this.state.currentRound}/{this.state.roundNb}</div>
                                    <br/>    
                                    <div><strong>Maximum number of players:</strong> {this.state.maxNbParticipants}</div>
                                    <br/> 
                                    <div><strong>Players: </strong> {this.state.participants.length>0? this.state.participants.join(", "): "The players all left or never joined"}</div>
                                    <br/>                  
                                    <div><strong>Words used:</strong> {this.state.wordsUsed.length>0? this.state.wordsUsed.join(", "): "The game did not start"}</div>
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