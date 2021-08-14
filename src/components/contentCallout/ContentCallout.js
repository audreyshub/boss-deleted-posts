import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

// Styles
const useStyles = makeStyles((theme) => ({
  contentCallout: {
    padding: theme.spacing(2, 0),
    borderRadius: theme.shape.borderRadius,
    textAlign: 'center',
    margin: '0 auto',
    maxWidth: '95ch',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(6, 0),
    },
  },
  contentWrapper: {
    backgroundColor: theme.palette.secondary.light,
  },
  title: {
    marginBottom: theme.spacing(3),
    fontStyle: (props) => props.emphasis && 'italic',
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h3,
    },
  },
  content: {
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h3,
      lineHeight: 1.3,
    },
    [theme.breakpoints.up('md')]: {
      ...theme.typography.h2,
    },
  },
}))

const ContentCallout = (props) => {
  // console.log('👾 ContentCallout > ', props)
  const classes = useStyles(props)

  const { styles, title, content } = props

  return (
    <Container className={`${styles} ${classes.container}`} maxWidth="lg">
      <Box className={`${classes.contentWrapper}`}>
        <Box className={`${styles} ${classes.contentCallout}`}>
          {title && (
            <Typography className={classes.title} variant="h4" component="h4">
              {title}
            </Typography>
          )}
          {content && (
            <Typography className={classes.content} variant="h5" component="p">
              {content}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default ContentCallout

export const contentCalloutFields = graphql`
  fragment contentCalloutFields on PrismicHomepageCalloutGroupType {
    title
    content
  }
`

ContentCallout.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
}
