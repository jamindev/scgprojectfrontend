import React, { Component } from 'react';
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
            order_years: "single_year",
            stay_in_myaccount_page: true,
            manufacturer: "",
            years: [],
            condition_description: "",
            order_stage: "Order form",
            manufacturer_error_msg: "",
            years_error_msg: ""
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


    goToPaymentForm = () => {
        let manufacturer = this.state.manufacturer;
        let years = this.state.years;
        if( manufacturer.length === 0 || !manufacturer.replace(/\s/g, '').length){
            this.setState({ manufacturer_error_msg: "Manufacturer field is empty." });
            return;
        }else{
            this.setState({ manufacturer_error_msg: "" });
        }
        if( years.length === 0 ){
            this.setState({ years_error_msg: "No year(s) have been chosen." });
            return;
        }else{
            this.setState({ years_error_msg: "" });
        }

        this.setState({ order_stage: "Payment form" });
    }


    placeOrder = () => {
        let order_details = new FormData();

        order_details.append("place_order", true);
        order_details.append("id", this.state.id);
        order_details.append("manufacturer", this.state.manufacturer);
        order_details.append("years", this.state.years);
        order_details.append("condition_description", this.state.condition_description);
        
        axios.post(this.context[5]+"/dashboard.php", order_details, {
            headers: {
                'Content-Type': 'multipart/form-data' 
            }
        })
        .then(body => (body.data.response === "order_placed" ? this.resetOrderForm() : console.log("An error occured")))
        .catch(e => console.log(e));
    }


    resetOrderForm = () => {
        this.setState({ order_stage: "Confirmation" });
        this.setState({ years: [] });
        this.setState({ order_years: "single_year" });
    }


    setInput = (event) => {
        const id = event.target.id;
        let val = event.target.value;

        this.setState({ [id]: val });
    }


    addYearToArray = () => {
        let order_years = this.state.order_years;
        let years = this.state.years;
        let year1 = document.getElementById("years1").value;

        if( order_years === "range_of_years" ){
            let year2 = document.getElementById("years2").value;
            if(year1.length > 0 && year2.length > 0){
                years.push(year1+"-"+year2);
            }
        }else{
            if(year1.length > 0){
                years.push(year1);
            }
        }

        this.setState({ years });
    }


    selectSingleOrRangeOfYears = (event) => {
        //let val = event.target.value;
        let radios = document.getElementsByName("order_years");
        let val = "";
        for(let i = 0; i < radios.length; i++){
            if( radios[i].checked ){
                val = radios[i].value;
                break;
            }
        }

        this.setState({ order_years: val });
    }


    removeYear = (index) => {
        let years = this.state.years;
        years.splice(index, 1);

        this.setState({ years });
    }
    

    render() { 
        let to = "";
        let value = "";
        if( this.state.order_years === "single_year" ){
            to = "";
            value = "";
        }else if( this.state.order_years === "range_of_years" ){
            to = <div className="body_dashboard_years_to">to</div>;
            value = <select id="years2">
                        <option></option>
                        {this.state.year_options.map((elem, index) => (
                            <option key={index}>{elem}</option>
                        ))}
                    </select>
        }
        if( this.state.order_stage === "Order form" ){ 
            return ( 
                <div className="body_order_form">
                    <div className="error_msg">
                        { this.state.manufacturer_error_msg }
                    </div>
                    Manufacturer<br />
                    <input onChange={this.setInput} type="text" id="manufacturer" placeholder="Manufacturer" /><br />
                    
                    <div className="error_msg">
                        { this.state.years_error_msg }
                    </div>
                    Years<br />
                    <div className="body_dashboard_signle_or_range_of_years">                    
                        Single year:<input type="radio" value="single_year" name="order_years" onChange={this.selectSingleOrRangeOfYears} />&nbsp;&nbsp;
                        Range of years:<input type="radio" value="range_of_years" name="order_years" onChange={this.selectSingleOrRangeOfYears} />
                    </div>
                    <div className="body_dashboard_years_container">
                        <div className="body_dashboard_years">
                            <select id="years1">
                                <option></option>
                                {this.state.year_options.map((elem, index) => (
                                    <option key={index}>{elem}</option>
                                ))}
                            </select>
                            {to}
                            {value}
                        </div>
                        <div onClick={this.addYearToArray} className="body_dashboard_add_year_btn">
                            Add year(s)
                        </div>
                    </div>
                    
                    <div className="body_dashboard_years_container">
                        <div className="body_dashboard_years_selected">
                            {this.state.years.map((elem, index) => (
                                <div key={index} className="body_dashboard_year_selected" onClick={() => (this.removeYear(index))}>{elem}</div>
                            ))}
                        </div>
                    </div>

                    Condition Description<br />
                    <textarea onChange={this.setInput} type="text" id="condition_description" placeholder="Condition description" /><br />
                    <div className="body_order_terms">
                    </div>
                    <div onClick={this.goToPaymentForm} className="body_order_btn">
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