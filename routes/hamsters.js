const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const json = require('express-json')
const router = express.Router()

// INDEX:
// GET /hamsters
// GET /hamsters/random
// GET /hamsters/:id

// POST /hamsters

// PUT /hamsters/:id

// PUT /hamsters/:id/win
// PUT /hamsters/:id/lose

// DELETE /hamsters/:id

// ============= NOTES ============= //
/* 
	TODO:
	
*/

// ** REST API **

// GET /hamsters
router.get('/', async (req, res) => {
	try {

		// Kollar ifall databasen är tom
		const hamstersRef = db.collection('hamsters')
		const snapshot = await hamstersRef.get()

		if( snapshot.empty ) {
			res.send([])
			return
		}
	
		let hamsters = []
	
		// Fyller hamsters med hamstrarna i databasen
		snapshot.forEach(doc => {
			const hamster = doc.data()
			hamster.id = doc.id
			hamsters.push( hamster )
		})
	
		// Allt gick bra. Hamstrarna skickas.
		res.status(200).send(hamsters)

	} catch (error) {
		console.log(error);
		res.sendStatus(500)
	}
})

// GET /hamsters/random
router.get('/random', async (req, res) => {
	try {

		// Kollar ifall databasen är tom
		const hamstersRef = db.collection('hamsters')
		const snapshot = await hamstersRef.get()
		
		if( snapshot.empty ) {
			res.send([])
			return
		}

		// Fyller på en array att slumpa en hamster ifrån
		let hamsters = []

		snapshot.forEach(doc => { // Loop
			const hamster = doc.data()
			hamster.id = doc.id
			hamsters.push( hamster )
		})
	
		// Allt gick bra. Slumpar fram en hamster från hamsters och skickar.
		randomHamster = hamsters[getRandomInt(hamsters.length)]
		res.status(200).send(randomHamster)

	} catch (error) {
		console.log(error);
		res.sendStatus(500)
	}
})

// GET /hamsters/:id
router.get('/:id', async (req, res) => {
	try {

		// Validerar id och kontrollerar att hamstern finns
		const id = req.params.id
		const docRef = await db.collection('hamsters').doc(id).get()

		if (idValidation(id, docRef, res) === false) {
			return
		}	

		// Allt gick bra. Skickar hamster
		const hamster = docRef.data()	
		res.status(200).send(hamster)

	} catch (error) {
		console.log(error);
		res.sendStatus(500)
	}
})


// POST /hamsters
router.post('/', async (req, res) => {
	try {
		const body = req.body

		// Validerar bodyn
		if (hamsterKeyValidation(body, res) === false) {
			return
		}
		if (hamsterValueValidation(body, res) === false) {
			return
		}

		const docRef = await db.collection('hamsters').add(body)
		res.status(200).send(docRef.id)
		
	} catch (error) {
		console.log(error);
		res.sendStatus(500)
	}
})


// PUT /hamsters/:id
router.put('/:id', async (req, res) => {
	try {	

		// Validerar id och kontrollerar att hamstern finns
		const id = req.params.id
		const docRef = db.collection('hamsters').doc(id)
		const doc = await docRef.get();

		if (idValidation(id, doc, res) === false) {
			return
		}	

		let hamster = doc.data();

		// Validerar body
		const body = req.body

		if( !body ) {
			console.log('Missing body. Query rejected.');
			res.status(400).send('Missing body. Query rejected.')
			return
		}	
		if (!partialKeyValidation(body, hamster, res)) {
			return
		}
		if (!partialValueValidation(body, res)) {
			return
		}

		// Skickar över data från body till hamster
		Object.keys(body).forEach(bodyKey => { // "Object.Keys()" Gör så att man kan hantera ett objekt som en array (loopa etc)

			if (hamster[bodyKey]) { // "hamster[bodyKey]" letar efter en nyckel i hamster som matchar nyckeln i body
				hamster[bodyKey] = body[bodyKey] // Den del av hamster som matchar med body, ska overridas av body
			}
		});

		// Allt gick bra
		await docRef.set(hamster, { merge: true })
		res.sendStatus(200)

	} catch (error) {
		console.log(error);
		res.sendStatus(500)
	}
})

