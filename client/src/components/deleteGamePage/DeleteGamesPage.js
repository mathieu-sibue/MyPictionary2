import React from "react";
import GamesToDeleteList from "./GamesToDeleteList";


export function DeleteGamesPage() {
    return (
        <div>
            <br/>
            <h1><strong>Lobbies created by players:</strong></h1>
            <br/>
            <br/>
            <GamesToDeleteList />
        </div>
    )
}