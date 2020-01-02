import React from "react";


export class MyFooter extends React.Component {
    render () {
        if ((window.location).toString().substring(0,26)==='http://localhost:3000/play') {
            return (<div></div>);
        } else {
            return (
                <footer className="Footer">
                    <a href="/about">About the game</a>
                </footer>
            )    
        }
    }
}