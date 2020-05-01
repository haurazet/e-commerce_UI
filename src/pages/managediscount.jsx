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
        flashsales:[],
        isModaladdopen:false,
        isModaleditopen:false,
        indexedit:0,
        indexdelete:-1,
    }
    
    async componentDidMount(){
        try {
            var res=await Axios.get(`${API_URL}/flashsale/getallflashsale`)
            this.setState({flashsales:res.data})
            console.log(res.data)
        } catch (error){
            console.log(error)
        }
    }

    toggleadd=()=>{
        this.setState({isModaladdopen:!this.state.isModaladdopen})
    }

    toggleedit=()=>{
        this.setState({isModaleditopen:!this.state.isModaleditopen})
    }

    onSaveaddDataClick=()=>{
        var formdata=new FormData()
        var namaadd=this.refs.namaadd.value
        var brandadd=this.refs.brandadd.value
        var stockadd=parseInt(this.refs.stockadd.value)
        var categoryadd=parseInt(this.refs.categoryadd.value)
        var price=this.refs.priceadd.getMaskedValue()
        var priceadd=parseInt(price.replace(/[^0-9-]+/g,""))
        var descriptionadd=this.refs.descriptionadd.value
        var obj={
            name:namaadd,
            brand:brandadd,
            stock:stockadd,
            categoryId:categoryadd,
            price:priceadd,
            description:descriptionadd
        }
        var token=this.props.User.token
        var Headers={
            headers:
            {
                'Content-Type':'multipart/form-data',
                'Authorization':`Bearer ${token}`
            },
        }
        formdata.append('image',this.state.addimagefile)
        formdata.append('data',JSON.stringify(obj)) // json.stringify mengubah objek menjadi json
        Axios.post(`${API_URL}/product/addprod`,formdata,Headers)
        .then((res)=>{
            console.log(res.data)
            this.setState({flashsales:res.data,isModaladdopen:false, addimagefile:undefined})
        }).catch((err)=>{
            console.log(err)
        })
    }

    deleteconfirm=(index,id)=>{
        Swal.fire({
            title: `Are you sure want to delete ${this.state.flashsales[index].name}?`,
            text: "You won't be able to revert this!",
            imageUrl: `${this.state.flashsales[index].image}`,
            imageWidth: '150px',
            imageHeight:'150px',
            width: '400px',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            if (result.value) {
                Axios.delete(`${API_URL}/product/deleteprod/${id}`)
              .then((res)=>{
                  Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                ).then((result)=>{
                  if(result.value){
                      this.setState({flashsales:res.data})
                  }
              })
                }).catch((err)=>{
                    console.log(err)
                })
            }
        })
    }

    onsaveEditClick=()=>{
        var formdata=new FormData()
        var namaedit=this.refs.namaedit.value
        var brandedit=this.refs.brandedit.value
        var stockedit=parseInt(this.refs.stockedit.value)
        var categoryedit=parseInt(this.refs.categoryedit.value)
        var priceedit=parseInt(this.refs.priceedit.value)

        // var price=this.refs.priceedit.getMaskedValue()
        // var priceedit=parseInt(price.replace(/[^0-9-]+/g,""))
        var descriptionedit=this.refs.descriptionedit.value
        var obj={
            name:namaedit,
            brand:brandedit,
            stock:stockedit,
            categoryId:categoryedit,
            price:priceedit,
            description:descriptionedit
        }
        var token=this.props.User.token
        var Headers={
            headers:
            {
                'Content-Type':'multipart/form-data',
                'Authorization':`Bearer ${token}`
            },
        }
        formdata.append('image',this.state.editimagefile)
        formdata.append('data',JSON.stringify(obj)) // json.stringify mengubah objek menjadi json
        var id=this.state.flashsales[this.state.indexedit].id
        Axios.put(`${API_URL}/product/editprod/${id}`,formdata,Headers)
        .then((res)=>{
            console.log(res.data)
            this.setState({flashsales:res.data,isModaleditopen:false})
        }).catch((err)=>{
            console.log(err)
        })
    }

    onEditClick=(index)=>{
        this.setState({indexedit:index,isModaleditopen:true})
    }
    
    renderFlashsale=()=>{
        const {flashsales} =this.state
        return flashsales.map((val,index)=>{
            return(
                <tr key={index}>
                    <th scope="row">{index+1}</th>
                    <td>{val.name}</td>
                    <td className='text-center'>{val.brand}</td>
                    <td className='text-center'><img src={API_URL+val.image} alt={val.name} width='150' height='150'/></td>
                    <td className='text-center'>{val.stock}</td>
                    <td className='text-center'>{val.catnama}</td>
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
        const {indexedit,flashsales}=this.state 
        if(this.props.User.role===0){
            return ( 
            <div className="m-5 p-5">
            
                <Modal isOpen={this.state.isModaladdopen} toggle={this.toggleadd} > 
                <ModalHeader toggle={this.toggleadd}>Add Flashsale</ModalHeader>
                <ModalBody>
                        <div className='mt-2'>Start Date</div>
                        <input type="date" ref='namaadd' placeholder='Product Name' className='form-control mt-2'/>
                        <input type="time" ref='brandadd' placeholder='Brand Name' className='form-control mt-2'/>
                        <div className='mt-2'>End Date</div>
                        <input type="date" ref='namaadd' placeholder='Product Name' className='form-control mt-2'/>
                        <input type="time" ref='brandadd' placeholder='Brand Name' className='form-control mt-2'/>
                        <div>
                            
                        </div>
                        
                        
                </ModalBody>
                <ModalFooter>
                    <Button className="btn btn-primary btn-sm " onClick={this.onSaveaddDataClick}>Save</Button>{' '}
                    <Button className="btn btn-primary btn-sm " onClick={this.toggleadd}>Cancel</Button>
                </ModalFooter>
                </Modal>
                {
                flashsales.length?
                <Modal isOpen={this.state.isModaleditopen} toggle={this.toggleedit} > 
                <ModalHeader toggle={this.toggleedit}>Edit {flashsales[indexedit].name}</ModalHeader>
                <ModalBody style={{fontSize:'14px'}}>
                    <form className="needs-validation" novalidate>
                        <div>
                            <label> Product Name</label>
                            <input type="text" ref='namaedit' defaultValue={flashsales[indexedit].name}  className='form-control mb-2' required/>
                        </div>
                        <div>
                            <label> Brand</label>
                            <input type="text" ref='brandedit' defaultValue={flashsales[indexedit].brand}  className='form-control mb-2' required/>
                        </div>
                        <div>
                            <label> Image </label>
                            <div className="card mb-2" style={{width: '150px',verticalAlign:'bottom'}}>

                                <img className="card-img-top" src={flashsales[indexedit].image} alt="Card"></img>
                            </div>
                            </div>
                            <input type="file" ref='imageedit' onChange={this.oneditimagefileChange}  className='form-control mb-2' required/>
                        <div>
                            <label> Stock</label>
                            <input type="number" ref='stockedit' defaultValue={flashsales[indexedit].stock}  className='form-control mb-2' required/>
                        </div>
                        <div>
                            <label > Category</label>
                            <select ref='categoryedit' defaultValue={flashsales[indexedit].categoryId} className='form-control mb-2' required> 
                                <option value="" hidden > Choose Category..</option>
                                {this.rendercategorytoadd()}
                            </select>
                        </div>
                        <div>
                            <label> Price </label>
                            <input type="number" ref='priceedit' placeholder='Price' defaultValue={flashsales[indexedit].price} className='form-control mb-2' required />
                        </div>
                        <div>
                            <label>Description</label>
                            <textarea cols="20" rows="5" ref='descriptionedit' className="form-control mb-2" defaultValue={flashsales[indexedit].description} ></textarea>
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
                <div> 
                    <h3 className="text-center my-5 text-uppercase"> Manage Flashsale </h3>
                </div>
                <button style={{borderRadius:'30px'}} className="btn double-light-blue btn-sm mt-2 white-text" onClick={this.toggleadd}><IoMdAdd/> Add Flashsale</button>
                    <Table striped  >
                        <thead className='text-center font-weight-bold'>
                        <tr>
                            <th style={{width: '5%'}}>ID</th>
                            <th style={{width: '15%'}}>Total Product</th>
                            <th style={{width: '10%'}}>Status</th>
                            <th style={{width: 'auto'}}>Start Date</th>
                            <th style={{width: '5%'}}>Expired Date</th>
                            <th style={{width: '10%'}}>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.renderFlashsale()}
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