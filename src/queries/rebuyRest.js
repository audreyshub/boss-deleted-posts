import axios from 'axios'
import { encode, decode } from 'shopify-gid'

export const rebuy = (method, endpoint, params) => {
  const client = axios.create({
    baseURL: `${process.env.GATSBY_REBUY_API_DOMAIN}${process.env.GATSBY_REBUY_API_PATH}${process.env.GATSBY_REBUY_API_VERSION}${endpoint}`,
    method,
    params: {
      key: process.env.GATSBY_REBUY_API_KEY,
      format: 'pretty',
      ...params,
    },
  })

  // Using a request interceptor
  client.interceptors.request.use(
    (config) => {
      // Do something before request is sent
      // console.log('interceptor request', config)
      return config
    },
    (error) => {
      // Do something with request error
      return Promise.reject(error)
    }
  )

  // Using a response interceptor
  client.interceptors.response.use(
    (response) => {
      // Convert response data into data that ProductCard can consume
      const products = response.data.data
      // console.log('interceptor response', products)

      // TODO abstract this out. will need again
      const adjustedProducts = products.map((product) => {
        const fields = { shopifyThemePath: `/products/${product.handle}` }
        const featuredImage = product.image.src
        const priceRangeV2 = {
          minVariantPrice: {
            amount:
              product.variants.length === 1
                ? product.variants[0].price
                : product.variants.reduce((prev, curr) => {
                    return parseInt(prev.price, 10) < parseInt(curr.price, 10)
                      ? prev.price
                      : curr.price
                  }),
          },
        }
        product.variants = product.variants.map((variant) => {
          const storefrontId = encode('ProductVariant', variant.id)
          return {
            ...variant,
            storefrontId,
          }
        })
        return {
          fields,
          featuredImage,
          priceRangeV2,
          ...product,
        }
      })
      return adjustedProducts
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error)
    }
  )

  return client.get()
}
