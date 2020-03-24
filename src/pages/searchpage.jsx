import React, { useState, useEffect }from 'react';
import Axios from 'axios';
import { API_URL } from '../supports/Apiurl';
import Numeral from 'numeral'
import {
    Card, CardBody,
    CardTitle, CardSubtitle, Button
  } from 'reactstrap';
import { Link } from 'react-router-dom'

const Searchpage =(props)=>{

    const [data,setdata]=useState({})
    const [isloading, setisloading] = useState(true)
    console.log(props)
    // console.log(data)
    console.log('ini props awal'+props)

    useEffect(()=>{ //component didmount
        console.log('useeffect called')
        console.log(isloading)
        Axios.get(`${API_URL}/products?name_like=${props.match.params.keyword}`)
        .then((res)=>{
            console.log(res.data)
            setdata(res.data)
            setisloading(false)
        }).catch((err)=>{
            console.log(err.mes)
        })
    },[props.match.params.keyword])
    

    const renderProducts=()=>{
        // setisloading(true)
        console.log(data)
        return data.map((val,index)=>{
            return(
                <div key={index} className="p-4 " style={{width:'25%'}}>
                    
                        <Card className="text-center no-shadow " style={{fontSize:'13px',}}>
                            <div style={{height:200, width:'100%'}}>
                                <img src={val.image} width="100%" height="100%" alt=""/>
                                <div className="kotak-hitam">
                                    <Link to={`/productdetail/${val.id}`}>
                                    <button className="tombol-buynow">Product Detail</button>
                                    </Link>
                                </div>
                            </div>
                            <CardBody style={{height:150}}>
                                <div style={{fontSize:"12px"}} className="my-pink text-uppercase">{val.brand}</div>
                                <CardTitle style={{height:50}} className="mb-2">{val.name}</CardTitle>
                                <CardSubtitle>{'IDR '+Numeral(val.price).format(0.0)}</CardSubtitle>
                            </CardBody>
                        </Card>
                    
                </div>
            )
        })
    }

    return(
        <div className="p-5 m-5">
        <div className=""> 
        <h5 className="text-center mt-5 text-uppercase"> search result for: '{props.match.params.keyword}' </h5>
        </div>
            <div className="row mt-5">

                <div className="col-md-2 p-4">
                    {/* <Search /> */}
                    <h1>filter by category</h1>
                </div>

                <div className="col-md-10"> 
                    <div className="d-flex flex-wrap justify-content-start ">
                        {isloading?
                        null
                        :
                        renderProducts()}
                        {/* {} */}
                    </div>
                </div>
            </div>
        </div>
       

    )
}

export default Searchpage