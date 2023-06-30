import React from 'react'
import { useSearchParams } from 'react-router-dom'

function PaymentSuccess() {

    const searchQuery = useSearchParams()[0]
    const reference = searchQuery.get("reference")

  return (
    <div style={{color: "white", textAlign: "center", marginTop: "200px"}}>
        <h1>Payment Successfull!</h1>
        <p style={{fontSize: "20px"}}><strong>Payment Id:</strong> {reference}</p>
    </div>
  )
}

export default PaymentSuccess