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
            id: "",
            year_options: [],
            stay_in_myaccount_page: true,
            manufacturer: "",
            years: [],
            condition_description: "",
            order_stage: "Order form"
        }
    }

    static contextType = Context;

    componentDidMount = () => {
        const id = localStorage.getItem("scgproject_stdtkto_id");
        const email = localStorage.getItem("scgproject_stdtkto_email");       
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
        order_details.append("id", this.state.id);
        order_details.append("manufacturer", this.state.manufacturer);
        order_details.append("years", JSON.stringify(this.state.years));
        order_details.append("condition_description", this.state.condition_description);

        axios.post(this.context[5]+"/dashboard.php", order_details, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            }
        })
        .then(body => (body.data.response === "order_placed" ? this.setState({order_stage: "Confirmation"}) : console.log("An error occured")))
        .catch(e => console.log(e));
    }


    setInput = (event) => {
        const id = event.target.id;
        let val = event.target.value;

        this.setState({ [id]: val });
    }

    addYear = (event) => {
        let val = event.target.value;

        let years = this.state.years;
        years.push(val);

        this.setState({ years });
    }
    

    render() { 
        if( this.state.order_stage === "Order form" ){ 
            return ( 
                <div className="body_order_form">
                    Manufacturer<br />
                    <input onChange={this.setInput} type="text" id="manufacturer" placeholder="Manufacturer" /><br />
                    Years<br />
                    <select id="years" onChange={this.addYear}>
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
                    <div onClick={() => {this.setState({ order_stage: "Payment form" })}} className="body_order_btn">
                        Next: Payment Information
                    </div>
                </div>
            );
        }else if(this.state.order_stage === "Payment form"){
            return ( 
                <div className="body_order_form">
                    <h3>Payment Information</h3>
                    <p>
                        Payment details will be collected or confirmed here if already collected in a previous tansaction.
                    </p>
                    <form onSubmit={this.placeOrder}>
                        <div className="body_order_terms">
                            <div>By signing up you agree to our <Link to="./terms">Terms of Use</Link> and <Link to="./privacy">Privacy Policies</Link></div>
                        </div>
                        <div onClick={this.placeOrder} className="body_order_btn">
                            Place your order
                        </div>
                    </form>
                </div>
            );
        }else if(this.state.order_stage === "Confirmation"){
            return ( 
                <div className="body_order_form">
                    <h3>Thank you!</h3>
                    <p>
                        Order was successfully placed. Please send your sports cards to our specilists' address: 5555 ABC DR. Knoxville, TN United States, 00000 
                    </p>
                    <div className="body_order_terms">
                        <div onClick={() => {this.setState({order_stage: "Order form"})}}>Place another order</div>
                    </div>
                </div>
            );
        }
    
    }
}
 
export default OrderForm;