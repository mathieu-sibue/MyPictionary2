import React from "react";
import PictionaryGameDrawer from "./PictionaryGameDrawer"
import PictionaryGameGuesser from "./PictionaryGameGuesser"
import API from "../../utils/API";


export class PictionaryPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            isDrawer: false,
            userId: JSON.parse(localStorage.getItem("userInfo")).id,
            lobbyId: props.match.params.id
        }
    }

    async componentDidMount() {            //pour vérifier si le user est le dessinateur (car pas de contexte de partie côté client, nécessité de solliciter l'API...)      
        const isDrawerRes = await API.isDrawerInLobby(this.state.userId, this.state.lobbyId);
        this.setState({ isDrawer: isDrawerRes });
    } 

    render() {
        return (this.state.isDrawer ? <PictionaryGameDrawer lobbyId={this.state.lobbyId} /> : <PictionaryGameGuesser lobbyId={this.state.lobbyId} />)
    }
}