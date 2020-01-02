import React from "react";
import WordList from "./WordList";
import { WordAdd } from "./WordAdd";


export class WordPage extends React.Component {
    constructor() {
        super()
        this.state = {
            wordAdded: false
        }
    }

    setWordAdded = (bool) => {
        this.setState({ wordAdded: bool })
    }

    render() {
        return (
            <div>
                <br/>
                <WordAdd wordAdded={this.state.wordAdded} setWordAdded={this.setWordAdded} />
                <br/>
                <br/>
                <h1><strong>Current dictionary:</strong></h1>
                <br/>
                <WordList wordAdded={this.state.wordAdded} setWordAdded={this.setWordAdded} />  
            </div>             
        )   
    }
}