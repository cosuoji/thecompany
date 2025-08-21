import React from 'react'
import ProductShowCase from '../Components/ProductComponents/ProductShowCase'
import { slides } from '../Components/ProductComponents/ProductSliderList'
import { ProductGrid } from '../Components/ProductComponents/ProductGrid'
import SEO from '../Components/SEO'



const Store = () => {
  return (
    
    <>
            <SEO 
              title="Store"
              description="The Olu The Maker Official Store"
              url="https://yourdomain.com/blog"
            />
    <ProductShowCase slides={slides}/>
    <ProductGrid />
    </>
  )
}


export default Store