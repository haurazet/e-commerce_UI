import {
    USER_REGISTER_FAILED,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_START
} from '../actions/type'

const INITIAL_STATE={
    loading:false,
    isregister:false,
    errormes:'',
    successmes:''
}

export default (state=INITIAL_STATE,action)=>{
    switch(action.type){
        case USER_REGISTER_START:
            return{...state,loading:true}
        case USER_REGISTER_SUCCESS:
            return{...state,loading:false,successmes:action.payload, isregister:true}
        case USER_REGISTER_FAILED:
            return{...state,loading:false,errormes:action.payload}
        case 'ErrorClear':
            return state
        case 'NOT_REGISTER':
            return{...state,isregister:false}
        default:
            return state
    }
}

