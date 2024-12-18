let isEditMode = false; // Track if in edit mode
let editId = null; // Track the ID of the review being edited
let allReviews = []; // Store all reviews for filtering

// Function to load reviews from the backend
function loadShowlogs() {
    fetch('http://localhost:3000/api/Shows')
        .then(response => response.json())
        .then(data => {
            allReviews = data; // Save all reviews for filtering
            displayReviews(allReviews);
        })
        .catch(error => {
            console.error('Error loading reviews:', error);
        });
}

// Function to display reviews in the DOM
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = ''; // Clear existing reviews

    reviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <h3>${review.title}</h3>
            <p><b>Genre:</b> ${review.genre}</p>
            <p><b>Rating:</b> ${review.rating}/5</p>
            <p><b>Review:</b> ${review.review}</p>
            <button onclick="editShowlogs(${review.id})">Edit</button>
            <button onclick="deleteShowlogs(${review.id})">Delete</button>
        `;
        reviewsList.appendChild(reviewCard);
    });
}

// Function to filter reviews by genre
function filterReviews() {
    const selectedGenre = document.getElementById('filterGenre').value;

    if (selectedGenre === 'all') {
        displayReviews(allReviews); // Show all reviews if "All Genres" is selected
    } else {
        const filteredReviews = allReviews.filter(review => review.genre === selectedGenre);
        displayReviews(filteredReviews);
    }
}

// Function to add a new review
function addShowlogs(event) {
    event.preventDefault();

    const title = document.getElementById("showTitle").value;
    const genre = document.getElementById("genreSelect").value;
    const rating = document.getElementById("rating").value;
    const review = document.getElementById("review").value;

    if (title && genre && rating && review) {
        fetch('http://localhost:3000/api/Shows', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, genre, rating, review }),
        })
        .then(() => {
            loadShowlogs(); // Reload reviews
            document.getElementById("reviewForm").reset(); // Clear form
        })
        .catch(error => {
            console.error('Error adding review:', error);
        });
    } else {
        alert('Please fill in all required fields.');
    }
}

// Function to edit a review
function editShowlogs(id) {
    fetch(`http://localhost:3000/api/Shows/${id}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('showTitle').value = data.title;
            document.getElementById('genreSelect').value = data.genre;
            document.getElementById('rating').value = data.rating;
            document.getElementById('review').value = data.review;

            isEditMode = true;
            editId = id;
            document.querySelector('button[type="button"]').textContent = 'Update Review';
        })
        .catch(error => {
            console.error('Error fetching review:', error);
        });
}

// Function to update an existing review
function updateShowlogs(event) {
    event.preventDefault();

    const title = document.getElementById('showTitle').value;
    const genre = document.getElementById('genreSelect').value;
    const rating = document.getElementById('rating').value;
    const review = document.getElementById('review').value;

    if (isEditMode && editId !== null) {
        fetch(`http://localhost:3000/api/Shows/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, genre, rating, review }),
        })
        .then(() => {
            loadShowlogs();
            switchToAddMode();
        })
        .catch(error => {
            console.error('Error updating review:', error);
        });
    }
}

// Function to delete a review
function deleteShowlogs(id) {
    if (confirm('Are you sure you want to delete this review?')) {
        fetch(`http://localhost:3000/api/Shows/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            loadShowlogs();
        })
        .catch(error => {
            console.error('Error deleting review:', error);
        });
    }
}

// Reset to "Add" mode
function switchToAddMode() {
    isEditMode = false;
    editId = null;
    document.querySelector('button[type="button"]').textContent = 'Submit Review';
    document.getElementById('reviewForm').reset();
}

// Event listener for form submission and filter selection
document.addEventListener('DOMContentLoaded', () => {
    loadShowlogs();
    document.getElementById('filterGenre').addEventListener('change', filterReviews);
    document.querySelector('button[type="button"]').onclick = isEditMode ? updateShowlogs : addShowlogs;
});