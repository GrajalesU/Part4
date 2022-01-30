// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((total, blog) => total + blog.likes, 0)

const favoriteBlog = (blogs) => (blogs.length === 0 ? null : blogs.reduce(
  (max, blog) => (max.likes > blog.likes ? max : blog),
  {},
))

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const counter = {}
  blogs.forEach((blog) => {
    // eslint-disable-next-line no-unused-expressions
    blog.author in counter ? counter[blog.author] += 1 : counter[blog.author] = 1
  })
  const sortedCounter = Object.entries(counter).sort(([, v1], [, v2]) => v2 - v1)
  sortedCounter.map((key, value) => [(key, value)])
  const [name, nOfBlogs] = sortedCounter[0]
  return { author: name, blogs: nOfBlogs }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const counter = {}
  blogs.forEach((blog) => {
    // eslint-disable-next-line no-unused-expressions
    blog.author in counter ? counter[blog.author] += blog.likes : counter[blog.author] = blog.likes
  })
  const sortedCounter = Object.entries(counter).sort(([, v1], [, v2]) => v2 - v1)
  const [name, likes] = sortedCounter[0]
  return { author: name, likes }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes,
}
