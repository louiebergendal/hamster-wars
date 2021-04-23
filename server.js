const express = require('express')
const app = express()
const cors = require('cors')
const path = require('path')
const books = require('./routes/books.js')
const hamsterWars = require('./routes/hamsters.js')

const PORT = 1339
const staticFolder = path.join(__dirname, 'static')

// ============= NOTES ============= //
/* 
	TODO:
	- is it a hamster?
		Kolla så att man inte pushar in en hamster som saknar nycklar

	- Se efter så att statuskoderna matchar med uppgiften
		Alla API-resurser ska returnera JSON eller en HTTP statuskod:

		200 (ok) - Om servern lyckats med att göra det som resursen motsvarar.
		
		400 (bad request) - Om requestet är felaktigt gjort, så att servern inte kan fortsätta. 
		Exempel: POST /hamsters skickar med ett objekt som inte är ett hamster-objekt.
		
		404 (not found) - Om resursen eller objektet som efterfrågas inte finns. 
		Exempel: id motsvarar inte något dokument i databasen. GET /hamsters/felaktigt-id
		
		500 (internal server error) - Om ett fel inträffar på servern. 
		Använd catch för att fånga det.

	- Dokumentera
	- Bryt ut funktioner
	- Olika hamstrar
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
app.use('/hamsters', hamsterWars)

// Starta servern
app.listen(PORT, () => {
	console.log('Server listening on port ' + PORT);
})

app.use(errorHandler)
function errorHandler (err, req, res, next) {

	console.log('TJOLAHOPP!');
	
	if (res.headersSent) {
	  return next(err)
	}
	res.status(500)
	res.render('error', { error: err })
}

