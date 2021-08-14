/**
 * ============================================================================
 * Product schema
 * ============================================================================
 */

// Utilities
import { ratingValue, reviewCount } from '../productRating/utilities'
import { getShopifyImage, oneYearFromNow } from './utilities'

export const getSchemaProduct = (product, siteUrl, currency, company) => {
  let schemaProduct = {
    '@context': 'http://schema.org',
    '@type': 'Product',
    name: product.title,
    url: `${siteUrl}${product.fields.shopifyThemePath}`,
    image: getShopifyImage(product.featuredImage.originalSrc),
    description: product.description,
    sku: product.variants[0].sku,
    brand: {
      '@type': 'Thing',
      name: product.vendor,
    },
  }

  // Product reviews
  if (product.reviews && product.reviews.length > 0) {
    schemaProduct = {
      ...schemaProduct,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: ratingValue(product.reviews),
        reviewCount: reviewCount(product.reviews),
      },
    }
  }

  // Product variants
  let variants = null
  if (product.variants) {
    variants = product.variants.map((variant) => {
      const schemaVariant = {
        '@type': 'Offer',
        name: variant.title === 'Default Title' ? product.title : variant.title,
        priceCurrency: currency,
        price: variant.price,
        priceValidUntil: oneYearFromNow(),
        url: `${siteUrl}${product.fields.shopifyThemePath}`,
        itemCondition: 'http://schema.org/NewCondition',
        availability: variant.availableForSale ? 'InStock' : 'OutOfStock',
        seller: {
          '@type': 'Organization',
          name: company,
        },
        weight: {
          '@type': 'QuantitativeValue',
        },
        // itemOffered: {
        //   '@type': 'Product',
        //   name: variant.title === 'Default Title' ? product.title : variant.title,
        //   aggregateRating: {
        //     '@type': 'AggregateRating',
        //     ratingValue: ratingValue(product.reviews),
        //     reviewCount: reviewCount(product.reviews),
        //   },
        // },
      }

      let fields = ['sku']
      fields.forEach((field) => {
        if (variant[field] !== '') {
          schemaVariant[field] = variant[field]
        }
      })

      fields = ['barcode']
      fields.forEach((field) => {
        if (variant[field] !== '') {
          schemaVariant.mpn = variant[field]
        }
      })

      fields = ['image']
      fields.forEach((field) => {
        if (variant[field] !== null) {
          schemaVariant[field] = variant[field].originalSrc
        }
      })

      // Weight
      fields = ['weight']
      fields.forEach((field) => {
        if (variant[field] !== null) {
          schemaVariant.weight.value = variant[field]
        }
      })
      fields = ['weightUnit']
      fields.forEach((field) => {
        if (variant[field] !== null) {
          schemaVariant.weight.unitText = variant[field]
        }
      })

      return schemaVariant
    })

    schemaProduct = {
      ...schemaProduct,
      offers: variants,
    }
  }

  return schemaProduct
}
