import React, { useState } from "react";
import {MDBInput, MDBAlert,} from 'mdbreact';
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import {RegisterUser, errormessageclear, notregister} from './../redux/actions'
import {connect} from 'react-redux'

const Register = ( props)=>{

    const [ismodalopen,setismodalopen]=useState(false)
    const [data,setdata]=useState({
        username:'',
        password:'',
        confirmpassword:''
    })
    const dataOnChange=(e)=>{
        setdata({...data,[e.target.name]:e.target.value})
    }

    const onFormSubmit=(e)=>{
        e.preventDefault()  
        props.RegisterUser(data)

        // .then((res)=>{
        //     if(props.isregister){
        //         setismodalopen(true)
        //      }else{
        //         setismodalopen(false)
        //      }
        // }).catch((err)=>{
        //     console.log(err)
        // })
        
    }

    // if(props.isregister){
    //     setismodalopen(true)
    //  }else{
    //     setismodalopen(false)
    //  }

    // const toggleopen=()=>{
       
    //     // setismodalopen({ismodalopen=!state.setismodalopen})
    // }
    
    const toggleclose=()=>{
        setismodalopen(false)
        props.notregister()
    }

    return (
        <div>
        
        <Modal isOpen={ismodalopen} toggle={()=>setismodalopen(false)} > 
        <ModalBody>
            <div>
                <div class="text-center" style={{color:'black'}}>sagitta shop</div>
                <div>Your account has been successfully registered!</div>
                <div>Now, return to <a className="signuplink" onClick={event => window.location.href='/login'}>Login page</a> and enjoy shopping</div>
            </div>
        </ModalBody>
                <ModalFooter>
                    <Button className="btn btn-primary btn-sm " onClick={toggleclose}>Okay</Button>{' '}
                </ModalFooter>
        </Modal>
        
        <div className='row justify-content-center loginbackground'>
            {/* <div className="col-md-2"></div> */}
            <div className="col-md-6 m-0 p-0">
                <div className='d-flex justify-content-end align-items-center  ' style={{height:'97vh'}}>
                    <form style={{width:'70%'}} onSubmit={onFormSubmit} className='whitebackground p-5 pb-2 subtleshadow'>
                        <p className="h4 text-center mb-5 text-uppercase" style={{fontWeight:'200'}}>Sign up </p>
                        <div className="grey-text">
                            <MDBInput 
                                className='backgroundinput' 
                                label="Type username" 
                                onChange={dataOnChange} 
                                name='username' 
                                icon="user" 
                                group 
                                type="text" 
                                validate 
                                value={data.username} /> 
                            <MDBInput 
                                className='backgroundinput'  
                                iconClass='fa'  
                                label="Type password" 
                                onChange={dataOnChange} 
                                name="password" 
                                icon="lock" 
                                group 
                                type="password" 
                                validate 
                                value={data.password}/>
                            <MDBInput 
                                className='backgroundinput'  
                                iconClass='fa'  
                                label="Confim password" 
                                onChange={dataOnChange} 
                                name="confirmpassword" 
                                icon="lock" 
                                group 
                                type="password" 
                                validate 
                                value={data.confirmpassword}/>
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
                        {
                            props.successmes?
                            <MDBAlert color="success" >
                                <div style={{fontSize:'14px'}}>
                                <div>Congratulation!</div>
                                <div>Your account has been successfully registered.</div>
                                <div>Now, <a style={{color:'blue', fontWeight:"300"}} onClick={event => window.location.href='/login'}>Sign In</a> to enjoy shopping :)</div>
                                    {/* {props.successmes} <span className='float-right hovererr' onClick={()=>props.errormessageclear()}>X</span> */}
                                </div>
                            </MDBAlert>
                            :
                            null
                        }
                        </div>
                        <div className="text-center mb-3">
                            <button className="btn loginbtn" type='button' style={{backgroundColor:"#3790a0"}} type="submit" disabled={props.loading}>Sign up</button>
                        </div>
                        <p className="loginfooter"> Have an account already? <a className="signuplink" onClick={event => window.location.href='/login'}>Sign in here</a> </p>
                    </form>
                    <div>
                    </div>
                </div>
            </div>
            <div className="col-md-6 m-0 p-0">
                <div className='d-flex justify-content-center align-items-center m-0 p-0' style={{height:'97vh'}}></div>
            </div>
        </div>
        </div>
);
};

const MapstatetoProps=({Regis})=>{
    return{
        ...Regis
    }

}
export default connect (MapstatetoProps,{RegisterUser,errormessageclear, notregister})(Register);


// <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        //         <div class="modal-dialog modal-dialog-centered" role="document">
        //             <div class="modal-content">
        //             <div class="modal-header ">
        //                 <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        //                 <span aria-hidden="true">&times;</span>
        //                 </button>
        //             </div>
        //                 <div class="modal-body text-center" style={{color:'black'}}>sagitta shop</div>
        //                 <div>Your account has been successfully registered!</div>
        //                 <div>Now, return to <a className="signuplink" onClick={event => window.location.href='/login'}>Login page</a> and enjoy shopping</div>
        //             </div>
        //             <div class="modal-footer">
        //                 <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        //             </div>
        //         </div>
        // </div>
        // :