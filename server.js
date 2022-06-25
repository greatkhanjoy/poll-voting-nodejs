const express = require('express')
const app = express()
const morgan = require('morgan')
const ejs = require('ejs')
const connectDB = require('./Db/connectDB')
const PollRouter = require('./Routes/PollRoutes')
const notFound = require('./Middlewares/notFound')
const ErrorHandler = require('./Middlewares/error-handler')

//Variables
const port = process.env.PORT || 4444

app.set('view engine', 'ejs')
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  res.render('index')
})
app.use('/polls', PollRouter)
app.use(ErrorHandler)
app.use(notFound)

//Listeners
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI || 'mongodb://localhost/pool')
    app.listen(port, () => console.log(`Server started on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}
start()
