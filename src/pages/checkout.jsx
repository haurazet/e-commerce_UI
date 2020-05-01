import React, { Component } from 'react';
import {connect} from 'react-redux'
import Axios from 'axios'
import {API_URL} from './../supports/Apiurl'
import {Table} from 'reactstrap'
import Swal from 'sweetalert2'
import {changetoRupiah} from '../supports/changetoRupiah'
import SquareButton  from '../components/button'
import {Getdata} from './../redux/actions'



class Cart extends Component {
    state = { 
        isicart:[],
        isPayment:false,
        ccnumber:0
    }
    
    componentDidMount(){
        this.getdata()
    }
    
    getdata=()=>{
        Axios.get(`${API_URL}/transaction/getcartdata/${this.props.User.id}`)
        .then((res)=>{
            console.log(res.data)
            this.setState({isicart:res.data})
            console.log(this.props.User.address)
        })
    }

    //  ===================== SHIPPING AND PAYMENT INFO ===================== //

    renderaddress=()=>{
        if(this.props.User.address!==''){
            return this.props.User.address.map((val,index)=>{
                return(
                    <div key={index}>
                        <div>{val.name}</div>
                        <div>{val.phone}</div>
                        <div>{val.street}</div>
                        <div>{val.city} {val.state} {val.zip}</div>
                    </div>
                )
            })
        }else{
            return(
                <div>You don't have address yet</div>
            )
        }
    }
    
    onSelectCC=(e)=>{
        var selected= e.target.value
        if(selected==="CC"){
            this.setState({isPayment:true})
        }
        console.log(selected)
    }
    
    dataOnChange=(e)=>{
        var ccnumber=e.target.value
        this.setState({ccnumber})
        console.log(this.state.ccnumber)
    }
    
    //  ===================== CART INFO ===================== //
    
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
                    <div className="col-md-5 p-0">{changetoRupiah(total)}</div>
                </div> 
            </div>
        )
    }

    confirmorder=()=>{
        if(this.state.isPayment){
            console.log(this.state.isicart)
            var data={
                ccnumber:this.state.ccnumber
            }
            Axios.post(`${API_URL}/transaction/checkout/${this.state.isicart[0].transactionid}`,data)
            .then(()=>{
                this.props.Getdata()
                Swal.fire({
                    icon: 'success',
                    title: 'Success confirm payment!',
                    text: 'Your payment is being verified, please wait for max 1x24 hour',
                  }).then(function(){
                        window.location.href='/'
                    })
            })
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please choose payment method',
              })
        }
    }

    
    render() { 
        return ( 
            <div>
                <div className="mt-5 mx-5 pt-5 px-5 row ">

                    {/* ===================== SHIPPING AND PAYMENT INFO =====================*/}

                    <div className="col-md-5 my-5 mr-5">
                        <div>
                            Ship to:
                            <div className="row mt-3">
                                <div className="col-md-10">
                                    <div>{this.props.User.username}</div>
                                    <div>{this.props.User.phonenumber}</div>
                                    <div>{this.props.User.address}</div>
                                </div>
                                <div className="col-md-2 m-0 p-0">
                                    <div className="btn btn-link m-0 p-0 blue-text text-capitalize">
                                        edit    
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="mt-5">
                            <form className="was-validated">
                                <div>Please select payment method:</div>
                                <div className="form-group">
                                    <select className="custom-select" required onChange={this.onSelectCC}>
                                    <option value="">Open this select menu</option>
                                    <option value="CC">Credit Card</option>
                                    </select>
                                    <div className="invalid-feedback">Select payment method</div>
                                </div>
                                <div>
                                <div>
                                    <input type="number" className="form-control" placeholder="Input card number" onChange={this.dataOnChange} required/>
                                </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* ===================== CART INFO =====================*/}

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
                            <div className="text-right p-3" >
                                <SquareButton isfunction={true} text="pay" onclick={this.confirmorder}/>
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
 
export default connect(MapstatetoProps, {Getdata}) (Cart);