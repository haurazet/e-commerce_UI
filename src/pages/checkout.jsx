import React, { Component } from 'react';
import {connect} from 'react-redux'
import Axios from 'axios'
import {API_URL} from './../supports/Apiurl'
import {Table} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {changetoRupiah} from '../supports/changetoRupiah'
import { AiOutlineDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom'
import SquareButton  from '../components/button'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {Getdata} from './../redux/actions'
const MySwal = withReactContent(Swal)



class Cart extends Component {
    state = { 
        isicart:[],
        totalpayment:0,
        isPayment:false,
    }
    
    componentDidMount(){
        this.getdata()
    }
    
    getdata=()=>{
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${this.props.User.id}&status=oncart`)
        .then((res)=>{
            console.log(this.state.isicart)
            console.log(res.data[0].transactiondetails)
            var newarrforprod=[]
            res.data[0].transactiondetails.forEach(element => {  //push detail product ke newarrforprod berdasarkan product id yg ada di cart
               newarrforprod.push(Axios.get(`${API_URL}/products/${element.productId}`)) //setiap itemnya di push jadi array of items
            });
            console.log(newarrforprod)
            Axios.all(newarrforprod)
            .then((res2)=>{
                console.log(res2)
                res2.forEach((val,index)=>{ //masukkan detail produk ke masing2 transdetail yg ada di dataprod
                    res.data[0].transactiondetails[index].dataprod=val.data
                })
                console.log(res.data[0].transactiondetails)
                this.setState({isicart:res.data[0].transactiondetails})
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

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
   
    renderisidata=()=>{
        return this.state.isicart.map((val,index)=>{
            return (
                <tr key={index} style={index === this.state.isicart.length-1?{borderBottom:'1px #DEE2E6 solid'}:{}}>
                    <td>{val.dataprod.name}</td>
                    <td className='text-center'><img src={val.dataprod.image} height='100' alt=''></img></td>
                    <td className='text-center'>{changetoRupiah(val.dataprod.price)}</td>
                    <td>{val.qty}</td>
                    <td className='text-center'>{changetoRupiah(val.dataprod.price*val.qty)}</td>
                </tr>
            )
        })
    }

    rendertotalcart =()=>{
        var total=0
        this.state.isicart.forEach((val)=>{
            var output= val.dataprod.price*val.qty
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

    onSelectCC=(e)=>{
        var selected= e.target.value
        if(selected==="CC"){
            this.setState({isPayment:true})
        }
        console.log(selected)
    }

    confirmorder=()=>{
        if(this.state.isPayment){
            Axios.patch(`${API_URL}/transactions/${this.state.isicart[0].transactionId}`,{status:"onpaymentverification", method:"CC"})
            .then(()=>{
                this.props.Getdata()
                Swal.fire({
                    icon: 'success',
                    title: 'Success confirm payment!',
                    text: 'Your payment is being verified, please wait for max 24 hour',
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

                    <div className="col-md-5 my-5 mr-5">
                        <div>
                            Ship to:
                            <div className="row mt-3">
                                <div className="col-md-10">
                                    {this.renderaddress()}
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
                                    <input type="number" className="form-control" placeholder="Input credit card number" required/>
                                </div>
                                </div>
                            </form>
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
                            <div className="text-right p-3" >
                                {/* <Link to={`/transaction/${this.state.isicart[0].transactionId}`}> */}
                                    <SquareButton isfunction={true} text="pay" onclick={this.confirmorder}/>
                                {/* </Link> */}
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