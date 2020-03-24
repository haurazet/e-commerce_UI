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
const MySwal = withReactContent(Swal)



class TransactionsSummary extends Component {
    state = { 
        transactions:[],
        totalpayment:0,
    }
    
    componentDidMount(){
        this.getdata()
    }
    
    getdata=()=>{
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&userId=${this.props.match.params.userId}&status=onprocess`)
        .then((res)=>{
            var newarrforprod=[]
            console.log(res.data)
            res.data.forEach(element1=>{
                element1.transactiondetails.forEach(element => {  //push detail product ke newarrforprod berdasarkan product id yg ada di cart
                    newarrforprod.push(Axios.get(`${API_URL}/products/${element.productId}`)) //setiap itemnya di push jadi array of items
                })
            })
            // console.log(newarrforprod)
            Axios.all(newarrforprod)
            .then((res2)=>{
                console.log(res2)
                res.data.forEach((val1,index1)=>{
                    val1.transactiondetails.forEach((val3,index3)=>{
                        res2.forEach((val2,index2)=>{
                            if(val3.productId==val2.data.id){
                                val3.dataprod=val2.data
                            }
                         })
                    })
                })

                this.setState({transactions:res.data})
                console.log(this.state.transactions)
                // this.totalpayment()
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    rendertransactions=()=>{
       return this.state.transactions.map((val,index)=>{
           console.log(this.state.transactions)
           if(val.status!=="oncart"){
               return (
                   <tr key={index} style={index === this.state.transactions.length-1?{borderBottom:'1px #DEE2E6 solid'}:{}}>
                       <td style={{verticalAlign:"middle"}}>#{val.id}</td>
                       <td><img src={val.transactiondetails[0].dataprod.image} height='75' alt=''></img>
                           {val.transactiondetails[0].dataprod.name} {val.transactiondetails.length>1?`and ${val.transactiondetails.length-1} other items`:null}
                       </td>
                        <td className="text-center">{val.method}</td>
                       <td className="text-center" style={{verticalAlign:"middle"}}>{val.status==='onprocess'?'Completed':null}</td>
                       <td style={{verticalAlign:"middle"}}>
                           <Link to={`/transaction/${val.id}`}>
                           <div className="btn btn-link text-capitalize">See order</div>
                           </Link> 
                       </td>
                   </tr>
               )
           }
        })
    }

    totalpayment =()=>{
        var total=0
        this.state.transactions.forEach((val)=>{
            var output= val.dataprod.price*val.qty
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