import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  photo: {
    type: String, 
    required: false
  },
  role: {
    type: String,
    enum: ['socio', 'entrenador'], 
    required: true
  },
  bankAccount: {
    type: String,
    required: function () {
      return this.role === 'socio';
    }
  },
  weight: {
    type: Number,
    required: function () {
      return this.role === 'socio';
    }
  },
  height: {
    type: Number,
    required: function () {
      return this.role === 'socio';
    }
  },
  classesCanTeach: {
    type: [String], // lista de clases que puede impartir
    required: function () {
      return this.role === 'entrenador';
    }
  }

}, {
  timestamps: true
})

export default mongoose.model('User', userSchema)


