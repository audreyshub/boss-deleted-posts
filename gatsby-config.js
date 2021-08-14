require('dotenv').config()
const { ImgixSourceType } = require('@imgix/gatsby')
const shopData = require('./shop-config')
const linkResolver = require('./src/utilities/linkResolver')

module.exports = {
  plugins: [
    // gatsby-plugin-google-tagmanager
    {
      resolve: 'gatsby-plugin-google-tagmanager',
      options: {
        id: 'GTM-NP49PF8',
        includeInDevelopment: false,
        enableWebVitalsTracking: true,
      },
    },
    'gatsby-plugin-loadable-components-ssr',
    // gatsby-source-filesystem
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `staticImages`,
        path: `${__dirname}/src/components/`,
      },
    },
    // gatsby-source-prismic
    {
      resolve: 'gatsby-source-prismic',
      options: {
        repositoryName: 'bossplanner',
        accessToken: `${process.env.PRISMIC_API_KEY}`,
        linkResolver: () => (link) => linkResolver(link),
        shouldDownloadImage: ({ node, key, value }) => {
          return false
        },
        schemas: {
          homepage: require('./customTypes/homePage.json'),
          about: require('./customTypes/about.json'),
          charity: require('./customTypes/charity.json'),
          contact: require('./customTypes/contact.json'),
          bundle: require('./customTypes/bundle.json'),
          faq: require('./customTypes/faq.json'),
          reviews: require('./customTypes/reviews.json'),
          rewards: require('./customTypes/rewards.json'),
          blog: require('./customTypes/blog.json'),
          newsletter: require('./customTypes/newsletter.json'),
          product: require('./customTypes/product.json'),
          page: require('./customTypes/page.json'),
          post: require('./customTypes/post.json'),
          navigation: require('./customTypes/navigation.json'),
          site_settings: require('./customTypes/siteSettings.json'),
        },
      },
    },
    // gatsby-source-shopify
    {
      resolve: 'gatsby-source-shopify',
      options: {
        password: process.env.SHOPIFY_ADMIN_PASSWORD,
        storeUrl: `${process.env.GATSBY_SHOP_NAME}.myshopify.com`,
        shopifyConnections: ['collections'],
        downloadImages: true,
      },
    },
    // gatsby-plugin-material-ui
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    // gatsby-source-stamped-reviews
    {
      resolve: require.resolve(`./src/plugins/gatsby-shopify-stamped-reviews`),
      options: {
        storeUrl: process.env.GATSBY_SHOP_NAME, // Without '.myshopify.com'
        apiKeyPublic: process.env.GATSBY_STAMPED_PUBLIC_KEY,
      },
    },
    // gatsby-plugin-react-svg
    {
      resolve: 'gatsby-plugin-react-svg',
      options: {
        rule: {
          include: /\.inline\.svg$/,
          omitKeys: [
            'xmlnsDc',
            'xmlnsCc',
            'xmlnsRdf',
            'xmlnsSvg',
            'xmlnsSodipodi',
            'xmlnsInkscape',
            'xmlnsSerif',
            'serifId',
          ],
        },
      },
    },
    // gatsby-plugin-imgix
    {
      resolve: '@imgix/gatsby',
      options: {
        domain: process.env.GATSBY_IMGIX_URL,
        secureURLToken: process.env.GATSBY_IMGIX_SECURE_URL_TOKEN,
        sourceType: ImgixSourceType.WebProxy,
        defaultImgixParams: {},
        // defaultImgixParams: { auto: 'format, compress' },
        fields: [
          {
            nodeType: 'ShopifyCollectionImage',
            fieldName: 'imgixImage',
            getURL: (node) => node.originalSrc,
          },
          {
            nodeType: 'ShopifyProductImage',
            getURL: (node) => node.originalSrc,
            fieldName: 'imgixImage',
          },
          {
            nodeType: 'ShopifyProductVariantImage',
            getURL: (node) => node.originalSrc,
            fieldName: 'imgixImage',
          },
          {
            nodeType: 'ShopifyProductFeaturedImage',
            getURL: (node) => node.originalSrc,
            fieldName: 'imgixImage',
          },
          {
            nodeType: 'StampedProductReviewImage',
            getURL: (node) => node.originalSrc,
            fieldName: 'imgixImage',
          },
          {
            nodeType: 'PrismicImageType',
            fieldName: 'imgixImage',
            getURL: (field) => {
              if (field.url) {
                const url = new URL(field.url)
                return `${url.origin}/${url.pathname}`
              }
            },
          },
        ],
      },
    },
    // @gatsby-contrib/gatsby-plugin-elasticlunr-search
    {
      resolve: '@gatsby-contrib/gatsby-plugin-elasticlunr-search',
      options: {
        // Fields to index
        fields: ['title', 'tags'],
        // How to resolve each field`s value for a supported node type
        resolvers: {
          // For any node of type MarkdownRemark, list how to resolve the fields` values
          ShopifyProduct: {
            product: (node) => node,
            title: (node) => node.title,
            tags: (node) => node.tags,
            shopifyThemePath: (node) => node.fields.shopifyThemePath,
          },
        },
      },
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: shopData.storeName,
        short_name: shopData.storeName,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#003a95`,
        display: `standalone`,
        icon: 'src/images/favicon/favicon.svg',
      },
    },
    // `gatsby-plugin-offline`,
    `./src/plugins/gatsby-account-pages`,
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-sass`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-extract-schema`,
    // `gatsby-plugin-netlify`,
    `gatsby-plugin-smoothscroll`,
    'gatsby-plugin-webpack-bundle-analyser-v2',
  ],
  siteMetadata: {
    title: shopData.storeName,
    description: shopData.storeDescription,
    location: shopData.location,
    siteUrl: 'https://www.bosspersonalplanner.com',
    image: 'defaultImage.jpg', // Located in /static folder
    pageType: 'website',
    gsConfig: {
      storeName: shopData.storeName,
      storeDescription: shopData.storeDescription,
      email: shopData.email,
      company: shopData.company,
      location: shopData.location,
      address: shopData.address,
      phone: shopData.phone,
      workingDays: shopData.workingDays,
      workingHours: shopData.workingHours,
      socialNetworks: shopData.socialNetworks,
      shareButtons: shopData.shareButtons,
      googleAnalyticsId: shopData.googleAnalyticsId,
      locales: shopData.locales,
      currency: shopData.currency,
      productsPerCollectionPage: shopData.productsPerCollectionPage,
      postsPerBlogPage: shopData.postsPerBlogPage,
      enableFloatingCart: shopData.enableFloatingCart,
      useImgix: true,
    },
  },
}
