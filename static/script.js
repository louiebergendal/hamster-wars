const display = document.querySelector('#displayData')
const fetchButton = document.querySelector('#fetchData')

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