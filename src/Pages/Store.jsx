import React from 'react'
import ProductShowCase from '../Components/ProductComponents/ProductShowCase'
import { slides } from '../Components/ProductComponents/ProductSliderList'

const Store = () => {
  return (
    
    <>
    <ProductShowCase slides={slides}/>
    </>
  )
}


export default Store