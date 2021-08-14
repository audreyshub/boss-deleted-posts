import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'

// Components
import PostCard from '../../components/postCard'
import linkResolver from '../../utilities/linkResolver'

//L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  postGrid: {
    paddingTop: theme.spacing(8),
  },
  wrapper: {
    display: 'grid',
    gap: theme.spacing(2),
    gridTemplateRows: '288px',
    paddingBottom: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      gridTemplateRows: '408px',
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'repeat(12, 1fr)',
      gridTemplateAreas:
        '"p0 p0 p0 p0 p0 p0 p1 p1 p1 p1 p1 p1""p2 p2 p2 p2 p2 p2 p2 p2 p2 p2 p2 p2""p3 p3 p3 p3 p4 p4 p4 p4 p5 p5 p5 p5""p6 p6 p6 p6 p6 p6 p7 p7 p7 p7 p7 p7"',
      gap: theme.spacing(3),
    },
  },
  postCard: {
    [theme.breakpoints.up('md')]: {
      minHeight: '408px',
    },
  },
}))

const PostGrid = (props) => {
  const classes = useStyles()

  return (
    <Container className={`${props.styles} ${classes.postGrid}`}>
      <Typography className={classes.title} variant="h2">
        {strings.title}
      </Typography>
      <Box className={classes.wrapper}>
        {props.posts.map((post, i) => {
          const card = {
            image: post.data.image,
            title: post.data.title,
            label: strings.label,
            link: linkResolver({ uid: post.uid, type: post.type }),
            excerpt: post.data.excerpt,
            content: post.data.content.text,
          }
          return <PostCard key={i} {...card} styles={classes.postCard} position={i} />
        })}
      </Box>
    </Container>
  )
}

export default PostGrid

PostGrid.propTypes = {}
PostGrid.defaultProps = {}
