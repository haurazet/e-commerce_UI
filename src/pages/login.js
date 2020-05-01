import React, { useState } from "react";
import {MDBInput, MDBAlert } from 'mdbreact';
import {Redirect} from 'react-router-dom'
import {LoginUser, errormessageclear, KeepLogin} from './../redux/actions'
import {connect} from 'react-redux'
import FacebookLogin from 'react-facebook-login';
import Axios from "axios";
import { API_URL } from "../supports/Apiurl";

const Login = (props) => {

    const [data,setdata]=useState({
        username:'',
        password:''
    })
    const dataOnChange=(e)=>{
        setdata({...data,[e.target.name]:e.target.value})
    }

    const onFormSubmit=(e)=>{
        console.log('submit')
        e.preventDefault()
        props.LoginUser(data)
    }

    const componentClicked=()=>{
        console.log('click')
    }

    const responseFacebook=(response)=>{
        console.log(response)
        var data ={
            username:response.name,
            email:response.email,
            id:response.id
        }
        Axios.post(`${API_URL}/users/fblog`,data)
        .then((res)=>{
            console.log('sampe post')
            localStorage.setItem('token',res.data.token)
            localStorage.setItem('iduser',res.data.id)
            props.KeepLogin(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    if(props.islogin){
        return <Redirect to='/' />
    }


    return (
        <div className='row justify-content-center loginbackground'>
            <div className="col-md-6 m-0 p-0">
                <div className='d-flex justify-content-end align-items-center ' style={{height:'97vh'}}>
                    <form style={{width:'70%'}} onSubmit={onFormSubmit} className='whitebackground p-5 pb-2 subtleshadow'>
                        <p className="h4 text-center mb-5 text-uppercase" style={{fontWeight:'200'}}>Sign in </p>
                        <div className="grey-text">
                            <MDBInput 
                                className='backgroundinput' 
                                label="Type your username" 
                                onChange={dataOnChange} 
                                name='username' 
                                icon="user" 
                                iconClass="iconinput iconlagi"
                                group type="text" 
                                validate value={data.username} /> 
                            <MDBInput   
                                label="Type your password" 
                                onChange={dataOnChange} 
                                name="password" 
                                icon="lock" 
                                iconClass="iconinput iconlagi"
                                group 
                                type="password" 
                                validate 
                                value={data.password}
                                />
                                
                        </div>
                        <div>
                        {
                            props.errormes?
                            <MDBAlert color="danger" >
                                <div style={{fontSize:'14px'}}>
                                    {props.errormes} <span className='float-right hovererr' onClick={()=>props.errormessageclear()}>X</span>
                                </div>
                            </MDBAlert>
                            :
                            null
                        }
                        </div>
                        <div className="text-center mb-4">
                            <button className="btn loginbtn" onClick={onFormSubmit} type='button' style={{backgroundColor:"#3790a0"}} disabled={props.loading}>Sign In</button>
                            <div className='mb-2'>or</div>
                            <FacebookLogin
                                appId="316586635977642"
                                autoLoad={false}
                                cookie={false}
                                fields="name,email,id"
                                onClick={componentClicked}
                                callback={responseFacebook} 
                                cssClass="fb connect"/>
                        </div>
                        <p className="loginfooter"> Don't have an account? <a className="signuplink" onClick={event => window.location.href='/register'}>Sign Up Here</a> </p>

                    </form>
                    <div>
                    </div>
                </div>
            </div>
            <div className="col-md-6 m-0 p-0">
                <div className='d-flex justify-content-center align-items-center m-0 p-0' style={{height:'97vh'}}></div>
            </div>
        </div>
);
};

const MapstatetoProps=({Auth})=>{
    return{
        ...Auth
    }

}
export default connect (MapstatetoProps,{LoginUser,errormessageclear, KeepLogin})(Login);