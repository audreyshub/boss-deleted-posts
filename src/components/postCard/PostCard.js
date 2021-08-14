import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import readingTime from 'reading-time'

// Component
import { Image } from '../../components/image'

// Icons
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

//L18n
import strings from './data/strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'grid',
    gridTemplateRows: 'auto 1fr auto auto',
    gap: theme.spacing(1),
    justifyItems: 'start',
    minHeight: '288px',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.common.black,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3, 2),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3, 3),
      gridArea: (props) => `p${props.position}`,
      // gridArea: 'p0'
    },
  },
  image: {
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    opacity: 0.5,
  },
  badge: {
    position: 'relative',
    padding: theme.spacing(1, 2),
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.shape.borderRadius,
  },
  title: {
    position: 'relative',
    alignSelf: 'end',
    maxWidth: '48ch',
    fontWeight: theme.typography.fontWeightBold,

    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h3,
    },
  },
  excerpt: {
    position: 'relative',
    maxWidth: '54ch',
  },
}))

const PostCard = (props) => {
  // console.log('👾 PostCard > ', props)
  const [readTime, setReadTime] = useState()
  const classes = useStyles(props)

  const { styles, title, excerpt, image, link, content } = props

  useEffect(() => {
    if (!content) return
    setReadTime(readingTime(content))
  }, [])

  // console.log('👾 PostCard > ', link)
  return (
    <Box className={`${styles} ${classes.root} postCard`}>
      <Image
        wrapperStyle={{ position: 'absolute' }}
        wrapperClassName={classes.image}
        image={image}
        alt={title}
      />

      {content && (
        <Typography className={classes.badge} variant="h4" component="span" color="secondary">
          {readTime && readTime.text}
        </Typography>
      )}
      <Typography className={classes.title} variant="h5" component="h4">
        {title}
      </Typography>
      <Hidden only="xs">
        <Typography className={classes.excerpt}>{excerpt}</Typography>
      </Hidden>
      <Button
        className={classes.link}
        component={GatsbyLink}
        to={link}
        color="inherit"
        endIcon={<ArrowForwardIcon />}
      >
        {strings.readMore}
      </Button>
    </Box>
  )
}

export default PostCard

PostCard.propTypes = {
  image: PropTypes.object,
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  excerpt: PropTypes.string,
  duration: PropTypes.number,
  link: PropTypes.string.isRequired,
}
