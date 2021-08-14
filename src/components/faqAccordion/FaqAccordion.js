import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Box from '@material-ui/core/Box'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Typography from '@material-ui/core/Typography'
import { RichText } from 'prismic-reactjs'

// Icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

// Styles
const useStyles = makeStyles((theme) => ({
  faqAccordion: {
    maxWidth: '768px',
    marginTop: theme.spacing(4),
  },
  accordion: {
    margin: theme.spacing(2, 0),
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: theme.spacing(1),
    '&:before': {
      content: 'none',
    },
    '&.Mui-expanded': {
      border: `1px solid ${theme.palette.secondary.main}`,
    },
  },
  accordionDetails: {
    flexDirection: 'column',
  },
}))

const FaqAccordion = (props) => {
  // console.log('👾 FaqAccordion > ', props)

  const title = props.primary.title

  const classes = useStyles()

  return (
    <Box className={`${props.styles} ${classes.faqAccordion}`}>
      <Typography variant="h3">{title}</Typography>

      {props.items.map((item, i) => (
        <Accordion key={i} className={classes.accordion} elevation={0}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${i}a-content`}
            id={`panel${i}a-header`}
          >
            <Typography variant="h4" component="p">
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={classes.accordionDetails}>
            <RichText render={item.answer.raw} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  )
}

export default FaqAccordion

FaqAccordion.propTypes = {
  items: PropTypes.array.isRequired,
}
