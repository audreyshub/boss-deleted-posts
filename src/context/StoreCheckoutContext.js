/*
  Original Author of this file: https://github.com/thetrevorharmon
  Original File: https://github.com/thetrevorharmon/sell-things-fast/blob/master/src/context/StoreCheckoutContext.js

  TYPED out by Issac: https://gist.github.com/isaac-martin

  Extended by Kevin Green for ✨
*/

import React, { useState, useEffect, useContext, useCallback } from 'react'
import ShopifyClient from 'shopify-buy'
import cookie from 'js-cookie'
import { useDeferredLoads } from 'react-loads'
import { decode } from 'shopify-gid'

const SHOPIFY_CHECKOUT_STORAGE_KEY = 'shopify_checkout_id'

// @ts-ignore
const client = ShopifyClient.buildClient({
  storefrontAccessToken: process.env.GATSBY_SHOPIFY_STOREFRONT_TOKEN,
  domain: `${process.env.GATSBY_SHOP_NAME}.myshopify.com`,
})

const initialStoreCheckoutState = {
  shopifyClient: client,
  isAdding: false,
  cartIsOpen: false,
  page: undefined,
  customerEmail: undefined,
  customerName: undefined,
  customerLastName: undefined,
  customerToken: undefined,
  orders: [],
  navIsOpen: false,
  checkout: {
    lineItems: null,
  },
}

const StoreCheckoutContext = React.createContext({
  storeCheckout: initialStoreCheckoutState,
  setStoreCheckout: () => null,
})
StoreCheckoutContext.displayName = 'StoreCheckoutContext'

const createNewCheckout = (storeCheckout) => {
  return storeCheckout.shopifyClient.checkout.create()
}

const fetchCheckout = (storeCheckout, id) => {
  return storeCheckout.shopifyClient.checkout.fetch(id)
}

const setCheckoutInState = (checkout, setStoreCheckout) => {
  const isBrowser = typeof window !== 'undefined'
  if (isBrowser) {
    localStorage.setItem(SHOPIFY_CHECKOUT_STORAGE_KEY, checkout.id)
  }

  setStoreCheckout((prevState) => {
    return { ...prevState, checkout }
  })
}

const klaviyoIdentify = (email) => {
  if (typeof window === 'undefined') return
  let _learnq = window._learnq || []
  _learnq.push([
    'identify',
    {
      $email: email,
    },
  ])
}

const klaviyoTrack = (event, item) => {
  if (typeof window === 'undefined') return
  let _learnq = window._learnq || []
  _learnq.push(['track', event, item])
}

const initCustomer = (setStoreCheckout) => {
  const customerEmail = cookie.get('customer_email')
  const customerToken = cookie.get('customer_token')
  const customerName = cookie.get('customer_firstName')
  const customerLastName = cookie.get('customer_lastName')
  const customerId = cookie.get('customer_id')

  if (customerEmail) klaviyoIdentify(customerEmail)

  if (customerEmail && customerToken && customerName && customerLastName) {
    setStoreCheckout((prevState) => {
      return {
        ...prevState,
        customerEmail,
        customerToken,
        customerName,
        customerLastName,
        customerId,
      }
    })
  }
}

const SetCustomerInState = () => {
  const { setStoreCheckout } = useContext(StoreCheckoutContext)

  async function updateCustomerInState() {
    const customerEmail = cookie.get('customer_email')
    const customerToken = cookie.get('customer_token')
    const customerName = cookie.get('customer_firstName')
    const customerLastName = cookie.get('customer_lastName')
    const customerId = cookie.get('customer_id')

    setStoreCheckout((prevState) => {
      return {
        ...prevState,
        customerEmail,
        customerToken,
        customerName,
        customerLastName,
        customerId,
      }
    })
  }

  const { error, isPending, isReloading, isResolved, load } = useDeferredLoads(
    'updateCustomerInState',
    updateCustomerInState
  )
  return { error, isPending, isReloading, isResolved, load }
}

