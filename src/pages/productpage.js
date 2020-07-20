import React, {Component, Fragment} from 'react'
import {
    Card, CardBody,
    CardTitle, CardSubtitle, Spinner
  } from 'reactstrap';
import { MDBPagination, MDBPageItem, MDBPageNav, MDBCol, MDBRow ,MDBBtn } from "mdbreact";
import Axios from 'axios'
import { API_URL } from '../supports/Apiurl';
import Numeral from 'numeral'
import { Link } from 'react-router-dom'


class Productpage extends Component {
    state = {
        isLoading:false,
        products:[],
        page:0,
        totalproduct:0,
        category:[],
        activecategory:0
     }

    componentDidMount(){
        console.log('masuk componentDidMount')
        Axios.get(`${API_URL}/product/category`)
        .then((res)=>{
            this.setState({category:res.data})
        })
        this.getData()
    }

    getData=(search,filter)=>{
        Axios.get(  search?`${API_URL}/product/totalproduct?search=${search}`:
                    filter?`${API_URL}/product/totalproduct?filter=${filter}`:
                            `${API_URL}/product/totalproduct`,{}
                    ).then((res)=>{
                    this.setState({totalproduct:res.data.total})
                    Axios.get(  search?`${API_URL}/product/getproductuser?search=${search}&page=${this.state.page}`:
                                filter?`${API_URL}/product/getproductuser?filter=${filter}&page=${this.state.page}`:
                                        `${API_URL}/product/getproductuser?page=${this.state.page}`
                                ).then((res1)=>{
                                window.scrollTo(0,0)
                                this.setState({products:res1.data, isLoading:false})
                                this.rendercategory()
                            }).catch((err)=>{
                                console.log(err)
                            })
                }).catch((err)=>{
                    console.log(err)
                })
    }

    getpaginationdata=(val)=>{
        this.setState({page:val*8, isLoading:true}, function(){
            this.getData()
        })
    }

    renderProducts=()=>{
        const {isLoading,products}=this.state
        if(isLoading){
            return(
                <div className='tocenter mt-3'>
                    <Spinner style={{ width: '3rem', height: '3rem' }} />{' '}
                </div>
            )
        }
        return products.map((val,index)=>{
            return(
                <div key={index} className="p-4 " style={{width:'22%'}}>
                    <Card className="text-center no-shadow " style={{fontSize:'13px',}}>
                        <div style={{height:200, width:'100%'}}>
                            <img src={API_URL+val.image} width="100%" height="100%" alt=""/>
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

    renderpagination=()=>{ 
        console.log('masuk pagination')
        var totalpage = Math.ceil(this.state.totalproduct/8)
        var arr=[]
        for ( var i = 0; i < totalpage; i++){
            arr.push(i)
        }
        return arr.map((val,index)=>{
            return(
                <div key={index}>
                    <MDBPageItem active={this.state.page/8===val} >
                        <MDBPageNav onClick={()=>this.getpaginationdata(val)}>{val+1}</MDBPageNav>
                    </MDBPageItem>
                </div>
            )
        })
    }

    rendercategory=()=>{
        const {category,activecategory}=this.state
        return category.map((val,index)=>{
            return(
                <div key={index}>
                    <MDBBtn 
                        color="grey" 
                        size='sm' 
                        value={val.id} 
                        onClick={this.onCategoryClick}
                        active={parseInt(activecategory)===val.id}
                        >{val.name}</MDBBtn>
                </div>
            )
        })
    }

    dataOnChange=(e)=>{
        var search=e.target.value
        this.setState({page:0})
        this.getData(search)
    }

    onCategoryClick=(e)=>{
        var filter=e.target.value
        this.setState({page:0,activecategory:filter})
        this.rendercategory()
        this.getData(null,filter)
      
    }

    onCategoryClear=()=>{
        this.setState({page:0,activecategory:0})
        this.getData()
    }

    render() { 
        const {page,totalproduct,activecategory}=this.state
            return ( 
                <div className="p-5 mt-5">
                    
                    {/* ================= TITLE, SEARCH and FILTER ================= */}

                    <h3 className="text-center mt-5 text-uppercase"> all product </h3>
                    <div className="row mt-5 d-flex flex-wrap justify-content-center">
                        <div className="col-md-11"> 
                        <div className="d-flex justify-content-center">
                            <input className="form-control form-control-sm  mb-2 inputwidth" 
                                    name="search" 
                                    type="text" 
                                    placeholder="Search product..." 
                                    aria-label="Search" 
                                    onChange={this.dataOnChange}/>
                        </div>
                        <div className=" mb-2 d-flex justify-content-center">
                             <MDBBtn active={activecategory===0} color="grey" size='sm' onClick={this.onCategoryClear}>All Categories</MDBBtn>
                             {this.rendercategory()}
                        </div>
                        <div className="ml-3 text-center" style={{fontSize:"13px"}}> Total product: {totalproduct} </div>
                        
                        

                        {/* ================= PRODUCT ================= */}

                        <div className="pl-5 d-flex flex-wrap justify-content-start widthmaxcontent">
                            {this.renderProducts()}
                        </div>

                        {/* ================= PAGINATION ================= */}
                        <MDBRow>
                            <MDBCol>
                                <MDBPagination className="mb-5 float-right" color='red'>
                                <MDBPageItem disabled={this.state.page===0} onClick={()=>this.getpaginationdata((page/8)-1)}>
                                    <MDBPageNav aria-label="Previous">
                                    <span aria-hidden="true">Previous</span>
                                    </MDBPageNav>
                                </MDBPageItem>
                                    {this.renderpagination()}
                                <MDBPageItem 
                                    disabled={Math.ceil(totalproduct/8)===(page/8)+1} 
                                    onClick={()=>this.getpaginationdata((page/8)+1)}>
                                    <MDBPageNav aria-label="Previous">
                                    <span aria-hidden="true">Next</span>
                                    </MDBPageNav>
                                </MDBPageItem>
                                </MDBPagination>
                            </MDBCol>
                            </MDBRow>

                        </div>
                    </div>
                </div>
             );
        }
    }

export default Productpage;