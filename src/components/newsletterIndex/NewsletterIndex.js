// WIP Still need to add Klaviyo form
import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import { makeStyles } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'

// Components
import { Image } from '../image'
import GoodForm from '../goodForm'

// L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  newsletterIndex: {
    display: 'grid',
    gap: theme.spacing(2),
    backgroundColor: theme.palette.common.white,
    border: `1px solid ${theme.palette.grey[200]}`,
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 8px 32px rgba(0, 77, 112, 0.06)',
    overflow: 'hidden',
    [theme.breakpoints.up('sm')]: {
      gap: theme.spacing(6),
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr 1fr',
      alignItems: 'center',
    },
    [theme.breakpoints.up('lg')]: {
      gridTemplateColumns: '1fr 640px',
    },
  },
  inner: {
    padding: theme.spacing(0, 2, 2),
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 6, 6),
    },
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(0, 6),
    },
  },
  image: {
    height: 0,
    paddingTop: '256px',
    [theme.breakpoints.up('md')]: {
      order: 1,
    },
  },
  title: {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      ...theme.typography.h2,
      maxWidth: '22ch',
    },
  },
  inputWrapper: {
    '& form': {
      position: 'relative',
      display: 'grid',
      gridTemplateRows: '1fr 1fr',
      gap: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: '1fr 244px',
        gridTemplateRows: '1fr',
        gap: theme.spacing(2),
      },
      [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '1fr auto',
      },
    },
  },
  input: {
    padding: theme.spacing(1.625, 2),
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: theme.shape.borderRadius,
    outline: '1px solid transparent',
    color: theme.palette.secondary.main,
  },
  helper: {
    position: 'absolute',
    left: theme.spacing(1),
    bottom: 0,
    transform: 'translateY(175%)',
    [theme.breakpoints.up('sm')]: {
      left: theme.spacing(2),
    },
  },
}))

const NewsletterIndex = (props) => {
  // console.log('👾 NewsletterIndex > ', props)

  const classes = useStyles(props)

  const { styles, title, image, list_id } = props

  return (
    <Container>
      <Box className={`${styles} ${classes.newsletterIndex}`}>
        <Image wrapperClassName={classes.image} image={image} alt={title} />

        <Box className={classes.inner}>
          {title && (
            <Typography className={classes.title} variant="h4" component="h4">
              {title}
            </Typography>
          )}
          {/* CMS need list_id added to home page newsletter */}
          <GoodForm
            className={classes.inputWrapper}
            subscriberType="newsletter"
            listId={list_id ? list_id : null}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default NewsletterIndex

export const newsletterIndexFields = graphql`
  fragment newsletterIndexFields on PrismicHomepageNewsletterGroupType {
    list_id
    image {
      url
      imgixImage {
        gatsbyImageData(width: 640, imgixParams: { auto: "format, compress" })
      }
    }
    label
    placeholder
    title
  }
`

NewsletterIndex.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  image: PropTypes.object,
  formId: PropTypes.string,
  helperText: PropTypes.string,
  helper: PropTypes.bool,
}
NewsletterIndex.defaultProps = {
  helper: false,
}
