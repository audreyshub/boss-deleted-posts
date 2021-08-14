import React, { useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import loadable from '@loadable/component'

// Components
import SEO from '../../components/seo'
// import HeroIndex from '../../components/heroIndex'
// import FeaturedCollections from '../../components/featuredCollections'
// import CtaIndex from '../../components/ctaIndex'
// import FeaturedProducts from '../../components/featuredProducts'
// import ContentCallout from '../../components/contentCallout'
// import ContentWithVideo from '../../components/contentWithVideo'
// import Instagram from '../../components/instagram'
// import NewsletterIndex from '../../components/newsletterIndex'
// import Testimonials from '../../components/testimonials'

// Utilities
import linkResolver from '../../utilities/linkResolver'
import { useHasBeenVisible } from '../../hooks/useVisibility'

// Loadable components
const HeroIndex = loadable(() => import('../../components/heroIndex/HeroIndex'))
const FeaturedCollections = loadable(() =>
  import('../../components/featuredCollections/FeaturedCollections')
)
const CtaIndex = loadable(() => import('../../components/ctaIndex/CtaIndex'))
const FeaturedProducts = loadable(() =>
  import('../../components/featuredProducts/FeaturedProducts')
)
const ContentCallout = loadable(() => import('../../components/contentCallout/ContentCallout'))
const ContentWithVideo = loadable.lib(() =>
  import('../../components/contentWithVideo/ContentWithVideo')
)
const Instagram = loadable(() => import('../../components/instagram/Instagram'))
const NewsletterIndex = loadable(() => import('../../components/newsletterIndex/NewsletterIndex'))
const Testimonials = loadable(() => import('../../components/testimonials/Testimonials'))

// Styles
const useStyles = makeStyles((theme) => ({
  section: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(10),
      marginBottom: theme.spacing(10),
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing(15),
      marginBottom: theme.spacing(15),
    },
  },
}))

const HomePage = (props) => {
  // console.log('👾 HomePage > ', props)
  const contentWithVideoRef = useRef()
  const hasScrolled = useHasBeenVisible(contentWithVideoRef)
  const classes = useStyles()

  const {
    hero,
    featured_collections,
    callout,
    cta,
    cta_items,
    how_it_works,
    instagram,
    instagram_items,
    newsletter,
    testimonial_title,
    testimonial_items,
  } = props.data.prismicHomepage.data

  // console.log('👾 HomePage > ', hasScrolled)
  return (
    <>
      <SEO />
      <HeroIndex
        styles={classes.section}
        {...hero[0]}
        link={linkResolver({ uid: hero[0].handle, type: hero[0].type })}
      />
      <FeaturedCollections styles={classes.section} items={featured_collections} />
      <CtaIndex styles={classes.section} {...cta[0]} items={cta_items} link="#howItWorks" />
      <FeaturedProducts styles={classes.section} products={props.data.FeaturedProducts.nodes} />
      <ContentCallout styles={classes.section} {...callout[0]} />

      {hasScrolled ? (
        <ContentWithVideo
          styles={classes.section}
          {...how_it_works[0]}
          reverse={true}
          link={linkResolver({ uid: how_it_works[0].handle, type: hero[0].type })}
          content={how_it_works[0].content.text}
          id="howItWorks"
        />
      ) : (
        <span ref={contentWithVideoRef}></span>
      )}
      <Instagram
        styles={classes.section}
        reverse={true}
        {...instagram[0]}
        link={props.data.prismicSiteSettings.data.instagram.url}
        items={instagram_items}
      />

      <NewsletterIndex styles={classes.section} {...newsletter[0]} />

      <Testimonials styles={classes.section} title={testimonial_title} items={testimonial_items} />
    </>
  )
}

export default HomePage
