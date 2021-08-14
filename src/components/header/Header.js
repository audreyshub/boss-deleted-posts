import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Slide from '@material-ui/core/Slide'
import Container from '@material-ui/core/Container'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import SvgIcon from '@material-ui/core/SvgIcon'
import Hidden from '@material-ui/core/Hidden'
import { useWindowSize } from 'react-use'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useLocalStorage } from 'react-use'

// Components
import NavTop from '../navTop'
import Branding from './Branding'
import NoticeBar from '../noticeBar'
import MainMenu from '../mainMenu'
import UserAccount from '../userAccount'
import Search from '../search'
import Cart from '../cart'

// Context
import { SearchContextProvider } from '../../context/SearchContext'

// data
import { navMainItems, navTopItems } from './data'

// Styles
const useStyles = makeStyles((theme) => ({
  header: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.main,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    minHeight: theme.spacing(10),
    [theme.breakpoints.up('md')]: {
      minHeight: theme.spacing(12),
    },
  },
  mainMenu: {
    [theme.breakpoints.up('sm')]: {
      order: 1,
    },
  },
  branding: {
    marginRight: 'auto',
    [theme.breakpoints.down('sm')]: {
      flexGrow: 1,
    },
  },
  navTop: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      flexGrow: 1,
      display: 'flex',
    },
  },
}))

const Header = (props) => {
  const theme = useTheme()
  const classes = useStyles()
  const [searchOpen, setSearchOpen] = useState(false)
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const [noticeBarHidden, setNoticeBarHidden] = useState(false)
  const [value, setValue, remove] = useLocalStorage('notice-bar-visible', true)

  function HideOnScroll(props) {
    const { children } = props
    const trigger = useScrollTrigger()

    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    )
  }

  const handleToggleNoticeBar = () => {
    const isHidden = !noticeBarHidden
    setNoticeBarHidden(isHidden)
    setValue(false)
  }

  // Local storage so that the notification bar will only re-appear on a page refresh, not Gatsby navigation
  const resetNoticeBarLocalStorage = () => {
    remove()
  }

  useEffect(() => {
    let isMounted = true
    setNoticeBarHidden(!value)
    if (isMounted) window.addEventListener('beforeunload', resetNoticeBarLocalStorage)
    return () => {
      window.removeEventListener('beforeunload', resetNoticeBarLocalStorage)
      isMounted = false
    }
  }, [])

  const handleToggleSearch = () => {
    setSearchOpen(!searchOpen)
  }

  // console.log('HEADER (component)', props)
  return (
    <HideOnScroll {...props}>
      <AppBar className={classes.header} position="sticky" elevation={0}>
        {!noticeBarHidden && (
          <NoticeBar
            message="Every order generates $1 for charities"
            handleToggleNoticeBar={handleToggleNoticeBar}
          />
        )}
        <Container className={classes.container}>
          <Toolbar className={classes.toolbar}>
            {!searchOpen && <MainMenu styles={classes.mainMenu} items={navMainItems} />}

            {(searchOpen && !isSmall) || !searchOpen ? (
              <Branding styles={classes.branding} />
            ) : null}

            {!searchOpen && <NavTop styles={classes.navTop} items={navTopItems} />}

            <SearchContextProvider>
              <Search handleToggleSearch={handleToggleSearch} searchOpen={searchOpen} />
            </SearchContextProvider>

            {!searchOpen && <UserAccount />}

            {!searchOpen && <Cart path={props.path} />}
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  )
}

export default Header

Header.propTypes = {
  message: PropTypes.string,
  qty: PropTypes.number,
}
Header.defaultProps = {
  string: null,
  qty: null,
}
