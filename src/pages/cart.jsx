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
import {Getdata} from './../redux/actions'
const MySwal = withReactContent(Swal)



class Cart extends Component {
    state = { 
        isicart:[],
        qty:0
     }

    componentDidMount(){
        this.getdata()
    }

    getdata=()=>{
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${this.props.User.id}&status=oncart`)
        .then((res)=>{
            var newarrforprod=[]
            res.data[0].transactiondetails.forEach(element => {  //push detail product ke newarrforprod berdasarkan product id yg ada di cart
               newarrforprod.push(Axios.get(`${API_URL}/products/${element.productId}`)) //setiap itemnya di push jadi array of items
            });
            Axios.all(newarrforprod)
            .then((res2)=>{
                res2.forEach((val,index)=>{ //masukkan detail produk ke masing2 transdetail yg ada di dataprod
                    res.data[0].transactiondetails[index].dataprod=val.data
                })
                this.setState({isicart:res.data[0].transactiondetails})
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    deleteconfirm=(index,id)=>{
        MySwal.fire({
            title: `Are you sure wanna delete ${this.state.isicart[index].dataprod.name} ?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
              Axios.delete(`${API_URL}/transactiondetails/${id}`)
              .then((res)=>{
                  MySwal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                  ).then((result)=>{
                      if(result.value){
                          this.getdata()
                          this.props.Getdata()
                      }
                  })
              }).catch((err)=>{
                  console.log(err)
              }) 
            }
          })
    }

    // qtychange=((e,index)=>{
    //     if(e.target.value===''){
    //         this.setState({qty:0})
    //     }
    //     if(Number(e.target.value)){ //untuk filter yang diinput harus number
    //         if(this.state.isicart[index].qty===0){
    //             this.setState({qty:e.target.value[1]})
    //             // setqty( e.target.value[1])
    //         }else{
    //             if(e.target.value>this.state.isicart[index].dataprod.stock){//jika valuenya lebih besar maka qtynya akan maksimal
    //                 this.setState({qty:this.state.isicart[index].dataprod.stock})
    //                 // setqty(stock)
    //             }else if(e.target.value<1){
    //                 this.setState({qty:1})
    //                 // setqty(1)
    //             }
    //             else{
    //                 // console.log(e.target.defaultValue)
    //                 this.setState(e.target.value)
    //                 // setqty(e.target.value)
    //             }
    //         }
    //     }
    // })

    onminqty=(index,id)=>{
        var minqty={
            qty:this.state.isicart[index].qty-1
        }
        Axios.patch(`${API_URL}/transactiondetails/${id}`,minqty)
        .then((res)=>{
            this.getdata()
            this.props.Getdata()
        })
    }

    onplusqty=(index,id)=>{
        var plusqty={
            qty:this.state.isicart[index].qty+1
        }
        Axios.patch(`${API_URL}/transactiondetails/${id}`,plusqty)
        .then((res)=>{
            this.getdata()
            this.props.Getdata()
        })
    }

    renderisidata=()=>{
        return this.state.isicart.map((val,index)=>{
            return (
                <tr key={index} style={index === this.state.isicart.length-1?{borderBottom:'1px #DEE2E6 solid'}:{}}>
                    <td>{val.dataprod.name}</td>
                    <td className='text-center'><img src={val.dataprod.image} height='100' alt=''></img></td>
                    <td className='text-center'>{changetoRupiah(val.dataprod.price)}</td>
                    <td className="d-flex justify-content-center" style={index===0?{borderTop:'none'}:{}}>
                        <div className="d-flex" style={{border:'1px lightgrey solid', width:"160px"}}>
                        <button className='btn btn-link btn-sm m-0 text-center' 
                                style={{fontSize:"20px", textDecoration:"none"}} 
                                disabled={val.qty<=1?true:false} 
                                onClick={()=>this.onminqty(index,val.id)}>-</button>
                        <div>
                            <input 
                                type="text" 
                                style={{width:'40px',height:'100%',textAlign:'center',backgroundColor:'transparent', border:"none"}} 
                                value={val.qty} 
                                readOnly
                                // onChange={this.qtychange(val, index)}
                            />
                        </div>
                        <button className='btn btn-link btn-sm m-0' 
                                style={{fontSize:"20px", textDecoration:"none"}} 
                                disabled={val.qty>=val.dataprod.stock?true:false} 
                                onClick={()=>this.onplusqty(index,val.id)}>+</button>
                        </div>
                    </td>
                    <td className='text-center'>{changetoRupiah(val.dataprod.price*val.qty)}</td>
                    <td className="text-right"><button style={{width:'20px', fontSize:'1.2em', color:'gray'}} className="btn btn-link hoverblack p-0 m-0" onClick={()=>this.deleteconfirm(index,val.id)}><AiOutlineDelete/></button></td>
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
            <div className='text-right mb-3'>
                Total {changetoRupiah(total)}
            </div>
        )
    }

    onCheckoutClick =()=>{
        return (
            this.props.history.push({
                pathname: `/checkout/transaction/${this.props.User.id}`,
            })
        )
    }


    render() { 
        return ( 
            <div className="m-5 p-5 ">
                <div> 
                    <h3 className="text-center my-5 text-uppercase"> Cart </h3>
                </div>
                {this.state.isicart===''?
                <div className="text-center">
                    <div className="m-5">Your cart is empty</div>
                    <Link to="/productpage">
                    <div><SquareButton text="shop now" isfunction={false}/></div>
                    </Link>
                </div>
                :
                <div>
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

                    <div>{this.rendertotalcart()}</div>
                    <div className="text-right" >
                        <Link to={'/checkout'}>
                            <SquareButton isfunction={false} text="checkout"/>
                        </Link>
                    </div>
                </div>
                }
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