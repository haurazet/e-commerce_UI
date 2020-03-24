import React, { Component } from "react";
import {
MDBNavbar,MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavbarToggler, MDBCollapse, 
MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBNavLink
} from "mdbreact";
// import { BrowserRouter as Router } from 'react-router-dom';;
// import Auth from "../redux/reducers"
import { connect}from "react-redux"
import {FaUserCircle, FaRoad} from "react-icons/fa"
import {BukanHome, IniHome, Getdata} from './../redux/actions'
import { NavLink } from "reactstrap";
import {FiShoppingCart} from "react-icons/fi"
import {FiHeart} from "react-icons/fi"
import {FiSettings} from "react-icons/fi"
import {FiLogOut} from "react-icons/fi"
import {FaRegListAlt} from "react-icons/fa"
import Search from './search'
import { Badge, Button } from 'reactstrap';
import {API_URL} from '../supports/Apiurl'
import Axios from 'axios'
import Cart from '../pages/cart'



class Header extends Component {
state = {
  isOpen: false,
  cartbadge:0
};

toggleCollapse = () => {
  this.setState({ isOpen: !this.state.isOpen });
}

logout = () => {
  localStorage.removeItem('iduser')
}

AuthHeader = ({ islogin }) => {
  if (islogin) {
    return (<Header />);
  }
  return (<div></div>);
}

componentDidMount=()=>{
  this.props.Getdata()
}


render() {
  return (
      <MDBNavbar className="no-shadow " 
          transparent={this.props.Header} scrolling fixed='top' expand="md" color="my-light-blue">
        <MDBNavbarBrand href='/'>
          <strong className="white-text fontlogo">sagitta shop</strong>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={this.toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" className="navbar-text" isOpen={this.state.isOpen} navbar>
          <MDBNavbarNav  right>
                <MDBNavItem className="p-1 " style={{height:"40px"}}>
                  <Search />
                </MDBNavItem>
                <MDBNavItem>
                    {
                      this.props.User.role==='admin'?
                      <MDBNavLink className="white-text" to='/manageorder'>
                      ORDER
                      </MDBNavLink>
                      :
                      null
                    }
                </MDBNavItem>
                <MDBNavItem>
                    {
                      this.props.User.role==='admin'?
                      <MDBNavLink className="white-text" to='/manageadmin'>
                      PRODUCT
                      </MDBNavLink>
                      :
                      null
                    }
                </MDBNavItem>
                <MDBNavItem>
                  {
                    this.props.User.islogin&&this.props.User.role==='user'?
                    <MDBNavLink to='/cart' style={{color:"white"}}>
                      <div className='quick-btn'>
                        <FiShoppingCart/> 
                        {this.props.Qty!==0?<span className="badge badge-danger label ml-2 text-center">{this.props.Qty}</span>
                        :
                        null}
                      </div>
                    </MDBNavLink>
                    :
                    null
                  }
                </MDBNavItem>
                <MDBNavItem>
                    {
                      this.props.User.islogin?
                      null
                      :
                      <MDBNavLink className="white-text" to="/login">
                        LOGIN
                      </MDBNavLink>
                    }
                </MDBNavItem>
               
                <MDBNavItem>
                  {
                    this.props.User.username?
                    <MDBDropdown className="white-text">
                        <MDBDropdownToggle nav caret className="white-text text-uppercase" >
                          <FaUserCircle/> HI, {this.props.User.username} !
                        </MDBDropdownToggle>
                          {this.props.User.role==='user'?
                            <MDBDropdownMenu className="right white-text">
                              <MDBDropdownItem href="#!"> <FiHeart /> Wishlist</MDBDropdownItem>
                              <MDBDropdownItem href={`/transactionssummary/${this.props.User.id}`}> <FaRegListAlt /> Transaction History</MDBDropdownItem>
                              <MDBDropdownItem href="/accountsetting"> <FiSettings /> Account Setting</MDBDropdownItem>
                              <MDBDropdownItem href="/" onClick={this.logout}><FiLogOut /> Logout</MDBDropdownItem>
                            </MDBDropdownMenu>
                          :
                            <MDBDropdownMenu className="right white-text">
                              <MDBDropdownItem href="/accountsetting"> <FiSettings /> Account Setting</MDBDropdownItem>
                              <MDBDropdownItem href="/" onClick={this.logout}><FiLogOut /> Logout</MDBDropdownItem>
                            </MDBDropdownMenu>
                        }
                    </MDBDropdown>
                    :
                    null
                  }
                </MDBNavItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBNavbar>
    );
  }
}

const MapstatetoProps=(state)=>{
  return{
    User:state.Auth,
    Header:state.Header.ishome,
    Qty:state.Cart.qty
  }
}

export default connect(MapstatetoProps, {IniHome, BukanHome, Getdata})(Header);