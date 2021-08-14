import React from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import loadable from '@loadable/component'
import { Helmet } from 'react-helmet'

// Components
// import Header from '../header'
// import Footer from '../footer'
import SEO from '../seo'

// Hooks
import useScript from '../../hooks/useHooks/useScript'

// Loadable components
const Header = loadable(() => import('../../components/header/Header'))
const Footer = loadable(() => import('../../components/footer/Footer'))

const Layout = (props) => {
  // const gorgias = useScript('/gorgias.js')
  // const klaviyo = useScript('https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=LNEyda')

  // console.log('LAYOUT (component)', isTouchDevice())
  return (
    <>
      <CssBaseline />
      <SEO />
      <Header {...props} />
      <main>{props.children}</main>
      <Footer />
    </>
  )
}

export default Layout
