import React from "react";
import API from "../../utils/API";
import { GameCreatedItem } from "./GameCreatedItem";


class GamesCreatedList extends React.Component {
    constructor() {
        super()
        this.state = {
            games: []
        };
    }

    componentDidMount = async () => {
        try {
            const userId = JSON.parse(localStorage.getItem("userInfo")).id;
            const gameList = await API.getCreatedGames(userId); 
            this.setState({games: gameList});         
          } catch (error) {
            console.log(error);
          };
    }

    render() {
        const componentList = (this.state.games).map(game => (<div><GameCreatedItem key={game._id} info={game} /><br/></div>))
        return(
            <div className="WordList">
                {
                    componentList.length > 0?
                    componentList.reverse():
                    <h5><em>Looks like you haven't created any game yet... <a href="/games">Create your own!</a></em></h5>
                }
            </div>
        )
    }
}

export default GamesCreatedList