import React from "react";
import API from "../../utils/API";
import { WordItem } from "./WordItem";


class WordList extends React.Component {
    constructor() {
        super()
        this.state = {
            words: []
        };
    }

    componentDidMount = async () => {
        try {
            const wordList = await API.getWords();
            this.setState({words: wordList});         
        } catch (error) {
            console.log(error);
        };
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.wordAdded !== this.props.wordAdded) {
            try {
                const wordList = await API.getWords();
                this.setState({words: wordList});         
            } catch (error) {
                console.log(error);
            };
            this.props.setWordAdded(false);            
        }
    }

    setWords = (newWords) => {
        this.setState({ words: newWords })
    }

    render() {
        const componentList = (this.state.words).map(word => (<div><WordItem key={word._id} info={word} setWords={this.setWords} /><br/></div>))
        return(
            <div className="WordList">
                {
                    componentList.length > 0?
                    componentList.reverse():
                    <h5><em>No word added yet... Add some now!</em></h5>
                }
            </div>
        )
    }
}

export default WordList