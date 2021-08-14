require('dotenv').config()
const fetch = require('node-fetch')
const axios = require('axios')

const {
  GATSBY_SHOP_NAME,
  GATSBY_SHOPIFY_STOREFRONT_TOKEN,
  GATSBY_SHOPIFY_STOREFRONT_API_VERSION,
  STAMPED_PRIVATE_KEY,
  STAMPED_PUBLIC_KEY,
  STAMPED_STORE_HASH,
  KLAVIYO_API_KEY,
} = process.env

const SHOPIFY_PRODUCT_RECOMMENDATIONS_URL = `https://${GATSBY_SHOP_NAME}.myshopify.com/recommendations/products.json`
const SHOPIFY_GRAPHQL_URL = `https://${GATSBY_SHOP_NAME}.myshopify.com/api/${GATSBY_SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`
// const SHOPIFY_GRAPHQL_URL = `https://hello-mary-jane.myshopify.com/api/2021-01/graphql.json

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
}

const shopifyConfig = {
  'Content-Type': 'application/json',
  'X-Shopify-Storefront-Access-Token': GATSBY_SHOPIFY_STOREFRONT_TOKEN,
  // 'X-Shopify-Storefront-Access-Token': '432d6300bfccea6e178753619d264b42',
}

const CUSTOMER_ADDRESS_QUERY = `
  firstName
  lastName
  address1
  address2
  company
  phone
  city
  country
  province
  zip
  id
`

const CUSTOMER_QUERY = `query customerQuery($customerAccessToken: String!){
  customer(customerAccessToken: $customerAccessToken) {
    firstName
    lastName
    acceptsMarketing
    phone
    email
    id
    defaultAddress {
      ${CUSTOMER_ADDRESS_QUERY}
    }
    addresses(first: 99) {
      edges {
        node {
          ${CUSTOMER_ADDRESS_QUERY}
        }
      }
    }
    orders(first:100){
      edges{
        node{
          orderNumber
          totalPrice
          processedAt
          statusUrl
          financialStatus
          fulfillmentStatus
          name
          successfulFulfillments(first: 100){
            trackingInfo(first: 100){
              number
              url
            }
          }
          lineItems(first:100){
            edges{
              node{
                quantity
                title
                variant{
                  title
                  price
                  image{
                    originalSrc
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`

const CUSTOMER_TOKEN_QUERY = `mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}
`
const CUSTOMER_RECOVERY_QUERY = `mutation customerRecover($email: String!) {
  customerRecover(email: $email) {
    userErrors {
      field
      message
    }
  }
}`

const CUSTOMER_LOGOUT_QUERY = `mutation customerAccessTokenDelete($customerAccessToken: String!) {
  customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
    userErrors {
      field
      message
    }
    deletedAccessToken
    deletedCustomerAccessTokenId
  }
}`

const CUSTOMER_CREATE_QUERY = `mutation customerCreate($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    userErrors {
      field
      message
    }
    customer {
      id
    }
    customerUserErrors {
      field
      message
    }
  }
}`

const CUSTOMER_RESET_QUERY = `mutation customerReset($id: ID!, $input: CustomerResetInput!) {
  customerReset(id: $id, input: $input) {
    userErrors {
      field
      message
    }
    customer {
      email
    }
  }
}`

const CUSTOMER_ACTIVATE_QUERY = `mutation customerActivate($id: ID!, $input: CustomerActivateInput!) {
  customerActivate(id: $id, input: $input) {
    customer {
      id
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`

const CUSTOMER_ADDRESS_CREATE = `mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
  customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
    customerAddress {
      id
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`

const CUSTOMER_ADDRESS_UPDATE = `mutation customerAddressUpdate($customerAccessToken: String!, $id: ID!, $address: MailingAddressInput!) {
  customerAddressUpdate(customerAccessToken: $customerAccessToken, id: $id, address: $address) {
    customerAddress {
      id
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`

const CUSTOMER_ADDRESS_DELETE = `mutation customerAddressDelete($id: ID!, $customerAccessToken: String!) {
  customerAddressDelete(id: $id, customerAccessToken: $customerAccessToken) {
    customerUserErrors {
      code
      field
      message
    }
    deletedCustomerAddressId
  }
}
`

const CUSTOMER_DEFAULT_ADDRESS_UPDATE = `mutation customerDefaultAddressUpdate($customerAccessToken: String!, $addressId: ID!) {
  customerDefaultAddressUpdate(customerAccessToken: $customerAccessToken, addressId: $addressId) {
    customer {
      id
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}`

//
// == PRODUCTS ===
//

