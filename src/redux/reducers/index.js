import {combineReducers} from 'redux'
import AuthReducer from './AuthReducer'
import HeaderReducer from './HeaderReducer'
import RegisReducer from './RegisReducer'
import CartReducer from './CartReducer'

export default combineReducers({
    Auth:AuthReducer,
    Header:HeaderReducer,
    Regis:RegisReducer,
    Cart:CartReducer
})