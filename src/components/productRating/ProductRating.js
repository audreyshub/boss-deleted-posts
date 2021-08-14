/**
 * ============================================================================
 * Product rating
 *
 * props:
 *
 * reviews [array]
 * authorRating [number]
 * showCount [boolean]
 * ============================================================================
 */

import React from 'react'
import SvgIcon from '@material-ui/core/SvgIcon'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import { makeStyles } from '@material-ui/core/styles'

// Icons Black
import StarIconBlackFull from '@material-ui/icons/Star'
import StarIconBlackEmpty from '@material-ui/icons/StarBorder'
import StarIconBlackHalf from '@material-ui/icons/StarHalf'

// Utilities
import { ratingValue, reviewCount } from './utilities'

// Styles
const useStyles = makeStyles((theme) => ({
  productRating: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stars: {
    display: 'flex',
    color: theme.palette.primary.main,
    '& svg': {
      display: 'inline-block',
    },
  },
  star: {
    width: (props) => (props.starWidth ? props.starWidth : '20px'),
  },
  number: {
    display: 'inline-block',
    marginLeft: theme.spacing(1.5),
    color: theme.palette.grey[600],
    fontSize: theme.typography.body1.fontSize,
  },
  average: {
    fontSize: '1.625rem',
    fontWeight: 'bold',
    lineHeight: 1,
    marginRight: theme.spacing(1.5),
  },
  starEmpty: {
    '& .inner-star': {
      fill: 'transparent !important',
    },
  },
}))

const ProductRating = (props) => {
  const classes = useStyles(props)
  const { reviews, authorRating, showAvg, showCount } = props
  const numberOfReviews = reviewCount(reviews)

  // console.log('PRODUCT RATING (component)', props)
  const createReviewStars = (productRating) => {
    const rating = productRating - 1
    let stars = []
    for (let i = 0; i < 5; i++) {
      if (i <= rating) {
        stars.push(
          <SvgIcon
            className={`${classes.star} ${classes.starFull} star`}
            component={StarIconBlackFull}
            key={i}
          />
        )
      } else if (!Number.isInteger(rating) && i <= rating + 1) {
        stars.push(
          <SvgIcon className={`${classes.star} star`} component={StarIconBlackHalf} key={i} />
        )
      } else {
        stars.push(
          <SvgIcon
            className={`${classes.star} ${classes.starEmpty} star`}
            component={StarIconBlackEmpty}
            key={i}
          />
        )
      }
    }
    return stars.map((star) => star)
  }

  return (
    <Box className={`${props.styles} ${classes.productRating} productRating`}>
      {showAvg && (
        <Typography className={`${classes.average} average`} component="span">
          {ratingValue(reviews)}
        </Typography>
      )}
      <Box className={`${classes.stars} starsWrapper`} component="span">
        {createReviewStars(authorRating ? authorRating : ratingValue(reviews))}
      </Box>
      {showCount && (
        <Typography className={`${classes.number} number`} component="span">
          Based on {numberOfReviews} Reviews
        </Typography>
      )}
    </Box>
  )
}

export default ProductRating
