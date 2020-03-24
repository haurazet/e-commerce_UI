import Axios from 'axios'
import { USER_REGISTER_START, USER_REGISTER_SUCCESS, USER_REGISTER_FAILED } from './type'
import { API_URL } from '../../supports/Apiurl'

export const RegisterUser=({username,password,confirmpassword})=>{
    return(dispatch)=>{
        dispatch({type:USER_REGISTER_START})
        if(username===''||password===''||confirmpassword===''){
            dispatch({type:USER_REGISTER_FAILED,payload:'Please fill in all field'})
        }else{
            Axios.get(`${API_URL}/users`,{ //get data username di user, kalo berhasil get berarti ada yg sama
                params:{
                    username:username,
                }
            }).then((res)=>{
                if(res.data.length!==0){ //untuk cek apakah username ada yang sama
                    dispatch({type:USER_REGISTER_FAILED,payload:'Username already exist'})
                }
                if(password!==confirmpassword){
                    dispatch({type:USER_REGISTER_FAILED,payload:'Password and confirm password does not match'})
                }else{
                    var cekpassword=false
                    var hilangstring=password.replace(' ','')
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
                            dispatch({type:USER_REGISTER_FAILED,payload:'Password should contain number'})
                        }else{
                            dispatch({type:USER_REGISTER_FAILED,payload:'Password should contain alphabet'})
                        }
                    }else{
                        dispatch({type:USER_REGISTER_FAILED,payload:'Password should have more than 6 characters'})
                    }
                }
                if(cekpassword==true&&res.data.length===0){
                    Axios.post(`${API_URL}/users`,{ 
                        username:username,
                        password:password,
                        role: "user", 
                        address:''
                    }).then((res)=>{
                        dispatch({type:USER_REGISTER_SUCCESS,payload:'Register successful!'})
                    }).catch((err)=>{

                    })
                }
            }).catch((err)=>{
                dispatch({type:USER_REGISTER_FAILED, payload:err.message})
            })
        }
    }
}

export const errormessageclear=()=>{
    return{
        type:'ErrorClear'
    }
}

export const notregister=()=>{
    return{
        type:'NOT_REGISTER'
    }
}
