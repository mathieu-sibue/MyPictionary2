import React from "react";
import GamesCreatedList from "./GamesCreatedList";


export function GamesCreatedPage() {
    return (
        <div>
            <br/>
            <h1><strong>Lobbies you have created:</strong></h1>
            <br/>
            <br/>
            <GamesCreatedList />
        </div>
    )
}