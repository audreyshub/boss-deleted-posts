import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'

// Components
import NavItem from '../navItem'

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginBottom: theme.spacing(2),
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  accordion: {
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    color: theme.palette.secondary.main,
    '&:before': {
      content: 'none',
    },
  },
  menu: {
    width: '100%',
  },
  menuItem: {
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: theme.palette.secondary.light,
    },
  },
}))

export const NavAccordion = (props) => {
  // console.log('👾 NavMain > ', props)
	const classes = useStyles()

	const accordionID = Math.floor(Math.random() * (999 - 100 + 1) + 100)
		
	return (
		<Accordion className={classes.accordion} square={true} elevation={0}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${accordionID}Content`} id={`panel${accordionID}Header`}>
				
				<NavItem variant="h4" {...props.primary} />
			
			</AccordionSummary>
			<AccordionDetails>
				<List className={classes.menu}>
					
					{props.items && props.items.map((item, i) => {
						return (
							<ListItem key={i} className={classes.menuItem}>
								<NavItem variant="h5" {...item} />
							</ListItem>
						)
					})}
					
				</List>
			</AccordionDetails> 
		</Accordion>
	)
}

export const NavSingle = (props) => {
	// console.log('👾 NavSingle PROPS > ', props)
	return (
		<AccordionSummary>
			<NavItem variant="h4" {...props.primary} />
		</AccordionSummary>
	)
}

// NavMain.propTypes = {}
// NavMain.defaultProps = {}
