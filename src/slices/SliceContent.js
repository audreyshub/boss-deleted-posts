import React from 'react'
import PropTypes from 'prop-types'
import Box from '@material-ui/core/Box'
import { RichText } from 'prismic-reactjs'

const SliceContent = (props) => {
	// console.log('👾 SliceContent > ', props)	

	return (
		<Box>
			<RichText render={props.primary.content.raw} />
		</Box>
	)
}

export default SliceContent

SliceContent.propTypes = {}