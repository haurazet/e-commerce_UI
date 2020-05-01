import Axios from 'axios'
import { GET_CART_DATA } from './type'
import { API_URL } from '../../supports/Apiurl'

export const Getdata=()=>{
    return(dispatch)=>{
        var userid = window.localStorage.getItem('iduser')
        Axios.get(`${API_URL}/transaction/gettotalcart/${userid}`)
        .then ((res)=>{
            console.log(res.data[0])
            dispatch({type:GET_CART_DATA, payload:res.data[0].totalqty})
        // if(res.data.length===1){
        //     var cartitem = 0
        //     res.data[0].transactiondetails.forEach((val)=>{
        //         cartitem += val.qty
        //     })
        // }
        })
    }
}