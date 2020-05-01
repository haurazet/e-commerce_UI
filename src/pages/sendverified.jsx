import React, { Component } from 'react';
import {connect} from 'react-redux'
import Axios from 'axios';
import { API_URL } from '../supports/Apiurl';

class SendVerified extends Component {
    state = { 
        loading:false
     }

    onsendclick=()=>{
        this.setState({loading:true})
        console.log(this.props.Auth)
        var obj={
            username:this.props.Auth.username,
            email:this.props.Auth.email,
            userid:this.props.Auth.id
        }
        Axios.post(`${API_URL}/users/sendemailverified`, obj)
        .then((res)=>{
            if(res.data.message){
                alert('email sent!')
            }
        }).catch((err)=>{
            console.log(err)
        }).finally(()=>{
            this.setState({loading:false})
        })
    }
    render() { 
        return ( 
            <div className="p-5 mt-5">
                <center>
                    <h1>
                        Have you received verification email from Sagitta Shop?
                        if you haven't, click re-send verification email below
                    </h1>
                    {
                        this.state.loading?
                        <div>Loading...</div>:
                        <button onClick={this.onsendclick}>Re-send verification email</button>
                    }
                </center>
            </div>
         );
    }
}

const Bebas=(state)=>{
    return {
        Auth:state.Auth
    }
}
 
export default connect(Bebas) (SendVerified);