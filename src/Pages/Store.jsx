import React from 'react'
import ProductShowCase from '../Components/ProductComponents/ProductShowCase'
import { slides } from '../Components/ProductComponents/ProductSliderList'
import { ProductGrid } from '../Components/ProductComponents/ProductGrid'

const Store = () => {

  

  return (
    
    <>
    <ProductShowCase slides={slides}/>
    <ProductGrid />
    </>
  )
}


export default Store