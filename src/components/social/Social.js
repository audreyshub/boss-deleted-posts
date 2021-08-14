import React from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql} from 'gatsby'
import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'

// Icons
import InstagramIcon from '@material-ui/icons/Instagram'
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'

//L18n
import strings from './strings.json'

const Social = (props) => {
	// console.log('👾 Social > ', props)
	
	// REFACTOR move query to index.js ...maybe?
	const data = useStaticQuery(graphql`
	{
		prismicSiteSettings {
			data {
				facebook {
					url
				}
				instagram {
					url
				}
				twitter {
					url
				}
			}
		}
	}
	`)
	
	const {facebook, instagram, twitter } = data.prismicSiteSettings.data

  return (
    <Box className={`${props.styles}`}>
      {facebook && (
        <IconButton
          href={facebook.url}
          target="_blank"
          aria-label={strings.ariaFacebookLabel}
          role="button"
					rel="noopener noreferrer"
					color="inherit"
        >
          <FacebookIcon  />
        </IconButton>
      )}
      {instagram && (
        <IconButton
          href={instagram.url}
          target="_blank"
          aria-label={strings.ariaInstagramLabel}
          role="button"
					rel="noopener noreferrer"
					color="inherit"
        >
          <InstagramIcon  />
        </IconButton>
      )}
      {twitter && (
        <IconButton
          href={twitter.url}
          target="_blank"
          aria-label={strings.ariaTwitterLabel}
          role="button"
					rel="noopener noreferrer"
					color="inherit"
        >
          <TwitterIcon  />
        </IconButton>
      )}
    </Box>
  )
}

export default Social

Social.propTypes = {
  
}