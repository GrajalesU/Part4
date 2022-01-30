// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((total, blog) => total + blog.likes, 0)

const favoriteBlog = (blogs) => (blogs.length === 0 ? null : blogs.reduce(
  (max, blog) => (max.likes > blog.likes ? max : blog),
  {},
))

module.exports = { dummy, totalLikes, favoriteBlog }
