import React, { Component } from 'react';
import {connect} from 'react-redux'
import Axios from 'axios'
import {API_URL} from './../supports/Apiurl'
import {Table} from 'reactstrap'
import Swal from 'sweetalert2'
import {changetoRupiah} from '../supports/changetoRupiah'
import SquareButton  from '../components/button'



class Transactions extends Component {
    state = { 
        isicart:[],
        totalpayment:0,
        isdetailopen:false,
        transactionstatus:''
    }
    
    componentDidMount(){
        this.getdata()
        // this.totalpayment()
    }
    
    getdata=()=>{
        Axios.get(`${API_URL}/transaction/transactiondetail/${this.props.match.params.transactionId}`)
        .then((res)=>{
            console.log(res.data)
            this.setState({transactionstatus:res.data[0].status, isicart:res.data})
            this.totalpayment()
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderisidata=()=>{
        return this.state.isicart.map((val,index)=>{
            return (
                <tr key={index} style={index === this.state.isicart.length-1?{borderBottom:'1px #DEE2E6 solid'}:{}}>
                    <td>{val.name}</td>
                    <td className='text-center'><img src={API_URL+val.image} height='100' alt=''></img></td>
                    <td className='text-center'>{changetoRupiah(val.price)}</td>
                    <td>{val.qty}</td>
                    <td className='text-center'>{changetoRupiah(val.price*val.qty)}</td>
                </tr>
            )
        })
    }

    totalpayment =()=>{
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

    confirmorder=()=>{
        this.props.Getdata()
        return(
            this.props.history.push({
                pathname: `/transaction/${this.state.isicart[0].transactionId}`,
            })
        )
    }

    seedetailstoggle=()=>{
        this.setState({isdetailopen:!this.state.isdetailopen})
    }
    
    render() { 
        return ( 
            <div>
                
            <div className="m-5 p-5 text-center">

            <div className="text-center mt-5 ">
                        <div className="d-flex justify-content-center">
                            <div className="mb-5 bg-dark text-white w-50 text-center">
                                {this.state.transactionstatus==="onpaymentverification"?"Your payment is being verified, please wait for max 1x24 hour":
                                this.state.transactionstatus==='onprocess'?"Your order is being processed":"Your order has completed"}
                            </div>
                        </div>
                        <div className="mt-2 h5"><u>Order Details</u></div>
            </div>
                    <div className="row text-left">
                    <div className="col-md-5 my-5 mr-5">
                        <div>
                            Ship to:
                            <div className="row mt-3">
                                <div className="col-md-10">
                                 <div>{this.props.User.username}</div>
                                    <div>{this.props.User.phonenumber}</div>
                                    <div>{this.props.User.address}</div>
                                </div>
                                

                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 my-5 ml-5" >
                        <div> 
                            <h5 className="text-center text-uppercase"> Product </h5>
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
            </div>
         );
    }
}

const MapstatetoProps=(state)=>{
    return{
      User:state.Auth,
    }
  }
 
export default connect(MapstatetoProps) (Transactions);