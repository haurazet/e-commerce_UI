import Axios from 'axios'
import { GET_CART_DATA } from './type'
import { API_URL } from '../../supports/Apiurl'

export const Getdata=()=>{
    return(dispatch)=>{
        var userid = window.localStorage.getItem('iduser')
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${userid}&status=oncart`)
        .then ((res)=>{
        if(res.data.length===1){
            var cartitem = 0
            res.data[0].transactiondetails.forEach((val)=>{
                cartitem += val.qty
            })
            dispatch({type:GET_CART_DATA, payload:cartitem})
        }
        })
    }
}