import React, { useState } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col } from 'reactstrap';
import classnames from 'classnames';
// import ShippingForm from '../components/shippingform'
import ChangePassword from '../components/changepassword';
import { connect}from "react-redux"



const AccountSetting = (props)=>{

    console.log(props.User)
    console.log(props.User.password)

    const [activeTab, setActiveTab] = useState('1');

    const toggle = tab => {
      if(activeTab !== tab) setActiveTab(tab);
    }

    const shippinginfo=()=>{
        if(props.User.address===""){
            return (
                <div>
                    <div>You don't have any address yet</div>
                    <Button>Add address</Button>
                </div>
            )
        }else{
            return props.User.address.map((val,index)=>{
                return(
                    <div className="row mt-3">
                    <div className="col-md-7">
                        <div key={index}>
                            <div>{val.name}</div>
                            <div>{val.phone}</div>
                            <div>{val.street}</div>
                            <div>{val.city} {val.state} {val.zip}</div>
                        </div>
                        </div>
                        <div className="col-md-4 m-0 p-0">
                            <div className="btn btn-link m-0 p-0 blue-text text-capitalize">
                                edit    
                            </div>
                        </div>
                    </div>

                    
                )
            })
        }
    }

    return (
        <div className="m-5 p-5">
            <h5 className="my-5 "> Account Setting</h5>
            <div>
                <Nav tabs>
                    <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '1' })}
                        onClick={() => { toggle('1'); }}
                    >
                        Shipping Address
                    </NavLink>
                    </NavItem>
                    <NavItem>
                    <NavLink
                        className={classnames({ active: activeTab === '2' })}
                        onClick={() => { toggle('2'); }}
                    >
                        Change Password
                    </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                    <TabPane tabId="1">
                    <Row className="p-5">
                        <Col sm="12" >
                        <h6 className="mb-3">Your Address</h6>
                        {shippinginfo()}
                        </Col>
                    </Row>
                    </TabPane>
                    <TabPane tabId="2">
                    <Row className="p-5">
                        <Col sm="4">
                        <ChangePassword userid={props.User.id} userpassword={props.User.password}/>
                        </Col>
                    </Row>
                    </TabPane>
                </TabContent>
            </div>
        </div>
    )
}

const MapstatetoProps=(state)=>{
    return{
      User:state.Auth
    }
  }

export default connect(MapstatetoProps) (AccountSetting)