import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Context } from '../../../../context.js'

import './signup.css';
var jsondata = require('./address.json');

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            confirm_password: "",
            gender: "",
            date_of_birth: "",
            address_1: "",
            address_2: "",
            city: "",
            password_error: "",
            email_exists_msg: "",
            go_to_myaccount: false,
            countries: jsondata,
            states_or_regions: [],
            country: "",
            state_or_region: "",
        }
    }

    static contextType = Context;

    signup = async (event) => {
        event.preventDefault();

        let data = new FormData();

        data.append("signup", true);
        data.append("first_name", this.state.first_name);
        data.append("last_name", this.state.last_name);
        data.append("email", this.state.email);
        data.append("password", this.state.password);
        data.append("onfirm_password", this.state.confirm_password);
        data.append("gender", this.state.gender);
        data.append("date_of_birth", this.state.date_of_birth);
        data.append("address_1", this.state.address_1);
        data.append("address_2", this.state.address_2);
        data.append("city", this.state.city);
        data.append("country", this.state.country);
        data.append("state_or_region", this.state.state_or_region);

        try{
        await axios.post(this.context[5], data, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            }
        })
        .then(body => (body.data.response === "posted" ? this.goToDashboard(body.data.email, body.data.id) : body.data.response === "Email is already being used!" ? this.setState({ email_exists_msg: body.data.response }): console.log(JSON.stringify(body)+" plus more stuff")))
        .catch((error) => console.log("Error: unable adding category!"));
        }catch(err){
            if(err.response.status === 500 ){
                console.log(" There was a problem with the server.");
            }else{
                console.log(err.response.data.msg);
            }
        }

    }


    goToDashboard = (email, id) => {
        localStorage.setItem("scgproject_stdtkto_active", true);
        localStorage.setItem("scgproject_stdtkto_email", email);
        localStorage.setItem("scgproject_stdtkto_id", id);
        this.context[1](true);
        this.setState({ go_to_dashboard: true})
        //send email
        // axios.get(this.context[5]+"/signup_confirmation_email?email="+this.state.email)
        // .then(body => (body.response_msg === "success" ? this.setState({ go_to_myaccount: true}) : body.response_msg === "Email is already being used!"? this.setState({ email_exists_msg: body.response_msg }): console.log("Error!")))
        // .catch(e => console.log(e));
    }

    
    setStateOrRegion = (event) => {
        let country = event.target.value;
        
        let countries = this.state.countries;
        for( let i = 0; i < countries.length; i++ ){
            if( countries[i].name === country ){
                this.setState({ states_or_regions: countries[i].states })
            }
        }
    }


    setInput = (event) => {
        const id = event.target.id;
        let val = event.target.value;

        this.setState({ [id]: val });
    }

    
    render() { 
        if( this.state.go_to_dashboard ){
            return (
                <Redirect to={{
                    pathname: "/dashboard",
                    state: {
                        "email": this.state.email
                    }
                }} 
                />
            );
        }else{
            return ( 
                <div className="body_signup">
                    <div className="body_signup_heading">
                        Sign up
                    </div>
                    <form onSubmit={this.signin}>
                        <div className="body_signup_form">
                            <div className="body_signup_form1">
                                First Name<br />
                                <input onChange={this.setInput} type="text" id="first_name" placeholder="Alex" /><br />
                                Last Name<br />
                                <input onChange={this.setInput} type="text" id="last_name" placeholder="Tracey" /><br />
                                Email<br />
                                <div className="error_msg">
                                { this.state.email_exists_msg }
                                </div>
                                <input onChange={this.setInput} type="email" id="email" placeholder="example@example.com" /><br />
                                Password<br />
                                <div className="error_msg">
                                { this.state.password_error }
                                </div>
                                <input onChange={this.setInput} type="password" id="password" placeholder="password" /><br />
                                Confirm Password<br />
                                <input onChange={this.setInput} type="password" id="confirm_password" placeholder="password" /><br />
                                Gender<br />
                                <select id="gender" onChange={e => {this.setStateOrRegion(e); this.setInput(e)} }>
                                    <option></option>
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                                Date of Birth<br />
                                <input onChange={this.setInput} type="date" id="date_of_birth" placeholder="Date of Birth" /><br />              
                            </div>
                            
                            <div className="body_signup_form2">
                                Street Address 1<br />
                                <input onChange={this.setInput} type="text" id="address_1" placeholder="Adress 1" /><br />
                                Street Address 2<br />
                                <input onChange={this.setInput} type="text" id="address_2" placeholder="Adress 2" /><br />
                                City<br />
                                <input onChange={this.setInput} type="text" id="city" placeholder="City" /><br />
                                Country<br />
                                <select id="country" onChange={e => {this.setStateOrRegion(e); this.setInput(e)} }>
                                    <option>Country</option>
                                    {this.state.countries.map((elem, index) => (
                                        <option key={index}>{elem.name}</option>
                                    ))}
                                </select>
                                State or Region<br />
                                <select id="state_or_region" onChange={e => {this.setStateOrRegion(e); this.setInput(e)} }>
                                    <option>State or Region</option>
                                    {this.state.states_or_regions.map((elem, index) => (
                                        <option key={index}>{elem.name}</option>
                                    ))}
                                </select>
                                <div className="body_signup_terms">
                                    <div>By signing up you agree to our <Link to="./terms">Terms of Use</Link> and <Link to="./privacy">Privacy Policies</Link></div>
                                </div>
                                <div onClick={this.signup} className="body_signup_btn">
                                    Sign Up
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
        }
    }
}
 
export default Signup;