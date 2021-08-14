import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Modal from '@material-ui/core/Modal'

/**
 * ============================================================================
 * Player component - can be used in the layout
 * ============================================================================
 */

// CSS
import 'plyr/dist/plyr.css'

// Styles
const usePlayerStyles = makeStyles((theme) => ({
  videoWrapper: {},
}))

export const Player = (props) => {
  const classes = usePlayerStyles()
  const playerRef = useRef()
  let player

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      typeof document !== 'undefined' &&
      playerRef.current !== undefined
    ) {
      const Plyr = require('plyr')
      player = new Plyr(playerRef.current, { autoplay: true })
    }
  }, [playerRef])

  return (
      <Box
        ref={playerRef}
        id="js-player"
        data-plyr-provider={props.videoProvider}
        data-plyr-embed-id={props.videoSrc}
      ></Box>
  )
}

export default Player

Player.propTypes = {}
Player.defaultProps = {}

/**
 * ============================================================================
 * PlayerModal component - An Mui Modal populated with Player
 *
 * Taks a trigger component as an argument
 *
 * https://github.com/sampotts/plyr#initialising
 * ============================================================================
 */

// Styles
const useModalStyles = makeStyles((theme) => ({
  videoWrapper: {
    position: 'fixed',
    width: '95vw',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    [theme.breakpoints.up('md')]: {
      width: '80vw',
    },
  },
}))

export const PlayerModal = (props) => {
  const classes = useModalStyles()
  const [openVideo, setOpenVideo] = useState(false)

  const TriggerComponent = props.triggerComponent

  const handleOpen = () => {
    setOpenVideo(true)
  }

  const handleClose = () => {
    setOpenVideo(false)
  }

  return (
    <>
      <span type="button" onClick={handleOpen}>
				{TriggerComponent}
      </span>
      <Modal className={classes.modal} open={openVideo} onClose={handleClose}>
				<Box className={`${props.styles} ${classes.videoWrapper}`}>
					<Player styles={classes.videoWrapper} videoSrc={props.videoSrc} videoProvider="youtube" />
				</Box>
			</Modal>
    </>
  )
}
