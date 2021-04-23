const display = document.querySelector('#displayData')
const fetchButton = document.querySelector('#fetchData')


let hamsters = []

function saveHamster(obj)

fetch('http://127.0.0.1:1339/hamster.js')
.then(res => res.json())
.then((out) => {
	hamsters = out;
		
	for (i = 0; i < out.length; i++)
	{
	
		console.log(out[i]["id"])
		
		console.log(out[i].name);

	}
  
})
.catch(err => { throw err });




// Test-bok-knappen
fetchButton.addEventListener('click', async event => {


	try {
		const response = await fetch('/books')
		const json = await response.json()

		let text = JSON.stringify(json)
		display.innerHTML = text

	} catch {
		console.log('Something went wrong in script.js');
	}
})






// Kurt 1 vinner

// Copypaste Kurt 2 vinner

// Slumpa fram nya hamstrar

// Save hamster
function saveHamster(hamster) {
    const formData = new FormData();

    formData.append('id', hamster.id); // ?
    formData.append('name', hamster.name);
    formData.append('age', hamster.age);
	formData.append('favFood', hamster.favFood);
	formData.append('loves', hamster.loves);
	formData.append('imgName', hamster.imgName);
	formData.append('wins', hamster.wins);
	formData.append('defeats', hamster.defeats);
	formData.append('games', hamster.games);

    return fetch('http://127.0.0.1:1339', { // min url ?
        method: 'POST', // put
        body: formData
    }).then(response => response.json())
}

// Kör "saveHamster()"
saveHamster(hamster)
   .then((json) => {
       // handle success
    })
   .catch(error => error);

   // ändra formdata 
   // strinconcact