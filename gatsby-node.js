const hasOwnProp = require('has-own-prop')
const R = require('ramda')
const chalk = require('chalk')

/**
 * ============================================================================
 * Variables and constants
 * ============================================================================
 */

const gs = chalk.hex('#FFA500')

const blogTemplate = require.resolve('./src/templates/blog/index')
const postTemplate = require.resolve('./src/templates/post/index')

/**
 * ============================================================================
 * General functions
 * ============================================================================
 */

function removeTrailingLeadingSlashes(string) {
  return string.replace(/^\/*|\/*$/g, '')
}

/**
 * ============================================================================
 * Create node fields
 * ============================================================================
 */

const createCollectionNode = (options, actions, node) => {
  let { basePath = '', collectionPageBasePath = 'collections' } = options
  const { createNodeField } = actions
  basePath = removeTrailingLeadingSlashes(basePath)
  collectionPageBasePath = removeTrailingLeadingSlashes(collectionPageBasePath)
  // Todo: Improve the way this is done. Maybe using the config.json file.
  createNodeField({
    node,
    name: 'shopifyThemePath',
    value: `${basePath && `/${basePath}`}/${collectionPageBasePath}/${node.handle}`,
  })
}
const createProductNode = (options, actions, node) => {
  let { basePath = '', productPageBasePath = 'products' } = options
  const { createNodeField } = actions
  basePath = removeTrailingLeadingSlashes(basePath)
  productPageBasePath = removeTrailingLeadingSlashes(productPageBasePath)

  createNodeField({
    node,
    name: 'shopifyThemePath',
    value: `${basePath && `/${basePath}`}/${productPageBasePath}/${node.handle}`,
  })
}
const createShopPolicyNode = (options, actions, node) => {
  let { basePath = '', policyPageBasePath = 'policies' } = options
  const { createNodeField } = actions
  basePath = removeTrailingLeadingSlashes(basePath)
  policyPageBasePath = removeTrailingLeadingSlashes(policyPageBasePath)
  // Todo: Improve the way this is done. Maybe using the config.json file.
  createNodeField({
    node,
    name: 'shopifyThemePath',
    value: `${basePath && `/${basePath}`}/${policyPageBasePath}/${node.type}`,
  })
}

/**
 * ============================================================================
 * Create pages
 * ============================================================================
 */

const createBlogPage = async (
  graphql,
  postsPerBlogPage,
  basePath,
  createPage,
  finalCartPagePath
) => {
  const queryPosts = await graphql(`
    {
      prismicBlog {
        data {
          hero {
            uid
          }
          popular {
            post {
              uid
            }
          }
        }
      }
      posts: allPrismicPost {
        totalCount
      }
    }
  `)

  const blogPageHandle = 'blog'
  const blogPagePath = `${basePath && `/${basePath}`}/${blogPageHandle}`
  const blogPostCount = queryPosts.data.posts.totalCount
  const postsPerPage = parseInt(postsPerBlogPage, 10)
  const numPages = Math.ceil(blogPostCount / postsPerBlogPage)
  const popularIds = queryPosts.data.prismicBlog.data.popular.map((item) => item.post.uid)

  Array.from({
    length: numPages,
  }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `${blogPagePath}` : `${blogPagePath}/${i + 1}`,
      component: blogTemplate,
      context: {
        heroId: queryPosts.data.prismicBlog.data.hero.uid,
        popularIds: popularIds,
        blogPagePath,
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
        // Todo: Find a better way to do this.
        // cartUrl: finalCartPagePath,
      },
    })
  })
}

const createPostPage = async (graphql, createPage, finalCartPagePath) => {
  const queryPosts = await graphql(`
    {
      posts: allPrismicPost {
        nodes {
          uid
        }
      }
    }
  `)
  // console.log('👾 gatsby-node QUERY > ', JSON.stringify(queryPosts.data, null, 2))
  queryPosts.data.posts.nodes.forEach(({ uid }) => {
    const shuffled = queryPosts.data.posts.nodes.sort(() => 0.5 - Math.random())
    const firstThree = shuffled.slice(0, 3)
    relatedPosts = firstThree.map((item) => item['uid'])

    createPage({
      path: `/blog/${uid}`,
      component: postTemplate,
      context: {
        uid: uid,
        relatedPosts: relatedPosts,
        // cartUrl: finalCartPagePath,
      },
    })
  })
}

/**
 * ============================================================================
 * Gatsby node APIs
 * ============================================================================
 */

exports.onCreateNode = async ({ node, actions, cache }, options) => {
  // NOTE: Before these nodes are picked up, createSchemaCustomization must run
  switch (node.internal.type) {
    case `ShopifyProduct`:
      createProductNode(options, actions, node)
      break
    case `ShopifyCollection`:
      createCollectionNode(options, actions, node)
      break
    case `ShopifyShopPolicy`:
      createShopPolicyNode(options, actions, node)
      break
    default:
  }
}

exports.createPages = async ({ graphql, actions }, options) => {
  const gsConfig = await graphql(`
    {
      site {
        siteMetadata {
          gsConfig {
            productsPerCollectionPage
            postsPerBlogPage
          }
        }
      }
    }
  `)

  const { productsPerCollectionPage = 9, postsPerBlogPage = 8 } = gsConfig

  let { basePath = '' } = options
  const { createPage } = actions

  // Create Cart path (used across multiple pages)
  let { cartPagePath = 'cart' } = options
  basePath = removeTrailingLeadingSlashes(basePath)
  cartPagePath = removeTrailingLeadingSlashes(cartPagePath)
  const finalCartPagePath = `${basePath && `/${basePath}`}/${cartPagePath}`

  basePath = removeTrailingLeadingSlashes(basePath)

  await createBlogPage(graphql, postsPerBlogPage, basePath, createPage, finalCartPagePath)
  console.log(gs('Blog page created'))
  await createPostPage(graphql, createPage, finalCartPagePath)
  console.log(gs('Post page created'))
}

/**
 * ============================================================================
 * Ignore the [mini-css-extract-plugin] ordering warnings
 * ============================================================================
 */
exports.onCreateWebpackConfig = ({ stage, actions, getConfig, loaders, plugins }) => {
  const config = getConfig()
  const miniCssExtractPluginIndex = config.plugins.findIndex(
    (plugin) => plugin.constructor.name === 'MiniCssExtractPlugin'
  )

  if (miniCssExtractPluginIndex > -1) {
    // remove miniCssExtractPlugin from plugins list
    config.plugins.splice(miniCssExtractPluginIndex, 1)

    // re-add mini-css-extract-plugin
    if (stage === 'build-javascript') {
      config.plugins.push(
        plugins.extractText({
          filename: `[name].[contenthash].css`,
          chunkFilename: `[name].[contenthash].css`,
          ignoreOrder: true,
        })
      )
    } else {
      config.plugins.push(
        plugins.extractText({
          filename: `[name].css`,
          chunkFilename: `[id].css`,
          ignoreOrder: true,
        })
      )
    }
  }
  actions.replaceWebpackConfig(config)

  // Allows for the usage of the crypto library since Webpack v5 doesn't provide polyfills for all the libraries below
  actions.setWebpackConfig({
    resolve: {
      alias: {
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),
        path: require.resolve('path-browserify'),
      },
      fallback: {
        fs: false,
        crypto: require.resolve('crypto-browserify'),
      },
    },
    plugins: [plugins.provide({ process: 'process/browser', Buffer: ['buffer', 'Buffer'] })],
  })
}
