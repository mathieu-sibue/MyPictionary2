import React from "react";
import GameList from "./GameList";
import { GameCreate } from "./GameCreate";


export function JoinAndCreateGamePage() {
    return (
        <div>
            <br/>            
            <GameCreate />
            <br/>
            <br/>
            <h1><strong>Join an ongoing game!</strong></h1>
            <br/>
            <GameList />
        </div>
    )
}