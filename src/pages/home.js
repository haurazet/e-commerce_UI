import React, {Component} from 'react'
import {connect} from 'react-redux'
import { MDBCarousel, MDBCarouselInner, MDBCarouselItem, MDBView, MDBMask } from
"mdbreact";
import {
    Card,  CardBody,
    CardTitle, CardSubtitle
  } from 'reactstrap';
import Axios from 'axios'
import { API_URL } from '../supports/Apiurl';
import Numeral from 'numeral'
import {BukanHome,IniHome} from './../redux/actions'
import { Link } from 'react-router-dom'
import SquareButton from '../components/button'
// import fFaCartPlus from 'react-icons/fa'
// import './../../public/images/'

class Home extends Component {
    state = { 
        photos:['./images/attractive-beautiful-beautiful-girl-beauty-458766.jpg', 
                './images/beautiful-birthday-blur-bouquet-318379.jpg',
                './images/makeupheader.jpg'],
        products:[]
     }

    componentDidMount(){
        this.props.IniHome()
        Axios.get(`${API_URL}/products?_expand=category&_limit=5`)
        .then((res)=>{
            this.setState({products:res.data})
            // console.log(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    componentWillUnmount=()=>{
        // console.log('ini unmount')
        this.props.BukanHome()
    }

    renderphoto=()=>{
        return this.state.photos.map((val, index)=>{
            return (
                <MDBCarouselItem key={index} itemId={index+1}>
                    <MDBView>
                        <div style={{width:'100', height:600}}>
                            <img
                                // className="d-block w-100"
                                src={val}
                                alt="First slide"
                                // height="700px"
                                width="100%"
                            />
                        </div>
                    <MDBMask overlay="black-light" />
                    </MDBView>
                </MDBCarouselItem>
            )
        })
    }

    renderProducts=()=>{
        return this.state.products.map((val,index)=>{
            return(
                <div key={index} className="p-4" style={{width:'20%'}}>
                    <div>
                        <Card className="text-center no-shadow" style={{fontSize:'13px'}}>
                            <div style={{height:191, width:'100%'}}>
                                <img src={val.image} width="100%" height="100%" alt=""/>
                                <div className="kotak-hitam">
                                    <Link to={`/productdetail/${val.id}`}>
                                    <button className="tombol-buynow">Product Detail</button>
                                    </Link>
                                </div>
                            </div>
                            <CardBody style={{height:120}}>
                                <div style={{fontSize:"12px"}} className="my-pink text-uppercase">{val.brand}</div>
                                <CardTitle style={{height:50}} className="mb-2">{val.name}</CardTitle>
                                <CardSubtitle>{'IDR '+Numeral(val.price).format(0.0)}</CardSubtitle>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            )
        })
    }

    render() { 
            return ( 
                <div>
                    <MDBCarousel
                        activeItem={1}
                        length={this.state.photos.length}
                        showControls={true}
                        showIndicators={true}
                        className="z-depth-1"
                    >
                        <MDBCarouselInner>
                            {this.renderphoto()}
                        </MDBCarouselInner>
                    </MDBCarousel>
                    <div> 
                        <div> 
                            <h3 className="text-center mt-5 text-uppercase"> BEST SELLER </h3>
                        </div>
                        <div className="d-flex px-5 ">
                            {this.renderProducts()}
                        </div>
                    </div>
                    <div className="m-3 text-center">
                        <Link to={`/productpage`}>
                            <SquareButton isfunction={false} text={"See all products"}/>
                        </Link>
                    </div>
                </div>
             );
        }
    }

const MapstatetoProps=({Auth})=>{
    return{
        islogin:Auth.islogin
    }

}

export default connect(MapstatetoProps,{BukanHome, IniHome}) (Home);