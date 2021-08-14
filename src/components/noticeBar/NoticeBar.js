import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import SvgIcon from '@material-ui/core/SvgIcon'

// Icons
import CloseIcon from '@material-ui/icons/Close'

//L18n
import strings from './strings.json'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0.5, 0),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    textAlign: 'center',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'center',
  },
}))

const NoticeBar = React.forwardRef((props, ref) => {
  const classes = useStyles()

  return (
    <Box ref={ref} className={`${props.styles} ${classes.root}`}>
      <Container className={classes.container}>
        <Typography variant="h4" component="span">
          {props.message}
        </Typography>

        {props.dismissable && (
          <IconButton
            color="inherit"
            edge="end"
            aria-label={strings.ariaDismissLabel}
            role="button"
            onClick={props.handleToggleNoticeBar}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Container>
    </Box>
  )
})

export default NoticeBar

NoticeBar.propTypes = {
  message: PropTypes.string.isRequired,
  dismissable: PropTypes.bool,
}
NoticeBar.defaultProps = {
  message: 'This is a notice',
  dismissable: true,
}
