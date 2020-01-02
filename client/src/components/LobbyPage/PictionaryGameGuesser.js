import React from "react";
import socketIOClient from "socket.io-client";
import ScoreBoard from "./ScoreBoard";
import HUD from "./HUDGuesser"
import { Button, FormGroup, FormControl, ControlLabel, Grid, Row, Col, Panel } from "react-bootstrap";


const socket = socketIOClient("http://localhost:8800"); 


export default class PictionaryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyId: props.lobbyId,
      userId: JSON.parse(localStorage.getItem("userInfo")).id,
      username: JSON.parse(localStorage.getItem("userInfo")).username,
      currentRound: 0,
      roundNb: 0,
      currentWord: "",
      maxNbParticipantsWithoutDrawer: 0,
      finalResultsAreIn: false,
      lobbyName: "",
      guess: "",
      prevWinner: "",
      roundOnGoing: false,

      currentColor: "black",
      creator: false,
      drawing: false,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      cleared: false,
      userList: []
    };
    this.whiteboard = React.createRef();


    socket.emit("join", {
      userId: this.state.userId,
      username: this.state.username,
      lobbyId: this.state.lobbyId
    });

    socket.on("joined", joinedInfo => {       //si on rejoint en cours de partie, on rajoute les events listeners et on reprend le contexte de la partie
      this.setState({ 
        lobbyName: joinedInfo.lobbyName,
        roundNb: joinedInfo.roundNb, 
        maxNbParticipantsWithoutDrawer: joinedInfo.maxNbParticipants-1,
        currentRound: joinedInfo.currentRound,
        roundOnGoing: joinedInfo.roundOnGoing,
        currentWord: joinedInfo.currentWord,
        prevWinner: joinedInfo.prevWinner
      });

      if (joinedInfo.roundOnGoing) {
        this.setState({
          whiteboard: this.whiteboard.current
        });
        //this.whiteboard.current.style.height = window.innerHeight;
        //this.whiteboard.current.style.width = window.innerWidth;
        window.addEventListener("resize", this.onResize);        
      }
    });

    socket.on("users", users => {
      this.setState({
        userList: users
      });
      this.forceUpdate()
    });

    socket.on("roundCanStart", wordInfo => {          //début d'un round : on lance les event listeners et on update le contexte
      this.setState(prevState => {return { currentWord: wordInfo.wordForNextRound, currentRound: prevState.currentRound+1, roundOnGoing: true }});
      this.setState({
        whiteboard: this.whiteboard.current
      });
      window.addEventListener("resize", this.onResize);
    });

    socket.on("cleared", () => {
      this.state.whiteboard
        .getContext("2d")
        .clearRect(0, 0, window.innerWidth, window.innerHeight);
    });

    socket.on("drawing", data => {
      let w = window.innerWidth;
      let h = window.innerHeight;

      if (!isNaN(data.x0 / w) && !isNaN(data.y0)) {
        this.drawLine(
          data.x0 * w,
          data.y0 * h,
          data.x1 * w,
          data.y1 * h,
          data.color
        );
      }
    });
 
    socket.on("aUserHasWon", (winner) => {
      this.setState(prevState => {return { roundOnGoing: false, prevWinner: winner.winnerName }});
    })

    socket.on("gameHasEnded", () => {
      window.location = "/dashboard";
    });

    socket.on("results", results => {
      this.setState({ finalResultsAreIn: true, userList: results })
      this.forceUpdate()
    });
  }

  
  componentDidMount() {
    this.setState({
      whiteboard: this.whiteboard.current
    });
    this.whiteboard.current.style.height = window.innerHeight;
    this.whiteboard.current.style.width = window.innerWidth;

    window.addEventListener("resize", this.onResize);
  }


  drawLine = (x0, y0, x1, y1, color, emit) => {
    let context = this.state.whiteboard.getContext("2d");
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.strokeStyle = color;
    context.lineWidth = 2;

    context.stroke();
    context.closePath();

    if (!emit) {
      return;
    }
  };

  onResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  };

  throttle = (callback, delay) => {
    let previousCall = new Date().getTime();
    return function() {
      let time = new Date().getTime();

      if (time - previousCall >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  };

  leave = () => {
    socket.emit("leaveroom", { userId: this.state.userId, lobbyId: this.state.lobbyId });
    window.location = '/dashboard';
  };
  

  handleChange = (event) => {
    this.setState({
        [event.target.id]: event.target.value
    })
  }

  handleGuess = () => {
    if ((this.state.guess).toLowerCase() === this.state.currentWord) {
      socket.emit("iHaveWon", { 
        userId: this.state.userId, 
        username: this.state.username, 
        lobbyId: this.state.lobbyId 
      })
    }
    this.setState({ guess: "" })
  }


  render() {
    if (this.state.finalResultsAreIn) {
      return (
        <div>
          <Grid>
            <Row className="FillEmptySpace">
            </Row>
            <Row><h1 className="LobbyName"><strong>{this.state.lobbyName}</strong> (lobby)</h1></Row>  
            <Row>
              <Col md={6} mdOffset={3} xs={8} xsOffset={2}>
                <ScoreBoard
                  userList={this.state.userList} 
                  nbParticipants={this.state.maxNbParticipantsWithoutDrawer} 
                  res={this.state.finalResultsAreIn}
                />                
              </Col>
            </Row>
            <Row>
              <HUD
                res={this.state.finalResultsAreIn}
              />   
            </Row>
          </Grid>
        </div>
      )
    }

    if (this.state.roundOnGoing) {
      return (
        <div>
          <canvas
            height={`${this.state.windowHeight}px`}
            width={`${this.state.windowWidth}px`}
            ref={this.whiteboard}
            className="whiteboard"
          />

          <div className="LobbyInfoContainer">
            <Panel className="LobbyInfoPanel">
              <Panel.Heading className="LobbyInfoPanel LobbyInfoHeadingViewer">
                <FormGroup controlId="guess" bsSize="large">
                  <Panel.Title toggle>
                    <ControlLabel><h1>Your guess:</h1></ControlLabel>
                  </Panel.Title>
                  <FormControl
                    type="text"
                    value={this.state.guess}
                    onChange={this.handleChange}
                  />
                  <Button onClick={this.handleGuess} bsSize="large" type="submit" className="HUDButtonViewer"><h3>Try your guess</h3></Button>                  
                </FormGroup>
              </Panel.Heading>
              <Panel.Body collapsible>
                <Grid>
                  <Row>
                    <Col xs={12} md={6}>
                      <h3><strong>{this.state.lobbyName}</strong> (lobby)</h3> 
                      <h3>Round {this.state.currentRound}/{this.state.roundNb}</h3>
                      <br/>
                    </Col>
                    <Col xs={12} md={6}>
                      <ScoreBoard userList={this.state.userList} nbParticipants={this.state.maxNbParticipantsWithoutDrawer}/>
                    </Col>
                  </Row>
                  <Row>               
                    <HUD
                      leave={this.leave}
                    />   
                  </Row>                  
                </Grid>                
              </Panel.Body>

            </Panel>
          </div>         
        </div>
      ); 

    } else {
      return (
        <div>
          <canvas
            height={`${this.state.windowHeight}px`}
            width={`${this.state.windowWidth}px`}
            ref={this.whiteboard}
            className="whiteboard"
            style={{display: "none"}}
          />   

          <Grid>
            <Row className="FillEmptySpace">
            </Row>  

            <Row>
              {this.state.prevWinner === this.state.username? 
              <h1><strong><em>You</em></strong> won this round!</h1>:
              this.state.prevWinner === ""?
                null:
                <h1>{this.state.prevWinner} won this round...</h1>
              }
              {this.state.currentWord === "" || this.state.prevWinner === this.state.username? null: <h3>Last word to guess was <strong>{this.state.currentWord}</strong></h3>}  
            </Row>

            <Row>
              {
                this.state.currentRound !== this.state.roundNb?
                <div>
                  <h1>Prepare to guess the word drawn on the page!</h1>
                  <br/>
                  <h4><em>Waiting for drawer to initiate next round... </em></h4>
                </div>
                :
                <h4><em>Waiting for results...</em></h4>
              }              
            </Row>
            <br/>
            <Row>
              <Col xs={12} md={6}>
                <h3><strong>{this.state.lobbyName}</strong> (lobby)</h3> 
                <h3>Round {this.state.currentRound}/{this.state.roundNb}</h3>
                <br/>
              </Col>
              <Col xs={12} md={6}>
                <ScoreBoard userList={this.state.userList} nbParticipants={this.state.maxNbParticipantsWithoutDrawer}/>
              </Col>
            </Row>
            <Row>
              <HUD
                leave={this.leave}
              />              
            </Row>
          </Grid>         
        </div>
      );      
    }
  }
}