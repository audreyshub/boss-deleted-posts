import React from 'react'

import SvgIcon from '@material-ui/core/SvgIcon'
import StarIconFull from '@material-ui/icons/Star'
import StarIconEmpty from '@material-ui/icons/StarBorder'
import StarIconHalf from '@material-ui/icons/StarHalf'

const Stars = (props) => {
  const createReviewStars = (productRating) => {
    const rating = productRating - 1
    let stars = []
    for (let i = 0; i < 5; i++) {
      if (i <= rating) {
        stars.push(<SvgIcon component={StarIconFull} key={i} />)
      } else if (!Number.isInteger(rating) && i <= rating + 1) {
        stars.push(<SvgIcon component={StarIconHalf} key={i} />)
      } else {
        stars.push(<SvgIcon component={StarIconEmpty} key={i} />)
      }
    }
    return stars.map((star) => star)
  }

  return <span>{createReviewStars(props.rating)}</span>
}

export default Stars
