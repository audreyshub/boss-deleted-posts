export const sortConstants = {
  SORT_BY_MOST_RECENT: 'Most recent',
  SORT_BY_HIGHEST_RATING: 'Highest rating',
  SORT_BY_LOWEST_RATING: 'Lowest rating',
  // SORT_BY_MOST_HELPFUL: 'Most helpful',
  SORT_BY_WITH_PHOTOS: 'With photos',
}

export const filterConstants = {
  NUMBER_OF_REVIEWS: 'NUMBER_OF_REVIEWS',
  FILTER_BY_TEXT: 'FILTERED_BY_TEXT',
  FILTER_BY_RATING: 'FILTER_BY_RATING',
}

export const actions = (state = initialState, { type, payload }) => {
  switch (type) {
    case sortConstants.SORT_BY_MOST_RECENT:
      const recent = payload.arr.sort(
        (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate) || b.reviewRating - a.reviewRating
      )
      const recentSliced = recent.slice(0, payload.quantity - 1)
      return {
        ...state,
        sorted: recentSliced,
        type: payload.type,
        quantity: payload.quantity,
        totalNumber: recent.length,
      }

    case sortConstants.SORT_BY_HIGHEST_RATING:
      const highest = payload.arr.sort((a, b) => b.reviewRating - a.reviewRating)
      const highestSliced = highest.slice(0, payload.quantity - 1)
      return {
        ...state,
        sorted: highestSliced,
        type: payload.type,
        quantity: payload.quantity,
        totalNumber: highest.length,
      }

    case sortConstants.SORT_BY_LOWEST_RATING:
      const lowest = payload.arr.sort((a, b) => a.reviewRating - b.reviewRating)
      const lowestSliced = lowest.slice(0, payload.quantity - 1)
      return {
        ...state,
        sorted: lowestSliced,
        type: payload.type,
        quantity: payload.quantity,
        totalNumber: lowest.length,
      }

    case sortConstants.SORT_BY_MOST_HELPFUL:
      return state

    case sortConstants.SORT_BY_WITH_PHOTOS:
      const photos = payload.arr.filter((a) => a.images.length > 0)
      const photosSliced = photos.slice(0, payload.quantity - 1)
      return {
        ...state,
        sorted: photosSliced,
        type: payload.type,
        quantity: payload.quantity,
        totalNumber: photos.length,
      }

    // Take in current sort type and return paginated subset
    case filterConstants.NUMBER_OF_REVIEWS:
      let slicedReviews = payload.arr.slice(0, payload.quantity - 1)
      return {
        ...state,
        sorted: slicedReviews,
        type: payload.type,
        quantity: payload.quantity,
        totalNumber: payload.arr.length,
      }

    // case filterConstants.FILTER_BY_RATING:
    //   const filteredByRating = payload.arr.filter((a) => {
    //     return a.reviewRating <= payload.maxRating
    //   })
    //   const filteredByRatingSliced =
    //     filteredByRating.length > 0 ? filteredByRating.slice(0, payload.quantity - 1) : []
    //   return {
    //     ...state,
    //     sorted: filteredByRatingSliced,
    //     type: payload.type,
    //     quantity: payload.quantity,
    //     totalNumber: filteredByRating.length,
    //   }

    case filterConstants.FILTER_BY_TEXT:
      const filteredByText = payload.arr.filter((a) => {
        const title = a.reviewTitle.toLowerCase()
        const message = a.reviewMessage.toLowerCase()
        const author = a.author.toLowerCase()
        if (
          title.includes(payload.searchQuery) ||
          message.includes(payload.searchQuery) ||
          author.includes(payload.searchQuery)
        ) {
          return true
        }
      })
      const filteredByTextSliced =
        filteredByText.length > 0 ? filteredByText.slice(0, payload.quantity - 1) : []
      return {
        ...state,
        sorted: filteredByTextSliced,
        type: payload.type,
        quantity: payload.quantity,
        totalNumber: filteredByText.length,
      }

    default:
      return state
  }
}
