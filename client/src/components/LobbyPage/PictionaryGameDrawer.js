import React from "react";
import socketIOClient from "socket.io-client";
import ScoreBoard from "./ScoreBoard";
import HUD from "./HUDDrawer"
import { Grid, Row, Col, Panel } from "react-bootstrap"


const socket = socketIOClient("http://localhost:8800"); 


export default class PictionaryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lobbyId: props.lobbyId,
      userId: JSON.parse(localStorage.getItem("userInfo")).id,
      username: JSON.parse(localStorage.getItem("userInfo")).username,
      currentWord: "",
      currentWordDescription: "",
      currentRound: 0,
      maxNbParticipantsWithoutDrawer: 0,
      roundNb: 0,
      lobbyName: "",
      prevWinner: "",
      roundOnGoing: false,
      finished: false,
      finalResultsAreIn: false,

      currentColor: "black",
      creator: true,
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

    socket.on("joined", joinedInfo => {
        this.setState({ 
          lobbyName: joinedInfo.lobbyName,
          roundNb: joinedInfo.roundNb, 
          maxNbParticipantsWithoutDrawer: joinedInfo.maxNbParticipants-1,
          currentRound: joinedInfo.currentRound,
          roundOnGoing: joinedInfo.roundOnGoing,
          currentWord: joinedInfo.currentWord,
          currentWordDescription: joinedInfo.currentWordDescription,
          prevWinner: joinedInfo.prevWinner
        })
        
        if (joinedInfo.roundOnGoing) {    //si on rejoint alors qu'un round est en cours, on relance les events listeners
          this.setState({
            whiteboard: this.whiteboard.current
          });
          this.whiteboard.current.style.height = window.innerHeight;
          this.whiteboard.current.style.width = window.innerWidth;       
          
          this.whiteboard.current.addEventListener("mousedown", this.onMouseDown, false);
          this.whiteboard.current.addEventListener("mouseup", this.onMouseUp, false);
          this.whiteboard.current.addEventListener("mouseout", this.onMouseUp, false);
          this.whiteboard.current.addEventListener("mousemove", this.throttle(this.onMouseMove, 5), false);
          this.whiteboard.current.addEventListener("touchstart", this.onMouseDown, false);
          this.whiteboard.current.addEventListener("touchmove", this.throttle(this.onTouchMove, 5), false);
          this.whiteboard.current.addEventListener("touchend", this.onMouseUp, false);
      
          window.addEventListener("resize", this.onResize);
        }
    });

    socket.on("users", users => {
      this.setState({
        userList: users
      });
      this.forceUpdate()
    });

    socket.on("roundCanStart", wordInfo => {      //quand on lance un round, il faut ajouter les event listeners à la ref et mettre à jour le "contexte de jeu"
      this.setState(prevState => {return { 
          currentWord: wordInfo.wordForNextRound, 
          currentWordDescription: wordInfo.wordDescription, 
          currentRound: prevState.currentRound+1, 
          roundOnGoing: true
        }
      });

      this.setState({
        whiteboard: this.whiteboard.current
      });
      this.whiteboard.current.style.height = window.innerHeight;
      this.whiteboard.current.style.width = window.innerWidth;
      
      this.whiteboard.current.addEventListener("mousedown", this.onMouseDown, false);
      this.whiteboard.current.addEventListener("mouseup", this.onMouseUp, false);
      this.whiteboard.current.addEventListener("mouseout", this.onMouseUp, false);
      this.whiteboard.current.addEventListener("mousemove", this.throttle(this.onMouseMove, 5), false);
      this.whiteboard.current.addEventListener("touchstart", this.onMouseDown, false);
      this.whiteboard.current.addEventListener("touchmove", this.throttle(this.onTouchMove, 5), false);
      this.whiteboard.current.addEventListener("touchend", this.onMouseUp, false);
  
      window.addEventListener("resize", this.onResize);
    });

    socket.on("aUserHasWon", (winner) => {
      this.setState({ roundOnGoing: false, prevWinner: winner.winnerName });
      if (this.state.currentRound === this.state.roundNb) {
        this.setState({ finished: true });
      }
      this.clearBoard()
    });
    
    socket.on("cleared", () => {
      this.state.whiteboard
        .getContext("2d")
        .clearRect(0, 0, window.innerWidth, window.innerHeight);
    });

    socket.on("results", results => {
      this.setState({ finalResultsAreIn: true, userList: results });
      this.forceUpdate()
    })   
  }
  

  drawLine = (x0, y0, x1, y1, color, emit, force) => {
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
    var w = window.innerWidth;
    var h = window.innerHeight;
    this.setState(() => {
      if (!isNaN(x0 / w)) {
        socket.emit("drawing", {
          x0: x0 / w,
          y0: y0 / h,
          x1: x1 / w,
          y1: y1 / h,
          color: color,
          lobbyId: this.state.lobbyId,
          force: force
        });
        return {
          cleared: false
        };
      }
    });
  };

  onMouseDown = e => {
    this.setState(() => {
      return {
        currentX: e.clientX,
        currentY: e.clientY,
        drawing: true
      };
    });
  };

  onMouseUp = e => {
    this.setState(() => {
      return {
        drawing: false,
        currentX: e.clientX,
        currentY: e.clientY
      };
    });
  };

  onMouseMove = e => {
    if (!this.state.drawing) {
      return;
    }
    this.setState(() => {
      return {
        currentX: e.clientX,
        currentY: e.clientY
      };
    }, this.drawLine(this.state.currentX, this.state.currentY, e.clientX, e.clientY, this.state.currentColor, true));
  };

  onTouchMove = e => {
    if (!this.state.drawing) {
      return;
    }
    this.setState(() => {
      this.drawLine(
        this.state.currentX,
        this.state.currentY,
        e.touches[0].clientX,
        e.touches[0].clientY,
        this.state.currentColor,
        true,
        e.touches[0].force
      );
      return {
        currentX: e.touches[0].clientX,
        currentY: e.touches[0].clientY
      };
    });
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

  clearBoard = () => {
    socket.emit("clear", { lobbyId: this.state.lobbyId });
  };

  leave = () => {                 //faire un socket.on ?
    socket.emit("gameEndedByDrawer", { creatorId: this.state.userId, lobbyId: this.state.lobbyId });
    this.setState({ finished: true })
    window.location = '/dashboard'
  };

  startRoundAndGetResults = () => {
    const listOfUsers = this.state.userList;
    if (listOfUsers.length === 0) {
      console.log("pas assez de viewers pour commencer")    //mettre un message d'erreur ?
    } else {
      if (this.state.currentRound === this.state.roundNb) {
        socket.emit("gameIsFinishedNormally", { userId: this.state.userId, lobbyId: this.state.lobbyId })
      } else {
        socket.emit("start", { userId: this.state.userId, lobbyId: this.state.lobbyId, currentRound: this.state.currentRound, roundNb: this.state.roundNb });
      } 
    }   
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
              <Panel.Heading className="LobbyInfoPanel LobbyInfoHeadingDrawer">
                <Panel.Title toggle>
                  <h1>Word to draw: <em><strong>{this.state.currentWord}</strong></em></h1>
                </Panel.Title>
                <h3><em>{this.state.currentWordDescription}</em></h3>                   
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
                      clearBoard={this.clearBoard}
                      roundOnGoing={this.state.roundOnGoing}
                      leave={this.leave}
                    />
                  </Row>                  
                </Grid>
              </Panel.Body>
            </Panel> 
          </div>
        </div>
      )

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
              {
                this.state.currentRound === 0 ? 
                <div>
                  <h1><strong><em>You</em></strong> are the drawer!</h1>
                  <br/>
                  <h4><em>Waiting for players to join in...</em></h4>
                </div>:
                null
              }
              {
                this.state.prevWinner === ""?
                null:
                <h1>{this.state.prevWinner} won this round!</h1>
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
              <h4>
                <em>{this.state.finished? <div>Game finished! Go to results</div>: <div>Initiate next round by clicking on <strong>'start next round'</strong></div>}</em>
              </h4>              
            </Row>
            <Row>
              {
                this.state.currentRound === this.state.roundNb?
                <HUD
                  finished={this.state.finished}
                  startRoundAndGetResults={this.startRoundAndGetResults}
                  roundOnGoing={this.state.roundOnGoing}
                />:
                <HUD
                  startRoundAndGetResults={this.startRoundAndGetResults}
                  roundOnGoing={this.state.roundOnGoing}
                  leave={this.leave}
                />
              }              
            </Row>
          </Grid>
        </div>
      )
    }
  }
}