import React from "react";
import { Col, Button } from "react-bootstrap"


export default class HUD extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			preRound: !props.roundOnGoing,
			finished: false,
			res: false
		};
	}

	componentDidUpdate(prevProps){				
		if (prevProps !== this.props) {
		  this.setState({preRound: !this.props.roundOnGoing, finished: this.props.finished, res: this.props.res });
		}
	}
	
	goToDashboard = () => {
		window.location = "/dashboard";
	}

	render() {
		if (this.state.res) {
			return (
				<div>
					<Button onClick={this.goToDashboard} className="HUDButton"><h3>Go back to dashboard</h3></Button>				
				</div>
			)
		}

		if (this.state.preRound) {
			return (
				<div>
					{
						this.state.finished?
						<Col xs={12}>
							<Button onClick={this.props.startRoundAndGetResults} className="HUDButton"><h3>Results</h3></Button>						
						</Col>:
						<div>
							<Col xs={6}>
								<Button onClick={this.props.startRoundAndGetResults} className="HUDButton"><h3>Start next round</h3></Button>
							</Col>					
							<Col xs={6}>
								<Button onClick={this.props.leave} className="HUDButton"><h3>Shut Lobby</h3></Button>					
							</Col>
						</div>
					}
				</div>				
			)
		} else {
			return (
				<div>
					<Col xs={6}>
						<Button onClick={this.props.clearBoard} bsSize="large" className="HUDButton"><h3>Clear</h3></Button>					
					</Col>
					<Col xs={6}>
						<Button onClick={this.props.leave} bsSize="large" className="HUDButton"><h3>Shut Lobby</h3></Button>				
					</Col>
				</div>
			);
		}
	}
}