const StoreCheckoutContextProvider = ({ children }) => {
  const [storeCheckout, setStoreCheckout] = useState(initialStoreCheckoutState)
  const [initStore, setInitStore] = useState(false)

  useEffect(() => {
    // console.log('StoreCheckoutContextProvider useEffect is running')
    if (initStore === false) {
      const initializeCheckout = async () => {
        // Check for an existing cart.
        const isBrowser = typeof window !== 'undefined'
        const existingCheckoutId = isBrowser
          ? localStorage.getItem(SHOPIFY_CHECKOUT_STORAGE_KEY)
          : null

        if (existingCheckoutId) {
          // console.log('StoreCheckoutContextProvider --> checkout ID exists', existingCheckoutId)
          try {
            const checkout = await fetchCheckout(storeCheckout, existingCheckoutId)

            // Make sure none of the items in this cart have been deleted from Shopify.
            if (checkout.lineItems.some((lineItem) => !lineItem.variant)) {
              throw new Error(
                'Invalid line item in checkout. This variant was probably deleted from Shopify'
              )
            }

            // Make sure this cart hasn’t already been purchased.
            if (!checkout.completedAt) {
              setCheckoutInState(checkout, setStoreCheckout)
              return
            }
          } catch (e) {
            // console.log('StoreCheckoutContextProvider --> checkout ID does not exist')
            localStorage.setItem(SHOPIFY_CHECKOUT_STORAGE_KEY, null)
          }
        }

        const newCheckout = await createNewCheckout(storeCheckout)
        // console.log('StoreCheckoutContextProvider --> new checkout is', newCheckout)
        setCheckoutInState(newCheckout, setStoreCheckout)
      }
      initCustomer(setStoreCheckout)
      initializeCheckout()
      setInitStore(true)
    }
  }, [storeCheckout, setStoreCheckout, storeCheckout.shopifyClient.checkout, initStore])

  // console.log('👾 StoreCheckoutContext Provider', storeCheckout)
  return (
    <StoreCheckoutContext.Provider
      value={{
        storeCheckout,
        setStoreCheckout,
      }}
    >
      {children}
    </StoreCheckoutContext.Provider>
  )
}

// =======================================================
//
//    Hooks
//
// =======================================================
function useStoreCheckout() {
  const { storeCheckout } = useContext(StoreCheckoutContext)
  return storeCheckout
}

function useCartCount() {
  const {
    storeCheckout: { checkout },
  } = useContext(StoreCheckoutContext)

  let count = 0
  if (checkout.lineItems) {
    count = checkout.lineItems.reduce((runningTotal, item) => item.quantity + runningTotal, 0)
  }

  return count
}

function useCartTotals() {
  const {
    storeCheckout: { checkout },
  } = useContext(StoreCheckoutContext)

  const tax = checkout.totalTaxV2 ? `${Number(checkout.totalTaxV2.amount).toFixed(2)}` : '-'
  const subtotalBeforeDiscount = checkout.lineItemsSubtotalPrice
    ? `${Number(checkout.lineItemsSubtotalPrice.amount).toFixed(2)}`
    : '-'
  const total = checkout.totalPriceV2 ? `${Number(checkout.totalPriceV2.amount).toFixed(2)}` : '-'

  return {
    tax,
    subtotalBeforeDiscount,
    total,
  }
}

function useCartItems() {
  const {
    storeCheckout: { checkout },
  } = useContext(StoreCheckoutContext)

  return checkout.lineItems
}

function useCustomer() {
  const {
    storeCheckout: { customerEmail, customerName, customerLastName, customerToken },
  } = useContext(StoreCheckoutContext)

  return { customerEmail, customerName, customerLastName, customerToken }
}

function useAddItemToCart() {
  // @ts-ignore
  const {
    storeCheckout: { checkout, shopifyClient },
    setStoreCheckout,
  } = useContext(StoreCheckoutContext)

  async function addItemToCart(variant, variantId, quantity, attributes) {
    if (variantId === '' || !quantity) {
      console.error('Both a size and quantity are required.')
      return
    }

    setStoreCheckout((prevState) => {
      return { ...prevState, isAdding: true }
    })

    const checkoutId = checkout.id
    // console.log('checkout ID', checkoutId)
    const lineItemsToAdd = [{ variantId, quantity, customAttributes: attributes }]

    const newCheckout = await shopifyClient.checkout.addLineItems(checkoutId, lineItemsToAdd)

    const decodedProductId = decode(variant.product.storefrontId)

    const klaviyoItem = {
      Name: variant.product.title,
      ProductID: decodedProductId.id,
      ImageURL: variant.image.originalSrc,
      URL: `https://bosspersonalplanner.com/products/${variant.product.handle}`,
      Price: variant.price,
      CompareAtPrice: variant.compareAtPrice,
    }

    klaviyoTrack('Added to Cart', klaviyoItem)

    Promise.resolve(newCheckout)

    // Stop cart drawer from opening when adding a new product to the cart on the cart page
    const currentUrl = window.location.href
    const isCartPage = currentUrl.includes('/cart')

    setStoreCheckout((prevState) => {
      return {
        ...prevState,
        checkout: newCheckout,
        cartIsOpen: isCartPage ? false : true,
        isAdding: false,
      }
    })
  }

  const { error, isPending, isReloading, isResolved, load } = useDeferredLoads(
    'addItemToCart',
    addItemToCart
  )
  // return addItemToCart
  return { error, isPending, isReloading, isResolved, load }
}

