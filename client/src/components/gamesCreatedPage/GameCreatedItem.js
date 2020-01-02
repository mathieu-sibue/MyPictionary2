import React from "react";
import API from "../../utils/API";
import { Panel, Grid, Row, Col } from "react-bootstrap"


export class GameCreatedItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lobbyName: props.info.lobbyName,
            participants: props.info.participants,
            roundNb: props.info.roundNb,
            id: props.info._id,
            wordsUsed: props.info.wordsUsed,
            maxNbParticipants: props.info.maxNbParticipants,
            CreatedOn: (props.info.createdAt).substring(0,10)+" at "+(props.info.createdAt).substring(11,19),
        }
    }

    async componentDidMount () {
        try {
            const playerList = await API.getUsernames(this.state.participants);
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
                                                <Panel.Title toggle style={{paddingBottom: "5%"}}>
                                                    <h3>{this.state.lobbyName}</h3>
                                                </Panel.Title> 
                                            </Col>
                                        </Col>
                                    </Row> 
                                </Panel.Heading>
                                <Panel.Body collapsible>
                                    <div><strong>Final round:</strong> {this.state.wordsUsed.length}/{this.state.roundNb}</div>
                                    <br/>    
                                    <div><strong>Maximum number of players:</strong> {this.state.maxNbParticipants}</div>
                                    <br/> 
                                    <div><strong>Players:</strong> {this.state.participants.length>0? this.state.participants.join(", "): "The players all left or never joined"}</div>
                                    <br/>                  
                                    <div><strong>Words used:</strong> {this.state.wordsUsed.length>0? this.state.wordsUsed.join(", "): "The game did not start"}</div>
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