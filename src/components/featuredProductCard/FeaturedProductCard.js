import React from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'

// Components
import ProductRating from '../productRating'
import ProductPrice from '../productPrice'
import ProductAddToCart from '../productAddToCart'
import { Image } from '../image'

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  featuredProductCard: {
    display: 'grid',
    gap: theme.spacing(3),
    gridTemplateRows: 'auto 1fr',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 1fr',
      gridTemplateRows: 'auto',
      gap: theme.spacing(5),
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: '620px 1fr',
      alignItems: 'center',
    },
  },
  image: {
    // paddingTop: '60%',
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      order: (props) => (props.reverse ? '1' : '0'),
    },
  },
  inner: {
    display: 'grid',
    gap: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(6, 0),
    },
  },
  badge: {
    width: 'max-content',
    padding: theme.spacing(1, 2),
    backgroundColor: 'hsla(30, 82%, 94%, 1)',
    color: 'hsla(11, 83%, 70%, 1)',
    borderRadius: theme.shape.borderRadius,
  },
  title: {
    lineHeight: 1,
    ...theme.typography.h3,
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h2,
    },
  },
  content: {
    display: '-webkit-box',
    '-webkit-line-clamp': 8,
    '-webkit-box-orient': 'vertical',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  rating: {
    justifyContent: 'start',
  },
  price: {
    ...theme.typography.h3,
  },
  button: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
      justifySelf: 'left',
    },
  },
}))

const FeaturedProductCard = (props) => {
  const classes = useStyles(props)

  const { product } = props

  const {
    badge,
    description,
    featuredImage,
    fields: { shopifyThemePath },
    link,
    metafields,
    priceRangeV2: { minVariantPrice },
    reviews,
    tags,
    title,
    styles,
    variants,
  } = product

  // console.log('LOG: FeaturedProductCard.js > ', props)
  return (
    <Box className={`${styles} ${classes.featuredProductCard}`}>
      <Image wrapperClassName={classes.image} image={featuredImage} alt={title} />

      <Box className={classes.inner}>
        {badge && <Box className={classes.badge}>{badge}</Box>}
        <Link component={GatsbyLink} to={shopifyThemePath} color="inherit" underline="none">
          <Typography className={classes.title} component="h3">
            {title}
          </Typography>
        </Link>
        <Typography className={classes.content} dangerouslySetInnerHTML={{ __html: description }} />
        <ProductRating styles={classes.rating} reviews={reviews} />
        <Typography variant="h3">
          <ProductPrice amount={minVariantPrice.amount} />
        </Typography>
        <ProductAddToCart
          styles={classes.button}
          product={product}
          buttonColor="primary"
          linkComponent="link"
        />
      </Box>
    </Box>
  )
}

export default FeaturedProductCard

FeaturedProductCard.propTypes = {
  badge: PropTypes.string,
  reverse: PropTypes.bool,
}
FeaturedProductCard.defaultProps = {
  reverse: false,
}
