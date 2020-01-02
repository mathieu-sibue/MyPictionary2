import React from "react";
import { Button } from "react-bootstrap";


export default class HUD extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			res: false
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps !== this.props) {
			this.setState({ res: this.props.res })
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
		return (
			<div>
				<Button onClick={() => {this.props.leave()}} className="HUDButton"><h3>Leave Lobby</h3></Button>
			</div>
		);
	}
}