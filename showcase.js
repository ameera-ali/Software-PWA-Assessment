function populateForm() {
    const updateReviewData = JSON.parse(localStorage.getItem("updateReviewData"));

    if (updateReviewData) {
        document.getElementById("showTitle").value = updateReviewData.title;
        document.getElementById("genreSelect").value = updateReviewData.genre;
        document.getElementById("rating").value = updateReviewData.rating;
        document.getElementById("review").value = updateReviewData.review; 
    }
}

function addToWatched() {
    const title = document.getElementById("showTitle").value;
    const genre = document.getElementById("genreSelect").value;
    const ratingInput = document.getElementById("rating").value;
    const review = document.getElementById("review").value;

    // Validate rating input
    const rating = parseFloat(ratingInput);
    if (isNaN(rating) || rating < 0 || rating > 5) {
        alert("The rating must be a number between 0 and 5.");
        return;
    }

    // Retrieve existing reviews or initialize an empty array
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    const updateReviewId = localStorage.getItem("updateReviewId");

    if (updateReviewId) {
        // Update the existing review
        const index = reviews.findIndex((review) => review.id === parseInt(updateReviewId));
        if (index !== -1) {
            reviews[index] = { id: parseInt(updateReviewId), title, genre, rating, review };
        }
        localStorage.removeItem("updateReviewId");
        localStorage.removeItem("updateReviewData");
    } else {
        // Add new review
        const reviewData = { id: Date.now(), title, genre, rating, review };
        reviews.push(reviewData);
    }

    // Save the updated reviews array to localStorage
    localStorage.setItem("reviews", JSON.stringify(reviews));
    console.log("Data saved to localStorage:", reviews); // Debugging
    window.location.href = "watched.html"; // Redirect to watched page
}

// Populate the form with data if editing
window.onload = populateForm;
