// Ngarkimi i faqes së kreut
function loadHomePage() {
    // kontrollo login
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        window.location.href = "auth.html";
        return;
    }

    // Ngarko avatarin e user-it
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.username === currentUser);

    document.getElementById("userAvatar").src = user.avatar;

    loadStories();
    loadTheme();
}


// Shfaq të gjitha historitë
function loadStories() {
    let stories = JSON.parse(localStorage.getItem("stories")) || [];
    let container = document.getElementById("storyList");

    container.innerHTML = "";

    if (stories.length === 0) {
        container.innerHTML = "<p>Nuk ka histori ende. Bëhu i pari që shton një! ✨</p>";
        return;
    }

    stories.reverse().forEach(story => {
        const div = document.createElement("div");
        div.className = "story-card";

        div.innerHTML = `
            <h3>${story.title}</h3>
            <p>${story.content.substring(0, 80)}...</p>
            <div class="story-footer">
                <span>❤️ ${story.likes || 0}</span>
                <button class="read-btn" onclick="openStory(${story.id})">Lexo</button>
            </div>
        `;

        container.appendChild(div);
    });
}

function openStory(id) {
    window.location.href = `story.html?id=${id}`;
}


// KËRKIMI I HISTORIVE
function searchStories() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const stories = document.querySelectorAll(".story-card");

    stories.forEach(story => {
        const text = story.innerText.toLowerCase();
        story.style.display = text.includes(query) ? "block" : "none";
    });
}


// DARK / LIGHT MODE
function toggleMode() {
    const current = localStorage.getItem("theme") || "light";

    if (current === "light") {
        document.body.classList.add("dark");
        localStorage.setItem("theme", "dark");
        document.getElementById("modeBtn").textContent = "🌙";
    } else {
        document.body.classList.remove("dark");
        localStorage.setItem("theme", "light");
        document.getElementById("modeBtn").textContent = "🌞";
    }
}

function loadTheme() {
    const theme = localStorage.getItem("theme") || "light";

    if (theme === "dark") {
        document.body.classList.add("dark");
        document.getElementById("modeBtn").textContent = "🌙";
    } else {
        document.body.classList.remove("dark");
        document.getElementById("modeBtn").textContent = "🌞";
    }
}


// SHKO NË PROFIL
function goToProfile() {
    window.location.href = "profile.html";
}

/* ===============================
     CREATE STORY PAGE
================================ */

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

    // Autosave events
    document.getElementById("storyTitle").addEventListener("input", autoSaveDraft);
    document.getElementById("storyContent").addEventListener("input", autoSaveDraft);
}

function autoSaveDraft() {
    const title = document.getElementById("storyTitle").value;
    const content = document.getElementById("storyContent").value;

    localStorage.setItem("draft_title", title);
    localStorage.setItem("draft_content", content);

    document.getElementById("autosaveText").innerText = "Auto-ruajtur…";
    setTimeout(() => {
        document.getElementById("autosaveText").innerText = "";
    }, 1000);
}


// PUBLIKO HISTORINË
function publishStory() {
    const title = document.getElementById("storyTitle").value.trim();
    const content = document.getElementById("storyContent").value.trim();

    if (!title || !content) {
        alert("Ju lutem plotësoni titullin dhe përmbajtjen.");
        return;
    }

    const currentUser = localStorage.getItem("currentUser");

    let stories = JSON.parse(localStorage.getItem("stories")) || [];

    const newStory = {
        id: Date.now(),
        title,
        content,
        author: currentUser,
        likes: 0,
        comments: []
    };

    stories.push(newStory);
    localStorage.setItem("stories", JSON.stringify(stories));

    // Shto historinë në profilin e user-it
    let users = JSON.parse(localStorage.getItem("users"));
    let user = users.find(u => u.username === currentUser);

    user.stories.push(newStory.id);
    localStorage.setItem("users", JSON.stringify(users));

    // Pastro draftin
    localStorage.removeItem("draft_title");
    localStorage.removeItem("draft_content");

    showNotification("Historia u publikua me sukses!");
    setTimeout(() => window.location.href = "index.html", 700);
}

// Unified toast notification
function showNotification(msg, options = {}) {
    // options: { duration }
    const duration = options.duration || 2500;

    // create container if missing
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

    // animate in
    requestAnimationFrame(() => notif.classList.add('show'));

    // remove after duration
    setTimeout(() => {
        notif.classList.remove('show');
        setTimeout(() => notif.remove(), 300);
    }, duration);
}

function followUser(username) {
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
let coverImage = document.getElementById("storyCover").value;

let newStory = {
    id: Date.now(),
    title: title,
    content: content,
    author: currentUser,
    likes: 0,
    comments: [],
    cover: coverImage
};
document.querySelectorAll(".read-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.getElementById("bgSound").play();
    });
});
// (keep only the unified showNotification above)
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

// kontrollo në ngarkim faqesh
if(localStorage.getItem("darkMode") === "true"){
    document.body.classList.add("dark-mode");
}
category: document.getElementById("storyCategory").value
let storiesPerPage = 5;
let currentPage = 1;

function loadLandingPage() {
    const start = (currentPage-1)*storiesPerPage;
    const end = start+storiesPerPage;
    displayStories(stories.slice(start,end));
}

function loadMore() {
    currentPage++;
    loadLandingPage();
}
function playSound() { document.getElementById("bgSound").play(); }
