import React, { Component } from 'react';
import "./termsprivacy.css";

class Terms extends Component {
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
                    Terms of Use ("Terms")
                </h2>
                <p>
                    Solutions Consulting Group LLC Terms of Use
                </p>
            </div>
        )
    }
}

export default Terms;