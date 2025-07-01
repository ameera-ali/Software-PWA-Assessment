let isEditMode = false; // Track if in edit mode
let editId = null; // Track the ID of the review being edited
let allReviews = []; // Store all reviews for filtering

// ✅ Sanitize input to remove SQL injections and HTML tags
function sanitizeInput(input) {
    const patterns = [
        /('|--|;|\/\*|\*\/|=|<script.*?>.*?<\/script>|<[^>]*>| OR | AND )/gi,
        /\s{2,}/g
    ];
    let sanitized = input.trim();
    for (let pattern of patterns) {
        sanitized = sanitized.replace(pattern, '[disallowed input]');
    }
    return sanitized;
}

// ✅ Load all reviews from server
function loadShowlogs() {
    fetch('http://localhost:3000/api/Shows')
        .then(response => response.json())
        .then(data => {
            allReviews = data;
            displayReviews(allReviews);
        })
        .catch(error => {
            console.error('Error loading reviews:', error);
        });
}

// ✅ Render reviews to the DOM
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = '';

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

// ✅ Filter reviews by genre
function filterReviews() {
    const selectedGenre = document.getElementById('filterGenre').value;
    if (selectedGenre === 'all') {
        displayReviews(allReviews);
    } else {
        const filtered = allReviews.filter(review => review.genre === selectedGenre);
        displayReviews(filtered);
    }
}

// ✅ Add a new review
function addShowlogs(event) {
    event.preventDefault();

    let title = document.getElementById("showTitle").value;
    const genre = document.getElementById("genreSelect").value;
    const rating = parseFloat(document.getElementById("rating").value);
    let review = document.getElementById("review").value;

    // ✅ Sanitise inputs
    title = sanitizeInput(title);
    review = sanitizeInput(review);

    if (isNaN(rating) || rating < 0 || rating > 5) {
        alert("Please enter a valid rating between 0 and 5.");
        return;
    }

    if (title && genre && review) {
        fetch('http://localhost:3000/api/Shows', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, genre, rating, review }),
        })
        .then(() => {
            loadShowlogs();
            document.getElementById("reviewForm").reset();
        })
        .catch(error => {
            console.error('Error adding review:', error);
        });
    } else {
        alert('Please fill in all required fields.');
    }
}

// ✅ Edit a review (prefill form)
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

// ✅ Update an existing review
function updateShowlogs(event) {
    event.preventDefault();

    let title = document.getElementById('showTitle').value;
    const genre = document.getElementById('genreSelect').value;
    const rating = document.getElementById('rating').value;
    let review = document.getElementById('review').value;

    // ✅ Sanitise inputs
    title = sanitizeInput(title);
    review = sanitizeInput(review);

    if (isEditMode && editId !== null) {
        fetch(`http://localhost:3000/api/Shows/${editId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
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

// ✅ Delete a review
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

// ✅ Reset to default Add Mode
function switchToAddMode() {
    isEditMode = false;
    editId = null;
    document.querySelector('button[type="button"]').textContent = 'Submit Review';
    document.getElementById('reviewForm').reset();
}

// ✅ Initial event bindings
document.addEventListener('DOMContentLoaded', () => {
    loadShowlogs();
    document.getElementById('filterGenre').addEventListener('change', filterReviews);

    document.querySelector('button[type="button"]').addEventListener('click', function (event) {
        if (isEditMode) {
            updateShowlogs(event);
        } else {
            addShowlogs(event);
        }
    });
});
