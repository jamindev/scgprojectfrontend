import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import {Context} from '../../../context.js';
import axios from 'axios'
import './flashcards.css';

class Starting extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            title: "",
            description: "",
            image_url: "",
            set_id: "",
            set: "",
            category: "",
            price: 0,
            should_begin: "wait",
            flashcard_sets_bought: [],
            go_to_signin: false
        }
    }

    static contextType = Context;

    componentWillMount = () => {
        const id = localStorage.getItem("flashcards_stdtkto_id");
        const email = localStorage.getItem("flashcards_stdtkto_email");       
        
        if( email !== null ){
            if( email.length > 5 ){
            axios.get(this.context[5]+"/myaccount?email="+email+"&id="+id)
            .then(body => (body.data.response_msg === "posted"? this.setAccountDetails(body.data): console.log("An error occured")))
            .then(() => {
                console.log(JSON.stringify("this - "+this.state.flashcard_sets_bought));
                if( this.state.flashcard_sets_bought.length > 0 && this.state.flashcard_sets_bought.includes( this.props.location.state.set_id ) ){
                    //flashcards does not include product
                    this.setState({ should_begin: true });
                }else{
                    this.setState({ should_begin: false });          
                }
            })
            .catch((error) => console.log(error+"Error: unable to add category!"))       
            }else{
                this.setState({ should_begin: false });
            }
        }
        this.setState({ title: this.props.location.state.title });
        this.setState({ description: this.props.location.state.description });
        this.setState({ image_url: this.props.location.state.image_url });
        this.setState({ price: this.props.location.state.price });
        this.setState({ set_id: this.props.location.state.set_id });
        this.setState({ set: this.props.location.state.set });
        this.setState({ category: this.props.location.state.category });
    }

    
    setAccountDetails = ( details ) => {
        this.setState({ flashcard_sets_bought: details.flashcard_sets_bought });
    }

    addToCart = () => {
        let email = localStorage.getItem("flashcards_stdtkto_email");
        let id = localStorage.getItem("flashcards_stdtkto_id");
        let set_id = this.state.set_id;

        if( localStorage.getItem("flashcards_stdtkto_email") ){
            axios.get(this.context[5]+"/add_to_cart?email="+email+"&id="+id+"&set_id="+set_id)
            .then(body => (body.data.response_msg === "posted" ? this.updateCart() : body.data.response_msg === "" ))
            .catch(e => console.log(e));
        }else{
            this.setState({ go_to_signin: true });
        }
    }


    updateCart = () => {
        const cart = this.context[4] + 1;
        this.context[3](cart);
    }

    render() { 
        if( this.state.go_to_signin ){
            return (
            <Redirect to={{
                pathname: "/signin"
            }}
            />
            )
        }else{
            if( this.state.should_begin === true ){
                return (
                    <div className="starting_container">
                    <div className="starting_image">
                        <img src={this.state.image_url} alt={this.state.title} />
                    </div>
                    <div className="starting_body">
                        <div className="starting_title">
                            {this.state.title}
                        </div>
                        <div className="starting_description">
                            {this.state.description}
                        </div>
                        <div className="starting_actions">
                            <div className="starting_preview">
                                <Link to={{
                                    pathname: "/flashcards",
                                    state: {
                                        set_id: this.state.set_id,
                                        set: this.state.set,
                                        category: this.state.category,
                                        title: this.state.title,
                                        description: this.state.description,
                                        image_url: this.state.image_url,
                                        price: this.state.price
                                    }
                                }}>
                                    Start
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                );
            }else if( this.state.should_begin === false ){
                return ( 
                    <div className="starting_container">
                        <div className="starting_image">
                            <img src={this.state.image_url} alt={this.state.title} />
                        </div>
                        <div className="starting_body">
                            <div className="starting_title">
                                {this.state.title}
                            </div>
                            <div className="starting_description">
                                {this.state.description}
                            </div>
                            <div className="starting_actions">
                                <div className="starting_preview">
                                    <Link to={{
                                        pathname: "/flashcards",
                                        state: {
                                            set_id: this.state.set_id,
                                            set: this.state.set,
                                            category: this.state.category,
                                            title: this.state.title,
                                            description: this.state.description,
                                            image_url: this.state.image_url,
                                            price: this.state.price
                                        }
                                    }}>
                                        Preview
                                    </Link>
                                </div>
                                <div onClick={this.addToCart} className="starting_add_to_cart">                           
                                    Add to Cart
                                </div>
                                <div className="starting_buy_now">
                                    <Link to={{
                                        pathname: "/checkout",
                                        state: {
                                            set_id: this.state.set_id,
                                            set: this.state.set,
                                            title: this.state.title,
                                            description: this.state.description,
                                            image_url: this.state.image_url,
                                            price: this.state.price
                                        }
                                    }}>
                                        Buy Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }else{
                return ( 
                    <div className="starting_container">
                        <div className="starting_image">
                            <img src={this.state.image_url} alt={this.state.title} />
                        </div>
                        <div className="starting_body">
                            <div className="starting_title">
                                {this.state.title}
                            </div>
                            <div className="starting_description">
                                {this.state.description}
                            </div>
                            <div className="starting_actions">
                            <div className="starting_preview">
                                <Link to={{
                                    pathname: "/flashcards",
                                    state: {
                                        set_id: this.state.set_id,
                                        set: this.state.set,
                                        title: this.state.title,
                                        description: this.state.description,
                                        image_url: this.state.image_url,
                                        price: this.state.price
                                    }
                                }}>
                                    Preview
                                </Link>
                            </div>
                            <div onClick={this.addToCart} className="starting_add_to_cart">                           
                                Add to Cart
                            </div>
                            <div className="starting_buy_now">
                                <Link to={{
                                    pathname: "/checkout",
                                    state: {
                                        signup: true,
                                        set_id: this.state.set_id,
                                        set: this.state.set,
                                        title: this.state.title,
                                        description: this.state.description,
                                        image_url: this.state.image_url,
                                        price: this.state.price
                                    }
                                }}>
                                    Buy Now
                                </Link>
                            </div>
                            </div>
                        </div>
                    </div>
                );
            }
        }
    }
}
 
export default Starting;