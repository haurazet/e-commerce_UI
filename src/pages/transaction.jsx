import React, { Component } from 'react';
import {connect} from 'react-redux'
import Axios from 'axios'
import {API_URL} from './../supports/Apiurl'
import {Table} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {changetoRupiah} from '../supports/changetoRupiah'
import { AiOutlineDelete } from 'react-icons/ai';
import { Link, Redirect } from 'react-router-dom'
import SquareButton  from '../components/button'
// import Swal from 'sweetalert2'

const MySwal = withReactContent(Swal)



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
        Axios.get(`${API_URL}/transactions/${this.props.match.params.transactionId}?_embed=transactiondetails`)
        .then((res)=>{
            console.log(res.data)
            this.setState({transactionstatus:res.data.status})
            // console.log(this.state.isicart)
            // console.log(res.data.transactiondetails)
            var newarrforprod=[]
            res.data.transactiondetails.forEach(element => {  //push detail product ke newarrforprod berdasarkan product id yg ada di cart
               newarrforprod.push(Axios.get(`${API_URL}/products/${element.productId}`)) //setiap itemnya di push jadi array of items
            });
            console.log(newarrforprod)
            Axios.all(newarrforprod)
            .then((res2)=>{
                console.log(res2)
                res2.forEach((val,index)=>{ //masukkan detail produk ke masing2 transdetail yg ada di dataprod
                    res.data.transactiondetails[index].dataprod=val.data
                })
                console.log(res.data.transactiondetails)
                this.setState({isicart:res.data.transactiondetails})
                this.totalpayment()
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

    totalpayment =()=>{
        var total=0
        this.state.isicart.forEach((val)=>{
            var output= val.dataprod.price*val.qty
            total+=output
        })
        return this.setState({totalpayment:total})
        
        
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

    confirmpayment=()=>{
        Axios.patch(`${API_URL}/transactions/${this.state.isicart[0].transactionId}`,{status:"onpaymentverification"})
        .then(()=>{
            Swal.fire({
                icon: 'success',
                title: 'Success confirm payment!',
                text: 'Your payment is being verified, please wait for max 24 hour',
              }).then(function(){
                    window.location.href='/'
                })
        })
    }
    
    render() { 
        return ( 
            <div>
                
            <div className="m-5 p-5 text-center">
                {this.state.transactionstatus=="onwaitingpayment"?
                    <div>
                        <div>Your order is waiting for payment. </div>
                        <div>Total payment {changetoRupiah(this.state.totalpayment)} </div>
                        <div>Please complete payment before ..</div>
                        <div>Choose payment method below:</div>
                        <div>BNI: 01234556669 a/n Sagitta Shop</div>
                        <div>BCA: 35978787899 a/n Sagitta Shop</div>
                        <div>OVO: 08211212122 a/n Sagitta Shop</div>
                        <div>Once you finish your payment, please confirm here:</div>
                        <div><SquareButton isfunction={true} text={"confirm payment"} onclick={this.confirmpayment}/></div>
                    </div>
                :
                this.state.transactionstatus=="onpaymentverification"?
                <div>
                        <div>Your payment is being verified, please wait for max 24 hour </div>
                </div>
                :
                this.state.transactionstatus=="onprocess"?
                <div>
                        <div>Your order is complete </div>
                </div>
                :
                null
                }
                {/* <div className="btn btn-link blue-text" onClick={this.seedetailstoggle}>{this.state.isdetailopen?"hide order detail":"See order detail"}</div> */}
                <div className="mt-5">Order Details</div>
                    <div className="row text-left">
                    <div className="col-md-5 my-5 mr-5">
                        <div>
                            Ship to:
                            <div className="row mt-3">
                                <div className="col-md-10">
                                    {this.renderaddress()}
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