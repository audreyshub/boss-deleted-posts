import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import PropTypes from 'prop-types'
import CurrencyFormat from 'react-currency-format'

// Language
import strings from './strings.json'

const ProductPrice = (props) => {
  // ========== Static Query ==========
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          gsConfig {
            locales
            currency
          }
        }
      }
    }
  `)

  const currency = data.site.siteMetadata.gsConfig.currency

  // console.log('👾 ProductPrice', props)
  return (
    <>
      {props.amount && (
        <CurrencyFormat
          className={props.styles}
          value={props.amount}
          displayType={'text'}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
          prefix={currency === 'USD' && '$'}
        />
      )}
    </>
  )
}

export default ProductPrice

ProductPrice.propTypes = {
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}
