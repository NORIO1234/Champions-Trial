/* ===========================
        PROFILE PAGE
=========================== */

// Keep a single source of truth for current user and their data
let currentUser = localStorage.getItem("currentUser");
let userData = null;

function loadProfilePage() {
    currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        // No logged-in user, redirect to login
        window.location.href = "auth.html";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    userData = users.find(u => u.username === currentUser) || null;

    if (!userData) {
        // If user record missing, clear session and redirect to login
        localStorage.removeItem("currentUser");
        window.location.href = "auth.html";
        return;
    }

    // populate profile fields safely
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
    // banner/stats may be optional in markup
    const banner = document.getElementById("profileBanner");
    if (banner) banner.src = userData.banner || "img/defaultBanner.jpg";

    const avgEl = document.getElementById("avgReadTime");
    const viewsEl = document.getElementById("totalViews");
    if (avgEl) avgEl.textContent = (typeof calculateAvgReadTime === 'function') ? calculateAvgReadTime(userData) : "-";
    if (viewsEl) viewsEl.textContent = (typeof calculateTotalViews === 'function') ? calculateTotalViews(userData) : "-";
}

/* ===========================
        STATISTIKAT
=========================== */

function loadUserStats() {
    const stories = JSON.parse(localStorage.getItem("stories")) || [];

    const myStories = stories.filter(s => s.author === currentUser);

    // numri i historive
    document.getElementById("statStories").textContent = myStories.length;

    // total likes
    let totalLikes = myStories.reduce((a, b) => a + b.likes, 0);
    document.getElementById("statLikes").textContent = totalLikes;
}

/* ===========================
        HISTORITE
=========================== */

function loadUserStories() {
    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    const container = document.getElementById("userStoryList");

    const myStories = stories.filter(s => s.author === currentUser);

    if (myStories.length === 0) {
        container.innerHTML = "<p>Nuk ke ende histori. Krijo një të re! ✨</p>";
        return;
    }

    myStories.forEach(story => {
        const div = document.createElement("div");
        div.className = "story-card";

        div.innerHTML = `
            <h3>${story.title}</h3>
            <p>${story.content.substring(0, 100)}...</p>
            <button class="read-btn" onclick="openStory(${story.id})">Lexo</button>
        `;

        container.appendChild(div);
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
    if (!user) {
        alert("Gabim: përdoruesi nuk u gjet.");
        return;
    }

    const bioInput = document.getElementById("editBio");
    const avatarInput = document.getElementById("editAvatar");

    user.bio = bioInput ? bioInput.value.trim() : (user.bio || "");
    user.avatar = avatarInput ? avatarInput.value : (user.avatar || "");

    localStorage.setItem("users", JSON.stringify(users));
    // refresh local userData reference
    userData = user;

    if (typeof showNotification === 'function') showNotification("Profili u ruajt me sukses!"); else alert("Profili u ruajt me sukses!");
    loadProfilePage();

    // update follower/following counts if elements exist
    document.getElementById("statFollowers") && (document.getElementById("statFollowers").textContent = (userData.followers || []).length);
    document.getElementById("statFollowing") && (document.getElementById("statFollowing").textContent = (userData.following || []).length);
}
function toggleFollow() {
    let users = JSON.parse(localStorage.getItem("users"));

    // user-i që po shikohet
    const profileUser = users.find(u => u.username === userData.username);
    const me = users.find(u => u.username === currentUser);

    if (!profileUser || !me) return;

    if ((me.following || []).includes(profileUser.username)) {
        // Unfollow
        me.following = (me.following || []).filter(u => u !== profileUser.username);
        profileUser.followers = (profileUser.followers || []).filter(u => u !== currentUser);
        showNotification(`Tashmë nuk e ndjek ${profileUser.username}`);
    } else {
        // Follow
        me.following = me.following || [];
        profileUser.followers = profileUser.followers || [];
        me.following.push(profileUser.username);
        profileUser.followers.push(currentUser);
        showNotification(`Tani e ndjek ${profileUser.username}`);
    }

    localStorage.setItem("users", JSON.stringify(users));

    // Rifresko butonin
    updateFollowButton();
}

function updateFollowButton() {
    const btn = document.getElementById("followBtn");

    if (currentUser === userData.username) {
        btn.style.display = "none"; // mos shfaq tek profili yt
        return;
    }

    if (userData.followers.includes(currentUser)) {
        btn.textContent = "✅ Ndiqur";
    } else {
        btn.textContent = "Ndjek";
    }
}

// call initial loader
document.addEventListener('DOMContentLoaded', loadProfilePage);

function logout() {
    if (localStorage.getItem("currentUser")) {
        localStorage.removeItem("currentUser"); // clear session
        // small confirmation then redirect
        alert("U log out me sukses!");
        window.location.href = "auth.html"; // redirect to login
    } else {
        alert("Nuk ka përdorues të loguar!");
    }
}

// Provide safe fallbacks for helper functions if not defined elsewhere
if (typeof calculateAvgReadTime !== 'function') {
    function calculateAvgReadTime(u) { return "-"; }
}
if (typeof calculateTotalViews !== 'function') {
    function calculateTotalViews(u) { return "-"; }
}
