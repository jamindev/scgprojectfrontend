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
            year_options: [],
            stay_in_myaccount_page: true,
            id: "",
            manufacturer: "",
            years: [],
            condition_description: ""
        }
    }

    static contextType = Context;

    componentDidMount = () => {
        const id = localStorage.getItem("flashcards_stdtkto_id");
        const email = localStorage.getItem("flashcards_stdtkto_email");       
        this.setState({email, id});
        let year_options = []; 
        let maxOffset = 80;
        let currentYear = (new Date()).getFullYear();
        for(let i = 0; i <= maxOffset; i++) {
            year_options.push(currentYear - i)
        }
        this.setState({year_options});
    }


    placeOrder = () => {
        let order_details = new FormData();

        order_details.append("place_order", true);
        order_details.append("manufacturer", this.state.manufacturer);
        order_details.append("years", this.state.years);
        order_details.append("condition_description", this.state.condition_description);
        
        axios.post(this.context[5]+"/dashboard.php", order_details)
        .then(body => (body.data.response_msg === "order_placed"? this.setAccountDetails(body.data): console.log("An error occured")))
        .catch(e => console.log(e));
    }


    setInput = (event) => {
        const id = event.target.id;
        let val = event.target.value;

        this.setState({ [id]: val });
    }
    

    render() { 
        return ( 
            <div className="body_order_form">
                <form onSubmit={this.placeOrder}>
                    Manufacturer<br />
                    <input onChange={this.setInput} type="text" id="manufacturer" placeholder="Manufacturer" /><br />
                    Years<br />
                    <select>
                        <option></option>
                        {this.state.year_options.map((elem, index) => (
                            <option key={index}>{elem}</option>
                        ))}
                    </select>
                    Condition Description<br />
                    <textarea onChange={this.setInput} type="text" id="condition_description" placeholder="Condition description" /><br />
                    <div className="body_order_terms">
                        <div>By signing up you agree to our <Link to="./terms">Terms of Use</Link> and <Link to="./privacy">Privacy Policies</Link></div>
                    </div>
                    <div onClick={this.signup} className="body_order_btn">
                        Place your order
                    </div>
                </form>
            </div>
        );
    
    }
}
 
export default OrderForm;