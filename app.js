var baseURL = 'https://api.nasa.gov/planetary/apod?api_key=';
var key = 'lHbDxOJzKgudrE8byarsVEaAvBzmk6VxM8Fg2ELv';
var selectedDate = '';

function getPicture() {
	fetch(baseURL + key, { method: 'GET' })
		.then(function (response) {
			return response.json();
		})
		.then(function (parsedResponse) {
			hideLoader();
			displayPicture(parsedResponse);
		})
		.catch(function (error) {
			console.log(error);
		});
}

function displayPicture(imageInformation) {
	var imageSection = document.getElementById('image-section');

	var imageTitle = document.createElement('h3');
	imageTitle.setAttribute('id', 'image-title');
	imageTitle.innerHTML = `Today's Picture: ${imageInformation.title}`;
	imageSection.appendChild(imageTitle);

	var image = document.createElement('img');
	image.classList.add('image-of-the-day');
	image.src = imageInformation.hdurl;
	imageSection.appendChild(image);
}

function changeDate(event) {
	selectedDate = event.target.value;
}

function getSelectedPicture() {
	hideImageSection();
	showLoader();

	fetch(baseURL + key + `&date=${selectedDate}`, { method: 'GET' })
		.then(function (response) {
			return response.json();
		})
		.then(function (parsedResponse) {
			hideLoader();
			replacePicture(parsedResponse);
		})
		.catch(function (error) {
			console.log(error);
		});
}

function appendErrorMessage(message) {
	var showErrorMessage = document.getElementById('error-message');

	if (showErrorMessage.hasChildNodes()) {
		showErrorMessage.innerHTML = '';
		showErrorMessage.appendChild(message);
	} else {
		showErrorMessage.appendChild(message);
	}
}

function hideImageSection() {
	var imageSection = document.getElementById('image-section');
	imageSection.style.display = 'none';
}

function showImageSection() {
	var imageSection = document.getElementById('image-section');
	imageSection.style.display = 'block';
}

function hideLoader() {
	var loader = document.getElementById('loader');
	loader.style.display = 'none';
}

function showLoader() {
	var loader = document.getElementById('loader');
	loader.style.display = 'block';
}

function displayCodeError(pictureDetails) {
	hideImageSection();

	var errorMessage = document.createElement('p');
	errorMessage.classList.add('errors');
	errorMessage.innerHTML = pictureDetails.msg;

	appendErrorMessage(errorMessage);
}

function displayNoPictureError() {
	hideImageSection();

	var noPictureError = document.createElement('p');
	noPictureError.innerHTML = `<p>Error: Selected day doesn't have a picture! Please try another day!</p>`;
	noPictureError.classList.add('errors');

	appendErrorMessage(noPictureError);
}

function replacePicture(newPicture) {
	if (newPicture.code === 400) {
		displayCodeError(newPicture);
	} else if (newPicture.media_type !== 'image') {
		displayNoPictureError();
	} else {
		showImageSection();

		var showErrorMessage = document.getElementById('error-message');
		if (showErrorMessage.hasChildNodes()) {
			showErrorMessage.innerHTML = '';
		}

		var oldPicture = document.getElementsByClassName('image-of-the-day')[0];
		oldPicture.setAttribute('src', newPicture.url);

		var oldTitle = document.getElementById('image-title');
		oldTitle.innerHTML = `Today's Picture: ${newPicture.title}`;
	}
}

window.addEventListener('load', function () {
	getPicture();

	var calendar = document.getElementById('calendar');
	calendar.onchange = changeDate;

	var button = document.getElementById('image-button');
	button.onclick = getSelectedPicture;
});
