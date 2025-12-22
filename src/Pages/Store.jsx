import ProductShowCase from '../Components/ProductComponents/ProductShowCase'
import { slides } from '../Components/ProductComponents/ProductSliderList'
import { ProductGrid } from '../Components/ProductComponents/ProductGrid'
import SEO from '../Components/SEO'
import { Link } from 'react-router-dom'



const Store = () => {
  return (
    
    <>
            <SEO 
              title="Store"
              description="The Olu The Maker Official Store"
              url="https://yourdomain.com/blog"
            />
          {/* Header Section */}
        <div className="mb-12 text-center pt-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Our Premium Footwear Collection
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore our handcrafted shoes made with the finest materials and attention to detail. 
            Each pair is designed for comfort, style, and durability.
          </p>
        </div>
    <ProductShowCase slides={slides}/>
    <ProductGrid />
    </>
  )
}


export default Store