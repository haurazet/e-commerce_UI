import Axios from 'axios'
import { USER_LOGIN_START, USER_LOGIN_FAILED, USER_LOGIN_SUCCESS } from './type'
import { API_URL } from '../../supports/Apiurl'

export const LoginUser=({username,password})=>{
    return(dispatch)=> {
        dispatch({type:USER_LOGIN_START})
        if(username===''||password===''){
            dispatch({type:USER_LOGIN_FAILED,payload:'username dan password belum diisi'})
        }else{
            // Axios.get(`http://localhost:2000/users?username=${data.username}&password=${data.password}`)
            // cara lain
            //untuk cek apakah data yang diinput user ada yg sesuai sama parameter/config dibawah
            Axios.get(`${API_URL}/users`,{
                params:{
                    username:username,
                    password
                }
                
            })
            .then((res)=>{
                console.log(res)
                if(res.data.length){
                    localStorage.setItem('iduser',res.data[0].id)
                    dispatch({type:USER_LOGIN_SUCCESS, payload:res.data[0]})
                    // setisierror('user ada')
                    //kalo ada maka taro id user tersebut ke local storage dengan key 'iduser' dan value yaitu id user
                }else{
                    dispatch({type:USER_LOGIN_FAILED,payload:'username atau password tidak terdaftar'})
                }
            }).catch((err)=>{
                console.log(err)
                dispatch({type:USER_LOGIN_FAILED, payload:err.message})
            })
        }
    }
}
export const errormessageclear=()=>{
    return{
        type:'ErrorClear'
    }
}

export const KeepLogin=(data)=>{
    return{
        type:USER_LOGIN_SUCCESS,
        payload:data
    }
}




