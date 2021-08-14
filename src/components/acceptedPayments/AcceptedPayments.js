import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import SvgIcon from '@material-ui/core/SvgIcon'

// Assets
import Icon1 from './assets/icon1.inline.svg'
import Icon2 from './assets/icon2.inline.svg'
import Icon3 from './assets/icon3.inline.svg'
import Icon4 from './assets/icon4.inline.svg'
import Icon5 from './assets/icon5.inline.svg'
import Icon6 from './assets/icon6.inline.svg'
import Icon7 from './assets/icon7.inline.svg'
import Icon8 from './assets/icon8.inline.svg'
import Icon9 from './assets/icon9.inline.svg'
import Icon10 from './assets/icon10.inline.svg'
import Icon11 from './assets/icon11.inline.svg'
import Icon12 from './assets/icon12.inline.svg'
import Icon13 from './assets/icon13.inline.svg'
import Icon14 from './assets/icon14.inline.svg'
import Icon15 from './assets/icon15.inline.svg'
import Icon16 from './assets/icon16.inline.svg'
import Icon17 from './assets/icon17.inline.svg'
import Icon18 from './assets/icon18.inline.svg'
import Icon19 from './assets/icon19.inline.svg'

// Styles
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(2),
    justifyContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '& svg': {
      height: '24px',
      width: '40px',
    },
  },
}))

const AcceptedPayments = (props) => {
  const classes = useStyles()
  return (
    <Container className={`${props.styles} ${classes.root}`}>
      <SvgIcon component={Icon1} viewBox="0 0 40 24" />
      <SvgIcon component={Icon2} viewBox="0 0 40 24" />
      <SvgIcon component={Icon3} viewBox="0 0 40 24" />
      <SvgIcon component={Icon4} viewBox="0 0 40 24" />
      <SvgIcon component={Icon5} viewBox="0 0 40 24" />
      <SvgIcon component={Icon6} viewBox="0 0 40 24" />
      <SvgIcon component={Icon7} viewBox="0 0 40 24" />
      <SvgIcon component={Icon8} viewBox="0 0 40 24" />
      <SvgIcon component={Icon9} viewBox="0 0 40 24" />
      <SvgIcon component={Icon10} viewBox="0 0 40 24" />
      <SvgIcon component={Icon11} viewBox="0 0 40 24" />
      <SvgIcon component={Icon12} viewBox="0 0 40 24" />
      <SvgIcon component={Icon13} viewBox="0 0 40 24" />
      <SvgIcon component={Icon14} viewBox="0 0 40 24" />
      <SvgIcon component={Icon15} viewBox="0 0 40 24" />
      <SvgIcon component={Icon16} viewBox="0 0 40 24" />
      <SvgIcon component={Icon17} viewBox="0 0 40 24" />
      <SvgIcon component={Icon18} viewBox="0 0 40 24" />
      <SvgIcon component={Icon19} viewBox="0 0 40 24" />
    </Container>
  )
}

export default AcceptedPayments
