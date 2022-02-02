const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const initialUsers = [
  {
    _id: '61fad5f383ad466cbd047c1e',
    username: 'root',
    name: 'admin',
    passwordHash: '$2b$10$tYCVnSF5ugCrgKV94/2kWeOoAO3.RTFeafnRYqiyPr4frV2oXCgLa',
    blogs: [],
    __v: 0,
  },
]

beforeEach(async () => {
  await User.deleteMany({})
  const userObject = new User(initialUsers[0])
  await userObject.save()
})

const api = supertest(app)

describe('user validation', () => {
  test('repeated username must return error', async () => {
    const newUser = {
      username: 'root', // repeated username
      name: 'admin2',
      password: 'root',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('username length must be more than or equal to 3', async () => {
    const newUser = {
      username: 'ro', // less than 3
      name: 'admin2',
      password: 'root',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('password length must be more than or equal to 3', async () => {
    const newUser = {
      username: 'root2',
      name: 'admin2',
      password: 'ro', // less than 3
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})
