const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const books = require('./routes/books.js')
const hamsterWars = require('./routes/hamsters.js')

const PORT = process.env.PORT || 1339
const staticFolder = path.join(__dirname, 'static')
const staticImgFolder = path.join(__dirname, 'static', 'img')


// ============= MIDDLEWARE ============= //

/* 
FRÅGOR:
	- Ligger min error handler rätt placerad?
*/


// Logger - skriv ut info om inkommande request
app.use((req, res, next) => {
	console.log(`${req.method}  ${req.url} `, req.params);
	next()
})

app.use( express.json() )
app.use( cors() )
app.use( express.static(staticFolder) )
app.use( express.static(staticImgFolder) )


// ============= ROUTES ============= //

app.use('/books', books)
app.use('/hamsters', hamsterWars)

// Starta servern
app.listen(PORT, () => {
	console.log('Server listening on port ' + PORT);
})

app.use(errorHandler)
function errorHandler (err, req, res, next) {

	console.log('HOPPSAN!');
	
	if (res.headersSent) {
	  return next(err)
	}
	res.status(500)
	res.render('error', { error: err })
}

