import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import { Link as GatsbyLink } from 'gatsby'
import Link from '@material-ui/core/Link'

// Components
import { Image } from '../image'
import GoodForm from '../goodForm'

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  newsletterPrimary: {
    position: 'relative',
    padding: theme.spacing(4, 0, 5),
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    textAlign: 'center',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      borderRadius: '16px',
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
  container: {
    position: 'relative',
    display: 'grid',
    gap: theme.spacing(4),
    maxWidth: '60ch',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    opacity: 0.15,
  },
  title: {},
  content: {},
  inputWrapper: {
    '& form': {
      position: 'relative',
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      color: 'white',
      gap: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr auto',
        gridTemplateRows: '1fr',
      },
    },
    '& .input': {
      border: `1px solid ${theme.palette.common.white}`,
      outline: '1px solid transparent',
      color: theme.palette.common.white,
    },
    '& .MuiInputBase-root': {
      color: theme.palette.common.white,
    },
  },
  freeSampleDownloadButton: {
    justifySelf: 'center',
  },
}))

const NewsletterPrimary = (props) => {
  const data = useStaticQuery(graphql`
    {
      prismicNewsletter {
        data {
          newsletter_primary {
            content
            title
            image {
              alt
              imgixImage {
                gatsbyImageData(width: 1280, imgixParams: { auto: "format, compress" })
              }
            }
            list_id
          }
        }
      }
    }
  `)

  const classes = useStyles()
  const [downloadSample, setDownloadSample] = useState(false)

  const { styles, subscriberType, freeSampleFile } = props
  let { title, content } = props

  const {
    title: cmsTitle,
    content: cmsContent,
    image,
    list_id,
  } = data.prismicNewsletter.data.newsletter_primary[0]

  title = title ? title : cmsTitle
  content = content ? content : cmsContent

  const handleTriggerSampleDownload = (subscriberType) => {
    if (!subscriberType) return
    setDownloadSample(true)
  }

  // console.log('👾 NewsletterPrimary', subscriberType)
  return (
    <Box className={`${styles} ${classes.newsletterPrimary}`}>
      <span className={classes.scrollAnchor} id="freeSampleSignup"></span>
      <Image
        wrapperStyle={{ position: 'absolute' }}
        wrapperClassName={classes.image}
        image={image}
      />

      <Container className={classes.container}>
        {title && (
          <Typography className={classes.title} variant="h2" component="p">
            {title}
          </Typography>
        )}
        {content && <Typography className={classes.content}>{content}</Typography>}
        <Box className={classes.inputWrapper}>
          <GoodForm
            className={classes.inputWrapper}
            subscriberType={subscriberType}
            listId={list_id}
            triggerSampleDownload={handleTriggerSampleDownload}
          />
        </Box>
        {downloadSample && (
          <Button
            className={classes.freeSampleDownloadButton}
            component={Link}
            color="primary"
            variant="contained"
            href={freeSampleFile}
            target="_blank"
          >
            Download free sample
          </Button>
        )}
      </Container>
    </Box>
  )
}

export default NewsletterPrimary

NewsletterPrimary.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  content: PropTypes.string,
}
