import React, { Component } from 'react';
import {connect} from 'react-redux'
import Axios from 'axios'
import {API_URL} from '../supports/Apiurl'
import {Table} from 'reactstrap'
import Swal from 'sweetalert2'
import {changetoRupiah} from '../supports/changetoRupiah'
import SquareButton  from '../components/button'



class AdminTransactions extends Component {
    state = { 
        isicart:[],
        totalpayment:0,
        transactionstatus:'',
        user:'',
        isloading:true
    }
    
    componentDidMount(){
        this.getdata()
    }
    
    getdata=()=>{
        Axios.get(`${API_URL}/transaction/transactiondetail/${this.props.match.params.transactionId}`)
        .then((res)=>{
            console.log(res.data)
            console.log(res.data)
            this.setState({transactionstatus:res.data[0].status, isicart:res.data})
            this.totalpayment()
            this.setState({isloading:false})
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderaddress=()=>{
        if(this.state.isicart[0]){
            return(
                <div>
                    <div>{this.state.isicart[0].username}</div>
                    <div>{this.state.isicart[0].phonenumber}</div>
                    <div>{this.state.isicart[0].address}</div>
                </div>
            )

        }
    }

    renderpayment=()=>{
        if(this.state.isicart[0]){
            return(
                <div>
                    <div>Credit Card</div>
                    <div>Credit Card Number: {this.state.isicart[0].creditcard_number}</div>
                </div>
            )

        }
    }
   
    renderisidata=()=>{
        return this.state.isicart.map((val,index)=>{
            return (
                <tr key={index} style={index === this.state.isicart.length-1?{borderBottom:'1px #DEE2E6 solid'}:{}}>
                    <td>{val.name}</td>
                    <td className='text-center'><img src={API_URL+val.image} height='75' alt=''></img></td>
                    <td className='text-center'>{changetoRupiah(val.price)}</td>
                    <td>{val.qty}</td>
                    <td className='text-center'>{changetoRupiah(val.price*val.qty)}</td>
                </tr>
            )
        })
    }

    totalpayment =()=>{
        console.log(this.state.isicart)
        var total=0
        this.state.isicart.forEach((val)=>{
            var output= val.price*val.qty
            total+=output
        })
        return this.setState({totalpayment:total})
        
        
    }

    rendertotalcart =()=>{
        var total=0
        this.state.isicart.forEach((val)=>{
            var output= val.price*val.qty
            total+=output
        })
        
        return (
            <div className='text-right mb-3 col-md-8 float-right'>
                <div className="row m-0 p-0 justify-content-end">
                    <div className="col-md-5 p-0">Total Product</div>
                    <div className="col-md-5 p-0">{changetoRupiah(total)}</div>
                </div>
                <div className="row m-0 p-0 justify-content-end">
                    <div className="col-md-5 p-0">Shipping fee</div>
                    <div className="col-md-5 p-0">0</div>
                </div> 
                <div className="row m-0 p-0 justify-content-end red-text">
                    <div className="col-md-5 p-0">Discount</div>
                    <div className="col-md-5 p-0">-0</div>
                </div>
                <div className="row m-0 p-0 justify-content-end">
                    <div className="col-md-5 p-0">Total Payment</div>
                    <div className="col-md-5 p-0">{changetoRupiah(this.state.totalpayment)}</div>
                </div> 
            </div>
        )
    }


    verifypayment=()=>{
        Axios.get(`${API_URL}/transaction/verifypayment/${this.props.match.params.transactionId}`)
        .then(()=>{
            Swal.fire({
                icon: 'success',
                title: 'Success verify payment!',
                text: 'Now process the order and send the product to the customer',
              }).then((res)=>{
                  this.getdata()
              })
        })
    }

    processorder=()=>{
        Axios.get(`${API_URL}/transaction/processorder/${this.props.match.params.transactionId}`)
        .then(()=>{
            Swal.fire({
                icon: 'success',
                title: 'Success process order!',
                text: 'Order completed',
              }).then((res)=>{
                  this.getdata()
              })
        })
    }
    
    render() { 
        return ( 
            <div className="m-5 p-5">
                 <div className="text-center mt-5 ">
                        <div className="d-flex justify-content-center">
                            <div className="mb-5 bg-dark text-white w-50 text-center">
                                {this.state.transactionstatus==="onpaymentverification"?"This order is waiting for your payment verification":
                                this.state.transactionstatus==='onprocess'?"Process this order":"Order completed"}
                            </div>
                        </div>
                        <div>
                            {this.state.transactionstatus==="onpaymentverification"?<SquareButton text="Verify Payment" isfunction={true} onclick={()=>this.verifypayment()}/>:
                                this.state.transactionstatus==='onprocess'?<SquareButton text="Process Order" isfunction={true} onclick={()=>this.processorder()}/>:null}
                            </div>
                        <div className="mt-5 h5"><u>Order Details</u></div>
                    </div>
                
                    <div className="row text-left">
                    <div className="col-md-5 my-5 mr-5">
                        <div>
                            <div className="font-weight-bold">
                                Ship to:
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-10">
                                    {this.renderaddress()}
                                </div>
                            </div>
                        </div>
                        <div className="mt-5" >
                        <div className="font-weight-bold">
                                Payment Method:
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-10">
                                    {this.renderpayment()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 my-5 ml-5" >
                        <div> 
                            <h5 className="text-center text-uppercase "> Product </h5>
                        </div>
                        <Table striped>
                            <thead>
                                <th>Name</th>
                                <th className='text-center'>Product</th>
                                <th className='text-center'>Price</th>
                                <th className='text-center'>Qty</th>
                                <th className='text-center'>Total</th>
                                <th className='text-center'></th>
                            </thead>
                            <tbody> 
                                {this.renderisidata()}
                            </tbody>
                        </Table>
                            {this.rendertotalcart()}
                    </div>
                    </div>
            </div>
            
         );
    }
}

const MapstatetoProps=(state)=>{
    return{
      User:state.Auth,
    }
  }
 
export default connect(MapstatetoProps) (AdminTransactions);