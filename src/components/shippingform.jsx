import React, { useState } from 'react';
import { Col, Row, Button, Form, FormGroup, Label, Input } from 'reactstrap';
// import Axios from "axios"
// import { API_URL } from '../supports/Apiurl';
// import { propTypes } from 'react-currency-input';

const ShippingForm = ({userid, useraddress}) => {

    const [isformopen, setisformopen]=useState(false)

    // const form =()=>{
    //     setisformopen(true)
    // }

    return (
      <div>
          <div style={{border: "1px solid lightgray"}}>
           
          </div>
          {isformopen?
                <Form>
                <Row form>
                <Col md={6}>
                    <FormGroup>
                    <Label for="exampleEmail">Name</Label>
                    <Input type="Name" name="email" id="exampleEmail" placeholder="First and last name" />
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                    <Label for="examplePassword">Phone Number</Label>
                    <Input type="number" name="password" id="examplePassword" placeholder="+62 XXX" />
                    </FormGroup>
                </Col>
                </Row>
                <FormGroup>
                <Label for="exampleAddress">Address</Label>
                <Input type="text" name="address" id="exampleAddress" placeholder="1234 Main St"/>
                </FormGroup>
                <Row form>
                <Col md={6}>
                    <FormGroup>
                    <Label for="exampleCity">City</Label>
                    <Input type="text" name="city" id="exampleCity"/>
                    </FormGroup>
                </Col>
                <Col md={4}>
                    <FormGroup>
                    <Label for="exampleState">State</Label>
                    <Input type="text" name="state" id="exampleState"/>
                    </FormGroup>
                </Col>
                <Col md={2}>
                    <FormGroup>
                    <Label for="exampleZip">Zip</Label>
                    <Input type="text" name="zip" id="exampleZip"/>
                    </FormGroup>  
                </Col>
                </Row>
                <Button >Save Address</Button>
            </Form>
          :
          null}
    </div>);
}


export default ShippingForm;