import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import {Context} from '../../../context.js';
import axios from 'axios';
import OrderForm from '../orders/orderform';
import './dashboard.css';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            details: {},
            name: "",
            sets: [],
            purchased_sets: [],
            purchased_sets_msg: "",
            stay_on_dashboard: true
        }
    }

    static contextType = Context;

    componentDidMount = () => {
        const stay = this.context[0].signed_in;
        if( stay ){
            this.setState({ stay_on_dashboard: this.context[0].signed_in })
        }

        const id = localStorage.getItem("scgproject_stdtkto_id");
        const email = localStorage.getItem("scgproject_stdtkto_email");

        axios.get(this.context[5]+"/dashboard.php?myprofile=true&email="+email+"&id="+id)
        .then(body => (body.data.response === "retrieved" ? this.setAccountDetails(body.data): console.log("An error occured"+JSON.stringify(body))))
        .catch(e => console.log(e));
    }
    

    setAccountDetails = ( details ) => {
        this.setState({ first_name: details.first_name });
        this.setState({ city: details.city });
        // this.setState({ flashcard_sets_bought: details.flashcard_sets_bought }, () => {
        // fetch(this.context[5]+"/all_sets")
        //     .then(res => res.json())
        //     .then((body) => (body.response_msg === "posted" ? this.setSets( body.returned_sets ): this.setState({ response: "Could not scan categories table!" }) ))
        //     .catch((error) => console.log(error+"Error: unable to add category!"))
        // });
    }

    
    render() { 
        if( !this.state.stay_on_dashboard ){
            return (
            <Redirect to={{
                pathname: "/",
                state: {}
            }}
            />
            )
        }else{
            return ( 
                <div className="body_dashboard">
                    <div className="body_dashboard_container1">
                        <div className="body_sets_heading_title">
                            Welcome, {this.state.first_name}
                        </div>
                        <div className="body_dashboard_order_stats">
                            Num orders pending
                        </div>
                    </div>
                    <div className="body_dashboard_container2">
                        <div className="body_dashboard_orders_heading">
                            Place an order
                        </div>
                        <div className="body_dashboard_orders">
                            <OrderForm />
                        </div>
                    </div>    
                </div>
            );
        }
    }
}
 
export default Dashboard;