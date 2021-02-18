import React, { Component } from 'react';
import './footer.css';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    render() { 
        return ( 
            <div className="footer_container">
                <div className="footer_copyright">
                    TracsalPrep @Copyright 2020
                </div>
                <div className="links">

                </div>
            </div>
        );
    }
}
 
export default Footer;