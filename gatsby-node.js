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
 * Create pages
 * ============================================================================
 */

const createBlogPage = async (graphql, postsPerBlogPage, basePath, createPage) => {
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
      },
    })
  })
}

const createPostPage = async (graphql, createPage) => {
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
      },
    })
  })
}

/**
 * ============================================================================
 * Gatsby node APIs
 * ============================================================================
 */

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

  const { postsPerBlogPage = 8 } = gsConfig

  let { basePath = '' } = options
  const { createPage } = actions

  basePath = removeTrailingLeadingSlashes(basePath)

  basePath = removeTrailingLeadingSlashes(basePath)

  await createBlogPage(graphql, postsPerBlogPage, basePath, createPage)
  console.log(gs('Blog page created'))
  await createPostPage(graphql, createPage)
  console.log(gs('Post page created'))
}
