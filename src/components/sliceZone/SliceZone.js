import React from 'react'
import PropTypes from 'prop-types'

// Components
import { NavAccordion, NavSingle } from '../navMain'
import SliceContent from '../../slices/SliceContent'
import SliceContentWithImage from '../../slices/SliceContentWithImage'
import SliceImageInsert3x  from '../../slices/SliceImageInsert3x'
import FaqAccordion from '../../components/faqAccordion'


const SliceZone = ({sliceData}) => {
	
	const sliceComponents = {
		nav_item: NavAccordion,
		nav_single: NavSingle,
		content: SliceContent,
		content_with_image: SliceContentWithImage,
		image_insert_3x: SliceImageInsert3x,
		faq: FaqAccordion
	}

	const sliceZoneContent = sliceData.map((slice, i) => {
		const SliceComponent = sliceComponents[slice.slice_type]
    if (!SliceComponent) return null
		return <SliceComponent {...slice} key={i} />
  })
	
	return (
		<>
			{sliceZoneContent}
		</>
	)
}

export default SliceZone

SliceZone.propTypes = {
	sliceData: PropTypes.arrayOf(PropTypes.object)
}