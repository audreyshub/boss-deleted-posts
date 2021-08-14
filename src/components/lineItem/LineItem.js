import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import SvgIcon from '@material-ui/core/SvgIcon'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

// Components
import ProductCounter from '../productCounter'
import { Image } from '../image'
import FormattedVariants from '../formattedVariants'
import ProductPrice from '../productPrice'

// Context
import { useUpdateItemsFromCart, useRemoveItemFromCart } from '../../context/StoreCheckoutContext'

// SVG
import IconDiscountBadge from './svg/discountBadge.inline.svg'

// Language
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  lineItem: {
    position: 'relative',
  },
  innerWrapper: {
    position: 'relative',
    zIndex: 1,
    padding: (props) =>
      props.location === 'floatingCart' ? theme.spacing(3, 3) : theme.spacing(3, 0),
    display: 'grid',
    gridTemplateColumns: '25% 35% 1fr',
    gridTemplateRows: 'auto auto auto auto auto',
    gridColumnGap: theme.spacing(2),
    gridRowGap: theme.spacing(1),
    gridTemplateAreas:
      '"image title title" "image variants variants" "image priceWrapper priceWrapper" "image discount discount" "image quantity delete"',
  },
  loadingOverlay: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: theme.palette.secondary.light,
    opacity: 0,
    transition: `z-index 0s, opacity .2s`,
    '&.isLoading': {
      transition: `z-index 0s, opacity .5s`,
      zIndex: 2,
      opacity: 0.6,
    },
  },
  image: {
    gridArea: 'image',
    borderRadius: '8px',
  },
  title: {
    gridArea: 'title',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontWeight: 600,
    marginBottom: theme.spacing(1),
  },
  variants: {
    gridArea: 'variants',
    marginBottom: theme.spacing(1),
  },
  priceWrapper: {
    gridArea: 'priceWrapper',
    marginBottom: 0,
  },
  discountWrapper: {
    gridArea: 'discount',
    justifySelf: 'start',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(1),
    textAlign: 'left',
  },
  discountBadge: {
    display: 'inline-block',
    marginRight: theme.spacing(1),
    height: '18px',
    width: '18px',
    transform: 'translateY(2px)',
  },
  price: {
    fontWeight: 600,
  },
  quantityWrapper: {
    gridArea: 'quantity',
  },
  delete: {
    gridArea: 'delete',
    justifySelf: 'start',
    alignSelf: 'end',
    cursor: 'pointer',
    border: `1px solid ${theme.palette.secondary.main}`,
    borderRadius: '8px',
    padding: theme.spacing(1),
  },
  compareAtPrice: {
    color: theme.palette.grey[600],
    textDecoration: 'line-through',
    display: 'inline-block',
    marginLeft: theme.spacing(2),
  },
}))

