import React from "react";
import { Button } from "react-bootstrap"


export function HomePage () {
    return (
            <div className="Home">
                <h1>Join <em>now</em> an awesome online Pictionary game!</h1>
                <br/>
                <br/>
                <Button href="/login" bsSize="large">Get Started</Button>
            </div>
        )    
}

