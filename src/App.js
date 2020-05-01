import React, {  useEffect, useState } from 'react';
import './App.css';
import Login from './pages/login'
import Header from './components/header'
import Home from './pages/home'
import Notfound from './pages/notfound'
import { Route, Switch, useLocation } from "react-router-dom"
import Axios from 'axios'
import { API_URL } from './supports/Apiurl';
import { connect } from 'react-redux';
import {KeepLogin} from './redux/actions';
import ManageAdmin from './pages/manageproduct'
import ProductDetail from './pages/productdetail';
import Cart from './pages/cart'
import Register from './pages/register'
import AccountSetting from './pages/accountsetting'
import Searchpage from './pages/searchpage'
import Checkout from './pages/checkout'
import Productpage from './pages/productpage'
import Transaction from './pages/transaction'
import TransactionsSummary from './pages/transactionsummary'
import ManageOrder from './pages/manageorder'
import AdminTransaction from './pages/admintransaction'
import Verified from './pages/verified'
import SendVerified from './pages/sendverified'
import Footer from './components/footer'
import ScrollToTop from './components/scrolltop'
import ManageDiscount from './pages/managediscount'



const App = (({KeepLogin}) =>{


// function App({KeepLogin}) {

  const [Loading, setLoading]=useState(true)
  const location=useLocation()

  useEffect(()=>{
    var token = localStorage.getItem('token')
    if(token){
      Axios.get(`${API_URL}/users/keeplogin`,{
        headers:{
          'Authorization' :  `Bearer ${token}`
        }
      })
      .then(res=>{
        KeepLogin(res.data, res.data.jumlahcart)
      })
      .catch(err=>{
        console.log(err.message)
      })
      .finally(()=>{
        setLoading(false)
      })
    }else{
      setLoading(false)
    }
    },[])

    
  if(Loading){
    return (
      <div>loading...</div>
    )
  }
  return (
    <div >
        {
         location.pathname!=='/login' && location.pathname!=='/register' ? <Header/>:''
        }
        <ScrollToTop />
        <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/manageadmin" exact component={ManageAdmin}/>
            <Route path="/manageorder" exact component={ManageOrder}/>
            <Route path="/managediscount" exact component={ManageDiscount}/>
            <Route path="/productdetail/:idprod" exact component={ProductDetail}/>
            <Route path="/cart" exact component={Cart}/>
            <Route path="/register" exact component={Register}/>
            <Route path="/accountsetting" exact component={AccountSetting}/>
            <Route path="/checkout" exact component={Checkout}/>
            <Route path="/searchpage/search?name=:keyword" exact component={Searchpage}/>
            <Route path="/checkout" exact component={Checkout}/>
            <Route path="/transaction/:transactionId" exact component={Transaction}/>
            <Route path="/admintransaction/:transactionId" exact component={AdminTransaction}/>
            <Route path="/transactionssummary/:userId" exact component={TransactionsSummary}/>
            <Route path="/productpage" exact component={Productpage}/>
            <Route path="/verified" exact component={Verified}/>
            <Route path="/sendverified" exact component={SendVerified}/>
            <Route component={Notfound} />
        </Switch>
        {
         location.pathname!=='/login' && location.pathname!=='/register' ? <Footer/>:''
        }
        
        </div>
  );
})

const MapstatetoProps=({Auth})=>{
  return{
      islogin:Auth.islogin
  }
}

export default connect(MapstatetoProps,{KeepLogin})(App);
