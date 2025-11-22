function showLogin() {
    document.getElementById("loginForm").classList.add("visible");
    document.getElementById("registerForm").classList.remove("visible");

    document.getElementById("loginTab").classList.add("active");
    document.getElementById("registerTab").classList.remove("active");
}

function showRegister() {
    document.getElementById("registerForm").classList.add("visible");
    document.getElementById("loginForm").classList.remove("visible");

    document.getElementById("registerTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");
}


// REGISTER FUNCTION
function register() {
    const username = document.getElementById("regUsername").value.trim();
    const password = document.getElementById("regPassword").value;
    const avatarFile = document.getElementById("regAvatar").files[0];

    if (!username || !password) {
        if (typeof showNotification === 'function') showNotification("Plotësoni të gjitha fushat!"); else alert("Plotësoni të gjitha fushat!");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.username === username)) {
        if (typeof showNotification === 'function') showNotification("Ky username është i zënë!"); else alert("Ky username është i zënë!");
        return;
    }

    // Lexojmë foton e avatarit
    if (avatarFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveUser(username, password, e.target.result);
        };
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

    if (typeof showNotification === 'function') showNotification("Llogaria u krijua me sukses!"); else alert("Llogaria u krijua me sukses!");
    showLogin();
}


// LOGIN FUNCTION
function login() {
    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        if (typeof showNotification === 'function') showNotification("Username ose password i gabuar!"); else alert("Username ose password i gabuar!");
        return;
    }

    localStorage.setItem("currentUser", username);

    window.location.href = "index.html";
}
