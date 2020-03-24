import React, { useState } from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';
import Axios from 'axios';
import {API_URL} from '../supports/Apiurl'
import { MDBAlert } from 'mdbreact';
import SquareButton  from '../components/button'

const ChangePassword = ({userid, userpassword}) => {

    const [data,setdata]=useState({
        currentpass:'',
        newpass:'',
        confirmpass:''
    })
    const [errormes,seterrormes]=useState('')
    const [ischange,setischange]=useState(false)

    const dataOnChange=(e)=>{
        setdata({...data,[e.target.name]:e.target.value})
        console.log(data)
    }

    const onFormSubmit = (e)=>{
        e.preventDefault()
        console.log(userpassword)
        if(data.currentpass===userpassword){
            console.log('datasama')
            if(data.newpass===''||data.confirmpass===''){
                seterrormes('Please fill all the field')
            }else if(data.currentpass===data.newpass){
                seterrormes(`Can't use current password as new password`)
            }else{
                var cekpassword=false
                var hilangstring=data.newpass.replace(' ','')
                if (hilangstring.length>=6){
                    var huruf=false
                    var angka=false
                    for(var i=0;i<hilangstring.length;i++){
                        if(hilangstring[i]>=0){
                            angka=true
                        }else{
                            huruf=true
                        }
                    }
                    if (angka&&huruf){
                        cekpassword=true
                    }else if (huruf){
                        seterrormes('Password should contain number')
                    }else{
                        seterrormes('Password should contain alphabet')
                    }
                }else{
                    seterrormes('Password should have more than 6 characters')
                }
                if(data.newpass!==data.confirmpass){
                    seterrormes('Confirm password does not match')
                }
                if(cekpassword===true){
                    Axios.patch(`${API_URL}/users/${userid}`,{
                        password: data.newpass
                    }).then((res)=>{
                        cekpassword=false
                        setischange(true)
                        seterrormes('Password succesfully changed')
                        setdata({currentpass:'',
                                newpass:'',
                                confirmpass:''})
                    }).catch((err)=>{
                        console.log(err.message)
                    })
                }
            }
        }else{
            seterrormes('Current password is incorrect')
        }

    }


  return (
    <Form onSubmit={onFormSubmit}>
      <FormGroup>
        <Label >Current Password</Label>
        <Input type="password" value={data.currentpass} placeholder="Type your current password" name='currentpass' onChange={dataOnChange}/>
      </FormGroup>
      <FormGroup>
        <Label >New Password</Label>
        <Input type="password" value={data.newpass} placeholder="Type your new password" name='newpass' onChange={dataOnChange}/>
      </FormGroup>
      <FormGroup>
        <Label >Confirm New Password</Label>
        <Input type="password" value={data.confirmpass} placeholder="Confirm your new password" name='confirmpass' onChange={dataOnChange}/>
      </FormGroup>
      <div>
        {
            errormes!==''?
            <MDBAlert color={ischange? "success" : "danger"} >
                <div style={{fontSize:'14px'}}>
                    {errormes} 
                </div>
            </MDBAlert>
            :
            null
        }
      </div>
      <div >
            <SquareButton isfunction={true} text={'save'} onclick={onFormSubmit} />
      </div>
    </Form>
  );
}

export default ChangePassword;