/* ===========================
        PROFILE PAGE
=========================== */

let currentUser = localStorage.getItem("currentUser");
let userData = null;

function loadProfilePage() {
    currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.href = "auth.html";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    userData = users.find(u => u.username === currentUser) || null;

    if (!userData) {
        localStorage.removeItem("currentUser");
        window.location.href = "auth.html";
        return;
    }

    const avatarEl = document.getElementById("profileAvatar");
    const usernameEl = document.getElementById("profileUsername");
    const bioEl = document.getElementById("profileBio");
    const editBioEl = document.getElementById("editBio");
    const editAvatarEl = document.getElementById("editAvatar");

    if (avatarEl) avatarEl.src = userData.avatar || "img/defaultAvatar.png";
    if (usernameEl) usernameEl.textContent = userData.username;
    if (bioEl) bioEl.textContent = userData.bio || "Pa bio";
    if (editBioEl) editBioEl.value = userData.bio || "";
    if (editAvatarEl) editAvatarEl.value = userData.avatar || "";

    loadUserStats();
    loadUserStories();
    updateFollowButton();

    const banner = document.getElementById("profileBanner");
    if (banner) banner.src = userData.banner || "img/defaultBanner.jpg";
}

/* ===========================
        STATISTIKAT
=========================== */

function loadUserStats() {
    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    const myStories = stories.filter(s => s.author === currentUser);

    document.getElementById("statStories").textContent = myStories.length;

    let totalLikes = myStories.reduce((sum, s) => sum + (s.likes || 0), 0);
    document.getElementById("statLikes").textContent = totalLikes;

    document.getElementById("statFollowers") && (document.getElementById("statFollowers").textContent = (userData.followers || []).length);
    document.getElementById("statFollowing") && (document.getElementById("statFollowing").textContent = (userData.following || []).length);
}

/* ===========================
        HISTORITE
=========================== */

function loadUserStories() {
    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    const container = document.getElementById("userStoryList");

    container.innerHTML = "";

    const myStories = stories.filter(s => s.author === currentUser);

    if (myStories.length === 0) {
        container.innerHTML = "<p>Nuk ke ende histori. Krijo një të re! ✨</p>";
        return;
    }

    myStories.forEach(story => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        const card = document.createElement("div");
        card.className = "card h-100 shadow-sm";

        card.innerHTML = `
            <img src="${story.cover || 'img/defaultCover.png'}" class="card-img-top" alt="${story.title}">
            <div class="card-body">
                <h5 class="card-title">${story.title}</h5>
                <p class="card-text">${story.content.substring(0, 100)}...</p>
            </div>
            <div class="card-footer d-flex justify-content-between align-items-center">
                <span>❤️ ${story.likes || 0}</span>
                <button class="btn btn-primary btn-sm" onclick="openStory(${story.id})">Lexo</button>
            </div>
        `;

        col.appendChild(card);
        container.appendChild(col);
    });
}

function openStory(id) {
    window.location.href = `story.html?id=${id}`;
}

/* ===========================
        EDIT PROFIL
=========================== */

function saveProfile() {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.username === currentUser);
    if (!user) return alert("Gabim: përdoruesi nuk u gjet.");

    const bioInput = document.getElementById("editBio");
    const avatarInput = document.getElementById("editAvatar");

    user.bio = bioInput ? bioInput.value.trim() : (user.bio || "");
    user.avatar = avatarInput ? avatarInput.value : (user.avatar || "");

    localStorage.setItem("users", JSON.stringify(users));
    userData = user;

    if (typeof showNotification === 'function') showNotification("Profili u ruajt me sukses!"); else alert("Profili u ruajt me sukses!");
    loadProfilePage();
}

function toggleFollow() {
    let users = JSON.parse(localStorage.getItem("users"));
    const profileUser = users.find(u => u.username === userData.username);
    const me = users.find(u => u.username === currentUser);

    if (!profileUser || !me) return;

    if ((me.following || []).includes(profileUser.username)) {
        me.following = me.following.filter(u => u !== profileUser.username);
        profileUser.followers = profileUser.followers.filter(u => u !== currentUser);
        showNotification(`Tashmë nuk e ndjek ${profileUser.username}`);
    } else {
        me.following = me.following || [];
        profileUser.followers = profileUser.followers || [];
        me.following.push(profileUser.username);
        profileUser.followers.push(currentUser);
        showNotification(`Tani e ndjek ${profileUser.username}`);
    }

    localStorage.setItem("users", JSON.stringify(users));
    updateFollowButton();
}

function updateFollowButton() {
    const btn = document.getElementById("followBtn");
    if (!btn) return;

    if (currentUser === userData.username) {
        btn.style.display = "none";
        return;
    }

    if ((userData.followers || []).includes(currentUser)) {
        btn.textContent = "✅ Ndiqur";
    } else {
        btn.textContent = "Ndjek";
    }
}

function logout() {
    if (localStorage.getItem("currentUser")) {
        localStorage.removeItem("currentUser");
        alert("U log out me sukses!");
        window.location.href = "auth.html";
    } else {
        alert("Nuk ka përdorues të loguar!");
    }
}

document.addEventListener('DOMContentLoaded', loadProfilePage);

// Safe fallbacks
if (typeof calculateAvgReadTime !== 'function') {
    function calculateAvgReadTime(u) { return "-"; }
}
if (typeof calculateTotalViews !== 'function') {
    function calculateTotalViews(u) { return "-"; }
}
