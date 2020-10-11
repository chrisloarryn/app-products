//Import packages
const express = require('express')
const fetch = require('node-fetch')
const redis = require('redis')
const jwt = require('jsonwebtoken')
const cors = require('cors')

const AppError = require('./utils/appError')

//Declare express server port and redis client port
const PORT = process.env.PORT || 3000
const REDIS_PORT = process.env.REDIS_PORT || 6379

//Create Redis client on Redis port
// const redisClient = redis.createClient(REDIS_PORT);
const redisClient = redis.createClient()
redisClient.on('connect', function () {
  console.log('You are now connected')
})
redisClient.on('error', function (error) {
  console.log(error)
})

//Create an app const by executing express like a function
const app = express()
app.use(cors())

// app.use(checkAuth)

function setResponse(key = 'username', data) {
  return { key, data }
}

async function checkToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1] // Authorization: 'Bearer TOKEN' <- part of string
    if (!token) return next(new AppError('Authentication failed!', 401))
    const { header, payload, signature } = jwt.decode(token, { complete: true })
    req.userData = {
      userId: payload.user_id,
      userSub: payload.sub,
      email: payload.email,
      userName: payload.name,
      userImg: payload.picture,
      emailOk: payload.email_verified,
    }
    req.token = token
    res.json({ header, payload, signature })
  } catch (err) {
    return next(new AppError('Authentication failed!', 401))
  }
}

async function dataFetcher(url) {
  const response = await fetch(url)
  return await response.json()
}

//Make request to GitHub for data
async function getProducts(req, res, next) {
  try {
    console.log('Fetching data...')

    const stations = await dataFetcher(
      `https://my-json-server.typicode.com/jirann/FAKEJSON/user/1/items`,
    )
    const users = await dataFetcher(
      `https://my-json-server.typicode.com/jirann/FAKEJSON/profile`,
    )
    const data = users.map(user => {
      return {
        user,
        stations: stations.filter(
          station => parseInt(user.id) === station.user_id,
        ),
      }
    })
    const myDataFormat = {
      users,
      stations,
      stationsByUser: data,
    }
    // set to redis
    // redisClient.setex('username', 3600, JSON.stringify(...myDataFormat));
    res.status(200).json({ message: 'success', data: { ...myDataFormat } })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
}

app.get('/api/checkToken', checkToken)
app.get('/api/products', getProducts)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}...`)
})
