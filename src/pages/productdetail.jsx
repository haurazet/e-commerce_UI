import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../supports/Apiurl';
import { changetoRupiah } from '../supports/changetoRupiah'
import { connect}from "react-redux"
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import $ from 'jquery'; 
import { Redirect } from 'react-router-dom'
import Swal from 'sweetalert2'
import {Getdata} from './../redux/actions'



const ProductDetail =(props)=>{

    const [data,setdata]=useState({})
    const [qty,setqty]=useState(1)
    const [modalopen, setmodalopen]=useState(false)
    const [redirectlog,setredirectlog]=useState(false)
    console.log(props)

    useEffect(()=>{ //component didmount
        console.log('ini useeffect')
        Axios.get(`${API_URL}/product/productdetail/${props.match.params.idprod}`)
        .then((res)=>{
            console.log(res.data)
            setdata(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    },[])

    const qtychange=(e)=>{
        if(e.target.value===''){
            setqty(0)
        }
        if(Number(e.target.value)){ //untuk filter yang diinput harus number
            if(qty===0){
                setqty( e.target.value[1])
            }else{
                if(e.target.value>stock){//jika valuenya lebih besar maka qtynya akan maksimal
                    setqty(stock)
                }else if(e.target.value<1){
                    setqty(1)
                }
                else{
                    // console.log(e.target.defaultValue)
                    setqty(e.target.value)
                }
            }
        }
    }

    const sendToCart=()=>{
        if(props.User.islogin&&props.User.role===1){
            var objtransaction={
                userid: props.User.id,
                productid: props.match.params.idprod,
                qty,
                username: props.User.username 
            }
            Axios.post(`${API_URL}/transaction/sendtocart`,objtransaction)
            .then((res)=>{
                console.log(res)
                Swal.fire({
                    icon: 'success',
                    title: 'added to cart!',
                  })
                  props.Getdata()

            }).catch((err)=>{
                console.log(err.message)
            })
            // Axios.get(`${API_URL}/transactions?status=oncart&userId=${props.User.id}`) //kalo user udah punya cart
            // .then((res1)=>{
            //     if(res1.data.length){
            //         Axios.get(`${API_URL}/transactions?_embed=transactiondetails&status=oncart&userId=${props.User.id}`) //kalo di cart user udah ada product id
            //         .then ((res4)=>{
            //             var addnewproduct = false
            //              res4.data[0].transactiondetails.map((val)=>{
            //                 if(val.productId===data.id){ //kalo ada produk yg sama
            //                     addnewproduct=true
            //                     console.log('ada')
            //                     var addqty ={
            //                         qty: val.qty+qty,
            //                     }
            //                     Axios.patch(`${API_URL}/transactiondetails/${val.id}`, addqty)
            //                      .then ((res3)=>{
            //                         Swal.fire({
            //                             icon: 'success',
            //                             title: 'added to cart!',
            //                           })
            //                           props.Getdata()
            //                     }).catch((err)=>{
            //                         console.log(err.message)
            //                     })
            //                 }
            //             })
            //             if(addnewproduct===false){ //kalo ga ada produk yang sama 
            //                 var objdetails={
            //                     transactionId:res1.data[0].id,
            //                     productId:data.id,
            //                     qty:qty
            //                 }
            //                 Axios.post(`${API_URL}/transactiondetails`, objdetails)
            //                 .then ((res3)=>{
            //                     Swal.fire({
            //                         icon: 'success',
            //                         title: 'added to cart!',
            //                       })
            //                     props.Getdata()
            //                 })
            //             }
            //         })
            //     }else{
            //         Axios.post(`${API_URL}/transactions`,objtransaction) //kalo user belum punya cart, maka buat dulu
            //         .then((res2)=>{
            //             var objdetails={
            //                 transactionId:res2.data.id,
            //                 productId:data.id,
            //                 qty:qty
            //             }
            //             Axios.post(`${API_URL}/transactiondetails`, objdetails)
            //             .then ((res3)=>{
            //                 Swal.fire({
            //                     icon: 'success',
            //                     title: 'added to cart!',
            //                   })
            //                   props.Getdata()
            //             })
            //         })
            //     }
            // }).catch((err)=>{
            //     console.log(err)
            // })
        }else{
            setmodalopen(true)
        }
    }

    const onToLoginClick=()=>{
        if(props.User.role===0){
            setmodalopen(false)
        }else{
            setmodalopen(false)
            setredirectlog(true)
        }
    }

    // HOVER IMAGE PAN
    $ (function (){
        $('.tile')
        // tile mouse actions
        .on('mouseover', function(){
          $(this).children('.photo').css({'transform': 'scale('+ $(this).attr('data-scale') +')'});
        })
        .on('mouseout', function(){
          $(this).children('.photo').css({'transform': 'scale(1)'});
        })
        .on('mousemove', function(e){
          $(this).children('.photo').css({'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +'%'});
        })
        // tiles set up
        .each(function(){
          $(this)
            // add a photo container
            .append('<div class="photo"></div>')
            // set up a background image for each tile based on data-image attribute
            .children('.photo').css({'background-image': 'url('+ $(this).attr('data-image') +')'});
        })
    })

    const {name,image,brand,price,description,stock}=data
    if(redirectlog){
        return <Redirect to='/login'/>
    }
    if(data){
        return (
            // console.log()
            <div>
                <Modal toggle={()=>setmodalopen(false)} isOpen={modalopen}>
                    <ModalBody>
                        {
                            props.User.role===0?
                            'Sorry, you are admin'
                            :
                            'Sorry, you have to login first'
                        }
                    </ModalBody>
                    <ModalFooter>
                        <button className="btn btn-primary" onClick={onToLoginClick}> OK</button>
                    </ModalFooter>
                </Modal>
            <div className='m-5 p-3'>
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-4 p-2" >
                        <div className="tiles">
                            <div className="tile" data-scale="1.5" data-image={API_URL+image}></div>
                        </div>
                    </div>
                    <div className="col-md-6 mt-5 ">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="text-uppercase"> <h5 >{brand}</h5> </div>
                                <h2>{name}</h2>
                                <div style={{ fontSize:"12px"}}> 
                                    <span>{0}&nbsp;x</span> item purchased
                                </div>
                                <div > 
                                    <p className="mt-3" style={{height:'200px'}}>{description}</p>
                                    <h6>{changetoRupiah(price)}</h6>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2" style={{color: "red", fontSize:"12px"}}>
                                {stock} stock left
                            </div>
                        </div>
                        
                        <div className="row" >
                                <div className="col-md-3" >
                                    <div className="d-flex" style={{border:'1px lightgrey solid', width:"160px"}}>
                                    <button className='btn btn-link btn-sm m-0 text-center' style={{fontSize:"20px", textDecoration:"none"}} disabled={qty<=1?true:false} onClick={()=>setqty(qty-1)}>-</button>
                                    <div>
                                        <input 
                                            type="text" 
                                            style={{width:'40px',height:'100%',textAlign:'center',backgroundColor:'transparent', border:"none"}} 
                                            value={qty} 
                                            onChange={qtychange}
                                        />
                                    </div>
                                    <button className='btn btn-link btn-sm m-0' style={{fontSize:"20px", textDecoration:"none"}} disabled={qty>=stock?true:false} onClick={()=>setqty(parseInt(qty)+1)}>+</button>
                                    </div>
                                </div>
                                <div className="col-md-4 ml-4">
                                    <div className="d-flex text-center" style={{height:"48px", width:'200px'}}>
                                        <button className="checkout" style={{backgroundColor:"white", border:'1px lightgrey solid', fontWeight:"300", padding:"0 20px 0 20px"}} onClick={sendToCart}>ADD TO CART</button>
                                    </div>
                                </div>
                        </div>     

                    </div>
                </div>
            </div>
            </div>
        )
    }
    return <div style={{paddingTop:'20%'}}>Loading...</div>
}

const MapstatetoProps=(state)=>{
    return{
      User:state.Auth,
    }
  }

export default connect(MapstatetoProps, {Getdata}) (ProductDetail)