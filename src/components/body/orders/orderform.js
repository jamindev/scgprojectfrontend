import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {Context} from '../../../context.js';
import axios from 'axios';
import './orderform.css';

class OrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            details: {},
            name: "",
            sets: [],
            purchased_sets: [],
            purchased_sets_msg: "",
            stay_in_myaccount_page: true
        }
    }

    static contextType = Context;

    componentDidMount = () => {
        const stay = this.context[0].signed_in;
        if( stay ){
            this.setState({ stay_in_myaccount_page: this.context[0].signed_in })
        }

        const id = localStorage.getItem("flashcards_stdtkto_id");
        const email = localStorage.getItem("flashcards_stdtkto_email");       
        
        axios.get(this.context[5]+"/myaccount?email="+email+"&id="+id)
        .then(body => (body.data.response_msg === "posted"? this.setAccountDetails(body.data): console.log("An error occured")))
        .catch(e => console.log(e));
    }

    setSets = (sets) => {
        sets = sets.filter(elem => elem.publish_set === "yes" );
        this.setState({ sets: sets });
        
        fetch(this.context[5]+"/purchased_sets?flashcard_sets_bought="+this.state.flashcard_sets_bought)
        .then(res => res.json())
        .then((body) => (body.response_msg === "posted" ? this.setState({ purchased_sets: body.returned_sets }, () => (body.returned_sets.length === 0) ? this.setState({ purchased_sets_msg: "You currently have no flashcards!" }): this.setState({ purchased_sets_msg: "Your flashcard sets" })): this.setState({ response: "Could not scan categories table!" }) ))
        .catch((error) => console.log(error+"Error: unable to add category!"))
    }
    

    setAccountDetails = ( details ) => {
        this.setState({ details: details });
        this.setState({ name: details.name });
        this.setState({ flashcard_sets_bought: details.flashcard_sets_bought }, () => {
        fetch(this.context[5]+"/all_sets")
            .then(res => res.json())
            .then((body) => (body.response_msg === "posted" ? this.setSets( body.returned_sets ): this.setState({ response: "Could not scan categories table!" }) ))
            .catch((error) => console.log(error+"Error: unable to add category!"))
        });
    }

    
    render() { 
        return ( 
            <div className="body_signup_form">
                <form onSubmit={this.signin}>
                    Manufacturer<br />
                    <input onChange={this.setInput} type="text" id="name" placeholder="Alex Tracey" /><br />
                    Dates<br />
                    <input onChange={this.setInput} type="text" id="city" placeholder="City" /><br />
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