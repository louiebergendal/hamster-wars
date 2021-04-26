const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const books = require('./routes/books.js')
const hamsters = require('./routes/hamsters.js')

const PORT = process.env.PORT || 1340
const staticFolder = path.join(__dirname, 'static')
const staticImgFolder = path.join(__dirname, 'static', 'img')

/* 
FRÅGOR:

	// x cors är protokoll för säker kommunikation mellan flera servrar
	// x Firestore (en del av Firebase) är databasen
	// x Heroku är moln-servern
	// Express är lokala servern?
	// Static är klient-sidan?

*/

// ============= MIDDLEWARE ============= //

// Logger - skriv ut info om inkommande request
app.use((req, res, next) => {
	console.log('===============');
	console.log(`${req.method}  ${req.url} `, req.params);
	next()
})

app.use( express.json() )
app.use( cors() ) 
app.use( express.static(staticFolder) )
app.use( express.static(staticImgFolder) )

// ============= ROUTES ============= //

app.use('/books', books)
app.use('/hamsters', hamsters)

// ============= RESTEN ============= //

// Felhanterare
app.use(errorHandler)
function errorHandler (err, req, res, next) {

	console.log('HOPPSAN!');
	
	if (res.headersSent) {
	  return next(err)
	}
	res.status(500)
	res.render('error', { error: err })
}

// Starta servern
app.listen(PORT, () => {
	console.log('Server listening on port ' + PORT);
})

