import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Box from '@material-ui/core/Box'
import { RichText } from 'prismic-reactjs'

// Components
import { Image } from '../components/image'

// Styles
const useStyles = makeStyles((theme) => ({
	sliceContentWithImage: {
		display: 'grid',
		gap: theme.spacing(2),
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		[theme.breakpoints.up('md')]: {
			gridTemplateColumns: '1fr 2fr',
			gap: theme.spacing(6),
		}
	},
	image: {
		objectFit: 'contain !important',
	}
}))

const SliceContentWithImage = (props) => {
	// console.log('👾 SliceContent > ', props)	
	const classes = useStyles()
	const { className, ...other } = props;

	return (
		<Box
      className={clsx(className, classes.sliceContentWithImage, 'sliceContentWithImage')}
      {...other}
    >
			<Image imgClassName={classes.image} image={props.primary.image} />
			<Box>
				<RichText render={props.primary.content.raw} />
			</Box>
		</Box>
	)
}

export default SliceContentWithImage

SliceContentWithImage.propTypes = {}