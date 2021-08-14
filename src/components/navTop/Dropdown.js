// REFACTOR clean up and refactor prop and const names for easier reading
import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import Link from '@material-ui/core/Link'
import { Link as GatsbyLink } from 'gatsby'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Box from '@material-ui/core/Box'
import Popper from '@material-ui/core/Popper'
import MenuItem from '@material-ui/core/MenuItem'
import MenuList from '@material-ui/core/MenuList'
import ListItem from '@material-ui/core/ListItem'
import { makeStyles } from '@material-ui/core/styles'
import { useHover } from 'ahooks'

// Component
import NavItem from '../navItem'

// Icons
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown'

// Styles
const useDropdownContentStyles = makeStyles((theme) => ({
  menuWrapper: {
    overflow: 'hidden',
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.white,
    '& .MuiList-padding': {
      padding: 0,
      overflow: 'hidden',
    },
    '& .MuiListItem-button': {
      '&:hover': {
        backgroundColor: theme.palette.secondary.light,
      },
    },
    '& .Mui-selected, & .MuiListItem-root.Mui-focusVisible': {
      backgroundColor: 'transparent',
    },
  },
}))

const DropdownContent = (props) => {
	// console.log('👾 DropdownContent > ', props)
	
	const classes = useDropdownContentStyles()
  const dropdownRef = useRef(null)
  const isHovering = useHover(dropdownRef)

  useEffect(() => {
    props.setIsHoveringDropdown(isHovering)
  }, [isHovering])

  return (
    <Grow
      {...props.transitionProps}
      style={{ transformOrigin: props.placement === 'bottom' ? 'center top' : 'center bottom' }}
    >
      <Box ref={dropdownRef} className={classes.menuWrapper}>
        <ClickAwayListener onClickAway={props.handleClose}>
          <MenuList
            autoFocusItem={props.open}
            id="menu-list-grow"
            onKeyDown={props.handleListKeyDown}
          >
            
						{props.items.map((item, i) => {
							return (
								<MenuItem key={i} onClick={props.handleClose}>
									<NavItem {...item} />
								</MenuItem>
							)
						})}

					</MenuList>
        </ClickAwayListener>
      </Box>
    </Grow>
  )
}

const Dropdown = (props) => {
  // console.log('👾 Dropdown > ', props)

	const [open, setOpen] = useState(false)
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(false)
  const anchorRef = useRef(null)
  const isHovering = useHover(anchorRef)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }
    setOpen(false)
  }

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault()
      setOpen(false)
    }
  }

  useEffect(() => {
    if (isHovering || isHoveringDropdown) {
      setOpen(true)
      return
    }
    setOpen(false)
  }, [isHovering, isHoveringDropdown])

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = useRef(open)
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus()
    }
    prevOpen.current = open
  }, [open])

	return (
    <>
      <ListItem
        className={`${props.styles}`}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
				<NavItem {...props.primary}/>
        <KeyboardArrowDownIcon color="primary" />
      </ListItem>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <DropdownContent
            transitionProps={TransitionProps}
            placement={placement}
            handleClose={handleClose}
            handleListKeyDown={handleListKeyDown}
            open={open}
            setOpen={setOpen}
						setIsHoveringDropdown={setIsHoveringDropdown}
						items={props.items}
          />
        )}
      </Popper>
    </>
  )
}

export default Dropdown

Dropdown.propTypes = {}
Dropdown.defaultProps = {}
