export const ratingValue = (reviews) => {
  const avgReview = reviews.reduce((total, next) => total + next.reviewRating, 0) / reviews.length
  return Math.round(avgReview * 10) / 10
}

export const reviewCount = (reviews) => {
  return reviews && reviews.length
}
