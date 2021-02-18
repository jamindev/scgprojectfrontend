import React, { Component } from 'react';
import "./termsprivacy.css";

class Privacy extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            sets: []
        }
    }


    render() { 
        return ( 
            <div className="body_termsprivacy">
                <h2>
                    Privacy Policy
                </h2>
                <p>
                    Solutions Consulting Group LLC Privacy Policy
                </p>
            </div>
        )
    }
}

export default Privacy;