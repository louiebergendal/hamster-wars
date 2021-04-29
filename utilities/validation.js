const express = require('express')
const json = require('express-json')
const router = express.Router()

// =================== VALIDERING =================== //

function id(id, docRef, res){

	console.log('Analyzing id ...');

	// Grundläggande validering av request
	if( !id ) {
		console.log('Missing id. Query rejected.');
		res.status(400).send('Missing id. Query rejected.')
		return false
	}

	// Kollar ifall hamstern finns
	if ( !docRef.exists ) {
		console.log('No such hamster.');
		res.status(404).send('No such hamster.')
		return false
	}

	console.log('Hamster found.');
	return true
}

// ANVÄNDS I PUT/ID
function propertyValues(body, res){

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

// ANVÄNDS I PUT/ID
function propertyKeys(body, hamster, res){

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

// ANVÄNDS I POST
function bodyKeys(body, res){

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

// ANVÄNDS I POST
function bodyValues(body, res){

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


function bodyObject(body, res) {
    console.log('Analyzing body object ...');

    if( !body ) { // Finns det en body?
        console.log('Missing body. Query rejected.');
        res.status(400).send('Missing body. Query rejected.')
        return false
    }

    if( typeof body !== 'object' ) { // Är body ett object?
        console.log('Body must be an object. Query rejected.');
        res.status(400).send('Body must be an object. Query rejected.')
        return false
    }

    if (Object.keys(body).length < 1) { // Är body-objektet tomt?
        console.log('Body is empty. Query rejected.');
        res.status(400).send('Body is empty. Query rejected.')
        return false
    }

    console.log('Body object seems to be in order.');
    return true
}

module.exports = {
    'bodyValues': bodyValues,
    'bodyKeys': bodyKeys,
    'propertyKeys': propertyKeys,
    'propertyValues': propertyValues,
    'id': id,
    'bodyObject': bodyObject,
}