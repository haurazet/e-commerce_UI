import React, { Component } from 'react';
import {connect} from 'react-redux'
import Axios from 'axios'
import {API_URL} from './../supports/Apiurl'
import {Table} from 'reactstrap'
import { Link } from 'react-router-dom'



class TransactionsSummary extends Component {
    state = { 
        transactions:[],
        totalpayment:0,
    }
    
    componentDidMount(){
        this.getdata()
    }
    
    getdata=()=>{
        Axios.get(`${API_URL}/transaction/transactionhistory/${this.props.match.params.userId}`)
        .then((res)=>{
            this.setState({transactions:res.data})
            console.log(res)
        }).catch((err)=>{
            console.log(err)
        })
    }

    rendertransactions=()=>{
        return this.state.transactions.map((val,index)=>{
            return (
                <tr key={index} style={index === this.state.transactions.length-1?{borderBottom:'1px #DEE2E6 solid'}:{}}>
                    <td style={{verticalAlign:"middle"}}>#{val.transactionid}</td>
                    <td><img src={API_URL+val.transactiondetails[0].image} height='75' alt=''></img>
                        {val.transactiondetails[0].name} {val.transactiondetails.length>1?`and ${val.transactiondetails.length-1} other items`:null}
                    </td>
                    <td className="text-center" style={{verticalAlign:"middle"}}>{val.method}</td>
                    <td className="text-center" style={{verticalAlign:"middle", color:"red", fontStyle:"italic"}}>{val.status==="onpaymentverification"?"waiting for payment verification":
                                                                                                                        val.status==="onprocess"?"on process"
                                                                                                                        :<span style={{color:"black", fontStyle:"normal"}}>completed</span>}</td>
                    <td style={{verticalAlign:"middle"}}>
                        <Link to={`/transaction/${val.transactionid}`}>
                        <div className="btn btn-link text-capitalize">See order</div>
                        </Link> 
                    </td>
                </tr>
            )
        })
    }

    totalpayment =()=>{
        var total=0
        this.state.transactions.forEach((val)=>{
            var output= val.price*val.qty
            total+=output
        })
        return this.setState({totalpayment:total})
        
        
    }
    
    render() { 
        return ( 
            <div className="m-5 p-5 ">
                <div> 
                    <h3 className="text-center my-5 text-uppercase"> Your Order </h3>
                </div>
                <Table striped>
                    <thead>
                        <th>Order Id</th>
                        <th>Product</th>
                        <th className='text-center'>Payment</th>
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

const MapstatetoProps=(state)=>{
    return{
      User:state.Auth,
    }
  }
 
export default connect(MapstatetoProps) (TransactionsSummary);