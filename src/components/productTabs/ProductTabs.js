import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Hidden from '@material-ui/core/Hidden'
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'
import parse from 'html-react-parser'

// Components
import { Image } from '../image'

// Utilities
import { getMetafieldValue } from '../../utilities/metafields'

// Language
import strings from './strings'

// Styles
const useStyles = makeStyles((theme) => ({
  productTabs: {
    padding: theme.spacing(2),
    boxShadow: theme.boxShadow,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(5),
    },
  },
  image: {
    borderRadius: theme.shape.borderRadius,
    height: theme.spacing(32),
    objectFit: 'cover',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(5),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      height: theme.spacing(50),
      marginBottom: theme.spacing(5),
    },
  },
  description: {
    '& iframe': {
      maxWidth: '100%',
    },
  },
  formControl: {
    width: '100%',
    marginBottom: theme.spacing(3),
  },
  select: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main,
    width: '100%',
    '& .MuiSelect-root:focus': {
      backgroundColor: 'transparent',
    },
  },
  toggleButtonGroup: {
    display: 'flex',
    justifyContent: 'space-around',
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5),
    marginBottom: theme.spacing(5),
  },
  toggleButton: {
    display: 'inline-flex',
    padding: 0,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.secondary.main,
    border: 'none',
    fontSize: '1rem',
    padding: theme.spacing(0.75, 2.75),
    textTransform: 'capitalize',
    lineHeight: 1.5,
    width: '100%',
    '& .MuiButton-root': {
      width: 'fit-content',
      '& .MuiButton-label': {
        display: 'block',
      },
    },
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.common.white,
    },
    '&:hover': {
      backgroundColor: 'transparent',
      // color: theme.palette.secondary.main,
    },
    '&.MuiToggleButtonGroup-groupedHorizontal:not(:last-child)': {
      borderTopRightRadius: theme.shape.borderRadius,
      borderBottomRightRadius: theme.shape.borderRadius,
    },
    '&.MuiToggleButtonGroup-groupedHorizontal:not(:first-child)': {
      borderTopLeftRadius: theme.shape.borderRadius,
      borderBottomLeftRadius: theme.shape.borderRadius,
      marginLeft: 0,
    },
  },
}))

