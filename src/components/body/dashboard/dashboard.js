import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import {Context} from '../../../context.js';
import axios from 'axios';
import './dashboard.css';

class MyAccount extends Component {
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
        if( !this.state.stay_in_myaccount_page ){
            return (
            <Redirect to={{
                pathname: "/",
                state: {}
            }}
            />
            )
        }else{
            return ( 
                <div className="body_myaccount">
                    <div className="body_myaccount_sets">
                    <div className="body_sets_heading_title">
                        Welcome, {this.state.name.split(" ")[0]}
                    </div>
                    <div className="body_myaccount_sets_heading_details">
                        {this.state.purchased_sets_msg}
                    </div>
                    { this.state.purchased_sets.map(( elem, index ) => (
                        <div key={"body_set"+index} className="set">
                            <Link key={"body_set_link"+index} to={{
                            pathname: "/starting",
                            state: { 
                                    title: elem.title,
                                    description: elem.description,
                                    image_url: elem.image_url,
                                    price: elem.price,
                                    set_id: elem.set_id,
                                    set: elem.title 
                                }
                            }}><div key={"body_set_profile_img"+index} className="set_profile_img">
                                <img src={elem.image_url} alt={elem.title} />
                            </div>
                            <div key={"body_set_details"+index} className="set_details">
                                <div key={"body_set_title"+index} className="set_title">
                                    {elem.title.split(" ").splice(0, 8).join(" ")}
                                </div>
                                <div key={"body_set_description"+index} className="set_description">
                                    {elem.description.split(" ").splice(0, 16).join(" ")+"..."}
                                </div>
                                <div className="set_price">
                                    
                                </div>
                            </div>
                            </Link>
                        </div>
                        ))}
                    <div className="body_sets_heading_title">
                        Recommendations
                    </div>
                    { this.state.sets.map(( elem, index ) => (
                        <div key={"body_set"+index} className="set">
                            <Link key={"body_set_link"+index} to={{
                            pathname: "/starting",
                            state: { 
                                    title: elem.title,
                                    description: elem.description,
                                    image_url: elem.image_url,
                                    price: elem.price,
                                    set_id: elem.set_id,
                                    set: elem.title,
                                    category: elem.category 
                                }
                            }}>
                            <div key={"body_set_profile_img"+index} className="set_profile_img">
                                <img src={elem.image_url} alt={elem.title} />
                            </div>
                            <div key={"body_set_details"+index} className="set_details">
                                <div key={"body_set_title"+index} className="set_title">
                                    {elem.title.split(" ").splice(0, 8).join(" ")}
                                </div>
                                <div key={"body_set_description"+index} className="set_description">
                                    {elem.description.split(" ").splice(0, 16).join(" ")+"..."}
                                </div>
                                <div className="set_price">
                                    ${elem.price}
                                </div>
                            </div>
                            </Link>
                        </div>
                        ))}
                </div>    
                </div>
            );
        }
    }
}
 
export default MyAccount;