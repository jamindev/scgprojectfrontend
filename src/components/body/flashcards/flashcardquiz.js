import React, { Component } from 'react';
import {Context} from '../../../context.js';

class FlashcardQuiz extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            quiz_set: [],
            current_question_index: 0,
            current_choices: [],
            current_question: "",
            current_answer: "",
            question_set: [],
            quiz_correct_result: 0,
            quiz_wrong_result: 0,
            choice_result: null,
            end_of_quiz: false
        }
    }

    static contextType = Context;
    
    componentDidMount = () => {
        this.setState({ quiz_set: this.props.params[1] }, () => {
            this.generateQuiz();
        });
    }

    generateQuiz = () => {
        let set = this.state.quiz_set;
        set.forEach(elem => {
            elem["choices"] = [];
            
            for( let i = 0; i < 3; i++ ){
                let choice = this.generateChoices(elem.answer);
                if( !elem.choices.includes(choice) ){
                    elem["choices"].push(choice);
                }else{
                    i--;
                }
            }

            let answer_index = Math.floor(Math.random()*4);
            elem['choices'].splice(answer_index, 0, elem.answer);
        })

        this.setState({ question_set: set }, () => {
            this.setState({ current_choices: this.state.question_set[this.state.current_question_index]["choices"] });
            this.setState({ current_question: this.state.question_set[this.state.current_question_index]["question"] });
            this.setState({ current_answer: this.state.question_set[this.state.current_question_index]["answer"] });
        });
    }

    generateChoices = (exception) => {
        let rand = Math.floor(Math.random()*10);
        let result = this.state.quiz_set[rand].answer;
        while( result === exception ){
            rand = Math.floor(Math.random()*10);
            result = this.state.quiz_set[rand].answer;
        }
        
        return result;
    }

    nextQuestion = () => {
        let index = this.state.current_question_index+1;
        if( index < this.state.quiz_set.length ){
            this.setState({ current_question_index: index }, () => {
                this.setState({ current_choices: this.state.question_set[this.state.current_question_index]["choices"] });
                this.setState({ current_question: this.state.question_set[this.state.current_question_index]["question"] });
                this.setState({ current_answer: this.state.question_set[this.state.current_question_index]["answer"] });
                this.setState({ choice_result: null });
                document.getElementsByClassName("quiz_choice_result")[0].style.backgroundColor = "none";
                document.getElementsByClassName("quiz_choice_result")[0].style.padding = "0";
                let elem = document.getElementsByName("quiz_option");
                
                for( let i = 0; i < elem.length; i++ ){
                    elem[i].checked = false;
                }
            })
        }else if( index === this.state.quiz_set.length ){
            this.setState({ end_of_quiz: true });
        }
    }


    seeAnswer = () => {
        let choice = document.querySelector("input[name='quiz_option']:checked");
        if( choice !== null ){
            if( choice.value === this.state.current_answer ){
                let marked = this.state.quiz_correct_result + this.state.quiz_wrong_result;
                if( marked < ( this.state.current_question_index + 1 )){
                    let result = this.state.quiz_correct_result + 1;
                    this.setState({ quiz_correct_result: result })
                }

                this.setState({ choice_result: "Correct!" });
                document.getElementsByClassName("quiz_choice_result")[0].style.backgroundColor = "#5d6";
                document.getElementsByClassName("quiz_choice_result")[0].style.padding = "0.2rem";
            }else{
                let marked = this.state.quiz_correct_result + this.state.quiz_wrong_result;
                if( marked < ( this.state.current_question_index + 1 )){
                    let result = this.state.quiz_wrong_result + 1;
                    this.setState({ quiz_wrong_result: result });
                }
                
                this.setState({ choice_result: "Wrong!" });
                document.getElementsByClassName("quiz_choice_result")[0].style.backgroundColor = "#f81844";
                document.getElementsByClassName("quiz_choice_result")[0].style.padding = "0.2rem";
            }
        }
    }


    retake = () => {
        this.setState({ quiz_set: this.props.params[1],
            current_question_index: 0,
            current_choices: [],
            current_question: "",
            current_answer: "",
            question_set: [],
            quiz_correct_result: 0,
            quiz_wrong_result: 0,
            choice_result: null,
            end_of_quiz: false }, () => {
            this.generateQuiz();
        });
    }


    render() { 
        if( this.state.end_of_quiz ){
            return (
                <div className="body_flashcard_quiz_result">
                    <h2>Your Score</h2>
                    <div className="body_flashcard_quiz_correct_result">
                        { this.state.quiz_correct_result }/10
                    </div>
                    <div className="body_flashcard_quiz_next_options">
                        <div className="quiz_actions">
                            <button className="quiz_actions_retake_btn" onClick={this.retake}>Retake Test</button>
                            <button className="quiz_actions_return_to_flashcard" onClick={this.props.params[0]}>Return to Flashcards</button>
                        </div>
                    </div>
                </div>
            )
        }else{
            return ( 
                <div className="body_flashcard_quiz">
                    <div className='quiz_choice_result'>
                        {this.state.choice_result}
                    </div>
                    Start Mini Test<br />
                    {this.state.current_question}
                    <ol type="A">
                    { this.state.current_choices.map((elem, index) => (
                        <div key={index}><li><input type="radio" name="quiz_option" value={elem} />{" "+elem}</li></div>
                    ))}
                    </ol>
                    <div className="quiz_actions">
                        <button className="quiz_actions_see_answer_btn" onClick={this.seeAnswer}>See Answer</button>
                        <button className="quiz_actions_next_question_btn" onClick={this.nextQuestion}>Next ></button>
                        <button className="quiz_actions_return_to_flashcard" onClick={this.props.params[0]}>Return to Flashcards</button>
                    </div>
                </div>
            );
        }
    }
}
 
export default FlashcardQuiz;