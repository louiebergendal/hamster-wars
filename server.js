const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const books = require('./routes/books.js')

const PORT = 1339
const staticFolder = path.join(__dirname, 'static')

// ============= NOTES ============= //
/* 
	BEHÖVER HJÄLP:
	- Lär ha gjort fel med git
	- PUT, DELETE OCH POST Funkar inte

	TODO:
	- *Behöver hjälp
	- Gör en ny route
		- hamsterWars.js
		- lägg till en knapp i hamsterwars
			- Ska öka wins-parametern på hamster[0] med 1 i databasen
	- Gör en ny collection i databasen (Firestore)
		- Hamster-Wars
			- Parametrarna från uppgiften
			- Wins & Losses
*/


// ============= MIDDLEWARE ============= //

// Logger - skriv ut info om inkommande request
app.use((req, res, next) => {
	console.log(`${req.method}  ${req.url} `, req.params);
	next()
})

app.use( express.json() )
app.use( cors() )
app.use( express.static(staticFolder) )


// ============= ROUTES ============= //

// REST API for /books
app.use('/books', books)

// Starta servern
app.listen(PORT, () => {
	console.log('Server listening on port ' + PORT);
})