import React from 'react'
import SendMessage from '../Components/SendMessage'
import SEO from '../Components/SEO'
const Contact = () => {
  return (
    <div>
       <SEO 
        title="Contact Us"
        description="Contact Us, Send Us A Message"
        url="https://yourdomain.com/blog"
      />


        <SendMessage />
    </div>
  )
}

export default Contact