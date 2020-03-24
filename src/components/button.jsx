import React from 'react';

const SquareButton = ({isfunction,text,onclick})=>{
 if (isfunction===true){
     return(
    <button className="checkout text-uppercase" style={{backgroundColor:"white", border:'1px black solid', fontWeight:"300", padding:"0 20px 0 20px", height:"48px", width:'200px'}} onClick={onclick}>{text}</button>
     )
}else{
    return(
    <button className="checkout text-uppercase" style={{backgroundColor:"white", border:'1px black solid', fontWeight:"300", padding:"0 20px 0 20px", height:"48px", width:'200px'}}>{text}</button>
    )
}
}

export default SquareButton