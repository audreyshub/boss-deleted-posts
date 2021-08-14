import React, { useState, useEffect } from 'react'
import equals from 'ramda/src/equals'
import { makeStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'
import Button from '@material-ui/core/Button'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'

// Context
import { useCurrentVariantContext } from '../../../context/CurrentVariantContext'

// Utilities
import { useProductHasMultipleVariants } from '../../../hooks/shopifyHooks'

// Language
import strings from './strings'

// Styles
const useStyles = makeStyles((theme) => ({
  variantSelector: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  optionWrapper: {
    width: 'calc(100% / 3)',
    margin: '0 0.25rem',
  },
  radioWrapper: {
    display: 'flex',
    flexDirection: 'row',
  },
  radioButton: {
    padding: 0,
    '& .MuiButton-label': {
      width: '100%',
      height: '100%',
      display: 'block',
    },
    '& [class*="PrivateRadioButtonIcon"]': {
      display: 'none',
    },
  },
  formLabel: {
    fontWeight: 600,
  },
  toggleButtonGroupWrapper: {
    marginBottom: theme.spacing(2),
  },
  toggleButtonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5),
  },
  toggleButton: {
    padding: 0,
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.secondary.main,
    border: 'none',
    fontSize: '1rem',
    padding: theme.spacing(0.75, 2.75),
    textTransform: 'capitalize',
    lineHeight: 1.5,
    '& .MuiButton-root': {
      width: 'fit-content',
      '& .MuiButton-label': {
        display: 'block',
      },
    },
    '&.Mui-selected, &.Mui-selected:hover': {
      backgroundColor: 'hsla(202, 29%, 82%, 1.00)',
      color: theme.palette.secondary.main,
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

const ProductVariantSelector = (props) => {
  const classes = useStyles()
  const { variants, options } = props
  const hasMultipleVariants = useProductHasMultipleVariants(variants)
  const { setCurrentVariant } = useCurrentVariantContext()
  const [userSelectedOptions, setUserSelectedOptions] = useState(() => {
    let initialState
    options.forEach((option) => {
      initialState = { ...initialState, [option.name]: option.values[0] }
    })
    return initialState
  })

  const showVariants = hasMultipleVariants

  const updateSelectedOptions = (name, value) => {
    setUserSelectedOptions((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const handleOptionsSelect = (name, value) => {
    updateSelectedOptions(name, value)
  }

  const handleOptionsButtonToggle = (name, e) => {
    let el
    if (e.target.classList.contains(`.MuiButtonBase-root`)) {
      el = e.target
    } else {
      el = e.target.closest(`.MuiButtonBase-root`)
    }
    const value = el.value
    updateSelectedOptions(name, value)
  }

  const getVariantFromSelectedOptions = (options, variants) => {
    let variantSelectedOptions
    let availableForSale
    let storefrontId = false
    let price
    let compareAtPrice
    let sku
    let image
    let title
    let productId
    let handle
    let product

    variants.forEach((v) => {
      v.selectedOptions.forEach((o) => {
        variantSelectedOptions = {
          ...variantSelectedOptions,
          [o.name]: o.value,
        }
      })
      if (equals(variantSelectedOptions, options)) {
        storefrontId = v.storefrontId
        availableForSale = v.availableForSale
        price = v.price
        compareAtPrice = v.compareAtPrice
        sku = v.sku
        image = v.image
        title = v.product.title
        productId = v.product.shopifyId
        handle = v.product.handle
        product = v.product
      }
    })
    return {
      storefrontId,
      availableForSale,
      price,
      compareAtPrice,
      sku,
      image,
      title,
      productId,
      handle,
      product,
    }
  }

  // FEATURE -> load variant based on query string, e.g. `/products/adidas-superstar-80s?variant=33030025937032`
  // This url can be added to the schemaProduct
  useEffect(() => {
    setCurrentVariant(getVariantFromSelectedOptions(userSelectedOptions, variants))
  }, [userSelectedOptions, setCurrentVariant, variants])

  // console.log('PRODUCT VARIANT SELECTOR', variants)
  return (
    <>
      {showVariants && (
        <>
          {/* <Box className={classes.variantSelector}>
            <Typography variant="h5" gutterBottom style={{ width: '100%' }}>
              Select dropdowns
            </Typography>
            {options.map((option, index) => {
              return (
                <div className={classes.optionWrapper} key={`${option.name}-${index}`}>
                  <InputLabel id={`${option.name}-${index}`}>
                    {strings.optionLabelPrefix} {option.name}
                  </InputLabel>
                  <Select
                    labelId={`box-${option.name}-${index}`}
                    id={option.name}
                    style={{ width: '100%' }}
                    value={userSelectedOptions[option.name]}
                    onChange={(event) => {
                      handleOptionsSelect(option.name, event.target.value)
                    }}
                    label={option.name}
                  >
                    {option.values.map((value, index) => (
                      <MenuItem key={`option-${option.name}-${index}`} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              )
            })}
          </Box> */}
          <Box className={classes.variantSelector}>
            {options.map((option, i) => {
              return (
                <Box className={classes.toggleButtonGroupWrapper} key={i}>
                  <FormLabel className={classes.formLabel} component="legend">
                    {strings.optionLabelPrefix} {option.name}
                  </FormLabel>
                  <ToggleButtonGroup
                    className={classes.toggleButtonGroup}
                    value={userSelectedOptions[option.name]}
                    exclusive
                    onChange={(e) => {
                      handleOptionsButtonToggle(option.name, e)
                    }}
                    aria-label="Product variant options"
                  >
                    {option.values.map((value, index) => (
                      <ToggleButton
                        className={`${classes.toggleButton}`}
                        value={value}
                        aria-label={value}
                        key={`option-${option.name}-${index}`}
                      >
                        {value}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                </Box>
              )
            })}
          </Box>
        </>
      )}
    </>
  )
}

export default ProductVariantSelector
