import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import { Link as GatsbyLink } from 'gatsby'
import Typography from '@material-ui/core/Typography'
import SvgIcon from '@material-ui/core/SvgIcon'
import scrollTo from 'gatsby-plugin-smoothscroll'

// Utilities
import { getMetafieldValue, validateMetafields } from '../../utilities/metafields'

// Icons
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'

// Styles
const useStyles = makeStyles((theme) => ({
  digitalDownloadWrapper: {},
  body: {
    marginBottom: theme.spacing(4),
  },
  downloadLink: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
    '& span': {
      display: 'inline-block',
      marginLeft: theme.spacing(1),
    },
  },
  subLink: {
    color: theme.palette.secondary.main,
    textDecoration: 'underline',
  },
}))

const DigitalFreeSample = (props) => {
  const classes = useStyles(props)

  const {
    product: { metafields },
  } = props

  // Validation metafields
  const sampleMetafields = {
    title: getMetafieldValue(metafields, 'free-samp-title'),
    content: getMetafieldValue(metafields, 'free-samp-file'),
    label: getMetafieldValue(metafields, 'klaviyo-subscriber-type'),
  }
  const validateSampleMetafields = validateMetafields(sampleMetafields)

  // console.log('👾 DigitalFreeSample', props)
  return (
    <>
      {validateSampleMetafields && (
        <Box className={`${props.styles} ${classes.digitalDownloadWrapper}`}>
          <Typography className={classes.body}>{sampleMetafields.title}</Typography>
          <Box className={classes.downloadLink} component="span">
            <SvgIcon component={CloudDownloadIcon} color="primary" />
            <Typography component="span" onClick={() => scrollTo('#freeSampleSignup')}>
              Free sample download
            </Typography>
          </Box>
          <Link className={classes.subLink} component={GatsbyLink} to="#">
            New to digital planning?
          </Link>
        </Box>
      )}
    </>
  )
}

export default DigitalFreeSample

DigitalFreeSample.propTypes = {}
DigitalFreeSample.defaultProps = {}
