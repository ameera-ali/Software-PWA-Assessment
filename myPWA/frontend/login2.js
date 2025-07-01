const wrapper = document.querySelector('.wrapper');
const signUpLink = document.querySelector('.signUp-link');
const signInLink = document.querySelector('.signIn-link');

signUpLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.add('animate-signIn');
    wrapper.classList.remove('animate-signUp');
});

signInLink.addEventListener('click', (e) => {
    e.preventDefault();
    wrapper.classList.add('animate-signUp');
    wrapper.classList.remove('animate-signIn');
});

// Prevent input of spaces and disallowed characters in real-time
const inputSelectors = ["#signup-username", "#signup-password", "#login-username", "#login-password"];
const sqlPatterns = [/('|--|;|=|\/\*|\*\/|--|#|%|<script>|<\/script>)/gi];

function scrubInput(input) {
    let value = input.value;
    // Strip spaces and trim
    value = value.replace(/\s+/g, '');
    // Replace SQLi/malicious patterns
    sqlPatterns.forEach(pattern => {
        value = value.replace(pattern, '[disallowed input]');
    });
    input.value = value;
}

inputSelectors.forEach(selector => {
    const input = document.querySelector(selector);
    input.addEventListener('input', () => scrubInput(input));
});

// Password visibility toggle and validation
const passwordInput = document.querySelector(".input-group-pass input");
const eyeIcon = document.querySelector(".input-group-pass i");
const requirementList = document.querySelectorAll(".requirement-list li");

const requirements = [
    { regex: /.{8,}/, index: 0 },
    { regex: /[0-9]/, index: 1 },
    { regex: /[a-z]/, index: 2 },
    { regex: /[^A-Za-z0-9]/, index: 3 },
    { regex: /[A-Z]/, index: 4 },
];

passwordInput.addEventListener("keyup", (e) => {
    requirements.forEach(item => {
        const isValid = item.regex.test(e.target.value);
        const requirementItem = requirementList[item.index];

        if (isValid) {
            requirementItem.firstElementChild.className = "fa-solid fa-check";
            requirementItem.classList.add("valid");
        } else {
            requirementItem.firstElementChild.className = "fa-solid fa-circle";
            requirementItem.classList.remove("valid");
        }
    });
});

eyeIcon.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    eyeIcon.className = `fa-solid fa-eye${passwordInput.type === "password" ? "" : "-slash"}`;
});

// Captcha setup
let captchaValue = "";

(function () {
    const fonts = ["cursive", "sans-serif", "serif", "monospace"];

    function generateCaptcha() {
        let value = btoa(Math.random() * 1000000000).substr(0, 5 + Math.random() * 5);
        captchaValue = value;
    }

    function setCaptcha() {
        let html = captchaValue.split("").map((char) => {
            const rotate = -20 + Math.trunc(Math.random() * 30);
            const fontIndex = Math.trunc(Math.random() * fonts.length);
            return `<span style="transform:rotate(${rotate}deg); font-family:${fonts[fontIndex]};">${char}</span>`;
        }).join("");
        document.querySelector(".form-wrapper.sign-up .captcha .preview").innerHTML = html;
    }

    function initCaptcha() {
        document.querySelector(".form-wrapper.sign-up .captcha-refresh").addEventListener("click", function () {
            generateCaptcha();
            setCaptcha();
        });

        generateCaptcha();
        setCaptcha();
    }

    initCaptcha();
})();

// Extra sanitisation before submission
function sanitizeInput(input) {
    return input.replace(/\s+/g, '').replace(/['"\\;%=<>]/g, '').trim();
}

// Sign Up Logic with sanitisation & validation
document.querySelector("#btn").addEventListener("click", async function () {
    let usernameRaw = document.querySelector("#signup-username").value;
    let passwordRaw = document.querySelector("#signup-password").value;
    let inputCaptchaValue = document.querySelector(".form-wrapper.sign-up #captcha-input").value;

    const username = sanitizeInput(usernameRaw);
    const password = sanitizeInput(passwordRaw);

    if (inputCaptchaValue !== captchaValue) {
        swal("Error", "Invalid Captcha", "error");
        return;
    }

    if (!username || !password) {
        swal("Error", "Username and password required", "error");
        return;
    }

    // Password validation check before sending to backend
    const failedRequirements = requirements.filter(req => !req.regex.test(passwordRaw));
    if (failedRequirements.length > 0) {
        swal("Error", "Password does not meet all requirements", "error");
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            swal("Success", "Account created!", "success");
        } else {
            const msg = await res.text();
            swal("Error", msg, "error");
        }
    } catch (error) {
        console.error(error);
        swal("Error", "Network error: " + error.message, "error");
    }
});

// Login Attempt Limiting + Fetch API login with sanitisation
let attemptsLeft = 3;
let lockout = false;
let lockoutEndTime = 0;

document.querySelector("#login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const now = Date.now();

    if (lockout && now < lockoutEndTime) {
        const secondsLeft = Math.ceil((lockoutEndTime - now) / 1000);
        swal("Locked Out", `Too many attempts. Please wait ${secondsLeft} seconds.`, "warning");
        return;
    }

    if (lockout && now >= lockoutEndTime) {
        attemptsLeft = 3;
        lockout = false;
    }

    let loginUsernameRaw = document.querySelector("#login-username").value;
    let loginPasswordRaw = document.querySelector("#login-password").value;

    const loginUsername = sanitizeInput(loginUsernameRaw);
    const loginPassword = sanitizeInput(loginPasswordRaw);

    try {
        const res = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: loginUsername, password: loginPassword })
        });

        if (res.ok) {
            attemptsLeft = 3;
            window.location.href = "browse.html";
        } else {
            attemptsLeft--;
            if (attemptsLeft > 0) {
                const msg = await res.text();
                swal("Error", `${msg} ${attemptsLeft} attempt(s) remaining.`, "error");
            } else {
                lockout = true;
                lockoutEndTime = Date.now() + 60000;
                swal("Locked Out", "Too many failed attempts. Please wait 1 minute before trying again.", "error");
            }
        }
    } catch (error) {
        console.error(error);
        swal("Error", "Network error: " + error.message, "error");
    }
});
