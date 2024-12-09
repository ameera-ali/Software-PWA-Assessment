function loadReviews() {
    const reviewsContainer = document.getElementById("reviewsContainer");
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    // Clear the container before loading
    reviewsContainer.innerHTML = "";

    // Check if there are reviews to display
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = "<p>No reviews added yet.</p>";
        return;
    }

    // Display each review
    reviews.forEach((review) => {
        console.log("Review loaded:", review); // Debugging
        const reviewCard = document.createElement("div");
        reviewCard.className = "review-card";
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

// Delete review function
function deleteReview(id) {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews = reviews.filter((review) => review.id !== id);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    loadReviews(); // Reload the reviews after deletion
}

// Update review function
function updateReview(id) {
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const review = reviews.find((review) => review.id === id);

    if (review) {
        localStorage.setItem("updateReviewId", id);
        localStorage.setItem("updateReviewData", JSON.stringify(review));
        window.location.href = "showcase.html";
    }
}

// On page load, call loadReviews
window.onload = loadReviews;