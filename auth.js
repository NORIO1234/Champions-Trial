/* ==========================
   SWITCH LOGIN / REGISTER
========================== */

function showLogin() {
    // Shfaq Login
    document.getElementById("loginForm").classList.remove("d-none");
    document.getElementById("registerForm").classList.add("d-none");

    // Tabs Active State
    document.getElementById("loginTab").classList.add("active");
    document.getElementById("registerTab").classList.remove("active");
}

function showRegister() {
    // Shfaq Register
    document.getElementById("registerForm").classList.remove("d-none");
    document.getElementById("loginForm").classList.add("d-none");

    // Tabs Active State
    document.getElementById("registerTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");
}

/* ==========================
          REGISTER
========================== */

function register() {
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value;
    const avatarFile = document.getElementById("regAvatar").files[0];

    if (!username || !password) {
        notify("Plotësoni të gjitha fushat!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.username === username)) {
        notify("Ky username është i zënë!");
        return;
    }

    // Lexojmë foton e avatarit
    if (avatarFile) {
        const reader = new FileReader();
        reader.onload = e => saveUser(username, password, e.target.result);
        reader.readAsDataURL(avatarFile);
    } else {
        saveUser(username, password, "default-avatar.png");
    }
}

function saveUser(username, password, avatar) {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    users.push({
        username,
        password,
        avatar,
        bio: "Përdorues i StoryVerse 🌌",
        stories: []
    });

    localStorage.setItem("users", JSON.stringify(users));
    notify("Llogaria u krijua me sukses!");

    showLogin(); // Kthehu në Login
}

/* ==========================
            LOGIN
========================== */

function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        notify("Username ose password i gabuar!");
        return;
    }

    localStorage.setItem("currentUser", username);
    window.location.href = "index.html";
}

/* ==========================
     NOTIFICATION WRAPPER
========================== */
function notify(msg) {
    if (typeof showNotification === "function") {
        showNotification(msg);
    } else {
        alert(msg);
    }
}
