document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("submit-btn").addEventListener("click", (event) => {
        event.preventDefault();  // Prevent default form submission
        console.log("Button clicked - Preventing default form submission");

        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        const user_name = "ameera";
        const pass_word = "softwareisthebest";

        // Check credentials
        if (username === user_name && password === pass_word) {
            console.log("Correct credentials - redirecting to browse.html");
            window.location.replace("browse.html");  // Use replace for redirect
        } else {
            console.log("Incorrect credentials - showing error message");
            document.getElementById("error-message").style.display = "block";
        }
    });
});


