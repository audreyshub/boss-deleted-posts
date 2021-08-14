const chalk = require('chalk')
const axios = require('axios')
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

/**
 * ============================================================================
 * Helper functions and constants
 * ============================================================================
 */
const REVIEW_NODE_TYPE = 'StampedProductReview'
const REVIEW_NODE_IMAGE_TYPE = 'StampedProductReviewImage'
const STAMPED_IMG_URL_PREFIX = 'https://s3-us-west-2.amazonaws.com/stamped.io/uploads/photos'

function encode(type, id, params = {}) {
  let full = `gid://shopify/${type}/${id}`
  let query = []
  const keys = Object.keys(params)
  if (keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      query.push(keys[i] + '=' + params[keys[i]])
    }
    query = '?' + query.join('&')
    full += query
  }
  return typeof window === 'undefined' ? Buffer.from(full, 'utf-8').toString('base64') : btoa(full) // eslint-disable-line no-undef
}

/**
 * ============================================================================
 * Verify plugin loads
 * ============================================================================
 */
exports.onPreInit = () => console.log(chalk.magentaBright('Loaded gatsby-shopify-stamped-reviews'))

/**
 * ============================================================================
 * Link nodes together with a customized GraphQL Schema
 * ============================================================================
 */
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  createTypes(`
    type StampedProductReview implements Node {
      id: ID!
      slug: String!
      description: String!
      author: String
      reviewTitle: String
      reviewMessage: String
      reviewRating: Int
      reviewDate: Date
      reviewUserPhotos: String
      reviewUserVideos: String
      reviewVerifiedType: Int
      reviewReply: String
      reviewReplyDate: Date
      productId: String
      productName: String
      productSKU: String
      productUrl: String
      productImageUrl: String
      productImageLargeUrl: String
      productImageThumbnailUrl: String
      productDescription: String
      avatar: String
      location: String
      reviewVotesUp: Int
      reviewVotesDown: Int
      userReference: String
      dateCreated: Date
      dateReplied: Date
      reviewType: Int
      widgetType: String
      shopifyProductId: String
      product: ShopifyProduct @link(by: "shopifyId", from: "shopifyProductId")
      images: [StampedProductReviewImage]
    }
    type StampedProductReviewImage {
      id: String
      altText: String
      originalSrc: String
    }
    type ShopifyProduct implements Node {
      reviews: [StampedProductReview] @link(by: "shopifyProductId", from: "storefrontId")
    }
  `)
}

/**
 * ============================================================================
 * Source and cache nodes from the API
 * ============================================================================
 */
exports.sourceNodes = async ({ actions, createContentDigest, createNodeId }, pluginOptions) => {
  // Constants & Variables
  const STORE_URL = `${pluginOptions.storeUrl}.myshopify.com`
  const STAMPED_PUBLIC_KEY = pluginOptions.apiKeyPublic
  const REVIEWS_PER_PAGE = 100 // Maximum is 100
  const ONLY_WITH_PHOTOS = false
  const MIN_RATING = 0
  const SORT_REVIEWS = 'featured'
  let reviews = []
  let totalNumberOfReviews
  let totalNumberOfPages = null
  let currentPage = 1
  const stampedUrl = (pageNumber) =>
    `https://stamped.io/api/widget/reviews?minRating=${MIN_RATING}&take=${REVIEWS_PER_PAGE}&page=${pageNumber}&isWithPhotos=${ONLY_WITH_PHOTOS}&storeUrl=${STORE_URL}&apiKey=${STAMPED_PUBLIC_KEY}`

  const { createNode } = actions

  const getReviews = (pageNumber) => {
    return axios(stampedUrl(pageNumber), {
      method: 'get',
      headers: {},
    })
      .then((response) => {
        if (totalNumberOfReviews !== response.data.total) {
          totalNumberOfReviews = response.data.total
        }
        if (totalNumberOfPages === null) {
          totalNumberOfPages = Math.ceil(totalNumberOfReviews / REVIEWS_PER_PAGE)
        }
        return response.data
      })
      .catch((error) => {
        console.log(chalk.magentaBright('Stamped request error', error.message))
        throw new Error(error.message)
      })
  }

  // Grab first page of reviews, or all reviews if there's only one page
  console.log(chalk.magentaBright('Gathering all Stamped.io Reviews'))
  const data = await getReviews(currentPage)
  reviews = [...reviews, ...data.data]

  // If additional queries are needed (number of reviews is greater than REVIEWS_PER_PAGE -> max: 100) gather queries into an array of queries
  let additionalPageQueries = []
  while (currentPage < totalNumberOfPages) {
    currentPage += 1
    additionalPageQueries.push(getReviews(currentPage).then((data) => data.data))
  }

  // Run all additional queries together asynchronously and combine with first query
  const additionalResponses = await Promise.all(additionalPageQueries)
  reviews =
    additionalResponses.flat().length > 0 ? [...reviews, ...additionalResponses.flat()] : reviews

  console.log(chalk.magentaBright('Done!'))

  // loop through data and create Gatsby nodes
  reviews.forEach((review) => {
    let images = []
    let imageUrls = []
    if (review.reviewUserPhotos && review.reviewUserPhotos !== '') {
      imageUrls = review.reviewUserPhotos.split(',')
    }
    imageUrls.forEach((imageUrl, i) => {
      images.push({
        id: createNodeId(`${REVIEW_NODE_IMAGE_TYPE}-${i}`),
        parent: review,
        children: [],
        internal: {
          type: REVIEW_NODE_IMAGE_TYPE,
          content: JSON.stringify(imageUrl),
          contentDigest: createContentDigest(imageUrl),
        },
        altText: `${review.author}'s product review photo #${i}`,
        originalSrc: `${STAMPED_IMG_URL_PREFIX}/${imageUrl}`,
      })
    })

    createNode({
      ...review,
      images,
      id: createNodeId(`${REVIEW_NODE_TYPE}-${review.id}`),
      parent: null,
      children: [],
      internal: {
        type: REVIEW_NODE_TYPE,
        content: JSON.stringify(review),
        contentDigest: createContentDigest(review),
      },
      shopifyProductId: encode('Product', review.productId),
    })
  })

  return
}

/**
 * ============================================================================
 * Transform remote file nodes
 * ============================================================================
 */
// exports.onCreateNode = async ({
//   node,
//   actions: { createNode },
//   cache,
//   createNodeId,
//   getCache,
//   store,
// }) => {
//   if (node.internal.type === REVIEW_NODE_TYPE && node.images.length > 0) {
//     for (const image of node.images) {
//       let fileNode = await createRemoteFileNode({
//         url: image.originalSrc,
//         parentNodeId: image.id,
//         createNode,
//         createNodeId,
//         getCache,
//         store,
//       })

//       if (fileNode) {
//         image.localFile___NODE = fileNode.id
//       }
//     }
//   }
// }
