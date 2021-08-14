import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

// Components
import { Image } from '../image'

// Svgs

// L18n
import strings from './strings.json'
import { FormatListBulletedOutlined } from '@material-ui/icons'

// Styles
const useStyles = makeStyles((theme) => ({
  bundlePageFlyer: {
    width: '100%',
    borderRadius: '16px',
    backgroundColor: theme.palette.secondary.light,
    border: `1px solid ${theme.palette.grey[300]}`,
    marginBottom: theme.spacing(5),
    padding: theme.spacing(3.375),
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '1fr 55%',
    },
  },
  content: {},
  title: {
    lineHeight: 1.2,
  },
  list: {
    margin: theme.spacing(3, 0),
    listStyleType: 'circle !important',
  },
  bullet: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  subtitle: {
    fontStyle: 'italic',
  },
  image: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'block',
      borderRadius: '16px',
    },
  },
}))

const BundlePageFlyer = (props) => {
  // console.log('👾 BundlePageFlyer', props)
  const theme = useTheme()
  const classes = useStyles(props)

  const { className } = props
  const {
    image,
    list: { raw: bullets },
    note: subtitle,
    title,
  } = props.data.callout[0]
  const splitTitle = title.split('|')

  // console.log('👾 BundlePageFlyer', props)
  return (
    <Box className={clsx(className, classes.bundlePageFlyer, 'bundlePageFlyer')}>
      <Box className={classes.content}>
        <Typography className={classes.title} component="h2" variant="h2">
          {splitTitle[0]}
          {splitTitle[1] && (
            <>
              <br />
              {splitTitle[1]}
            </>
          )}
        </Typography>
        <List className={classes.list} dense={true}>
          {bullets.map((bullet, i) => (
            <ListItem className={classes.bullet} dense={true} key={i}>
              <ListItemText primary={bullet.text} />
            </ListItem>
          ))}
        </List>
        <Typography className={classes.subtitle}>{subtitle}</Typography>
      </Box>
      <Image wrapperClassName={classes.image} image={image} width={650} height={275} />
    </Box>
  )
}

export default BundlePageFlyer

BundlePageFlyer.propTypes = {}

//export const query = graphql`
// fragment BundlePageFlyer on <node type here> {

// }
// `
