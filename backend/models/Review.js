import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 60 },
  review: { type: String, required: true, trim: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('Review', reviewSchema)
