function openPopup(card) {
    // Retrieve data attributes and image source from the clicked show card
    const title = card.getAttribute('data-title');
    const description = card.getAttribute('data-description');
    const genre = card.getAttribute('data-genre');
    const imageSrc = card.querySelector('img').src;

    // Log data to the console for debugging
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Genre:", genre);
    console.log("Image Source:", imageSrc);

    // Set popup content
    document.getElementById("popup-image").src = imageSrc;
    document.getElementById("popup-title").innerText = title;
    document.getElementById("popup-genre").innerText = "Genre: " + genre;
    document.getElementById("popup-description").innerText = description;

    // Display the popup
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    // Hide the popup
    document.getElementById("popup").style.display = "none";
}

function redirectToShowcase() {
    window.location.href = "showcase.html";
}
