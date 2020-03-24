import React, { Component }from 'react';
import {  MDBIcon } from "mdbreact";
import {
	withRouter
} from 'react-router-dom';

class Search extends Component {

    state={
        keyword:''
    }

    dataOnChange=(e)=>{
        this.setState({[e.target.name]:e.target.value})
        console.log(this.state.keyword)
    }

    onSubmit =(e)=>{
        e.preventDefault()
        if(this.state.keyword!==''){
            return(
                this.props.history.push({
                    pathname: `/searchpage/search?name=${this.state.keyword}`,
                })
            )
        }
    }

    render(){
        return(
        // <Link to={`/productpage/${keyword}`} >
            <form className="form-inline d-flex justify-content-end" onSubmit={this.onSubmit}> 
                <MDBIcon icon="search" />
                <input className="form-control form-control-sm ml-3 w-75" name="keyword" type="text" placeholder="Search product..." aria-label="Search" onChange={this.dataOnChange} />
            </form>
        // </Link>
        )
        }
}

export default withRouter (Search)