// PUT /hamsters/:id/win
router.put('/:id/win', async (req, res) => {
	try {

		// Validerar id och kontrollerar att hamstern finns
		const id = req.params.id
		const docRef = db.collection('hamsters').doc(id)
		const doc = await docRef.get();

		if (idValidation(id, doc, res) === false) {
			return
		}

		let hamster = doc.data();

		// Hamstern vinner
		hamster.wins ++;
		hamster.games ++;

		// Allt gick bra
		await docRef.set(hamster, { merge: true })
		res.sendStatus(200)
		
	} catch (error) {
		console.log(error);
		res.sendStatus(500)
	}

})

// PUT /hamsters/:id/lose
router.put('/:id/lose', async (req, res) => {
	try {

		// Validerar id och kontrollerar att hamstern finns
		const id = req.params.id
		const docRef = db.collection('hamsters').doc(id)
		const doc = await docRef.get();

		if (idValidation(id, doc, res) === false) {
			return
		}

		let hamster = doc.data();
	
		// Hamstern förlorar
		hamster.defeats ++;
		hamster.games ++;
	
		// Allt gick bra
		await docRef.set(hamster, { merge: true })
		res.sendStatus(200)

	} catch (error) {
		res.sendStatus(500)
		console.log(error);
	}
})


// DELETE /hamsters/:id
router.delete('/:id', async (req, res) => {
	try {

		// Validerar id och kontrollerar att hamstern finns
		const id = req.params.id
		const docRef = await db.collection('hamsters').doc(id).get()

		if (idValidation(id, docRef, res) === false) {
			return
		}
	
		// Allt gick bra
		await db.collection('hamsters').doc(id).delete()
		res.sendStatus(200)

	} catch (error) {
		console.log(error);
		res.sendStatus(500)
	}
})



// =================== FUNKTIONER =================== //

function idValidation(id, docRef, res){

	console.log('Analyzing id ...');

	// Grundläggande validering av request
	if( !id ) {
		console.log('Missing id. Query rejected.');
		res.status(400).send('Missing id. Query rejected.')
		return false
	}

	// Kollar ifall hamstern finns
	if ( !docRef.exists ) {
		console.log('No such hamster. Query rejected.');
		res.status(404).send('No such hamster. Query rejected.')
		return false
	}

	console.log('Hamster found.');
	return true
}


function partialValueValidation(body, res){

	console.log('Analyzing object values ...');

	let numbersValid = true
	let stringsValid = true

	Object.keys(body).forEach(bodyKey => { // "Object.Keys()" Gör så att man kan hantera ett objekt som en array (loopa etc)

		// Kollar så att bodynyckelns värde har rätt datatyp
		if (bodyKey === 'age' || bodyKey === 'wins' || bodyKey === 'defeats' || bodyKey === 'games') {
			if ( typeof body[bodyKey] != 'number') {
				numbersValid = false
			}
		}
		if (bodyKey === 'name' || bodyKey === 'favFood' || bodyKey === 'loves' || bodyKey === 'imgName') {
			if ( typeof body[bodyKey] != 'string') {
				stringsValid = false
			}
		}
	});

	// Om datatypen är fel så godtas inte queryn
	if (numbersValid === false) {
		console.log('"age", "wins", "defeats" and "games" must be numbers. Query rejected.');
		res.status(400).send('"age", "wins", "defeats" and "games" must be numbers. Query rejected.')
		return false	
	}
	if (stringsValid === false) {
		console.log('"name", "favFood", "loves" and "imgName" must be strings. Query rejected.');
		res.status(400).send('"name", "favFood", "loves" and "imgName" must be strings. Query rejected.')
		return false	
	}

	console.log('Object values analyzed. All seems fine.');
	return true
}

function partialKeyValidation(body, hamster, res){

	console.log('Analyzing keys ...');

	let keyExists = true

	// Loopar igenom body och kollar så att inga nyckar är fel
	Object.keys(body).forEach(bodyKey => {
		if (hamster[bodyKey] === undefined) {
			keyExists = false
		}
	});

	// Om någon nyckel inte stämmer så skickas ett felmeddelande
	if (keyExists === false) {
		console.log('Some keys did not match. Query rejected.');
		res.status(400).send('Some keys did not match. Query rejected.')
		return false
	}

	console.log('Keys analyzed. All seems fine.');
	return true
}

