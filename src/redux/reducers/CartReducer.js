import {GET_CART_DATA} from '../actions/type'

const INITIAL_STATE={
    qty:0
}

export default (state=INITIAL_STATE,action)=>{
    switch(action.type){
        case GET_CART_DATA:
            return{...state,qty:action.payload}
        default:
            return state

    }
}