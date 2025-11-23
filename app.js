/* ============================================
   HOMEPAGE LOAD
============================================ */
function loadHomePage() {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.href = "auth.html";
        return;
    }

    // Load user avatar
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.username === currentUser);

    if (user && user.avatar) {
        document.getElementById("userAvatar").src = user.avatar;
    }

    loadStories();
    loadTheme();
}

/* ============================================
   LOAD STORIES WITH BOOTSTRAP CARDS
============================================ */
function loadStories() {
    let stories = JSON.parse(localStorage.getItem("stories")) || [];
    let container = document.getElementById("storyList");

    container.innerHTML = "";

    if (stories.length === 0) {
        container.innerHTML = `
            <p class="text-muted">Nuk ka histori ende. Bëhu i pari që shton një! ✨</p>
        `;
        return;
    }

    stories.reverse();

    container.classList.add("row", "g-4");

    container.innerHTML = stories.map((story, idx) => createStoryCard(story, idx)).join("");

    // Add fade-in animation
    document.querySelectorAll(".story-card").forEach((el, i) => {
        el.classList.add("fade-in");
        el.style.animationDelay = (i * 0.1) + "s";
    });
}

function createStoryCard(story) {
    return `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card story-card h-100 shadow-sm">
                <div class="card-body d-flex flex-column">

                    <h5 class="card-title fw-bold">${story.title}</h5>

                    <p class="card-text flex-grow-1">
                        ${story.content.substring(0, 120)}...
                    </p>

                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <button onclick="openStory(${story.id})" class="btn btn-primary btn-sm read-btn">
                            Lexo
                        </button>
                        <span class="text-danger">❤️ ${story.likes || 0}</span>
                    </div>

                </div>
            </div>
        </div>
    `;
}

function openStory(id) {
    window.location.href = `story.html?id=${id}`;
}

/* ============================================
   STORY SEARCH
============================================ */
function searchStories() {
    const input = document.getElementById("searchInput") || document.getElementById("searchInputMobile");
    const query = input.value.toLowerCase();

    const stories = document.querySelectorAll(".story-card");

    stories.forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(query) ? "block" : "none";
    });
}

/* ============================================
   DARK / LIGHT MODE
============================================ */
function toggleMode() {
    const isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    document.getElementById("modeBtn").textContent = isDark ? "🌙" : "🌞";
}

function loadTheme() {
    const theme = localStorage.getItem("theme");

    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("modeBtn").textContent = "🌙";
    } else {
        document.body.classList.remove("dark-mode");
        document.getElementById("modeBtn").textContent = "🌞";
    }
}

/* ============================================
   REDIRECT TO PROFILE
============================================ */
function goToProfile() {
    window.location.href = "profile.html";
}

/* ============================================
   CREATE STORY PAGE SETUP
============================================ */
function loadCreatePage() {
    const currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.href = "auth.html";
        return;
    }

    // Autosave load
    const draftTitle = localStorage.getItem("draft_title");
    const draftContent = localStorage.getItem("draft_content");

    if (draftTitle) document.getElementById("storyTitle").value = draftTitle;
    if (draftContent) document.getElementById("storyContent").value = draftContent;

    document.getElementById("storyTitle").addEventListener("input", autoSaveDraft);
    document.getElementById("storyContent").addEventListener("input", autoSaveDraft);
}

function autoSaveDraft() {
    localStorage.setItem("draft_title", document.getElementById("storyTitle").value);
    localStorage.setItem("draft_content", document.getElementById("storyContent").value);

    const autosave = document.getElementById("autosaveText");
    autosave.innerText = "Auto-ruajtur…";
    setTimeout(() => autosave.innerText = "", 1000);
}

/* ============================================
   PUBLISH STORY
============================================ */
function publishStory() {
    const title = document.getElementById("storyTitle").value.trim();
    const content = document.getElementById("storyContent").value.trim();
    const coverImage = document.getElementById("storyCover")?.value || "";
    const currentUser = localStorage.getItem("currentUser");

    if (!title || !content) {
        alert("Ju lutem plotësoni titullin dhe përmbajtjen.");
        return;
    }

    let stories = JSON.parse(localStorage.getItem("stories")) || [];

    const newStory = {
        id: Date.now(),
        title,
        content,
        author: currentUser,
        likes: 0,
        comments: [],
        cover: coverImage
    };

    stories.push(newStory);
    localStorage.setItem("stories", JSON.stringify(stories));

    // Add to user's story list
    let users = JSON.parse(localStorage.getItem("users"));
    let user = users.find(u => u.username === currentUser);

    user.stories.push(newStory.id);
    localStorage.setItem("users", JSON.stringify(users));

    // Clear draft
    localStorage.removeItem("draft_title");
    localStorage.removeItem("draft_content");

    showNotification("Historia u publikua me sukses!");
    setTimeout(() => window.location.href = "index.html", 700);
}

/* ============================================
   NOTIFICATIONS (Toast)
============================================ */
function showNotification(msg, options = {}) {
    const duration = options.duration || 2500;

    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const notif = document.createElement('div');
    notif.className = 'notification toast';
    notif.textContent = msg;
    container.appendChild(notif);

    requestAnimationFrame(() => notif.classList.add('show'));

    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, duration);
}

/* ============================================
   FOLLOW USERS
============================================ */
function followUser(username) {
    const currentUser = localStorage.getItem("currentUser");
    if (username === currentUser) return;

    let users = JSON.parse(localStorage.getItem("users"));
    let me = users.find(u => u.username === currentUser);
    let other = users.find(u => u.username === username);

    if (!me.following.includes(username)) {
        me.following.push(username);
        other.followers.push(currentUser);
        localStorage.setItem("users", JSON.stringify(users));
        showNotification(`Tani ndiqni ${username}!`);
    } else {
        showNotification(`Tashmë e ndiqni ${username}`);
    }
}

/* ============================================
   SOUND ON BUTTON CLICK
============================================ */
document.addEventListener("click", e => {
    if (e.target.classList.contains("read-btn")) {
        const sound = document.getElementById("bgSound");
        if (sound) sound.play();
    }
});
// Dark/Light Mode JS
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('modeBtn');
    if (!btn) return;

    // Merr gjendjen nga localStorage
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) document.documentElement.setAttribute('data-theme', 'dark');
    btn.textContent = darkMode ? '🌙' : '🌞';

    btn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            btn.textContent = '🌞';
            localStorage.setItem('darkMode', false);
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            btn.textContent = '🌙';
            localStorage.setItem('darkMode', true);
        }
    });
});

function showLogin() {
    document.getElementById("loginForm").classList.remove("d-none");
    document.getElementById("registerForm").classList.add("d-none");
    document.getElementById("login-tab").classList.add("active");
    document.getElementById("register-tab").classList.remove("active");
}

function showRegister() {
    document.getElementById("registerForm").classList.remove("d-none");
    document.getElementById("loginForm").classList.add("d-none");
    document.getElementById("register-tab").classList.add("active");
    document.getElementById("login-tab").classList.remove("active");
}
