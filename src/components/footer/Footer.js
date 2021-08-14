import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import SvgIcon from '@material-ui/core/SvgIcon'

// Components
import NavList from '../navList'
import Social from '../social'
import AcceptedPayments from '../acceptedPayments'

// Assets
import Logo from './assets/logo.inline.svg'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    marginTop: theme.spacing(10),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(15),
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
  container: {
    display: 'grid',
    gap: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr auto',
      alignItems: 'start',
    },
  },
  logo: {
    height: '80px',
    width: '208px',
  },
  innerWrapper: {
    display: 'grid',
    gap: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto 1fr',
      alignItems: 'center',
      order: 1,
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'auto',
    },
  },
  navWrapper: {
    display: 'grid',
    gap: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  },
  navList: {
    [theme.breakpoints.only('xs')]: {
      borderBottom: '1px solid hsla(199, 59%, 33%, 1)',
    },
  },
}))

const Footer = (props) => {
  const data = useStaticQuery(graphql`
    {
      prismicNavigation {
        data {
          nav_footer {
            ... on PrismicNavigationNavFooterNavList {
              primary {
                type
                label
                handle
                link {
                  type
                  uid
                  url
                }
              }
              items {
                type
                label
                handle
                link {
                  type
                  uid
                  url
                }
              }
            }
          }
        }
      }
    }
  `)

  const navMenus = data.prismicNavigation.data.nav_footer

  const classes = useStyles()

  // console.log('👾 Footer', navMenus)
  return (
    <>
      <Box className={classes.root} component="footer">
        <Container className={classes.container}>
          <Box className={classes.innerWrapper}>
            <SvgIcon className={classes.logo} component={Logo} viewBox="0 0 208 80" />
            <Social />
          </Box>
          <Box className={classes.navWrapper}>
            {navMenus.map((menu, i) => (
              <NavList key={i} styles={classes.navList} {...menu} />
            ))}
          </Box>
        </Container>
      </Box>
      <AcceptedPayments styles={classes.acceptedPayments} />
    </>
  )
}

export default Footer

Footer.propTypes = {}
Footer.defaultProps = {}
