import React from 'react'
import Helmet from 'react-helmet'

const InvalidToken = (props) => {
  const { path } = props
  return (
    <div>
      <Helmet title="login" />
      <h1>Error: Invalid Activation Token.</h1>
    </div>
  )
}

export default InvalidToken
