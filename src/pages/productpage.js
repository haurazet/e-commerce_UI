import React, {Component} from 'react'
import {
    Card, CardBody,
    CardTitle, CardSubtitle
  } from 'reactstrap';
import Axios from 'axios'
import { API_URL } from '../supports/Apiurl';
import Numeral from 'numeral'
import { Link } from 'react-router-dom'
import Search from '../components/search'


class Productpage extends Component {
    state = { 
        products:[],
        checkedItems: new Map(),
        currentfilter:[],
        keyword:'',
        isSearch:false,
        productfilter:[],
        selectedcategory:"All Categories",
        isSelectCategory:false
     }

    componentDidMount(){
        Axios.get(`${API_URL}/products?_expand=category`)
        .then((res)=>{
            this.setState({products:res.data})
            // console.log(res.data)
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderProducts=()=>{
        var produk = ''
        if(this.state.isSearch||this.state.isSelectCategory||this.state.selectedcategory!=="All Categories"?
            produk=this.state.productfilter:produk=this.state.products){
                return produk.map((val,index)=>{
                    return(
                        <div key={index} className="p-4 " style={{width:'22%'}}>
                            
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
    }

    dataOnChange=(e)=>{
        this.setState({[e.target.name]:e.target.value}, function() {
            this.setState({isSearch:true})
            var productfilterresult = this.state.products.filter((val)=>val.name.toLowerCase().includes(this.state.keyword.toLowerCase()))
            this.setState({productfilter:productfilterresult})
            this.renderProducts()
        })
        console.log(this.state.keyword)
    }

    onCategoryClick=(e)=>{
        this.setState({selectedcategory:e.target.value}, function(){
            this.setState({isSelectCategory:true})
            console.log(this.state.products)
            var productfilterresult = this.state.products.filter((val)=>val.category.name===this.state.selectedcategory)
            this.setState({productfilter:productfilterresult})
            console.log(this.state.selectedcategory)
        })
    }

    onCategoryClear=()=>{
        this.setState({isSelectCategory:false})
        this.setState({selectedcategory:"All Categories"})
    }

    handleChange(e) {
        const item = e.target.name;
        const isChecked = e.target.checked;
        console.log(this.state.checkedItems)
        console.log(this.state.products)
        this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
    }
    
    filterdata(){
        var selected=[]
        for (const a of this.state.checkedItems.entries()){
            var output =''
            if(a[1]==true){
                output=a[0]
            }
            selected.push(output)
            console.log(output)
        }
        console.log(selected)

        var result =[]
        selected.forEach(element => {
            output=[]
            result.push(...result, this.state.products.filter((val)=>val.category.name===element))
            // output.push(...result)
        });
          
        console.log(result)
    }

    render() { 
            return ( 
                <div className="p-5 mt-5">
                        <div className=""> 
                                <h3 className="text-center mt-5 text-uppercase"> all product </h3>
                        </div>
                    <div className="row mt-5 d-flex flex-wrap justify-content-center">
                        <div>
                        {/* <div className="col-md-2 py-4 px-2">
                            <Search />
                            <div className="greyborder">
                                <div className="mb-4">
                                    <div className="mb-1">Filter by Category</div>
                                    <div>
                                    <label key="Skincare">
                                        <input type='checkbox' name="Skincare" checked={this.state.checkedItems.get("skincare")} onChange={(e)=>this.handleChange(e)} />
                                        Skincare
                                    </label>
                                    </div>
                                    <div>
                                    <label key="Make Up">
                                        <input type='checkbox' name="Make Up" checked={this.state.checkedItems.get("makeup")} onChange={(e)=>this.handleChange(e)} />
                                        Make Up
                                    </label>
                                    </div>
                                    <div>
                                    <label key="Accessories">
                                        <input type='checkbox' name="Accessories" checked={this.state.checkedItems.get("accessories")} onChange={(e)=>this.handleChange(e)} />
                                        Accessories
                                    </label>
                                    </div>

                                    <button onClick={()=>this.filterdata()}>Filter</button> */}
{/*                                 
                            </div>
                        </div> */}
                        </div>

                        <div className="col-md-11"> 
                        <div>
                            <input className="form-control form-control-sm ml-3 mb-2 w-25" 
                                    name="keyword" 
                                    type="text" 
                                    placeholder="Search product..." 
                                    aria-label="Search" 
                                    onChange={this.dataOnChange}/>
                        </div>
                        <div className="ml-2 mb-2">
                            <button type="button" class="btn btn-outline-default waves-effect btn-sm" onClick={this.onCategoryClear}>All Categories</button>
                            <button type="button" class="btn btn-outline-default waves-effect btn-sm" value="Skincare" onClick={this.onCategoryClick}>Skincare</button>
                            <button type="button" class="btn btn-outline-default waves-effect btn-sm" value="Make Up" onClick={this.onCategoryClick}>Make Up</button>
                            <button type="button" class="btn btn-outline-default waves-effect btn-sm" value="Accessories" onClick={this.onCategoryClick}>Accessories</button>
                        </div>
                        <div className="ml-3" style={{fontSize:"13px"}}>Category: {this.state.selectedcategory}  </div>
                            <div className="d-flex flex-wrap justify-content-start">
                                {this.renderProducts()}
                            </div>
                        </div>
                    </div>
                </div>
             );
        }
    }

export default Productpage;