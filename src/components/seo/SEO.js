import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { useLocation } from '@reach/router'
import { useStaticQuery, graphql } from 'gatsby'

// Utilities
import { getShopifyImage } from './utilities'

// Schema
import { getSchemaProduct } from './schemaProduct'

const SEO = (props) => {
  // console.log('SEO props, props)
  const {
    title,
    description,
    image,
    article,
    product,
    collection,
    type,
    shopifyThemePath = '',
  } = props
  const { pathname } = useLocation()
  const { site } = useStaticQuery(query)

  const {
    defaultTitle,
    defaultDescription,
    siteUrl,
    defaultImage,
    twitterUsername,
    defaultPageType,
    gsConfig,
  } = site.siteMetadata

  const { company, currency } = gsConfig

  const ogType = () => {
    if (product) return 'product'
    if (collection) return 'collection'
    // if (blog) return 'blog'
    // if (article) return 'article'
    return
  }

  const templateTitle = () => {
    if (product) return product.seo.title || product.title
    if (collection) return collection.seo.title || collection.title
    // CMS seo titles for blog and article
    // if (blog) return blog.title
    // if (article) return article.title
    return
  }

  const seoDescription = () => {
    if (product) return product.seo.description || product.description
    if (collection) return collection.seo.description || collection.description
    // CMS seo descriptions for blog and article
    // if (blog) return blog.description
    // if (article) return article.excerpt
    return
  }

  const seoImage = () => {
    if (product && product.featuredImage) return getShopifyImage(product.featuredImage.originalSrc)
    if (collection && collection.image) return getShopifyImage(collection.image.originalSrc)
    // CMS seoImage for blog and articles
    return
  }

  const seo = {
    title: title || defaultTitle,
    templateTitle: templateTitle() || null,
    description: seoDescription() || defaultDescription,
    image: seoImage() || `${siteUrl}/${image || defaultImage}`,
    type: ogType() || defaultPageType,
    url: `${siteUrl}${pathname}`,
  }

  // FEATURE -> schemaCollection -> https://www.schemaapp.com/tutorial/creating-collectionpage-schema-markup-using-the-schema-app-editor/
  // FEATURE -> schemaBlog -> https://github.com/LeKoArts/gatsby-starter-prismic/blob/master/src/components/SEO/SEO.jsx
  // FEATURE -> schemaArticle -> https://github.com/LeKoArts/gatsby-starter-prismic/blob/master/src/components/SEO/SEO.jsx
  // FEATURE -> schemaOrgWebPage

  // Product schema
  let schemaProduct = null
  if (product) schemaProduct = getSchemaProduct(product, siteUrl, currency, company)

  // console.log('SCHEMA', seo.image)
  return (
    <Helmet
      title={seo.title}
      defaultTitle={seo.title}
      titleTemplate={seo.templateTitle && `%s | ${seo.templateTitle}`}
      htmlAttributes={{ lang: 'en' }}
      meta={[
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover',
        },
      ]}
    >
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={`${siteUrl}${shopifyThemePath}`} />
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />
      // Open graph
      {seo.url && <meta property="og:url" content={seo.url} />}
      {seo.type && <meta property="og:type" content={seo.type} />}
      {seo.title && <meta property="og:title" content={seo.title} />}
      {seo.description && <meta property="og:description" content={seo.description} />}
      {seo.image && <meta property="og:image" content={seo.image} />}
      // Twitter meta
      <meta name="twitter:card" content="summary_large_image" />
      {twitterUsername && <meta name="twitter:creator" content={twitterUsername} />}
      {seo.title && <meta name="twitter:title" content={seo.title} />}
      {seo.description && <meta name="twitter:description" content={seo.description} />}
      {seo.image && <meta name="twitter:image" content={seo.image} />}
      // Rich schema
      {product && <script type="application/ld+json">{JSON.stringify(schemaProduct)}</script>}
    </Helmet>
  )
}

export default SEO

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
  article: PropTypes.object,
  product: PropTypes.object,
  collection: PropTypes.object,
}

SEO.defaultProps = {
  title: null,
  description: null,
  image: null,
  article: null,
  product: null,
  collection: null,
}

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        defaultTitle: title
        defaultDescription: description
        siteUrl
        defaultImage: image
        defaultPageType: pageType
        gsConfig {
          company
          currency
        }
      }
    }
  }
`
