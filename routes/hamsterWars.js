const getDatabase = require('../database.js')
const db = getDatabase()

const express = require('express')
const json = require('express-json')
const router = express.Router()


// ** REST API **

// GET /hamsters
router.get('/', async (req, res) => {

	const hamstersRef = db.collection('hamsters')
	const snapshot = await hamstersRef.get()

	// Om hamsters inte är tom
	if( snapshot.empty ) {
		res.send([])
		return
	}

	// Om hamsters är tom
	let items = []

	// Snapshot är en firestore-funktion.
	// Ett "doc" är nästan en array. 
	// Man kan bara loopa snapshot med firestores egna forEach.
	snapshot.forEach(doc => { // Loop
		const data = doc.data()
		data.id = doc.id  // id behövs för POST+PUT+DELETE
		items.push( data )
	})

	res.send(items)
})

// GET /hamsters/:id
router.get('/:id', async (req, res) => {
	const id = req.params.id
	const docRef = await db.collection('hamsters').doc(id).get()

	if( !docRef.exists ) {
		res.status(404).send('Hamster does not exist')
		return
	}

	const data = docRef.data()
	res.send(data)
})

// POST /hamsters
router.post('/', async (req, res) => {
	// OBS! Måste installera express.json för att detta ska fungera
	const object = req.body

	if( !ishamstersObject(object) ) {
		console.log('POST/ hamsters had an error!')
		res.sendStatus(400)
		return
	}

	const docRef = await db.collection('hamsters').add(object)
	res.send(docRef.id)
})

// PUT /hamsters/:id
router.put('/:id', async (req, res) => {
	// OBS! Måste installera express.json för att detta ska fungera
	const object = req.body
	const id = req.params.id

	if( !object || !id ) {
		res.sendStatus(400)
		return
	}

	// Vi kan kontrollera om det finns ett doc som matchar id i databasen. 
	// Den här koden godkänner id som inte matchar, 
	// och lägger till ett nytt doc i databasen.

	const docRef = db.collection('hamsters').doc(id)
	await docRef.set(object, { merge: true })
	res.sendStatus(200)
})

// DELETE /hamsters/:id
router.delete('/:id', async (req, res) => {
	const id = req.params.id

	if( !id ) {
		res.sendStatus(400)
		return
	}

	await db.collection('hamsters').doc(id).delete()
	res.sendStatus(200)
})







function ishamstersObject(maybeObject) {

	console.log('MAYBE OBJECT: ', maybeObject);

	// Pratigt, men kanske mera lättläst. Kan göras mer kompakt
	if( !maybeObject )
		return false
	else if( !maybeObject.title || !maybeObject.author )
		return false

	return true
}

module.exports = router