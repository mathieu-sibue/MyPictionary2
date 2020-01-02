import React from "react";
import API from "../../utils/API";
import { GameToDeleteItem } from "./GameToDeleteItem";


class GamesToDeleteList extends React.Component {
    constructor() {
        super()
        this.state = {
            games: []
        };
    }

    componentDidMount = async () => {
        try {
            const gameList = await API.getAllGames();
            this.setState({games: gameList});         
          } catch (error) {
            console.log(error);
          };
    }

    setGames = (newGameList) => {
        this.setState({ games: newGameList })
    }

    render() {
        const componentList = (this.state.games).map(game => (<div><GameToDeleteItem key={game._id} info={game} setGames={this.setGames} /><br/></div>))
        return(
            <div className="WordList">
                {
                    componentList.length > 0?
                    componentList.reverse():
                    <h5><em>No on going or finished games yet...</em></h5>
                }
            </div>
        )
    }
}

export default GamesToDeleteList