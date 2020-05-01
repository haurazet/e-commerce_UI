import {
    USER_LOGIN_FAILED,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_START
} from '../actions/type'

const INITIAL_STATE={
    username:'',
    password:'',
    id:0,
    role:'',
    address:'',
    loading:false,
    islogin:false,
    errormes:'',
    isverified:0
}

export default (state=INITIAL_STATE,action)=>{
    switch(action.type){
        case USER_LOGIN_START:
            return{...state,loading:true}
        case USER_LOGIN_SUCCESS:
            return{...state,loading:false,...action.payload,islogin:true}
        case USER_LOGIN_FAILED:
            return{...state,loading:false,errormes:action.payload}
        case 'AFTER_VERIFIED':
            return {...state,...action.payload}
        case 'ErrorClear':
            return state
        default:
            return state
    }
}

