import React, { Component } from 'react';
// import {connect} from 'react-redux'
import Axios from 'axios'
import {API_URL} from '../supports/Apiurl'
import {Table} from 'reactstrap'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Link } from 'react-router-dom'
import SquareButton  from '../components/button'
const MySwal = withReactContent(Swal)



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
        Axios.get(`${API_URL}/transactions?_embed=transactiondetails&status=onpaymentverification`)
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
                // this.totalpayment()
            })
            var newarrforuser=[]
            res.data.forEach((val)=>{
                newarrforuser.push(Axios.get(`${API_URL}/users/${val.userId}`))
            })
            Axios.all(newarrforuser)
            .then((res1)=>{
                console.log(res1)
                res.data.forEach((val1,index1)=>{
                    res1.forEach((val2,index2)=>{
                        console.log('masuk')
                        if(val1.userId==val2.data.id){
                            val1.datauser=val2.data
                        }
                    })
                })
                // console.log(res.data)
                // this.setState({transactions:res.data})
                this.setState({isloading:false})
                // console.log(this.state.transactions)
            })
           
        }).catch((err)=>{
            console.log(err)
        })
    }

    rendertransactions=()=>{
        if(this.state.isloading){
            return <div>null</div>
        }else{
            console.log(this.state.totalpayment)
            console.log(this.state.transactions)
           return this.state.transactions.map((val,index)=>{
                   return (
                       <tr key={index} style={index === this.state.transactions.length-1?{borderBottom:'1px #DEE2E6 solid'}:{}}>
                           <td style={{verticalAlign:"middle"}} className="text-center">#{val.id}</td>
                           <td><img src={val.transactiondetails[0].dataprod.image} height='75' alt=''></img>
                               {val.transactiondetails[0].dataprod.name} {val.transactiondetails.length>1?`and ${val.transactiondetails.length-1} other items`:null}
                           </td>
                            <td className="text-center" style={{verticalAlign:"middle"}}>{val.datauser.username}</td>
                           <td className="text-center" style={{verticalAlign:"middle", color:"red", fontStyle:"italic"}}>{val.status=="onpaymentverification"?"waiting for payment verification":null}</td>
                           <td style={{verticalAlign:"middle"}}>
                               <Link to={`/admintransaction/${val.id}`}>
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

// const MapstatetoProps=(state)=>{
//     return{
//       User:state.Auth,
//     }
//   }
 
export default  ManageOrder;