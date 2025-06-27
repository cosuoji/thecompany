import React from 'react'
import ProductShowCase from '../Components/ProductComponents/ProductShowCase'
import { slides } from '../Components/ProductComponents/ProductSliderList'
import { ProductGrid } from '../Components/ProductComponents/ProductGrid'
import useDocumentTitle from '../hooks/useDocumentTitle'


const Store = () => {
  useDocumentTitle("Store - ")
  return (
    
    <>
    <ProductShowCase slides={slides}/>
    <ProductGrid />
    </>
  )
}


export default Store