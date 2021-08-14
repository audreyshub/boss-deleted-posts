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

// L18n
import strings from './strings.json'

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
  divider: {
    marginBottom: theme.spacing(4),
  },
}))

const PageBreadcrumbs = (props) => {
  // console.log('👾 PageBreadcrumbs > ', props)

  const classes = useStyles(props)
  const { pageTitle } = props

  return (
    <>
      <Container className={classes.breadcrumbs} maxWidth="lg">
        <Crumbs aria-label="breadcrumb" separator={<ArrowForwardIosIcon />}>
          <Link className={classes.crumb} component={GatsbyLink} to="/">
            {strings.rootPath}
          </Link>
          {pageTitle && (
            <Typography className={classes.crumb} color="textPrimary">
              {pageTitle}
            </Typography>
          )}
        </Crumbs>
      </Container>
      <Divider className={classes.divider} />
    </>
  )
}

export default React.memo(PageBreadcrumbs)
