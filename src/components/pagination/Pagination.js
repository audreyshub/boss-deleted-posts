/**
 * ============================================================================
 * Pagination component takes in one prop
 *
 * Usage:
 *
 * <Pagination {...props.pageContext} />
 * ============================================================================
 */

import React from 'react'
import { Link as GatsbyLink } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import { default as MuiPagination } from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'
import Box from '@material-ui/core/Box'

// ========== Styles ==========
const useStyles = makeStyles((theme) => ({
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    margin: theme.spacing(4, 0),
    [theme.breakpoints.up('lg')]: {
      justifyContent: 'flex-end',
    },
    '& .MuiPaginationItem-root': {
      fontWeight: 500,
    },
    '& .Mui-selected': {
      backgroundColor: theme.palette.secondary.main,
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.common.white,
      fontWeight: 600,
    },
  },
  currentPage: {
    color: 'blue',
  },
  disabled: {
    color: 'gray',
  },
}))

const Pagination = (props) => {
  const classes = useStyles()
  const { numPages, currentPage, shopifyThemePath, location } = props
	

  // console.log('PAGINATION', props)
  return (
    <Box className={classes.pagination}>
      <MuiPagination
        count={numPages}
        page={currentPage}
        separator=">"
        renderItem={(item) => {
          return (
            <PaginationItem
              component={GatsbyLink}
              to={`${shopifyThemePath}${item.page === 1 ? '' : `/${item.page}`}`}
              {...item}
            />
          )
        }}
      />
    </Box>
  )
}

export default Pagination
