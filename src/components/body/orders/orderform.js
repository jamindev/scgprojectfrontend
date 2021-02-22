import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Context} from '../../../context.js';
import axios from 'axios';
import './orderform.css';

class OrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email: "",
            stay_in_myaccount_page: true,
            manufacturer: "",
            dates: [],
            country: ""
        }
    }

    static contextType = Context;

    componentDidMount = () => {
        // const id = localStorage.getItem("flashcards_stdtkto_id");
        const email = localStorage.getItem("flashcards_stdtkto_email");       
        this.setState({email});
    }


    placeOrder = () => {
        let order_details = new FormData();

        order_details.append("place_order", true);
        order_details.append("manufacturer", this.state.manufacturer);
        order_details.append("dates", this.state.dates);
        order_details.append("country", this.state.country);
        
        axios.get(this.context[5], order_details)
        .then(body => (body.data.response_msg === "posted"? this.setAccountDetails(body.data): console.log("An error occured")))
        .catch(e => console.log(e));
    }


    setInput = (event) => {
        const id = event.target.id;
        let val = event.target.value;

        this.setState({ [id]: val });
    }
    

    render() { 
        return ( 
            <div className="body_signup_form">
                <form onSubmit={this.placeOrder}>
                    Manufacturer<br />
                    <input onChange={this.setInput} type="text" id="manufacturer" placeholder="Alex Tracey" /><br />
                    Dates<br />
                    <input onChange={this.setInput} type="text" id="dates" placeholder="City" /><br />
                    Country<br />
                    <input onChange={this.setInput} type="text" id="country" placeholder="Country" /><br />
                    <div className="body_signup_terms">
                        <div>By signing up you agree to our <Link to="./terms">Terms of Use</Link> and <Link to="./privacy">Privacy Policies</Link></div>
                    </div>
                    <div onClick={this.signup} className="body_signup_btn">
                        Place your order
                    </div>
                </form>
            </div>
        );
    
    }
}
 
export default OrderForm;