const PRODUCT_QUERY = `query getProduct($id: ID!) {
  node(id: $id) {
    ... on Product {
      id
      handle
      title
      totalVariants
      images(first: 100) {
        edges {
          node {
            id
            originalSrc
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            price
            displayName
          }
        }
      }
      metafield(namespace: "sync", key: "productData") {
        value
        id
      }
    }
  }
}
`

const PRODUCT_UPDATE = `mutation productMetaUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product {
      metafields(first: 100) {
        edges {
          node {
            id
            namespace
            key
            value
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}`

const validateIncomingData = (event) => {
  if (event.httpMethod !== 'POST' || !event.body) return statusReturn(400, '')

  try {
    return (data = JSON.parse(event.body))
  } catch (error) {
    return statusReturn(400, { error: 'Bad request body' })
  }
}

const statusReturn = (code, body) => {
  return {
    statusCode: code,
    headers,
    body: JSON.stringify(body),
  }
}

const preparePayload = (query, v) => {
  return {
    query,
    variables: v,
  }
}

const queryShopify = (payload) => {
  return fetch(SHOPIFY_GRAPHQL_URL, {
    method: 'post',
    body: JSON.stringify(payload),
    headers: shopifyConfig,
  })
    .then((res) => res.json())
    .catch((error) => {
      throw new Error(error)
    })
}

const queryRecommendedProducts = (payload) => {
  return axios(SHOPIFY_PRODUCT_RECOMMENDATIONS_URL, {
    method: 'get',
    params: payload,
  })
    .then((response) => {
      return response.data
    })
    .catch((error) => {
      throw new Error(error)
    })
}

const queryStampedGetPrivate = (payload) => {
  // Use this on the frontend as the payload
  // var urlencoded = qs.stringify({
  //   productIds: productId.id,
  //   page: 2,
  // })
  const username = STAMPED_PUBLIC_KEY
  const password = STAMPED_PRIVATE_KEY
  const auth = Buffer.from(`${username}:${password}`).toString('base64')
  const STAMPED_URL = `http://s2.stamped.io/api/v2/${STAMPED_STORE_HASH}/dashboard/reviews`
  return axios(STAMPED_URL, {
    method: 'get',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: payload,
  })
    .then((response) => {
      // console.log('REQUEST CONFIG (queryStamped)', response.data)
      return response.data
    })
    .catch((error) => {
      // console.log('REQUEST CONFIG -> ERROR (queryStamped)', error)
      throw new Error(error)
    })
}

// https://developers.stamped.io/#7d02c323-794e-443f-9512-28373a244854
const queryStampedGetPublic = ({
  productId,
  page = 1,
  reviewsPerPage: take = 3,
  requestWithPhotos = true,
  minRating = 1,
  sortReviews = 'featured',
}) => {
  const STORE_URL = `${GATSBY_SHOP_NAME}.myshopify.com`
  const STAMPED_URL = `https://stamped.io/api/widget/reviews?productId=${productId}&minRating=${minRating}&take=${take}&page=${page}&isWithPhotos=${requestWithPhotos}&sortReviews=${sortReviews}&storeUrl=${STORE_URL}&apiKey=${STAMPED_PUBLIC_KEY}`
  return axios(STAMPED_URL, {
    method: 'get',
    headers: {},
  })
    .then((response) => {
      // console.log('REQUEST CONFIG -> RESPONSE (queryStamped)', response.data)
      return response.data
    })
    .catch((error) => {
      // console.log('REQUEST CONFIG -> ERROR (queryStamped)', error)
      throw new Error(error)
    })
}

const klaviyoSubscribeProfile = (payload, listId) => {
  const url = `https://a.klaviyo.com/api/v2/list/${listId}/subscribe?api_key=${KLAVIYO_API_KEY}`
  const options = {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  }
  return fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      return json
    })
    .catch((err) => console.error('add error:' + err))
}

module.exports = {
  queryShopify,
  queryStampedGetPrivate,
  queryStampedGetPublic,
  queryRecommendedProducts,
  klaviyoSubscribeProfile,
  validateIncomingData,
  headers,
  shopifyConfig,
  statusReturn,
  preparePayload,
  CUSTOMER_QUERY,
  CUSTOMER_RECOVERY_QUERY,
  CUSTOMER_TOKEN_QUERY,
  CUSTOMER_LOGOUT_QUERY,
  CUSTOMER_CREATE_QUERY,
  CUSTOMER_RESET_QUERY,
  CUSTOMER_ACTIVATE_QUERY,
  CUSTOMER_ADDRESS_CREATE,
  CUSTOMER_ADDRESS_UPDATE,
  CUSTOMER_ADDRESS_DELETE,
  CUSTOMER_DEFAULT_ADDRESS_UPDATE,
  PRODUCT_QUERY,
  PRODUCT_UPDATE,
}