const useCartTemplateStyles = makeStyles((theme) => ({
  innerWrapper: {
    gridTemplateColumns: '12.5% 1fr 20% 20%',
    gridTemplateRows: 'auto 1fr',
    gridTemplateAreas: '"image title quantity priceWrapper" "image variants quantity discount" ',
  },
  quantityWrapper: {
    justifySelf: 'center',
    alignSelf: 'start',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceWrapper: {
    justifySelf: 'end',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  discountWrapper: {
    textAlign: 'right',
    justifySelf: 'end',
  },
  delete: {
    marginLeft: theme.spacing(2),
  },
  image: {
    minHeight: '144px',
    [theme.breakpoints.up('sm')]: {
      minHeight: '160px',
    },
  },
}))

const buildThumb = (image) => {
  const { src, altText } = image
  const splitImageSrc = src.split(/\.(?=[^\.]+$)/)
  const thumbUrlSmall = `${splitImageSrc[0]}_150x.${splitImageSrc[1]}`
  const thumbUrlMedium = `${splitImageSrc[0]}_320x.${splitImageSrc[1]}`
  return { thumbUrlSmall, thumbUrlMedium, altText }
}

const LineItem = (props) => {
  const theme = useTheme()
  const mdUp = useMediaQuery(theme.breakpoints.up('md'))
  const classes = useStyles(props)
  const cartTemplateMediumClasses = useCartTemplateStyles()
  const [isMediumAndCartTemplate, setIsMediumAndCartTemplate] = useState(false)
  const [thumbUrl, setThumbUrl] = useState()
  const [discountDescription, setDiscountDescription] = useState()
  const [discountAmount, setDiscountAmount] = useState()
  const {
    load: loadUpdate,
    isPending: isPendingUpdate,
    isReloading: isReloadingUpdate,
  } = useUpdateItemsFromCart()
  const {
    load: loadDelete,
    isPending: isPendingDelete,
    isReloading: isReloadingDelete,
  } = useRemoveItemFromCart()
  const { lineItem } = props
  const { quantity, title, variant, discountAllocations } = lineItem
  const { image, price, compareAtPrice } = variant

  const { cartItemPriceLabel, cartItemAriaRemoveFromCart } = strings

  const { thumbUrlSmall, thumbUrlMedium, altText } = buildThumb(image)

  const discountApplication =
    discountAllocations.length > 0 ? discountAllocations[0].discountApplication : null
  const discountApplicationDescription = discountApplication
    ? discountApplication.description
    : null
  const discountApplicationAmount = discountApplication ? discountApplication.value.amount : null

  useEffect(() => {
    const mdAndCart = mdUp && props.location === 'cartTemplate'
    setIsMediumAndCartTemplate(mdAndCart)
    setThumbUrl(mdAndCart ? thumbUrlMedium : thumbUrlSmall)
  }, [mdUp, thumbUrl])

  useEffect(() => {
    if (!discountApplication) return
    setDiscountDescription(discountApplicationDescription)
    setDiscountAmount(discountApplicationAmount)
  }, [discountApplicationAmount])

  const decreaseProductQuantity = async ({ id, quantity }) => {
    if (quantity === 1) return
    try {
      await loadUpdate({ id, quantity: quantity - 1 })
    } catch (error) {
      console.error(error.message)
    }
  }

  const increaseProductQuantity = async ({ id, quantity }) => {
    try {
      await loadUpdate({ id, quantity: quantity + 1 })
    } catch (error) {
      console.error(error.message)
    }
  }

  // console.log('👾 LineItem', lineItem)
  return (
    <Box className={`${props.styles} ${classes.lineItem} `}>
      <Box
        className={`${classes.loadingOverlay} ${
          isPendingUpdate || isReloadingUpdate || isPendingDelete || isReloadingDelete
            ? 'isLoading'
            : 'isResolved'
        }`}
      ></Box>
      <Box
        className={`${classes.innerWrapper} ${
          isMediumAndCartTemplate && cartTemplateMediumClasses.innerWrapper
        }`}
      >
        {thumbUrl && (
          <Image
            wrapperClassName={`${classes.image} ${
              isMediumAndCartTemplate && cartTemplateMediumClasses.image
            }`}
            objectFit="cover"
            src={
              thumbUrl
                ? thumbUrl
                : 'https://fakeimg.pl/140x140/?text=Placeholder%0AImage&font=lobster&font_size=12'
            }
            width={140}
            height={140}
            sizes={`112px`}
            alt={altText ? altText : title}
          />
        )}

        <Typography className={`${classes.title}`} variant="body1">
          {title}
        </Typography>
        <FormattedVariants className={`${classes.variants}`} variant={variant} format="box" />
        <Typography
          className={`${classes.priceWrapper} ${
            isMediumAndCartTemplate && cartTemplateMediumClasses.priceWrapper
          }`}
          variant="body1"
          gutterBottom
        >
          <Typography className={`${classes.price}`} component="span" variant="body1">
            <ProductPrice amount={price} aria-label={cartItemPriceLabel} />
          </Typography>
          {compareAtPrice && compareAtPrice !== '0.00' && (
            <Typography className={`${classes.compareAtPrice}`} component="span" variant="body1">
              <ProductPrice amount={compareAtPrice} />
            </Typography>
          )}
        </Typography>
        {discountDescription && discountAmount && (
          <Box
            className={`${classes.discountWrapper} ${
              isMediumAndCartTemplate && cartTemplateMediumClasses.discountWrapper
            }`}
          >
            <Typography
              className={`${classes.discountDescription}`}
              component="span"
              variant="body1"
            >
              <SvgIcon
                className={classes.discountBadge}
                component={IconDiscountBadge}
                viewBox="0 0 18 18"
              />
              {discountDescription} (-{<ProductPrice amount={discountAmount} />})
            </Typography>
          </Box>
        )}
        <Box
          className={`${classes.quantityWrapper} ${
            isMediumAndCartTemplate && cartTemplateMediumClasses.quantityWrapper
          }`}
        >
          <ProductCounter
            label={isMediumAndCartTemplate ? false : true}
            currentQuantity={quantity}
            decreaseQuantity={async () => {
              await decreaseProductQuantity({ id: lineItem.id, quantity: lineItem.quantity })
            }}
            increaseQuantity={async () => {
              await increaseProductQuantity({ id: lineItem.id, quantity: lineItem.quantity })
            }}
          />
          {isMediumAndCartTemplate && (
            <IconButton
              className={`${classes.delete} ${
                isMediumAndCartTemplate && cartTemplateMediumClasses.delete
              }`}
              onClick={() => loadDelete(lineItem.id)}
              aria-label={cartItemAriaRemoveFromCart}
            >
              <CloseIcon color="secondary" />
            </IconButton>
          )}
        </Box>
        {!isMediumAndCartTemplate && (
          <IconButton
            className={`${classes.delete}`}
            onClick={() => loadDelete(lineItem.id)}
            aria-label={cartItemAriaRemoveFromCart}
          >
            <CloseIcon color="secondary" />
          </IconButton>
        )}
      </Box>
    </Box>
  )
}

export default LineItem
