import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'

// Icons
import SearchIcon from '@material-ui/icons/Search'

// Components
import SearchBox from './SearchBox.js'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {},
}))

const Search = (props) => {
  const classes = useStyles()
  const { searchOpen, handleToggleSearch } = props

  // console.log('SEARCH (component)', props)
  return (
    <>
      {!searchOpen && (
        <IconButton
          className={classes.root}
          color="inherit"
          onClick={props.handleToggleSearch}
          aria-label="search"
        >
          <SearchIcon />
        </IconButton>
      )}
      {searchOpen && <SearchBox searchOpen={searchOpen} handleToggleSearch={handleToggleSearch} />}
    </>
  )
}

export default Search

Search.propTypes = {}
Search.defaultProps = {}
