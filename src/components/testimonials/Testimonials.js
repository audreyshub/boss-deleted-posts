import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

// Components
import Card from './Card'
import Carousel from '../carousel'

// Styles
const useStyles = makeStyles((theme) => ({
  testimonials: {},
  carousel: {
    '& .arrow': {
      top: 'unset',
      bottom: 0,
      left: 0,
      borderRadius: '4px',
      width: '56px',
      height: '56px',
      '& svg': {
        width: '24px',
        height: '24px',
      },
    },
    '& .arrowRight': {
      transform: 'translate(170%, 150%)',
    },
    '& .arrowLeft': {
      transform: 'translate(50%, 150%) rotate(180deg)',
    },
  },
  carouselWrapper: {
    padding: theme.spacing(5, 0, 15),
    backgroundColor: theme.palette.secondary.light,
  },
  title: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h2,
    },
  },
}))

const Testimonials = (props) => {
  // console.log('👾 Testimonials > ', props)
  
	const classes = useStyles()

  return (
    <Box className={`${props.styles} ${classes.testimonials}`}>
      <Container>
        <Typography className={classes.title} variant="h3" component="h3">
          {props.title}
        </Typography>
      </Container>
      <Box className={classes.carouselWrapper}>
        <Carousel
          styles={classes.carousel}
          useArrows={true}
          arrowSvg={ArrowForwardIcon}
          arrowViewbox="0 0 24 24"
          activateCarouselWidth="1126"
          xsSlideWidth="305px"
          mdSlideWidth="400px"
          freeMode={false}
          containerMaxWidth="100%"
          arrowPaddingFromContainer={45}
          propsByBreakpoint={{
            spaceBetween: { 0: 15, 600: 40 },
          }}
        >
          {props.items.map((item, i) => (
            <Card key={i} {...item} content={item.content.text} />
          ))}
        </Carousel>
      </Box>
    </Box>
  )
}

export default Testimonials

export const testimonialsItemsFields = graphql`
	fragment testimonialsItemsFields on PrismicHomepageTestimonialItemsGroupType {
		name
		content {
			text
		}
	}
`

Testimonials.propTypes = {
	title: PropTypes.string,
	items: PropTypes.arrayOf(
		PropTypes.object
	)
}