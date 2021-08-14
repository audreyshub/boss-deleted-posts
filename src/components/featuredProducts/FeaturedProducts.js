import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import SvgIcon from '@material-ui/core/SvgIcon'
import Hidden from '@material-ui/core/Hidden'

// Components
import FeaturedProductCard from '../featuredProductCard'

// Assets
import BackgroundLeft from './assets/backgroundLeft.inline.svg'
import BackgroundRight from './assets/backgroundRight.inline.svg'

// Styles
const useStyles = makeStyles((theme) => ({
  featuredProducts: {
    position: 'relative',
    paddingTop: theme.spacing(5),
    // paddingBottom: theme.spacing(10),
    [theme.breakpoints.up('md')]: {
      paddingTop: theme.spacing(10),
      // paddingBottom: theme.spacing(15),
    },
    [theme.breakpoints.up('lg')]: {
      // paddingTop: theme.spacing(15),
    },
  },
  container: {
    display: 'grid',
    gap: theme.spacing(8),
		[theme.breakpoints.up('md')]: {
      gap: theme.spacing(10),
    },
  },
  backgroundLeft: {
    position: 'absolute',
    top: '528px',
    left: 0,
    height: '656px',
    width: '243px',
    transform: 'translateY(-10%)',
    zIndex: '-1',
  },
  backgroundRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    height: '670px',
    width: '172px',
    transform: 'translateY(20%)',
    zIndex: '-1',
  },
}))

const FeaturedProducts = (props) => {
  const classes = useStyles()

  const { styles, products } = props

  return (
    <Box className={`${styles} ${classes.featuredProducts}`}>
      <Hidden smDown>
        <SvgIcon
          className={classes.backgroundLeft}
          component={BackgroundLeft}
          viewBox="0 0 243 656"
        />
        <SvgIcon
          className={classes.backgroundRight}
          component={BackgroundRight}
          viewBox="0 0 172 670"
        />
      </Hidden>
      <Container className={classes.container}>
        {products.map((product, i) => {
          return (
            <FeaturedProductCard key={i} product={product} reverse={i % 2 == 0 ? true : false} />
          )
        })}
      </Container>
    </Box>
  )
}

export default FeaturedProducts

FeaturedProducts.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
}
FeaturedProducts.defaultProps = {}
