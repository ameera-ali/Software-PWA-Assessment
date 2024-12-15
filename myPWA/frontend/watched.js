async function loadReviews() {
    try {
        const response = await fetch('http://localhost:3000/api/shows'); // Correct API URL
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reviews = await response.json();  // Parse the JSON response
        console.log('Fetched reviews:', reviews);  // Log the reviews to the console

        displayReviews(reviews);  // Display the reviews on the page
    } catch (error) {
        console.error('Error loading reviews:', error.message);  // Log the error
        alert('Error loading reviews. Please try again later.');
    }
}

// Function to display reviews in the DOM
function displayReviews(reviews) {
    const reviewsContainer = document.getElementById('reviewsContainer');
    reviewsContainer.innerHTML = '';  // Clear existing content

    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p>No reviews added yet.</p>';
        return;
    }

    // Loop through the reviews and create HTML elements for each
    reviews.forEach((review) => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'review-card';
        reviewCard.innerHTML = `
            <h3>${review.title}</h3>
            <p><b>Genre:</b> ${review.genre}</p>
            <p><b>Rating:</b> ${review.rating}/5</p>
            <p><b>Review:</b> ${review.review}</p>
            <button onclick="deleteReview(${review.id})">Delete</button>
            <button onclick="updateReview(${review.id})">Update</button>
        `;
        reviewsContainer.appendChild(reviewCard);
    });
}

// Function to delete a review by ID
async function deleteReview(id) {
    try {
        const response = await fetch(`http://localhost:3000/api/shows/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete review');
        }

        console.log(`Review with ID ${id} deleted`);
        loadReviews();  // Reload reviews after deletion
    } catch (error) {
        console.error('Error deleting review:', error.message);
        alert('Failed to delete review. Please try again.');
    }
}

// Function to update a review
async function updateReview(id) {
    try {
        const reviewsResponse = await fetch('http://localhost:3000/api/shows');
        const reviews = await reviewsResponse.json();

        const reviewToUpdate = reviews.find((review) => review.id === id);

        if (reviewToUpdate) {
            const updatedReview = promptForReviewDetails(reviewToUpdate);
            if (updatedReview) {
                await fetch(`http://localhost:3000/api/shows/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedReview),
                });

                loadReviews();  // Reload reviews after update
            }
        }
    } catch (error) {
        console.error('Error updating review:', error.message);
        alert('Failed to update review. Please try again.');
    }
}

// Prompt the user for updated review details
function promptForReviewDetails(existingReview) {
    const title = prompt('Enter new title:', existingReview.title);
    const genre = prompt('Enter new genre:', existingReview.genre);
    const rating = prompt('Enter new rating (1-5):', existingReview.rating);
    const review = prompt('Enter new review:', existingReview.review);

    if (title && genre && rating && review) {
        return { title, genre, rating, review };
    }
    return null;
}

// Load reviews when the page loads
window.onload = loadReviews;