function hamsterKeyValidation(body, res){

	console.log('Analyzing hamster keys ...');

	// Kollar så att antalet properties stämmer
	if( Object.keys(body).length > 8 ) {
		console.log('To many properties. Query rejected.');
		res.status(400).send('To many properties. Query rejected.')
		return false
	}

	// Kollar så att alla nyckar finns med
	if (typeof body.name === 'undefined') {
		console.log('The hamster needs a name. Query rejected.');
		res.status(400).send('The hamster needs a name. Query rejected.')
		return false
	}

	if (typeof body.age === 'undefined') {
		console.log('The hamster needs a age. Query rejected.');
		res.status(400).send('The hamster needs a "age". Query rejected.')
		return false
	}

	if (typeof body.favFood === 'undefined') {
		console.log('The hamster needs a "favFood". Query rejected.');
		res.status(400).send('The hamster needs a "favFood". Query rejected.')
		return false
	}

	if (typeof body.loves === 'undefined') {
		console.log('The hamster needs a "loves". Query rejected.');
		res.status(400).send('The hamster needs a "loves". Query rejected.')
		return false
	}

	if (typeof body.imgName === 'undefined') {
		console.log('The hamster needs a "imgName". Query rejected.');
		res.status(400).send('The hamster needs a "imgName". Query rejected.')
		return false
	}

	if (typeof body.wins === 'undefined') {
		console.log('The hamster needs a "wins". Query rejected.');
		res.status(400).send('The hamster needs a "wins". Query rejected.')
		return false
	}

	if (typeof body.defeats === 'undefined') {
		console.log('The hamster needs a "defeats". Query rejected.');
		res.status(400).send('The hamster needs a "defeats". Query rejected.')
		return false
	}

	if (typeof body.games === 'undefined') {
		console.log('The hamster needs a "games". Query rejected.');
		res.status(400).send('The hamster needs a "games". Query rejected.')
		return false
	}

	console.log('All keys are there.')
	return true
}

function hamsterValueValidation(body, res){

	console.log('Analyzing hamster ...');

	// Kollar så att alla värden är ifyllda och är av rätt data-typ
	if (typeof body.name !== 'string' || body.name === '') {
		console.log('"name" must be a string containing one or more letters. Query rejected.');
		res.status(400).send('"name" must be a string containing one or more letters. Query rejected.')
		return false
	}

	if (typeof body.age !== 'number' || body.age < -1) {
		console.log('"age" must be a positive number. Query rejected.');
		res.status(400).send('"age" must be a positive number. Query rejected.')
		return false
	}

	if (typeof body.favFood !== 'string' || body.favFood === '') {
		console.log('"favFood" must be a string containing one or more letters. Query rejected.');
		res.status(400).send('"favFood" must be a string containing one or more letters. Query rejected.')
		return false
	}

	if (typeof body.loves !== 'string' || body.loves === '') {
		console.log('"loves" must be a string containing one or more letters. Query rejected.');
		res.status(400).send('"loves" must be a string containing one or more letters. Query rejected.')
		return false
	}

	if (typeof body.imgName !== 'string' || body.imgName === '') {
		console.log('"imgName" must be a string containing one or more letters. Query rejected.');
		res.status(400).send('"imgName" must be a string containing one or more letters. Query rejected.')
		return false
	}

	if (typeof body.wins !== 'number' || body.wins < -1) {
		console.log('"wins" must be a positive number. Query rejected.');
		res.status(400).send('"wins" must be a positive number. Query rejected.')
		return false
	}

	if (typeof body.defeats !== 'number' || body.defeats < -1) {
		console.log('"defeats" must be a positive number. Query rejected.');
		res.status(400).send('"defeats" must be a positive number. Query rejected.')
		return false
	}

	if (typeof body.games !== 'number' || body.games < -1) {
		console.log('"games" must be a positive number. Query rejected.');
		res.status(400).send('"games" must be a positive number. Query rejected.')
		return false
	}

	// Kollar så att bodyns wins, defeats och games går ihop
	if (body.wins + body.defeats !== body.games) {
		console.log('"games" must be the sum of "wins" and "defeats". Query rejected.');
		res.status(400).send('"games" must be the sum of "wins" and "defeats". Query rejected.')
		return false
	}

	console.log('All properties are valid.')
	return true
}

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = router