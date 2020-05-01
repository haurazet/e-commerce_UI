import React, { Component } from 'react';
import Axios from 'axios'
import {API_URL} from './../supports/Apiurl';
import querystring from 'query-string'
import {connect} from 'react-redux'
import {afterVerified} from './../redux/actions'

class Verified extends Component {
    state = { 
        success:0
     }

    componentDidMount(){
        console.log(this.props.location.search)
        var obj=querystring.parse(this.props.location.search)
        console.log(obj)
        Axios.get(`${API_URL}/users/verified`,{
            headers:{
                'Authorization': `Bearer ${obj.token}`
            }
        }).then((res)=>{ //kalo token masih aktif
            console.log(res.data)
            this.props.afterVerified(res.data)
            this.setState({success:1})
        }).catch((err)=>{ //kalo token udah expired (status 401 ada di auth helper)
            console.log(err)
            this.setState({success:2})
        })
    }
    render() { 
        if(this.state.success===1){
            return(
                <div className='p-5 mt-5'>
                    <center>
                        <h1>Berhasil verified</h1>
                    </center>
                </div>
            )
        }else if(this.state.success===2){ 
            return(
                <div className='p-5 mt-5'>
                    <center>
                        <h1>Gagal verified</h1>
                    </center>
                </div>
            )
        }
        return ( 
            <div className='p-5 mt-5'>
                <center>
                    <h1>Sedang menunggu verified</h1>
                </center>
            </div>
         );
    }
}

const bebas=(state)=>{
    return{
        Auth:state.Auth
    }
}
 
export default connect(bebas,{afterVerified})(Verified);