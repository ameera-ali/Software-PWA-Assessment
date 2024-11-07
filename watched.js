function loadReviews() {
    const reviewsContainer = document.getElementById("reviewsContainer");
    const reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    reviewsContainer.innerHTML = "";
    reviews.forEach((review) => {
        const reviewCard = document.createElement("div");
        reviewCard.className = "review-card";
        reviewCard.innerHTML = `
            <h3>${review.title}</h3>
            <p><b>Genres:</b> ${review.genres.join(", ")}</p>
            <p><b>Rating:</b> ${review.rating}/5</p>
            <p><b>Review:</b> ${review.review}</p>
            <button onclick="deleteReview(${review.id})">Delete</button>
            <button onclick="updateReview(${review.id})">Update</button>
        `;
        reviewsContainer.appendChild(reviewCard);
    });
}

function deleteReview(id) {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews = reviews.filter((review) => review.id !== id);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    loadReviews();
}

function updateReview(id) {
    const reviews = JSON.parse(localStorage.getItem("reviews"));
    const review = reviews.find((review) => review.id === id);
    if (review) {
        window.location.href = "showcase.html";
        localStorage.setItem("editReviewId", id);
    }
}

window.onload = loadReviews;
