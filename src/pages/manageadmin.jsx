import React, { Component } from 'react';
import { Table } from 'reactstrap';
import Axios from 'axios';
import {API_URL} from '../supports/Apiurl'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import CurrencyInput from 'react-currency-input';
import {Redirect} from 'react-router-dom'
import Swal from 'sweetalert2'
import {connect} from 'react-redux'
import { FaRegEdit } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoMdAdd } from 'react-icons/io';




class ManageAdmin extends Component {
    state = { 
        products:[],
        isModaladdOpen:false,
        isModaleditopen:false,
        indexedit:0,
        indexdelete:-1,
        categories:[],
        isEditImage:false
    }
    
    componentDidMount(){
        Axios.get(`${API_URL}/products?_expand=category`)
        .then((res)=>{
            this.setState({products:res.data})
            Axios.get(`${API_URL}/categories`)
            .then((categories)=>{
                this.setState({products:res.data,categories:categories.data})
            })
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    
    toggleadd=()=>{
        this.setState({isModaladdopen:!this.state.isModaladdopen})
    }

    toggleedit=()=>{
        this.setState({isModaleditopen:!this.state.isModaleditopen})
    }

    toggleEditImage=()=>{
        this.setState({isEditImage:!this.state.isEditImage})
    }

    onSaveaddDataClick=()=>{
        var namaadd=this.refs.namaadd.value
        var brandadd=this.refs.brandadd.value
        var imageadd=this.refs.imageadd.value
        var stockadd=parseInt(this.refs.stockadd.value)
        var categoryadd=parseInt(this.refs.categoryadd.value)
        var price=this.refs.priceadd.getMaskedValue()
        var priceadd=parseInt(price.replace(/[^0-9-]+/g,""))
        var descriptionadd=this.refs.descriptionadd.value
        var obj={
            name:namaadd,
            brand:brandadd,
            image:imageadd,
            stock:stockadd,
            categoryId:categoryadd,
            price:priceadd,
            description:descriptionadd
        }
        Axios.post(`${API_URL}/products`,obj)
        .then((res)=>{
            console.log(res.data)
            Axios.get(`${API_URL}/products?_expand=category`)
            .then((resakhir)=>{
                this.setState({products:resakhir.data, isModaladdopen:false})
            }).catch((err)=>{
                console.log(err)
            })
        })
    }

    deleteconfirm=(index,id)=>{
        Swal.fire({
            title: `Are you sure want to delete ${this.state.products[index].name}?`,
            text: "You won't be able to revert this!",
            imageUrl: `${this.state.products[index].image}`,
            imageWidth: '150px',
            imageHeight:'150px',
            width: '400px',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                Axios.delete(`${API_URL}/products/${id}`)
              .then((res)=>{
                  Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                ).then((result)=>{
                  if(result.value){
                      Axios.get(`${API_URL}/products?_expand=category`)
                      .then((res1)=>{
                          this.setState({products:res1.data})
                      })
                  }
              })
                }).catch((err)=>{
                    console.log(err)
                })
            }
        })
    }

    onsaveEditClick=()=>{
        var namaedit=this.refs.namaedit.value
        var brandedit=this.refs.brandedit.value
        var imageedit=this.refs.imageedit.value
        var stockedit=parseInt(this.refs.stockedit.value)
        var categoryedit=parseInt(this.refs.categoryedit.value)
        var priceedit=parseInt(this.refs.priceedit.value)

        // var price=this.refs.priceedit.getMaskedValue()
        // var priceedit=parseInt(price.replace(/[^0-9-]+/g,""))
        var descriptionedit=this.refs.descriptionedit.value
        var obj={
            name:namaedit,
            brand:brandedit,
            image:imageedit,
            stock:stockedit,
            categoryId:categoryedit,
            price:priceedit,
            description:descriptionedit
        }
        var id=this.state.products[this.state.indexedit].id
        console.log(obj,id)
        Axios.put(`${API_URL}/products/${id}`,obj)
        .then((res)=>{
            // console.log(res.data)
            Axios.get(`${API_URL}/products?_expand=category`)
            .then((resakhir)=>{
                this.setState({products:resakhir.data,isModaleditopen:false})
            }).catch((err)=>{
                console.log(err)
            })
        })

    }

    onEditClick=(index)=>{
        this.setState({indexedit:index,isModaleditopen:true})
        console.log(this.state.isModaladdOpen)
    }

    rendercategorytoadd=()=>{
        return this.state.categories.map((val,index)=>{
            return <option key={index} value={val.id}>{val.name}</option>
        })
    }

    
    renderProduct=()=>{
        const {products,} =this.state
        return products.map((val,index)=>{
            return(
                <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{val.name}</td>
                    <td className='text-center'>{val.brand}</td>
                    <td className='text-center'><img src={val.image} alt={val.name} width='150' height='150'/></td>
                    <td className='text-center'>{val.stock}</td>
                    <td className='text-center'>{val.category.name}</td>
                    <td className='text-center'>{val.price}</td>
                    <td>{val.description}</td>
                    <td className="text-center align-middle">
                        <button style={{width:'20px', fontSize:'1.5em', color:'gray'}} className="btn btn-link hoverblack px-0 m-3" onClick={()=>this.onEditClick(index)}><FaRegEdit/></button>
                        <button style={{width:'20px', fontSize:'1.5em', color:'gray'}} className="btn btn-link hoverred px-0 m-3" onClick={()=>this.deleteconfirm(index,val.id)}><AiOutlineDelete/></button>
                    </td>
                </tr>
            )
        })
    }


    render() { 
        const {indexedit,products}=this.state 
        if(this.props.User.role==='admin'){
            return ( 
            <div className="m-5 p-5">
            
                <Modal isOpen={this.state.isModaladdopen} toggle={this.toggleadd} > 
                <ModalHeader toggle={this.toggleadd}>Add Data</ModalHeader>
                <ModalBody>
                        <input type="text" ref='namaadd' placeholder='Product Name' className='form-control mt-2'/>
                        <input type="text" ref='brandadd' placeholder='Brand Name' className='form-control mt-2'/>
                        <input type="text" ref='imageadd' placeholder='Image URL' className='form-control mt-2'/>
                        <input type="number" ref='stockadd' placeholder='Total Stock' className='form-control mt-2'/>
                        <select ref='categoryadd' className='form-control mt-2'> 
                            <option value="" hidden > Choose Category..</option>
                            {this.rendercategorytoadd()}
                        </select>
                        <CurrencyInput  ref='priceadd' placeholder='Price' prefix={'IDR '} className='form-control mt-2' precision="3"  />
                        {/* <input type="number" ref='priceadd' placeholder='Price' prefix={'Rp '} /> */}
                        <textarea cols="20" rows="5" ref='descriptionadd' className="form-control mt-2" placeholder="Description"></textarea>
                        
                </ModalBody>
                <ModalFooter>
                    <Button className="btn btn-primary btn-sm " onClick={this.onSaveaddDataClick}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggleadd}>Cancel</Button>
                </ModalFooter>
                </Modal>
                {
                products.length?
                <Modal isOpen={this.state.isModaleditopen} toggle={this.toggleedit} > 
                <ModalHeader toggle={this.toggleedit}>Edit {products[indexedit].name}</ModalHeader>
                <ModalBody style={{fontSize:'14px'}}>
                    <form className="needs-validation" novalidate>
                        <div>
                            <label> Product Name</label>
                            <input type="text" ref='namaedit' defaultValue={products[indexedit].name}  className='form-control mb-2' required/>
                        </div>
                        <div>
                            <label> Brand</label>
                            <input type="text" ref='brandedit' defaultValue={products[indexedit].brand}  className='form-control mb-2' required/>
                        </div>
                        <div>
                            <label> Image </label>
                            <div className="card mb-2" style={{width: '150px',verticalAlign:'bottom'}}>
                                <img className="card-img-top" src={products[indexedit].image} alt="Card"></img>
                                {/* <div className="card-img-overlay text-center mt-5 ml-0 pt-10"> */}
                                {/* <Button className="card-link m-0 p-1" color="secondary" size="sm" onClick={this.toggleEditImage}>Edit Image</Button>{' '}
                                    <a className="card-link">Edit Image</a> */}
                                </div>
                            </div>
                            <input type="text" ref='imageedit' defaultValue={products[indexedit].image}  className='form-control mb-2' required/>
                            {/* {isEditImage?
                            <input type="text" ref='imageedit' defaultValue={products[indexedit].image}  className='form-control mb-2' required/>
                            :
                            null
                            } */}
                        {/* </div> */}
                        <div>
                            <label> Stock</label>
                            <input type="number" ref='stockedit' defaultValue={products[indexedit].stock}  className='form-control mb-2' required/>
                        </div>
                        <div>
                            <label > Category</label>
                            <select ref='categoryedit' defaultValue={products[indexedit].categoryId} className='form-control mb-2' required> 
                                <option value="" hidden > Choose Category..</option>
                                {this.rendercategorytoadd()}
                            </select>
                        </div>
                        <div>
                            <label> Price </label>
                            {/* <CurrencyInput  ref='priceedit' defaultValue={products[indexedit].price}  prefix={'IDR '} className='form-control mb-2' precision="3" required /> */}
                            <input type="number" ref='priceedit' placeholder='Price' defaultValue={products[indexedit].price} className='form-control mb-2' required />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea cols="20" rows="5" ref='descriptionedit' className="form-control mb-2" defaultValue={products[indexedit].description} ></textarea>
                        </div>
                        </form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.onsaveEditClick}>Save</Button>{' '}
                    <Button color="secondary" onClick={this.toggleedit}>Cancel</Button>
                </ModalFooter>
                </Modal>
                :
                null
                }
                <h4  className="mt-4 ml-2">Product List</h4>
                <button style={{borderRadius:'30px'}} className="btn double-light-blue btn-sm mt-2 white-text" onClick={this.toggleadd}><IoMdAdd/> Add Product</button>
                    <Table striped  >
                        <thead className='text-center font-weight-bold'>
                        <tr>
                            <th style={{width: '5%'}}>No</th>
                            <th style={{width: '15%'}}>Name</th>
                            <th style={{width: '10%'}}>Brand</th>
                            <th style={{width: 'auto'}}>Image</th>
                            <th style={{width: '5%'}}>Stock</th>
                            <th style={{width: '5%'}}>Category</th>
                            <th style={{width: '10%'}}>Price</th>
                            <th style={{width: '25%'}}>Description</th>
                            <th style={{width: '10%'}}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderProduct()}
                        </tbody>
                    </Table> 
            </div>)
        }else{
            return(
                <Redirect to='/hayongapain'/>
            )
        }
        

    }
}
 
const MapstatetoProps=(state)=>{
    return{
      User:state.Auth
    }
  }
export default connect (MapstatetoProps)(ManageAdmin);