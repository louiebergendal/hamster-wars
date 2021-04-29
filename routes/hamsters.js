const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const json = require('express-json')
const router = express.Router()

const validation = require('../utilities/validation.js')

// INDEX:
// GET /hamsters
// GET /hamsters/random
// GET /hamsters/:id

// POST /hamsters

// PUT /hamsters/:id

// PUT /hamsters/:id/win
// PUT /hamsters/:id/lose

// DELETE /hamsters/:id


// ** REST API **

// GET /hamsters
router.get('/', async (req, res) => {
	try {
		
		const hamstersRef = db.collection('hamsters')
		const snapshot = await hamstersRef.get()

		// Kollar ifall databasen är tom
		if( snapshot.empty ) {
			console.log('No collection found.');
			res.status(404).send('No collection found.')
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

		const hamstersRef = db.collection('hamsters')
		const snapshot = await hamstersRef.get()

		// Kollar ifall databasen är tom
		if( snapshot.empty ) {
			console.log('No collection found.');
			res.status(404).send('No collection found.')
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

		const id = req.params.id
		const docRef = await db.collection('hamsters').doc(id).get()

		// Validerar id och kontrollerar att hamstern finns
		if (validation.id(id, docRef, res) === false) { return }	

		// Allt gick bra. Skickar hamster.
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
		if (validation.bodyKeys(body, res) === false) { return }
		if (validation.bodyValues(body, res) === false) { return }

		// Allt gick bra. Hamstern skickas in i databasen, och klienten får ett objekt med hamsterns id.
		const docRef = await db.collection('hamsters').add(body)
		const idObject = { id: docRef.id } // Objectet krävs av uppgifts-specen
		res.status(200).send(idObject)
		
	} catch (error) {
		console.log(error);
		res.sendStatus(500)
	}
})

// PUT /hamsters/:id
router.put('/:id', async (req, res) => {
	try {	
		const body = req.body

		// Validerar body
		if( validation.bodyObject(body, res) === false ) { return }

		const id = req.params.id
		const docRef = db.collection('hamsters').doc(id)
		const doc = await docRef.get();

		// Validerar id och kontrollerar att hamstern finns
		if (validation.id(id, doc, res) === false) { return }	

		let hamster = doc.data();

		// Kollar så att bodyns properties matchar med databas-hamsterns properties
		if (validation.propertyKeys(body, hamster, res) === false) { return }
		if (validation.propertyValues(body, res) === false) { return }

		// Skickar över data från body till hamster
		Object.keys(body).forEach(bodyKey => { // "Object.Keys()" Gör så att man kan hantera ett objekt som en array (loopa etc)
			if (hamster[bodyKey]) { // "hamster[bodyKey]" letar efter en nyckel i hamster som matchar nyckeln i body
				hamster[bodyKey] = body[bodyKey] // Den del av hamster som matchar med body, ska overridas av body
			}
		});

		// Allt gick bra. Hamstern uppdateras.
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

		const id = req.params.id
		const docRef = db.collection('hamsters').doc(id)
		const doc = await docRef.get();

		// Validerar id och kontrollerar att hamstern finns
		if (validation.id(id, doc, res) === false) { return }

		let hamster = doc.data();

		// Hamstern vinner
		hamster.wins ++;
		hamster.games ++;

		// Allt gick bra. Hamstern förlorar.
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

		const id = req.params.id
		const docRef = db.collection('hamsters').doc(id)
		const doc = await docRef.get();

		// Validerar id och kontrollerar att hamstern finns
		if ( validation.id(id, doc, res) === false ) { return };

		let hamster = doc.data();
	
		// Hamstern förlorar
		hamster.defeats ++;
		hamster.games ++;
	
		// Allt gick bra
		await docRef.set( hamster, { merge: true } )
		res.sendStatus(200)

	} catch (error) {
		res.sendStatus(500)
		console.log(error);
	}
})


// DELETE /hamsters/:id
router.delete('/:id', async (req, res) => {
	try {

		const id = req.params.id
		const docRef = await db.collection('hamsters').doc(id).get()

		// Validerar id och kontrollerar att hamstern finns
		if (validation.id(id, docRef, res) === false) { return }
	
		// Allt gick bra, hamstern elimineras
		await db.collection('hamsters').doc(id).delete()
		res.sendStatus(200)

	} catch (error) {
		console.log(error);
		res.sendStatus(500)
	}
})


// =================== FUNKTIONER =================== //

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = router