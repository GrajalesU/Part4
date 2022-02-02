const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const app = require('../app')
const Blog = require('../models/blog')

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7', title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', user: mongoose.Types.ObjectId('61fad5f383ad466cbd047c1e'), likes: 7, __v: 0,
  }, {
    _id: '5a422aa71b54a676234d17f8', title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html', user: mongoose.Types.ObjectId('61fad5f383ad466cbd047c1e'), likes: 5, __v: 0,
  }, {
    _id: '5a422b3a1b54a676234d17f9', title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html', user: mongoose.Types.ObjectId('61fad5f383ad466cbd047c1e'), likes: 12, __v: 0,
  }, {
    _id: '5a422b891b54a676234d17fa', title: 'First class tests', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll', user: mongoose.Types.ObjectId('61fad5f383ad466cbd047c1e'), likes: 10, __v: 0,
  }, {
    _id: '5a422ba71b54a676234d17fb', title: 'TDD harms architecture', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html', user: mongoose.Types.ObjectId('61fad5f383ad466cbd047c1e'), likes: 0, __v: 0,
  }, {
    _id: '5a422bc61b54a676234d17fc', title: 'Type wars', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html', user: mongoose.Types.ObjectId('61fad5f383ad466cbd047c1e'), likes: 2, __v: 0,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[3])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[4])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[5])
  await blogObject.save()
})

const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const res = await api.get('/api/blogs')

  expect(res.body).toHaveLength(initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const res = await api.get('/api/blogs')

  const titles = res.body.map((r) => r.title)
  expect(titles).toContain('First class tests')
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    url: 'test',
    author: 'Juan Manuel Grajales',
  }

  const userForToken = {
    username: 'root',
    id: '61fad5f383ad466cbd047c1e',
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const res = await api.get('/api/blogs')
  const titles = await res.body.map((r) => r.title)

  expect(res.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain('async/await simplifies making async calls')
})

test('id property is defined for each blog', async () => {
  const res = await api.get('/api/blogs')
  const blog = res.body[0]

  expect(blog.id).toBeDefined()
})

test('0 likes as default for a new blog', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    url: 'test',
    author: 'Juan Manuel Grajales',
  }
  const userForToken = {
    username: 'root',
    id: '61fad5f383ad466cbd047c1e',
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  const res = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogInBD = res.body

  expect(blogInBD.likes).toBeDefined()
  expect(blogInBD.likes).toBe(0)
})

test('return 400 if blog do not have title or url', async () => {
  const newBlogWithoutUrl = {
    title: 'async/await simplifies making async calls',
    author: 'Juan Manuel Grajales',
  }

  const newBlogWithoutTitle = {
    url: 'test',
    author: 'Juan Manuel Grajales',
  }

  const userForToken = {
    username: 'root',
    id: '61fad5f383ad466cbd047c1e',
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlogWithoutUrl)
    .expect(400)

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlogWithoutTitle)
    .expect(400)
})

test('return 401 if not have token auth header', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    url: 'test',
    author: 'Juan Manuel Grajales',
  }

  const token = null

  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(newBlog)
    .expect(401)
})

afterAll(() => {
  mongoose.connection.close()
})
