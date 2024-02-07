
  
const menuBtn = document.querySelector('.menu-btn');
const navigation = document.querySelector('.navigation');
const btns = document.querySelectorAll('.nav-btn');
const slides = document.querySelectorAll('.video-slide');
const contents = document.querySelectorAll('.content');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle("active");
    navigation.classList.toggle("active");
});

function removeActiveClass(elements) {
    elements.forEach(element => element.classList.remove('active'));
}

function addActiveClass(elements, index) {
    elements[index].classList.add('active');
}

function updateCostDisplay(element, value) {
    element.textContent = '₹' + value;
}

function calculateCost() {
    var adults = parseFloat(document.getElementById('adults').value) || 0;
    var children = parseFloat(document.getElementById('children').value) || 0;

    if (adults < 0 || children < 0) {
        alert('Please enter positive numbers for Adults and Children.');
        return;
    }

    var hotelOption = document.getElementById('hotelOption').value;
    var foodOption = document.getElementById('foodOption').value;

    var costPerAdult = 3000;
    var costPerChild = 1500;

    var costPerAdultDisplay = costPerAdult * adults;
    var costPerChildDisplay = costPerChild * children;

    var hotelCostDisplay = (hotelOption === 'yes') ? 3000 * 2 : 0;
    var foodCostDisplay = (foodOption === 'yes') ? 500 * (adults + children) : 0;

    updateCostDisplay(document.getElementById('costPerAdult'), costPerAdultDisplay);
    updateCostDisplay(document.getElementById('costPerChild'), costPerChildDisplay);
    updateCostDisplay(document.getElementById('hotelCost'), hotelCostDisplay);
    updateCostDisplay(document.getElementById('foodCost'), foodCostDisplay);

    var totalCost = costPerAdultDisplay + costPerChildDisplay + hotelCostDisplay + foodCostDisplay;
    updateCostDisplay(document.getElementById('totalCost'), totalCost);
}

document.getElementById('calculateCostBtn').addEventListener('click', calculateCost);

document.addEventListener("DOMContentLoaded", function () {
    let currentVideoIndex = 0;
    const videos = document.querySelectorAll(".video-slide");
    const contents = document.querySelectorAll(".content");
    const navBtns = document.querySelectorAll(".nav-btn");
    let interval;

    function playNextVideo() {
        removeActiveClass(videos);
        removeActiveClass(contents);
        removeActiveClass(navBtns);

        currentVideoIndex = (currentVideoIndex + 1) % videos.length;

        addActiveClass(videos, currentVideoIndex);
        addActiveClass(contents, currentVideoIndex);
        addActiveClass(navBtns, currentVideoIndex);
    }

    function startInterval() {
        interval = setInterval(playNextVideo, 4500);
    }

    function stopInterval() {
        clearInterval(interval);
    }

    navBtns.forEach((btn, index) => {
        btn.addEventListener("click", function () {
            stopInterval();
            currentVideoIndex = index;
            playNextVideo();
            startInterval();
        });
    });

    startInterval();
});

document.addEventListener('DOMContentLoaded', function () {
    const apiKey = '65b7bfca7c4e41d3c1b3493c';

    async function searchFlights(origin, destination, departureDate) {
        const apiUrl = `https://api.flightapi.io/onewaytrip/${apiKey}/${origin}/${destination}/${departureDate}/1/0/0/Economy/USD`;

        try {
            const response = await axios.get(apiUrl, {
                params: {
                    origin: origin,
                    destination: destination,
                    departureDate: departureDate
                },
                headers: {
                    'api-key': apiKey,
                    'api-host': apiUrl,
                }
            });

            const data = response.data;

            if (Array.isArray(data.itineraries)) {
                displayFlights(data.itineraries);
            } else {
                throw new Error('Invalid API response. Expected an array of itineraries.');
            }
        } catch (error) {
            console.error('An error occurred during the request:', error.message);
            displayError('Failed to fetch flights. Please try again.');
        }
    }

    function displayFlights(flights) {
        const resultsContainer = document.getElementById('flight-search-results');
        resultsContainer.innerHTML = '';

        if (flights.length === 0) {
            resultsContainer.innerHTML = '<p>No flights found</p>';
            return;
        }

        const ul = document.createElement('ul');
        flights.forEach(flight => {
            const li = document.createElement('li');
            li.textContent = `Flight: ${flight.flightNumber}, Price: ${flight.price}`;
            ul.appendChild(li);
        });

        resultsContainer.appendChild(ul);
    }

    function displayError(message) {
        const resultsContainer = document.getElementById('flight-search-results');
        resultsContainer.innerHTML = `<p>${message}</p>`;
    }

    document.getElementById('search-button').addEventListener('click', async function () {
        const origin = document.getElementById('origin').value;
        const destination = document.getElementById('destination').value;
        const departureDate = document.getElementById('departure-date').value;

        await searchFlights(origin, destination, departureDate);
    });
});