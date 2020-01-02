import React from "react";
import API from "../../utils/API";
import { Button, FormGroup, FormControl, ControlLabel, Panel, ButtonGroup } from "react-bootstrap";


export class WordItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            word: props.info.word,
            description: props.info.description,
            id: props.info._id,
            addedBy: props.info.author,
            CreatedOn: (props.info.createdAt).substring(0,10)+" at "+(props.info.createdAt).substring(11,19),
            willToModify: false
        }
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value.toLowerCase()
        })
    }

    handleSubmitModification = async () => {
        try {
            const words = await API.sendModifiedWordAndFetchOthers(this.state.id, this.state.word.toLowerCase(), this.state.description.toLowerCase());
            this.props.setWords(words)
            this.setState({ willToModify: false })
        } catch(error){
            console.log(error)
        }
    }

    handleModify = () => {
        this.setState({ willToModify: true })
    }

    cancelModification = () => {
        this.setState({ willToModify: false })        
    }

    handleDelete = async () => {
        try {
            const words = await API.deleteWordAndFetchOthers(this.state.id);
            this.props.setWords(words)
            //window.location.reload(true)
        } catch(error){
            console.log(error)
        }
    }

    render() {
        if (!this.state.willToModify) {
            return(
                <div className="WordAddDiv">
                    <Panel className="WordItemPanel">
                        <Panel.Heading>
                            <Panel.Title toggle style={{paddingBottom: "2%"}}>
                                <h3>{this.state.word}</h3>
                            </Panel.Title>                            
                        </Panel.Heading>

                        <Panel.Body collapsible>
                            <div><strong>Description:</strong> {this.state.description}</div>
                            <br/>    
                            <div><strong>Added by:</strong> {this.state.addedBy}</div>
                            <br/>
                            <div><strong>Added on:</strong> {this.state.CreatedOn}</div> 
                            <br/>
                            <ButtonGroup>
                                <Button onClick={this.handleModify} bsSize="large" type="submit">Modify</Button>
                                <Button onClick={this.handleDelete} bsSize="large" type="submit">Delete</Button>                         
                            </ButtonGroup>                            
                        </Panel.Body>
                    </Panel>                  
                </div>
            )
        } else {
            return(
                <div className="WordAddDiv">
                    <Panel className="WordItemPanel">
                        <Panel.Heading>
                            <Panel.Title style={{paddingBottom: "2%"}}>
                                <FormGroup controlId="word" bsSize="large">
                                    <ControlLabel>Word:</ControlLabel>
                                    <FormControl
                                        autoFocus
                                        type="text"
                                        value={this.state.word}
                                        maxLength="50"
                                        onChange={this.handleChange}
                                    />
                                </FormGroup>                                
                            </Panel.Title>
                        </Panel.Heading>
                        <Panel.Body>
                            <FormGroup controlId="description" bsSize="large">
                                <ControlLabel>Description:</ControlLabel>
                                <FormControl
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    type="text"
                                    componentClass="textarea"
                                    maxLength="250"
                                    style={{resize: "none"}}
                                />
                            </FormGroup>
                            <div><strong>Added by:</strong> {this.state.addedBy}</div>
                            <br/>
                            <div><strong>Added on:</strong> {this.state.CreatedOn}</div>
                            <ButtonGroup>
                                <Button onClick={this.cancelModification} bsSize="large" type="submit">Cancel</Button>
                                <Button onClick={this.handleSubmitModification} bsSize="large" type="submit">Submit changes</Button>
                                <Button onClick={this.handleDelete} bsSize="large" type="submit">Delete</Button>                      
                            </ButtonGroup>  
                        </Panel.Body>                                
                    </Panel>
                </div>
            )
        }            
    }
};