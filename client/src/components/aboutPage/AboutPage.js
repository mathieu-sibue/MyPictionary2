import React from "react";

export function AboutPage () {
    return (
            <div className="About">
                <h1>MyPictionary: the second version of a classic game</h1>
                <br/>
                <p>Here is my second attempt at making an online Pictionary Game. This one uses, as required, a front and a back JS framework.</p>
                <br/>
                <h1>Rules</h1>
                <br/>
                <p>The creator of a lobby (aka room) will wait for players to join in. 
                    Once enough participants have joined in, the host can launch the first round and players will have to guess the words drawn by the host.
                    The round winner is the first player to guess the word drawn.
                    The game winner is the player who accumulated the highest number of points during the rounds.
                </p>
                <br/>
            </div>
        )    
}