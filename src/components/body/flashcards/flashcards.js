import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {Context} from '../../../context.js';
import FlashcardQuiz from './flashcardquiz.js'

class Flashcards extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            flashcards: [],
            flashcard_sets_bought: [],
            can_access_all_flashcards: false,
            number_of_flashcards: 0,
            current_flashcard: 0,
            question: "",
            answer: "",
            price: this.props.location.state.price,
            set_id: this.props.location.state.set_id,
            category: this.props.location.state.category,
            start_quiz: false,
            quiz_set: []
        }
    }
    
    static contextType = Context;

    componentDidMount = () => {
        fetch(this.context[5]+"/all_flashcards?set_id="+this.state.set_id)
        .then(res => res.json())
        .then((body) => (body.response_msg === "posted" ? this.setFlashcardData( body.returned_flashcards ): this.setState({ response: "Could not flashcards table!" }) ))
        .catch((error) => console.log(error+"Error: unable to add category!"))      
    }

    setFlashcardData = (flashcards) => {   
        this.setState({ number_of_flashcards: flashcards.length });
        
        if( Array.isArray( flashcards ) ){
            const id = localStorage.getItem("flashcards_stdtkto_id");
            const email = localStorage.getItem("flashcards_stdtkto_email");       
            
            if( email !== null ){
                if( email.length > 5 ){
                axios.get(this.context[5]+"/myaccount?email="+email+"&id="+id)
                .then(body => (body.data.response_msg === "posted"? this.setAccountDetails(body.data): console.log("An error occured")))
                .then(() => {
                    if( !this.state.flashcard_sets_bought.includes(this.state.set_id) ){
                        //flashcards does not include product
                        flashcards = flashcards.splice(0, 11);
                        flashcards[11] = "Get the full set <br />"+this.state.price;
                        this.setState({ flashcards: flashcards });
                        this.setState({ question: flashcards[0].question });
                        this.setState({ answer: flashcards[0].answer });                   
                    }else{
                        this.setState({ flashcards: flashcards });
                        this.setState({ question: flashcards[0].question });
                        this.setState({ answer: flashcards[0].answer });          
                    }
                })
                .catch((error) => console.log(error+"Error: unable to add category!"))       
                }else{
                    flashcards = flashcards.splice(0, 11);
                    flashcards[11] = "Get the full set <br />"+this.state.price;
                    this.setState({ flashcards: flashcards });
                    this.setState({ question: flashcards[0].question });
                    this.setState({ answer: flashcards[0].answer });                               
                }
            }else{
                flashcards = flashcards.splice(0, 11);
                flashcards[11] = "Get the full set <br />"+this.state.price;
                this.setState({ flashcards: flashcards });
                this.setState({ question: flashcards[0].question });
                this.setState({ answer: flashcards[0].answer });                                          
            }
        }else{
            ////flashcards bought is not set
            flashcards = flashcards.splice(0, 11);
            flashcards[11] = "Sign up and get the full set <Link to{{ pathname: '/signin' }}></Link>";
        }
    }

    
    setAccountDetails = ( details ) => {
        this.setState({ details: details });
        this.setState({ name: details.name });
        this.setState({ flashcard_sets_bought: details.flashcard_sets_bought });
    }


    hasPurchased = (purchased_sets) => {
        let result = purchased_sets.filter(elem => elem === this.state.set_id );
        if( result.length > 0 ){
            this.setState({ can_access_all_flashcards: true })
            return true;
        }else{
            return false;
        }
    }

    returnedToFlashcards = () => {
        this.setState({ start_quiz: false });
        const next_position = this.state.current_flashcard + 1;
        this.setState({ current_flashcard: next_position });
        this.setState({ question: this.state.flashcards[next_position].question });
        this.setState({ answer: this.state.flashcards[next_position].answer });
    }

    next = () => {
        if( this.state.current_flashcard < this.state.flashcards.length ){
            const next_position = this.state.current_flashcard + 1;
            if( this.state.current_flashcard === this.state.flashcards.length - 2 ){
                let elem = document.getElementsByClassName("body_flashcard_front")[0];
                elem.innerHTML = "Get the full set <br />$"+this.state.price;
            }else{
                if(( next_position % 10 ) === 0 && next_position !== 0 && !this.state.start_quiz && this.state.category === "SAT" ){
                    let quiz_set = this.state.flashcards.slice(next_position-10, next_position)
                    this.setState({ quiz_set });
                    this.setState({ start_quiz: true });
                }else{
                    this.setState({ start_quiz: false });
                    this.setState({ current_flashcard: next_position });
                    this.setState({ question: this.state.flashcards[next_position].question });
                    this.setState({ answer: this.state.flashcards[next_position].answer });
                    
                    let elem = document.getElementsByClassName("body_flashcard_front")[0];
                    elem.style.transform = "rotateY(0deg)";
                    let elem2 = document.getElementsByClassName("body_flashcard_back")[0];
                    elem2.style.transform = "rotateY(180deg)";
                }
            }
        }
    }

    prev = () => {
        if(this.state.current_flashcard > 0 ){      
            const next_position = this.state.current_flashcard - 1;
            this.setState({ current_flashcard: next_position });
            this.setState({ question: this.state.flashcards[next_position].question });
            this.setState({ answer: this.state.flashcards[next_position].answer });
            
            let elem = document.getElementsByClassName("body_flashcard_front")[0];
            elem.style.transform = "rotateY(0deg)";
            let elem2 = document.getElementsByClassName("body_flashcard_back")[0];
            elem2.style.transform = "rotateY(180deg)";
        }
    }

    flip = () => {
        let elem = document.getElementsByClassName("body_flashcard_front")[0];
        let temp = elem.style.transform;
        if( temp === "rotateY(-180deg)" ){
            elem.style.transform = "rotateY(0deg)";
        }else{
            elem.style.transform = "rotateY(-180deg)";
        }

        let elem2 = document.getElementsByClassName("body_flashcard_back")[0];
        let temp2 = elem2.style.transform;
        if( temp2 === "rotateY(0deg)" ){
            elem2.style.transform = "rotateY(180deg)";
        }else{
            elem2.style.transform = "rotateY(0deg)";
        }

    }

    render() { 
        if( this.state.start_quiz ){
            return (
                <div className="body_flashcards">
                    <div className="body_flashcards_top">
                        <div className="body_flashcard_nav_back">
                            <Link to={{
                                pathname: "/starting",
                                state: { 
                                    title: this.props.location.state.title,
                                    description: this.props.location.state.description,
                                    image_url: this.props.location.state.image_url,
                                    set_id: this.props.location.state.set_id,
                                    set: this.props.location.state.set 
                                }
                            }}> 
                            <div className="body_flashcards_back_to_starting">{"<"}</div>
                            </Link>
                        </div>
                        <div className="body_flashcards_counter">
                            { this.state.current_flashcard+1 } | { this.state.number_of_flashcards }
                        </div>
                    </div>
                    <div className="card_quiz body_flashcard_quiz_container">
                        <FlashcardQuiz params={[this.returnedToFlashcards, this.state.quiz_set]} />
                    </div>
                </div>
            );
        }else{
            return ( 
                <div className="body_flashcards">
                    <div className="body_flashcards_top">
                        <div className="body_flashcard_nav_back">
                            <Link to={{
                                pathname: "/starting",
                                state: { 
                                    title: this.props.location.state.title,
                                    description: this.props.location.state.description,
                                    image_url: this.props.location.state.image_url,
                                    set_id: this.props.location.state.set_id,
                                    set: this.props.location.state.set 
                                }
                            }}> 
                            <div className="body_flashcards_back_to_starting">{"<"}</div>
                            </Link>
                        </div>
                        <div className="body_flashcards_counter">
                            { this.state.current_flashcard+1 } | { this.state.number_of_flashcards }
                        </div>
                    </div>
                    <div className="card body_flashcard">
                        <div className="body_flashcard_front">
                            { this.state.question }
                        </div>
                        <div className="body_flashcard_back">
                            <div className="body_flashcard_back_question">{ this.state.question }</div><br /><br />
                            <div className="body_flashcard_back_answer">{ this.state.answer }</div><br /><br />
                            { this.state.explanation }
                        </div>
                    </div>
                    <div className="flip">
                        <div className="flip_btn" onClick={ this.flip }>&#8634;</div>
                    </div>
                    <div className="navigation">
                        <div className="navigation_next" onClick={ this.prev }>-</div>
                        <div className="navigation_prev" onClick={ this.next }>+</div>
                        <div className="navigation_right"> </div>
                    </div>
                </div>
            );
        }
    }
}
 
export default Flashcards;