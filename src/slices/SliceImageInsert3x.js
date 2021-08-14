import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'

// Components
import { Image } from '../components/image'

// Styles
const useStyles = makeStyles((theme) => ({
	sliceImageInsert3x: {
		display: 'grid',
		gap: theme.spacing(2),
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		[theme.breakpoints.up('sm')]: {
			gap: theme.spacing(4),
			gridTemplateColumns: '1fr 1fr 1fr',
		}
	},
	image: {
		height: '200px',
		borderRadius: '16px',
		[theme.breakpoints.up('sm')]: {
			height: 'auto',
			aspectRatio: 1,
		}
	},
	logo: {
		[theme.breakpoints.only('xs')]: {
			objectFit: 'contain !important',
		}
	}
}))

const SliceImageInsert3x = (props) => {
	// console.log('👾 SliceImageInsert3x > ', props)
	const classes = useStyles()

	return (
		<Box className={`${props.styles} ${classes.sliceImageInsert3x}`}>
			<Image wrapperClassName={classes.image} image={props.primary.image1} />
			<Image wrapperClassName={classes.image} imgClassName={classes.logo} image={props.primary.image2} />
			<Image wrapperClassName={classes.image} image={props.primary.image3} />
		</Box>
	)
}

export default SliceImageInsert3x

SliceImageInsert3x.propTypes = {

}
SliceImageInsert3x.defaultProps = {

}