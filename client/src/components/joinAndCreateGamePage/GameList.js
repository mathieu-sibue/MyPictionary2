import React from "react";
import API from "../../utils/API";
import { GameToJoinItem } from "./GameToJoinItem";


class GameList extends React.Component {
    constructor() {
        super()
        this.state = {
            games: []
        };
    }

    componentDidMount = async () => {
        try {
            const gameList = await API.getGames(false);
            this.setState({games: gameList});         
          } catch (error) {
            console.log(error);
          };
    }

    render() {
        const componentList = (this.state.games).map(game => (<div><GameToJoinItem key={game._id} info={game} /><br/></div>))
        return(
            <div className="WordList">
                {
                    componentList.length > 0?
                    componentList.reverse():
                    <h5><em>No on going games with places left... Create your own!</em></h5>
                }
            </div>
        )
    }
}

export default GameList