const ProductTabs = (props) => {
  // console.log('ProductTabs', props.metafields)
  const images = useStaticQuery(graphql`
    {
      allFile(filter: { relativeDirectory: { eq: "productTabs/images" } }) {
        nodes {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
    }
  `)

  const classes = useStyles()
  const [tab, setTab] = useState(0)
  const [image, setImage] = useState()

  const { styles, heading, description, metafields } = props

  const metafieldHeading = getMetafieldValue(metafields, 'product-tabs-heading')
  const metafieldSubheading = getMetafieldValue(metafields, 'product-tabs-subheading')
  const metafieldTabs = getMetafieldValue(metafields, 'product-tabs-tabs')

  const handleSelectChange = (event) => {
    if (event.target.value === tab) return
    setTab(event.target.value)
  }

  const handleButtonToggleChange = (event, newTab) => {
    if (newTab === null) {
      event.preventDefault()
      return
    }
    setTab(newTab)
  }

  useEffect(() => {
    let newImage
    if (tab === 0) {
      newImage =
        metafieldTabs && metafieldTabs[tab]['product-tab-image']
          ? metafieldTabs[tab]['product-tab-image']
          : image
    }
    if (tab !== 0)
      newImage =
        metafieldTabs &&
        metafieldTabs[tab]['product-tab-name'] &&
        metafieldTabs[tab]['product-tab-description'] &&
        metafieldTabs[tab]['product-tab-image']
          ? metafieldTabs[tab]['product-tab-image']
          : image
    setImage(newImage)
  }, [tab])

  // const getImage = () => {
  //   console.log('👾 ProductTabs', image)
  //   return (
  //     <Image
  //       wrapperClassName={classes.image}
  //       src={image}
  //       alt={tab === 0 ? 'Description' : metafieldTabs[tab]['product-tab-name']}
  //     />
  //   )
  // }

  const getDescription = () => {
    if (tab === 0) {
      return (
        <Typography className={classes.description} component="div">
          {metafieldTabs && metafieldTabs[tab]['product-tab-description']
            ? parse(metafieldTabs[tab]['product-tab-description'])
            : parse(description)}
        </Typography>
      )
    }
    return (
      <Typography component="div">
        {parse(metafieldTabs[tab]['product-tab-description'])}
      </Typography>
    )
  }

  // console.log('👾 ProductTabs', image)
  return (
    <Box className={styles}>
      <Container maxWidth="lg">
        <Box className={classes.productTabs}>
          <Typography component="h2" variant="h2" color="secondary" gutterBottom>
            {metafieldHeading ? metafieldHeading : heading}
          </Typography>
          <Typography gutterBottom>{metafieldSubheading}</Typography>
          {image && (
            <Image
              wrapperClassName={classes.image}
              image={image}
              alt={tab === 0 ? 'Description' : metafieldTabs[tab]['product-tab-name']}
            />
          )}
          {/* {image && getImage()} */}
          <Hidden smUp>
            <FormControl className={classes.formControl}>
              <InputLabel className="visuallyHidden" id="tab-select">
                Product tabs
              </InputLabel>
              <Select
                className={classes.select}
                labelId="tab-select"
                id="product-tabs"
                value={tab}
                IconComponent={KeyboardArrowDownIcon}
                onChange={handleSelectChange}
              >
                <MenuItem value={0}>Description</MenuItem>
                {metafieldTabs &&
                  metafieldTabs[1] &&
                  metafieldTabs[1]['product-tab-name'] &&
                  metafieldTabs[1]['product-tab-description'] &&
                  metafieldTabs[1]['product-tab-image'] && (
                    <MenuItem value={1}>{metafieldTabs[1]['product-tab-name']}</MenuItem>
                  )}
                {metafieldTabs &&
                  metafieldTabs[2] &&
                  metafieldTabs[2]['product-tab-name'] &&
                  metafieldTabs[2]['product-tab-description'] &&
                  metafieldTabs[2]['product-tab-image'] && (
                    <MenuItem value={1}>{metafieldTabs[2]['product-tab-name']}</MenuItem>
                  )}
              </Select>
            </FormControl>
          </Hidden>
          <Hidden xsDown>
            <ToggleButtonGroup
              className={classes.toggleButtonGroup}
              value={tab}
              exclusive
              onChange={handleButtonToggleChange}
            >
              <ToggleButton
                className={`${classes.toggleButton}`}
                value={0}
                aria-label="Description"
              >
                Description
              </ToggleButton>
              {metafieldTabs &&
                metafieldTabs[1] &&
                metafieldTabs[1]['product-tab-name'] &&
                metafieldTabs[1]['product-tab-description'] &&
                metafieldTabs[1]['product-tab-image'] && (
                  <ToggleButton
                    className={`${classes.toggleButton}`}
                    value={1}
                    aria-label={metafieldTabs[1]['product-tab-name']}
                  >
                    {metafieldTabs[1]['product-tab-name']}
                  </ToggleButton>
                )}
              {metafieldTabs &&
                metafieldTabs[2] &&
                metafieldTabs[2]['product-tab-name'] &&
                metafieldTabs[2]['product-tab-description'] &&
                metafieldTabs[2]['product-tab-image'] && (
                  <ToggleButton
                    className={`${classes.toggleButton}`}
                    value={2}
                    aria-label={metafieldTabs[2]['product-tab-name']}
                  >
                    {metafieldTabs[2]['product-tab-name']}
                  </ToggleButton>
                )}
            </ToggleButtonGroup>
          </Hidden>
          {getDescription()}
        </Box>
      </Container>
    </Box>
  )
}

export default ProductTabs

ProductTabs.propTypes = {}
ProductTabs.defaultProps = {}
