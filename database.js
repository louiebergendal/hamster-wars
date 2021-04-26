const admin = require("firebase-admin");

let serviceAccount; 
if ( process.env.PRIVATE_KEY ) {
	// På Heroku
	serviceAccount = JSON.parse(process.env.PRIVATE_KEY)
} else {
	// Lokalt
	serviceAccount = require("./private-key.json");
}


admin.initializeApp({
	credential: admin.credential.cert(serviceAccount)
});

function getDatabase() {
	return admin.firestore()
}

module.exports = getDatabase