function useAddMultipleItemsToCart() {
  // @ts-ignore
  const {
    storeCheckout: { checkout, shopifyClient },
    setStoreCheckout,
  } = useContext(StoreCheckoutContext)

  async function addMultipleItemsToCart(itemsArr) {
    for (const item of itemsArr) {
      let { variantId, quantity } = item

      if (variantId === '' || !quantity) {
        console.error('Both a size and quantity are required.')
        return
      }
    }

    setStoreCheckout((prevState) => {
      return { ...prevState, isAdding: true }
    })

    const checkoutId = checkout.id
    const lineItemsToAdd = itemsArr
    // console.log('CHECKOUT CONTEXT > LINE ITEMS', lineItemsToAdd)

    const newCheckout = await shopifyClient.checkout.addLineItems(checkoutId, lineItemsToAdd)

    Promise.resolve(newCheckout)

    setStoreCheckout((prevState) => {
      return { ...prevState, checkout: newCheckout, cartIsOpen: true, isAdding: false }
    })
  }

  const { error, isPending, isReloading, isResolved, load } = useDeferredLoads(
    'addMultipleItemsToCart',
    addMultipleItemsToCart
  )
  // return addItemToCart
  return { error, isPending, isReloading, isResolved, load }
}

function useRemoveItemFromCart() {
  const {
    storeCheckout: { checkout, shopifyClient },
    setStoreCheckout,
  } = useContext(StoreCheckoutContext)

  async function removeItemFromCart(itemId) {
    const newCheckout = await shopifyClient.checkout.removeLineItems(checkout.id, [itemId])

    setStoreCheckout((prevState) => {
      return { ...prevState, checkout: newCheckout }
    })
  }

  // return removeItemFromCart
  const { error, isPending, isReloading, load } = useDeferredLoads(
    'removeItemFromCart',
    removeItemFromCart
  )
  return { error, isPending, isReloading, load }
}

function useUpdateItemsFromCart() {
  const {
    storeCheckout: { checkout, shopifyClient },
    setStoreCheckout,
  } = useContext(StoreCheckoutContext)

  async function updateItemsFromCart(items) {
    try {
      items = [].concat(items)
      const newCheckout = await shopifyClient.checkout.updateLineItems(checkout.id, items)

      setStoreCheckout((prevState) => {
        return { ...prevState, checkout: newCheckout }
      })
    } catch (e) {
      console.error(e)
      alert("This varian ID doesn't exist in the cart to update")
    }
    return null
  }

  const { error, isPending, isReloading, load } = useDeferredLoads(
    'updateItemsFromCart',
    updateItemsFromCart
  )
  // return updateItemsFromCart
  return { error, isPending, isReloading, load }
}

function useCheckoutUrl() {
  const {
    storeCheckout: { checkout },
  } = useContext(StoreCheckoutContext)

  // console.log('CHECKOUT', checkout)
  return checkout.webUrl
}

function useSetPage() {
  const { setStoreCheckout } = useContext(StoreCheckoutContext)
  async function setPage(page) {
    setStoreCheckout((prevState) => {
      return { ...prevState, page }
    })
  }
  return setPage
}

function useToggleCart() {
  const {
    storeCheckout: { cartIsOpen },
    setStoreCheckout,
  } = useContext(StoreCheckoutContext)

  async function toggleCart() {
    setStoreCheckout((prevState) => {
      return { ...prevState, cartIsOpen: !cartIsOpen }
    })
  }

  async function openCart() {
    setStoreCheckout((prevState) => {
      return { ...prevState, cartIsOpen: true }
    })
  }

  async function closeCart() {
    setStoreCheckout((prevState) => {
      return { ...prevState, cartIsOpen: false }
    })
  }

  return { toggleCart, openCart, closeCart }
}

// FEATURE: Add a discount

// FEATURE: Remove a discount

export {
  client,
  StoreCheckoutContextProvider,
  SetCustomerInState,
  useAddItemToCart,
  useAddMultipleItemsToCart,
  useStoreCheckout,
  useCustomer,
  useCartCount,
  useCartItems,
  useCartTotals,
  useSetPage,
  useRemoveItemFromCart,
  useUpdateItemsFromCart,
  useCheckoutUrl,
  useToggleCart,
}
