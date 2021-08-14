import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import InputLabel from '@material-ui/core/InputLabel'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import SvgIcon from '@material-ui/core/SvgIcon'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import IconButton from '@material-ui/core/IconButton'
import { Index } from 'elasticlunr'
import Typography from '@material-ui/core/Typography'
import { Link as GatsbyLink } from 'gatsby'
import Link from '@material-ui/core/Link'
import { useDebounce } from 'ahooks'

// Icons
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'

// Components
import ProductPrice from '../productPrice'
import { Image } from '../image'

// Utilities
import { triggerInput } from '../../utilities/formHelpers'

// Context
import { useSearchContext } from '../../context/SearchContext'

//L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  searchWrapper: {
    position: 'relative',
  },
  input: {
    width: '355px',
    maxWidth: '100%',
  },
  menuWrapper: {
    marginTop: theme.spacing(1),
    padding: theme.spacing(1, 0),
    maxHeight: '50vh',
    overflow: 'scroll',
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    '& .MuiList-padding': {
      padding: 0,
      overflow: 'hidden',
    },
    '& .MuiListItem-button': {
      '&:hover, &:focus': {
        backgroundColor: theme.palette.secondary.light,
      },
    },
    '& .Mui-selected, & .MuiListItem-root.Mui-focusVisible': {
      backgroundColor: 'transparent',
    },
  },
  resultItem: {
    '&:hover': {
      '& $searchCard': {
        textDecoration: 'none',
      },
    },
  },
  searchCard: {
    display: 'grid',
    gridTemplateAreas: '"image title" "image price"',
    gridTemplateColumns: '56px 1fr',
    gridGap: theme.spacing(1),
    color: theme.palette.secondary.main,
  },
  cardImageWrapper: {
    gridArea: 'image',
    width: '100%',
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative',
    paddingBottom: '100%',
  },
  cardImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardTitle: {
    gridArea: 'title',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cardPrice: {
    gridArea: 'price',
  },
  clearInput: {
    cursor: 'pointer',
    fontWeight: 500,
  },
}))

const buildThumb = (image) => {
  const { originalSrc, altText } = image
  const splitImageSrc = originalSrc.split(/\.(?=[^\.]+$)/)
  const thumbUrlSmall = `${splitImageSrc[0]}_112x.${splitImageSrc[1]}`
  return { thumbUrlSmall, altText }
}

const SearchBox = (props) => {
  const data = useStaticQuery(graphql`
    query SearchIndexQuery {
      siteSearchIndex {
        index
      }
    }
  `)

  const classes = useStyles()
  const { searchShowed, setSearchShowed } = useSearchContext()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const anchorRef = useRef(null)
  const menuListRef = useRef(null)
  const debouncedQuery = useDebounce(query, { wait: 500 })
  let index

  const { handleToggleSearch } = props

  const getOrCreateIndex = () => index || Index.load(data.siteSearchIndex.index)

  const search = (query) => {
    index = getOrCreateIndex()
    setResults(
      index.search(query, { expand: true }).map(({ ref }) => {
        return index.documentStore.getDoc(ref)
      })
    )
  }

  const handleSearch = (evt) => {
    const query = evt.target.value
    setQuery(query)
  }

  // When focused in search input, escape key closes the search bar
  const handleInputKeyUp = (e) => {
    if (e.keyCode === 27) {
      handleToggleSearch()
    }
  }

  useEffect(() => {
    if (debouncedQuery.length < 3) return
    search(debouncedQuery)
  }, [debouncedQuery])

  // Use down arrow key to move focus to search results
  const handleInputKeyDown = (e) => {
    if (e.keyCode === 40) {
      menuListRef.current.querySelector('li').focus()
      setTimeout(() => {
        menuListRef.current.parentNode.scrollTop = 0
      }, 25)
    }
  }

  // Listen for enter key on focused search results item
  const handleListItemKeyUp = (e) => {
    if (e.keyCode === 13) {
      e.target.querySelector('a').click()
    }
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setSearchShowed(false)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab' || event.keyCode === 27) {
      event.preventDefault()
      setSearchShowed(false)
    }
  }

  useEffect(() => {
    if (results.length === 0) {
      setSearchShowed(false)
      return
    }
    setSearchShowed(true)
  }, [results])

  useEffect(() => {
    // Focus input on initial render
    anchorRef.current.querySelector('input').focus()

    // return focus to the text box when we transitioned from !open -> open
    if (searchShowed) {
      anchorRef.current.querySelector('input').focus()
    }
  }, [searchShowed])

  useEffect(() => {}, [])

  // console.log('SEARCH BOX (component)', query)
  return (
    <Box className={classes.searchWrapper}>
      <FormControl className={classes.searchBox} variant="outlined">
        <InputLabel shrink={false} className="visuallyHidden" htmlFor="search-field">
          Search
        </InputLabel>
        <TextField
          className={classes.input}
          id="search-field"
          type="text"
          variant="outlined"
          value={query}
          onChange={handleSearch}
          onKeyDown={handleInputKeyDown}
          onKeyUp={handleInputKeyUp}
          ref={anchorRef}
          InputProps={{
            startAdornment: <SvgIcon component={SearchIcon} />,
            endAdornment: (
              <InputAdornment position="end">
                {searchShowed ? (
                  <Typography
                    className={classes.clearInput}
                    component="span"
                    onClick={() => {
                      triggerInput('search-field', '')
                    }}
                  >
                    {strings.clear}
                  </Typography>
                ) : (
                  <IconButton
                    aria-label="Cancel search"
                    onClick={handleToggleSearch}
                    onMouseDown={handleToggleSearch}
                    edge="end"
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
        <Popper
          open={searchShowed}
          anchorEl={anchorRef.current}
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Box className={classes.menuWrapper} style={{ width: anchorRef.current.offsetWidth }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    ref={menuListRef}
                    className={classes.menuList}
                    // autoFocusItem={searchShowed}
                    id="menu-list-grow"
                    onKeyDown={handleListKeyDown}
                    // variant="menu"
                  >
                    {results.map((result, i) => {
                      const { thumbUrlSmall, altText } = buildThumb(result.product.featuredImage)
                      return (
                        <MenuItem
                          className={classes.resultItem}
                          key={i}
                          onKeyUp={handleListItemKeyUp}
                        >
                          <Link
                            component={GatsbyLink}
                            to={result.shopifyThemePath}
                            className={classes.searchCard}
                          >
                            <Box className={classes.cardImageWrapper}>
                              <Image
                                wrapperClassName={classes.cardImage}
                                src={thumbUrlSmall}
                                alt={altText}
                              />
                            </Box>
                            <Typography className={classes.cardTitle}>{result.title}</Typography>
                            <ProductPrice
                              styles={classes.cardPrice}
                              amount={result.product.priceRangeV2.minVariantPrice.amount}
                            />
                          </Link>
                        </MenuItem>
                      )
                    })}
                  </MenuList>
                </ClickAwayListener>
              </Box>
            </Grow>
          )}
        </Popper>
      </FormControl>
    </Box>
  )
}

export default SearchBox

SearchBox.propTypes = {}
SearchBox.defaultProps = {}
