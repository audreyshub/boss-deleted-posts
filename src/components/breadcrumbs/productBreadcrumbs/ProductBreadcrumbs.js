import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link as GatsbyLink } from 'gatsby'
import Typography from '@material-ui/core/Typography'
import { default as Crumbs } from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import queryString from 'query-string'
import { useLocation } from '@reach/router'
import Container from '@material-ui/core/Container'
import Divider from '@material-ui/core/Divider'

// Icons
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'

// Styles
const useStyles = makeStyles((theme) => ({
  breadcrumbs: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    '& .MuiBreadcrumbs-separator': {
      color: theme.palette.secondary.main,
      '& svg': {
        width: '.8rem',
        height: '.8rem',
      },
    },
  },
  crumb: {
    color: theme.palette.secondary.main,
    fontWeight: 600,
  },
}))

const ProductBreadcrumbs = (props) => {
  const classes = useStyles(props)
  const location = useLocation()
  const { productTitle } = props
  const { collection: collectionTitle, path: collectionPath } = queryString.parse(location.search)

  // console.log('PRODUCT BREADCRUMBS', props)
  return (
    <>
      <Container className={classes.breadcrumbs} maxWidth="lg">
        <Crumbs aria-label="breadcrumb" separator={<ArrowForwardIosIcon />}>
          <Link className={classes.crumb} component={GatsbyLink} to="/">
            Home
          </Link>

          {collectionPath && collectionTitle && (
            <Link className={classes.crumb} component={GatsbyLink} to={collectionPath}>
              {collectionTitle}
            </Link>
          )}

          {productTitle && (
            <Typography className={classes.crumb} color="textPrimary">
              {productTitle}
            </Typography>
          )}
        </Crumbs>
      </Container>
      <Divider className={classes.divider} />
    </>
  )
}

export default React.memo(ProductBreadcrumbs)
