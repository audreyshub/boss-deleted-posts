import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import loadable from '@loadable/component'
import { Helmet } from 'react-helmet'

const Layout = (props) => {
  return (
    <>
      <CssBaseline />
      <main>{props.children}</main>
    </>
  )
}

export default Layout
