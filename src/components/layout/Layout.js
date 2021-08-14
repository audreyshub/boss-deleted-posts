import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import loadable from '@loadable/component'
import { Helmet } from 'react-helmet'

// Components
import SEO from '../seo'

// Hooks
import useScript from '../../hooks/useHooks/useScript'

const Layout = (props) => {
  return (
    <>
      <CssBaseline />
      <SEO />
      <main>{props.children}</main>
    </>
  )
}

export default Layout
