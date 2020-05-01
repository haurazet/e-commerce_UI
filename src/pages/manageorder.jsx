import React, { Component } from 'react';
import Axios from 'axios'
import {API_URL} from '../supports/Apiurl'
import {Table} from 'reactstrap'
import { Link } from 'react-router-dom'



class ManageOrder extends Component {
    state = { 
        transactions:[],
        user:"",
        isloading:true
    }
    
    componentDidMount(){
        this.getdata()
    }
    
    getdata=()=>{
        Axios.get(`${API_URL}/transaction/alltransactions`)
        .then((res)=>{
            this.setState({transactions:res.data})
            this.setState({isloading:false})
            console.log(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    rendertransactions=()=>{
        if(this.state.isloading){
            return <div>null</div>
        }else{
           return this.state.transactions.map((val,index)=>{
                   return (
                       <tr key={index} style={index === this.state.transactions.length-1?{borderBottom:'1px #DEE2E6 solid'}:{}}>
                           <td style={{verticalAlign:"middle"}} className="text-center">#{val.transactionid}</td>
                           <td><img src={API_URL+val.transactiondetails[0].image} height='75' alt=''></img>
                               {val.transactiondetails[0].name} {val.transactiondetails.length>1?`and ${val.transactiondetails.length-1} other items`:null}
                           </td>
                            <td className="text-center" style={{verticalAlign:"middle"}}>{val.username}</td>
                           <td className="text-center" style={{verticalAlign:"middle", color:"red", fontStyle:"italic"}}>{val.status==="onpaymentverification"?"waiting for payment verification":
                                                                                                                        val.status==="onprocess"?"on process"
                                                                                                                        :<span style={{color:"black", fontStyle:"normal"}}>completed</span>}</td>
                           <td style={{verticalAlign:"middle"}}>
                               <Link to={`/admintransaction/${val.transactionid}`}>
                               <div className="btn btn-link text-capitalize">See order</div>
                               </Link> 
                           </td>
                       </tr>
                   )
               
            })
        }
    }

    
    render() { 
        return ( 
            <div className="m-5 p-5 ">
                <div> 
                    <h3 className="text-center my-5 text-uppercase"> Manage Order </h3>
                </div>
                <Table striped>
                    <thead>
                        <th className='text-center'>Order Id</th>
                        <th className='text-center'>Product</th>
                        <th className='text-center'>Customer</th>
                        <th className='text-center'>Status</th>
                    </thead>
                    <tbody> 
                        {this.rendertransactions()}
                    </tbody>
                </Table>
            </div>
         );
    }
}

 
export default  ManageOrder;