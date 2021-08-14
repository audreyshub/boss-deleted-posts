import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Hidden from '@material-ui/core/Hidden'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import spacetime from 'spacetime'

// Components
import Status from './status'
import ProductPrice from '../../../productPrice'

// Language
import strings from '../strings'

// Styles
const useSmallStyles = makeStyles((theme) => ({
  orderCard: {
    display: 'grid',
    gridArea: '"order date" "financialStatus fulfillmentStatus" "total ."',
    gridTemplateColumns: '1fr 1fr',
    gap: theme.spacing(3),
    boxShadow: theme.boxShadow2,
    borderRadius: '5px',
    margin: `${theme.spacing(2)}px 0`,
    padding: theme.spacing(2),
  },
  item: {},
}))

const useLargeStyles = makeStyles((theme) => ({
  headingsCard: {
    border: '1px solid black',
  },
  orderCard: {
    display: 'grid',
    gridArea: '"order date financialStatus fulfillmentStatus total"',
    gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    gap: theme.spacing(1),
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
    padding: theme.spacing(2),
  },
  heading: {
    fontWeight: 600,
  },
  orderLink: {
    color: theme.palette.secondary.main,
    textDecoration: 'underline',
  },
}))

const Order = (props) => {
  const smallClasses = useSmallStyles()
  const largeClasses = useLargeStyles()

  const { financialStatus, fulfillmentStatus, name, processedAt, statusUrl, totalPrice, headings } =
    props

  // console.log('ORDER', props)
  return (
    <>
      <Hidden smUp>
        <Box className={smallClasses.orderCard}>
          <Box className={smallClasses.item}>
            <Typography display="block" variant="caption">
              {strings.order}
            </Typography>
            <Link href={statusUrl} target="_blank" rel="noopener">
              <Typography component="h3" variant="body1">
                {name}
              </Typography>
            </Link>
          </Box>
          <Box className={smallClasses.item}>
            <Typography display="block" variant="caption">
              {strings.processedAt}
            </Typography>
            <Typography variant="body1">{spacetime(processedAt).unixFmt('MM/dd/yyyy')}</Typography>
          </Box>
          <Box className={smallClasses.item}>
            <Typography display="block" variant="caption">
              {strings.financialStatus}
            </Typography>
            <Box variant="body1">
              <Status status={financialStatus} />
            </Box>
          </Box>
          <Box className={smallClasses.item}>
            <Typography display="block" variant="caption">
              {strings.fulfillmentStatus}
            </Typography>
            <Box variant="body1">
              <Status status={fulfillmentStatus} />
            </Box>
          </Box>
          <Box className={smallClasses.item}>
            <Typography display="block" variant="caption">
              {strings.totalPrice}
            </Typography>
            <Typography variant="body1">
              <ProductPrice amount={totalPrice} />
            </Typography>
          </Box>
        </Box>
      </Hidden>
      <Hidden xsDown>
        <Box
          className={`${props.styles} ${largeClasses.orderCard} ${
            headings && largeClasses.headingsCard
          }`}
        >
          {headings ? (
            <Typography className={largeClasses.heading}>{strings.order}</Typography>
          ) : (
            <Link
              className={largeClasses.orderLink}
              href={statusUrl}
              target="_blank"
              rel="noopener"
            >
              <Typography component="h3" variant="body1">
                {name}
              </Typography>
            </Link>
          )}
          <Typography>
            {headings ? (
              <Typography className={largeClasses.heading} component="span">
                {strings.processedAt}
              </Typography>
            ) : (
              spacetime(processedAt).unixFmt('MM/dd/yyyy')
            )}
          </Typography>
          <Box>
            {headings ? (
              <Typography className={largeClasses.heading}>{strings.financialStatus}</Typography>
            ) : (
              <Status status={financialStatus} />
            )}
          </Box>
          <Box>
            {headings ? (
              <Typography className={largeClasses.heading}>{strings.fulfillmentStatus}</Typography>
            ) : (
              <Status status={fulfillmentStatus} />
            )}
          </Box>
          <Typography>
            {headings ? (
              <Typography className={largeClasses.heading} component="span">
                {strings.totalPrice}
              </Typography>
            ) : (
              <ProductPrice amount={totalPrice} />
            )}
          </Typography>
        </Box>
      </Hidden>
    </>
  )
}

export default Order

Order.propTypes = {}
Order.defaultProps = {}
