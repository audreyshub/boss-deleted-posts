// WIP
import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql, Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'

// Components
import Dropdown from './Dropdown'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    fontWeight: theme.typography.fontWeightBold,
    justifyContent: 'center',
    textAlign: 'center',
  },
  item: {
    width: 'auto',
  },
}))

const NavTop = React.forwardRef((props, ref) => {
	const data = useStaticQuery(graphql`
		{
			prismicNavigation {
				data {
					nav_top {
						... on PrismicNavigationNavTopNavList {
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
					}
				}
			}
		}
	`)
	
	const navItemsData = data.prismicNavigation.data.nav_top
	
	const classes = useStyles()

  return (
    <List ref={ref} className={`${props.styles} ${classes.root}`}>
      {navItemsData.map((item, i) => (
        <Dropdown key={i} styles={classes.item} {...item} />
      ))}
    </List>
  )
})

export default NavTop

NavTop.propTypes = {
  items: PropTypes.array,
}
NavTop.defaultProps = {}
