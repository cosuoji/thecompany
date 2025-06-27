import React from 'react'
import SendMessage from '../Components/SendMessage'
import useDocumentTitle from '../hooks/useDocumentTitle'
const Contact = () => {
  useDocumentTitle("Contact Us")
  return (
    <div>

        <SendMessage />
    </div>
  )
}

export default Contact