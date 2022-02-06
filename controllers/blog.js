const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (_request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  const { body, token } = request
  const decodedToken = jwt.verify(token, process.env.SECRET)

  if (!token || !decodedToken.id) { return next({ name: 'Unauthorized', message: 'Token missing or invalid' }) }

  const user = await User.findById(decodedToken.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body?.likes,
    user: user.id,
  })

  const savedBlog = await blog.save()

  await user.updateOne({ blogs: [...user.blogs, savedBlog.id] })

  return response.status(201).json(savedBlog)
})

blogRouter.put('/:id', async (request, response) => {
  const blog = {
    ...request.body,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

blogRouter.delete('/:id', async (request, response, next) => {
  const { token } = request
  const { id } = jwt.verify(token, process.env.SECRET)
  if (!token || !id) { return next({ name: 'Unauthorized', message: 'Token missing or invalid' }) }
  const { user } = await Blog.findById(request.params.id)
  if (id === user.toString()) {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)
    return response.json(deletedBlog)
  }
  return next({ name: 'Unauthorized', message: 'The blog you are trying to delete is not your own.' })
})

module.exports = blogRouter
