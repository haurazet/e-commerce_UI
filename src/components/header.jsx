import React, { Component } from "react";
import {
MDBNavbar,MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavbarToggler, MDBCollapse, 
MDBDropdown, MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem, MDBNavLink
} from "mdbreact";
import { connect}from "react-redux"
import {FaUserCircle, FaRoad} from "react-icons/fa"
import {BukanHome, IniHome, Getdata} from './../redux/actions'
import {FiShoppingCart} from "react-icons/fi"
import {FiHeart} from "react-icons/fi"
import {FiSettings} from "react-icons/fi"
import {FiLogOut} from "react-icons/fi"
import {FaRegListAlt} from "react-icons/fa"
import Search from './search'
import {Link} from 'react-router-dom'



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
  localStorage.removeItem('token')
}

AuthHeader = ({ islogin }) => {
  if (islogin) {
    return (<Header />);
  }
  return (<div></div>);
}

componentDidMount=()=>{
  console.log(this.props.User)
  this.props.Getdata() 
}


render() {
  return (
    <div >
    
      <MDBNavbar 
           scrolling 
           fixed='top' 
           expand="md" 
           color="white" 
           className='px-5'
          >
        <MDBNavbarBrand href='/'>
          <strong className="black-text fontlogo">
            <span style={{color:'#f07474'}} className='fontlogo'>s</span>
            agitta shop</strong>
        </MDBNavbarBrand>
        <MDBNavbarToggler onClick={this.toggleCollapse} />
        <MDBCollapse id="navbarCollapse3" className="navbar-text" isOpen={this.state.isOpen} navbar>
          <MDBNavbarNav  right>
                <MDBNavItem className="p-1 " style={{height:"40px"}}>
                  <Search />
                </MDBNavItem>
                <MDBNavItem>
                    {
                      this.props.User.role===0?
                      <MDBNavLink className="black-text" to='/manageorder'>
                      ORDER
                      </MDBNavLink>
                      :
                      null
                    }
                </MDBNavItem>
                <MDBNavItem>
                    {
                      this.props.User.role===0?
                      <MDBNavLink className="black-text" to='/manageadmin'>
                      PRODUCT
                      </MDBNavLink>
                      :
                      null
                    }
                </MDBNavItem>
                <MDBNavItem>
                    {
                      this.props.User.role===0?
                      <MDBNavLink className="black-text" to='/managediscount'>
                      DISCOUNT
                      </MDBNavLink>
                      :
                      null
                    }
                </MDBNavItem>
                <MDBNavItem>
                  {
                    this.props.User.islogin&&this.props.User.role===1?
                    <MDBNavLink to='/cart' style={{color:"black"}}>
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
                      <MDBNavLink className="black-text" to="/login">
                        LOGIN
                      </MDBNavLink>
                    }
                </MDBNavItem>
               
                <MDBNavItem>
                  {
                    this.props.User.username?
                    <MDBDropdown className="black-text">
                        <MDBDropdownToggle nav caret className="black-text text-uppercase" >
                          <FaUserCircle style={{color:'#f07474'}}/> HI, {this.props.User.username} !
                        </MDBDropdownToggle>
                          {this.props.User.role===1?
                            <MDBDropdownMenu className="right black-text">
                              <MDBDropdownItem href="#!"> <FiHeart /> Wishlist</MDBDropdownItem>
                              <MDBDropdownItem href={`/transactionssummary/${this.props.User.id}`}> <FaRegListAlt /> Transaction History</MDBDropdownItem>
                              <MDBDropdownItem href="/accountsetting"> <FiSettings /> Account Setting</MDBDropdownItem>
                              <MDBDropdownItem href="/" onClick={this.logout}><FiLogOut /> Logout</MDBDropdownItem>
                            </MDBDropdownMenu>
                          :
                            <MDBDropdownMenu className="right black-text">
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
      </div>
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