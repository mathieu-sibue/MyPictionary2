import React from "react";
import { Panel } from "react-bootstrap";


export default class ScoreBoard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userList: [],
            nbParticipants: 0,
            res: false
        }
    }

    componentDidMount() {
        this.setState({
            userList: this.props.userList,
            nbParticipants: this.props.nbParticipants
        })
    }

    componentDidUpdate(prevProps) {         
        if (prevProps !== this.props) {
            this.setState({ userList: this.props.userList, nbParticipants: this.props.nbParticipants, res: this.props.res })
        }
    }

	render() {
        let userJSXList = this.state.userList.map((user) => <h4><strong>{user.username}:</strong> {user.value} point(s)</h4>);
        let winner;
        if (this.state.res) {
            winner = (this.state.userList).reduce(function(prev, current) {
                return (prev.value > current.value) ? prev : current
            });
        }
        
		return (
            <div>
                {
                this.state.res? 
                <div><h2>And the winner is... {winner.username === JSON.parse(localStorage.getItem("userInfo")).username? <strong>You</strong>: winner.username}!</h2><br/></div>: 
                null 
                }
                <Panel className="ScoreBoard">
                    <Panel.Heading className="ScoreBoard">
                        <Panel.Title toggle className="ScoreBoard">
                            <h3 style={{paddingBottom: "2%"}}>Scoreboard</h3> 
                        </Panel.Title>
                    </Panel.Heading>
                    <Panel.Body collapsible>
                        {userJSXList}
                        <em>({userJSXList.length}/{this.state.nbParticipants} guest player(s))</em>                        
                    </Panel.Body>
                </Panel>
            </div>
        );
	}
}