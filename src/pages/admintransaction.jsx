import React, { Component } from 'react';
import {connect} from 'react-redux'
import Axios from 'axios'
import {API_URL} from '../supports/Apiurl'
import {Table} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import {changetoRupiah} from '../supports/changetoRupiah'
import { AiOutlineDelete } from 'react-icons/ai';
import { Link, Redirect } from 'react-router-dom'
import SquareButton  from '../components/button'
// import Swal from 'sweetalert2'

const MySwal = withReactContent(Swal)



class AdminTransactions extends Component {
    state = { 
        isicart:[],
        totalpayment:0,
        isdetailopen:false,
        transactionstatus:'',
        user:'',
        isloading:true
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
            // console.log(newarrforprod)
            Axios.all(newarrforprod)
            .then((res2)=>{
                // console.log(res2)
                res2.forEach((val,index)=>{ //masukkan detail produk ke masing2 transdetail yg ada di dataprod
                    res.data.transactiondetails[index].dataprod=val.data
                })
                // console.log(res.data.transactiondetails)
                this.setState({isicart:res.data.transactiondetails})
                this.totalpayment()
                console.log(this.state.isicart)
            })
            Axios.get(`${API_URL}/users/${res.data.userId}`)
            .then((res3)=>{
                res.data.userdata=res3.data
                this.setState({user:res3.data})
                console.log(this.state.user.address)
                this.setState({isloading:false})
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderaddress=()=>{
        console.log(this.state.user.address)
        if(this.state.isloading==false){
            if(this.state.user.address!==""){
                return this.state.user.address.map((val,index)=>{
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
                    <div>This customer does not have address yet</div>
                )
            }
        }
    }
   
    renderisidata=()=>{
        return this.state.isicart.map((val,index)=>{
            return (
                <tr key={index} style={index === this.state.isicart.length-1?{borderBottom:'1px #DEE2E6 solid'}:{}}>
                    <td>{val.dataprod.name}</td>
                    <td className='text-center'><img src={val.dataprod.image} height='75' alt=''></img></td>
                    <td className='text-center'>{changetoRupiah(val.dataprod.price)}</td>
                    <td>{val.qty}</td>
                    <td className='text-center'>{changetoRupiah(val.dataprod.price*val.qty)}</td>
                </tr>
            )
        })
    }

    totalpayment =()=>{
        console.log(this.state.isicart)
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


    verifypayment=()=>{
        Axios.patch(`${API_URL}/transactions/${this.props.match.params.transactionId}`,{status:"onprocess"})
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
    
    render() { 
        return ( 
            <div className="m-5 p-5">
                {this.state.transactionstatus=="onpaymentverification"?
                    <div className="text-center mt-3">
                        <div className="mb-3">This order is waiting for your payment verification</div>
                        <SquareButton text="Verify Payment  & Accept order" isfunction={true} onclick={()=>this.verifypayment()}/>  
                        <div className="mt-5">Order Details</div>
                    </div>
                :
                this.state.transactionstatus=='onprocess'?
                    <div className="text-center mt-3">
                        <div className="mb-3">Process this order</div>
                        <div className="mt-5">Order Details</div>
                    </div>
                :
                null
                }
                
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
            
         );
    }
}

const MapstatetoProps=(state)=>{
    return{
      User:state.Auth,
    }
  }
 
export default connect(MapstatetoProps) (AdminTransactions);