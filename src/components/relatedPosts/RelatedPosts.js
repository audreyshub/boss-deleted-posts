import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

// Components
import PostCard from '../../components/postCard'

// Utilities
import linkResolver from '../../utilities/linkResolver'

//L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  relatedPosts: {
    paddingTop: theme.spacing(4),
  },
  wrapper: {
    display: 'grid',
    gap: theme.spacing(4),
    paddingTop: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 1fr 1fr',
      '& .postCard': {
        gridArea: 'unset',
      },
    },
  },
}))

const RelatedPosts = (props) => {
  // console.log('👾 RelatedPosts > ', card)

  const classes = useStyles()

  return (
    <Container className={`${props.styles} ${classes.relatedPosts}`}>
      <Typography variant="h2">{props.title}</Typography>
      <Box className={classes.wrapper}>
        {props.posts.map((post, i) => {
          const card = {
            image: post.data.image,
            title: post.data.title,
            label: strings.label,
            excerpt: post.data.excerpt,
            content: post.data.content.text,
            link: linkResolver({ uid: post.uid, type: 'post' }),
          }
          return <PostCard key={i} {...card} />
        })}
      </Box>
    </Container>
  )
}

export default RelatedPosts

RelatedPosts.propTypes = {}
