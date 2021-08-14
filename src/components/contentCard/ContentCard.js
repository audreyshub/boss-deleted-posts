import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { RichText } from 'prismic-reactjs'


// Styles
const useStyles = makeStyles((theme) => ({
	contentCard: {
		[theme.breakpoints.up('md')]: {
			padding: theme.spacing(3, 0)
		}
	},
	inner: {
    display: 'grid',
    gap: theme.spacing(3),
    padding: theme.spacing(2, 2, 3, 2),
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: '16px',
    boxShadow: '0px 8px 32px rgba(0, 77, 112, 0.06)',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3, 3, 4, 3),
    },
  },
}))

const ContentCard = (props) => {
  const classes = useStyles()

	return (
		
		<Box className={`${props.styles} ${classes.contentCard}`}>
			<Box className={classes.inner}>
				<Typography variant="h3" component="h4">
					{props.title}
				</Typography>
				<RichText render={props.content.raw} />
			</Box>
		</Box>
  )
}

export default ContentCard

ContentCard.propTypes = {}
ContentCard.defaultProps = {}
