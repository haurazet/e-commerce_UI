import React from "react";
import { MDBCol, MDBContainer, MDBRow, MDBFooter, MDBIcon } from "mdbreact";
import {FiInstagram} from "react-icons/fi"
import {FaWhatsapp, FaShoppingBag} from "react-icons/fa"

const FooterPage = () => {
  return (
    <MDBFooter color="grey lighten-5" className="font-small pt-5 mt-4" >
      <MDBContainer fluid className="text-center text-md-left black-text px-5" style={{height:"50vh", lineHeight:'1.6em'}}>
        <MDBRow className="d-flex justify-content-between">
          <MDBCol md="5">
            <h5 className="title"><strong className="black-text fontlogo p-3">
            <span style={{color:'#f07474'}} className='fontlogo'>s</span>
            agitta shop</strong></h5> 
            <p className="p-3"> 
              Indonesia's most popular beauty e-commerce. We provide your beauty needs from head to toe with 100% original brands.
            </p>
            <div className='d-flex col-3 justify-content-between'>
            <FiInstagram size={20}/>
            <FaWhatsapp size={20}/>
            <FaShoppingBag size={20}/>
            </div>
          </MDBCol>
          <MDBCol md="3">
            <h5 className="title">Information</h5>
            <ul className='text-uppercase' style={{lineHeight:'2.6'}}>
              <li className="list-unstyled ">
                <a href="#!" className="text-dark">About Us</a>
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-dark">Shopping Process</a>
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-dark">Shipping Rate</a>
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-dark">Our Policy</a>
              </li>
            </ul>
          </MDBCol>
          <MDBCol md="3">
            <h5 className="title">Customer Care</h5>
            <ul className='text-uppercase' style={{lineHeight:'2.6'}}>
              <li className="list-unstyled">
                <a href="#!" className="text-dark">Contact Us</a>
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-dark">Transaction Info</a>
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-dark">Return Product</a>
              </li>
              <li className="list-unstyled">
                <a href="#!" className="text-dark">Product Request</a>
              </li>
            </ul>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <div className="footer-copyright text-center py-3 text-dark " style={{backgroundColor:'#fce4ec'}}>
        <MDBContainer fluid >
          &copy; {new Date().getFullYear()} Copyright: <a className="text-dark" href="/"> sagittashop.com </a>
        </MDBContainer>
      </div>
    </MDBFooter>
  );
}

export default FooterPage;