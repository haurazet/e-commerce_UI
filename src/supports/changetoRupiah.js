import Numeral from 'numeral'

export const changetoRupiah = (param) =>{
    return(
        'Rp '+Numeral(param).format(0.0)
    )
}