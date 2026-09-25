import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import Review from './models/Review.js'

const app = express()
app.use(cors())
app.use(express.json())

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/momo'

mongoose
  .connect(MONGO_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err))

app.get('/api/reviews', async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 })
  res.json(reviews)
})

app.post('/api/reviews', async (req, res) => {
  const { name, review } = req.body
  if (!name?.trim() || !review?.trim()) {
    return res.status(400).json({ error: 'name and review are required' })
  }
  const created = await Review.create({ name: name.trim(), review: review.trim() })
  res.status(201).json(created)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`API listening on port ${PORT}`))
