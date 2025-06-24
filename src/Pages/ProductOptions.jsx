import React from 'react'
import CategoryForm from '../Components/Forms/ShoeOptionForms/CategoryForm'
import CollectionForm from '../Components/Forms/ShoeOptionForms/CollectionForm'
import ColorForm from '../Components/Forms/ShoeOptionForms/ColorForm'
import LastForm from '../Components/Forms/ShoeOptionForms/LastForm'
import MaterialForm from '../Components/Forms/ShoeOptionForms/MaterialForm'
import SoleForm from '../Components/Forms/ShoeOptionForms/SoleForm'

const ProductOptionsForm = () => {
  return (
    <div className='pt-32'>
        <CategoryForm />
        <CollectionForm />
        <ColorForm />
        <LastForm />
        <MaterialForm />
        <SoleForm />
    </div>
  )
}

export default ProductOptionsForm