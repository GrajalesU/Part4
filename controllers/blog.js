const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) return authorization.substring(7)
  return null
}

blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const { body } = request
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) { return next({ name: 'Unauthorized', message: 'Token missing or invalid' }) }

  const user = await User.findById(body.userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body?.likes,
    user: user.id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog.id)
  await user.save()

  return response.status(201).json(savedBlog)
})

blogRouter.put('/:id', async (request, response) => {
  const blog = {
    ...request.body,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
  response.json(deletedBlog)
})

module.exports = blogRouter
