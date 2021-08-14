import React, { useState, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import { useDebounce } from 'ahooks'
import Zoom from 'react-medium-image-zoom'

// Components
import ProductRating from '../../productRating'
import { Image } from '../../image'

// Reducer
import { sortConstants, filterConstants, actions } from '../actions'

// Language
import strings from './strings'

// Styles
import 'react-medium-image-zoom/dist/styles.css'
const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {},
  subheader: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      justifyContent: 'start',
      alignItems: 'center',
    },
  },
  rating: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'start',
    alignItems: 'start',
    padding: theme.spacing(3, 0),
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    '& .average': {
      marginBottom: theme.spacing(2),
    },
    '& .starsWrapper': {
      marginBottom: theme.spacing(1),
    },
    '& .number': {
      marginLeft: 0,
    },
    [theme.breakpoints.up('md')]: {
      borderBottom: 'none',
      paddingRight: theme.spacing(3),
      borderRight: `1px solid ${theme.palette.grey[200]}`,
    },
  },
  review: {
    padding: theme.spacing(3, 0),
    borderTop: `1px solid ${theme.palette.grey[200]}`,
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    '&:first-child': {
      borderTop: 'none',
    },
    '&:last-child': {
      borderBottom: 'none',
    },
  },
  avatar: {
    borderRadius: '50%',
    overflow: 'hidden',
    width: '60px',
    height: '60px',
    '& img': {
      width: '100%',
      objectFit: 'cover',
    },
  },
  sortByRating: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(3, 0),
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    marginBottom: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      borderBottom: 'none',
      paddingLeft: theme.spacing(3),
    },
  },
  ratingFilter: {
    display: 'flex',
    alignItems: 'center',
  },
  ratingStarsText: {
    marginLeft: theme.spacing(1),
  },
  author: {
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  date: {
    color: theme.palette.grey[600],
    marginBottom: theme.spacing(1),
  },
  reviewStars: {
    marginBottom: theme.spacing(1),
    display: 'inline-flex',
  },
  reviewTitle: {
    marginBottom: theme.spacing(1),
    fontWeight: 600,
  },
  image: {
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(3),
    width: '155px',
    height: 'auto',
    borderRadius: '13px',
    objectFit: 'cover',
  },
}))

const countReviewRatings = (reviews) => {
  return [
    { rating: reviews.filter((a) => a.reviewRating >= 1 && a.reviewRating < 2).length },
    { rating: reviews.filter((a) => a.reviewRating >= 2 && a.reviewRating < 3).length },
    { rating: reviews.filter((a) => a.reviewRating >= 3 && a.reviewRating < 4).length },
    { rating: reviews.filter((a) => a.reviewRating >= 4 && a.reviewRating < 5).length },
    { rating: reviews.filter((a) => a.reviewRating === 5).length },
  ]
}

