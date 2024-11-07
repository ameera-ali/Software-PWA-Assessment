function addToWatched() {
    const title = document.getElementById("showTitle").value;
    const genres = Array.from(document.getElementById("genreSelect").selectedOptions).map(option => option.value);
    const rating = document.getElementById("rating").value;
    const review = document.getElementById("review").value;

    const reviewData = { id: Date.now(), title, genres, rating, review};
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.push(reviewData);
    localStorage.setItem("reviews", JSON.stringify(reviews));

    window.location.href = "watched.html";
}