const linkResolver = (props) => {

	if (props.type === 'homepage') {
    return `/`
	}
	if (props.type === 'collection') {
    return `/collections/${props.uid}`
	}
	if (props.type === 'product') {
    return `/products/${props.uid}`
	}
	if (props.type === 'page') {
    return `/${props.uid}`
	}
  if (props.type === 'post') {
    return `/blog/${props.uid}`
	}
	
  return `/${props.uid}`
}

module.exports = linkResolver