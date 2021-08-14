import React from 'react'
import PropTypes from 'prop-types'
import { graphql, Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

// Components
import { PlayerModal } from '../player'
import { Image } from '../image'

// Icons
import PlayCircleFilledWhiteIcon from '@material-ui/icons/PlayCircleFilledWhite'

// Mock images
import mockPlaceholderImage from './images/image.jpeg'

// Styles
const useStyles = makeStyles((theme) => ({
  contentWithVideo: {
    position: 'relative',
    display: 'grid',
    gridTemplateRows: 'auto 1fr',
    gap: theme.spacing(3),
    [theme.breakpoints.up('md')]: {
      gridTemplate: 'auto / 1fr 1fr',
      alignItems: 'center',
    },
  },
  scrollAnchor: {
    visibility: 'hidden',
    width: '1px',
    height: '1px',
    position: 'absolute',
    top: 0,
    transform: 'translateY(-20vh)',
  },
  content: {
    display: 'grid',
    gap: theme.spacing(3),
    '& p': {
      [theme.breakpoints.up('md')]: {
        maxWidth: '53ch',
      },
    },
  },
  title: {
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h2,
    },
  },
  button: {
    [theme.breakpoints.up('sm')]: {
      width: 'max-content',
    },
  },
  media: {
    position: 'relative',
    display: 'grid',
    placeItems: 'center',
    height: '192px',
    backgroundColor: theme.palette.common.black,
    borderRadius: theme.shape.borderRadius,
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      height: '440px',
    },
    [theme.breakpoints.up('md')]: {
      height: '340px',
      order: (props) => (props.reverse ? '1' : '0'),
    },
  },
  image: {
    position: 'absolute !important',
    width: '100%',
    height: '100%',
    opacity: 0.5,
  },
  icon: {
    position: 'relative',
    height: '48px',
    width: '48px',
    color: theme.palette.common.white,
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      height: '64px',
      width: '64px',
    },
  },
}))

const ContentWithVideo = React.forwardRef((props, ref) => {
  // console.log('👾 ContentWithVideo > ', mockPlaceholderImage)
  const classes = useStyles(props)

  const { styles, id, image, title, youtube_id, content, label, link } = props

  // console.log('👾 ContentWithVideo > ', props)
  return (
    <Container ref={ref} className={`${styles} ${classes.contentWithVideo}`}>
      <span className={classes.scrollAnchor} id={id}></span>
      <Box className={classes.media}>
        <Image wrapperClassName={classes.image} image={image} alt={title} />

        <PlayerModal
          videoSrc={youtube_id}
          triggerComponent={
            <Button aria-label="play video">
              <PlayCircleFilledWhiteIcon className={classes.icon} />
            </Button>
          }
        />
      </Box>
      <Box className={classes.content}>
        <Typography className={classes.title} variant="h3" component="h3">
          {title}
        </Typography>
        <Typography>{content}</Typography>

        {label && link && (
          <Button
            className={classes.button}
            component={GatsbyLink}
            to={link}
            variant="contained"
            color="primary"
          >
            {label}
          </Button>
        )}
      </Box>
    </Container>
  )
})

export default ContentWithVideo

export const contentWithVideoFields = graphql`
  fragment contentWithVideoFields on PrismicHomepageHowItWorksGroupType {
    title
    type
    label
    handle
    youtube_id
    content {
      text
    }
    image {
      alt
      url
      imgixImage {
        gatsbyImageData(width: 620, imgixParams: { auto: "format, compress" })
      }
    }
  }
`

ContentWithVideo.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  label: PropTypes.string,
  handle: PropTypes.string,
  youtube_id: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  reverse: PropTypes.bool,
}
ContentWithVideo.defaultProps = {
  reverse: false,
}
