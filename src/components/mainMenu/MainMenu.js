import React from 'react'
import { useStaticQuery, graphql} from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import Box from '@material-ui/core/Box'
import SvgIcon from '@material-ui/core/SvgIcon'

// Components
import SliceZone from '../sliceZone'

// Assets
import Logo from './assets/logo.inline.svg'

// Icons
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  drawer: {
    '& .MuiDrawer-paper': {
      width: 'clamp(320px, 100%, 375px)',
    },
  },
  header: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
    minHeight: '64px',
    marginBottom: theme.spacing(2),
  },
  logo: {
    height: '32px',
    width: '200px',
    marginLeft: theme.spacing(1.5),
  },
}))

const MainMenu = React.forwardRef((props, ref) => {
  // console.log('👾 MainMenu > ', props)
	
	const data = useStaticQuery(graphql`
    {
      prismicNavigation {
        data {
          nav_main {
            ... on PrismicNavigationNavMainNavItem {
              slice_type
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
            }
            ... on PrismicNavigationNavMainNavSingle {
							slice_type
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
            }
          }
        }
      }
    }
  `)
	
	const navSlicesData = data.prismicNavigation.data.nav_main
	
	const classes = useStyles()

  const [open, setOpen] = React.useState(false)

  const toggleDrawer = (event, state) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setOpen(state)
  }

  return (
    <>
      <IconButton
        ref={ref}
        className={`${props.styles} ${classes.root}`}
        color="inherit"
        onClick={(e) => toggleDrawer(e, true)}
        aria-label={strings.ariaMenuLabel}
        role="button"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        className={classes.drawer}
        anchor="left"
        open={open}
        onClose={(e) => toggleDrawer(e, false)}
      >
        <Box className={classes.header}>
          <SvgIcon className={classes.logo} component={Logo} viewBox="0 0 296 48" />
          <IconButton
            className={classes.closeButton}
            onClick={(e) => toggleDrawer(e, false)}
            color="secondary"
          >
            <CloseIcon />
          </IconButton>
        </Box>

				<SliceZone sliceData={navSlicesData} />

      </Drawer>
    </>
  )
})

export default MainMenu