const ProductReviews = (props) => {
  const theme = useTheme()
  const classes = useStyles()
  const { reviews, numberPerLoad = 3, styles } = props
  const [loadNumber, setLoadNumber] = useState(numberPerLoad)
  const [searchQuery, setSearchQuery] = useState('')
  const [hideSearchHelper, setHideSearchHelper] = useState(true)
  const debouncedSearchQuery = useDebounce(searchQuery, { wait: 500 })
  const reviewsWidthPhotos = reviews.filter((review) => review.images.length > 0)
  const [reducedReviews, dispatch] = useReducer(actions, {
    sorted: [],
    type: '',
    quantity: null,
    totalNumber: null,
  })

  const { SORT_BY_MOST_RECENT } = sortConstants
  const { NUMBER_OF_REVIEWS, FILTER_BY_TEXT } = filterConstants

  const getMenuItems = (sortConstants) => {
    let menuItems = []
    for (const item in sortConstants) {
      if (sortConstants.hasOwnProperty(item)) {
        if (item === 'SORT_BY_WITH_PHOTOS' && reviewsWidthPhotos.length === 0) continue
        menuItems.push(
          <MenuItem key={item} value={item}>
            <React.Fragment key={item}>{sortConstants[item]}</React.Fragment>
          </MenuItem>
        )
      }
    }
    return menuItems
  }

  const handleLoadMore = () => {
    const newNumber = loadNumber + numberPerLoad
    setLoadNumber(newNumber)
    dispatch({
      type: NUMBER_OF_REVIEWS,
      payload: { arr: reviews, type: reducedReviews.type, quantity: newNumber },
    })
  }

  const handleChangeSort = (e) => {
    dispatch({
      type: sortConstants[e.target.value],
      payload: { arr: reviews, type: e.target.value, quantity: numberPerLoad },
    })
    setLoadNumber(numberPerLoad)
  }

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  // const handleFilterByRating = (rating) => {
  //   dispatch({
  //     type: FILTER_BY_RATING,
  //     payload: {
  //       arr: reviews,
  //       type: SORT_BY_MOST_RECENT,
  //       quantity: numberPerLoad,
  //       maxRating: rating,
  //     },
  //   })
  //   setLoadNumber(numberPerLoad)
  // }

  useEffect(() => {
    // Set default sort, only on first render
    if (reducedReviews.type === '') {
      dispatch({
        type: SORT_BY_MOST_RECENT,
        payload: { arr: reviews, type: 'SORT_BY_MOST_RECENT', quantity: numberPerLoad },
      })
      return
    }
    // Search reviews by name, title, and body if 3 or more char are typed
    if (debouncedSearchQuery.length >= 3) {
      dispatch({
        type: FILTER_BY_TEXT,
        payload: {
          arr: reviews,
          type: reducedReviews.type,
          quantity: numberPerLoad,
          searchQuery: debouncedSearchQuery,
        },
      })
      setHideSearchHelper(true)
      setLoadNumber(numberPerLoad)
      return
    }
    // If less than 3 char, reset reviews to unfiltered version of existing type
    if (debouncedSearchQuery.length < 3) {
      dispatch({
        type: NUMBER_OF_REVIEWS,
        payload: { arr: reviews, type: reducedReviews.type, quantity: numberPerLoad },
      })
      setHideSearchHelper(false)
      if (debouncedSearchQuery.length === 0) setHideSearchHelper(true)
      return
    }
  }, [debouncedSearchQuery])

  // console.log('PRODUCT REVIEWS', reviews)
  return (
    <Box className={`${styles} ${classes.productReviews}`}>
      <Container maxWidth="lg">
        <Box className={classes.header}>
          <Typography className={`${classes.title} title`} variant="h2">
            {strings.title}
          </Typography>
          {/* <FormControl className={classes.searchWrapper}>
          <InputLabel htmlFor="search-reviews">{strings.searchPlaceholder}</InputLabel>
          <Input
            id="search-reviews"
            aria-describedby="search-reviews-helper-text"
            value={searchQuery}
            placeholder={strings.searchPlaceholder}
            onChange={handleSearch}
          />
          <FormHelperText
            className={hideSearchHelper ? 'visuallyHidden' : null}
            id="search-reviews-helper-text"
          >
            {strings.searchInputHelper}
          </FormHelperText>
        </FormControl> */}
          <FormControl className={classes.sortWrapper}>
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={reducedReviews.type}
              // placeholder={reducedReviews.type}
              onChange={handleChangeSort}
            >
              {getMenuItems(sortConstants)}
            </Select>
          </FormControl>
        </Box>
        <Box className={`${classes.subheader} subheader`}>
          <Box className={classes.productAvg}>
            <ProductRating
              styles={classes.rating}
              reviews={reviews}
              showCount={true}
              showAvg={true}
            />
          </Box>
          <Box className={classes.sortByRating}>
            {countReviewRatings(reviews)
              .map((rating, i) => (
                // <Box className={classes.ratingFilter} onClick={() => handleFilterByRating(i + 1)}>
                <Box className={classes.ratingFilter} key={i}>
                  <ProductRating styles={classes.reviewStars} authorRating={i + 1} />
                  <Typography className={classes.ratingStarsText} component="span">
                    ({rating.rating} reviews)
                  </Typography>
                </Box>
              ))
              .reverse()}
          </Box>
        </Box>
        <Box className={classes.reviews}>
          <Box className={classes.reviews}>
            {reducedReviews.sorted.length > 0 &&
              reducedReviews.sorted.map((review, i) => (
                <Box className={classes.review} key={i}>
                  <Typography className={classes.author} component="h4" variant="h5">
                    {review.author}
                  </Typography>
                  <Typography className={classes.date}>{review.reviewDate}</Typography>
                  <ProductRating styles={classes.reviewStars} authorRating={review.reviewRating} />
                  <Typography className={classes.reviewTitle}>{review.reviewTitle}</Typography>
                  <Typography>{review.reviewMessage}</Typography>
                  {review.images.length > 0 &&
                    review.images.map((image, i) => (
                      <Box className={classes.image} key={i}>
                        <Zoom
                          zoomZindex={999999}
                          className="test"
                          image={{
                            src: image.imgixImage.gatsbyImageData.images.fallback.src,
                            alt: image.altText,
                            // className: 'img',
                            style: {
                              width: '100%',
                              borderRadius: '13px',
                              objectFit: 'cover',
                              marginTop: theme.spacing(3),
                              marginRight: theme.spacing(3),
                            },
                          }}
                        >
                          <Image image={image} alt={image.altText} />
                        </Zoom>
                      </Box>
                    ))}
                </Box>
              ))}
          </Box>
        </Box>
        {reducedReviews.totalNumber > loadNumber && (
          <Button variant="outlined" color="secondary" onClick={handleLoadMore}>
            {strings.loadMore}
          </Button>
        )}
      </Container>
    </Box>
  )
}

export default ProductReviews

ProductReviews.propTypes = {}
ProductReviews.defaultProps = {}
