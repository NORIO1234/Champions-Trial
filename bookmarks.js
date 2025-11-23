let currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "auth.html";
}

/* ============================================
       LOAD BOOKMARKS WITH BOOTSTRAP CARDS
============================================ */
function loadBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const myBookmarks = bookmarks[currentUser] || [];

    const container = document.getElementById("bookmarkList");
    container.innerHTML = "";

    if (myBookmarks.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted">
                <p>Nuk ke favoritet ende. 🌟</p>
            </div>
        `;
        return;
    }

    let stories = JSON.parse(localStorage.getItem("stories")) || [];

    myBookmarks.forEach(id => {
        const story = stories.find(s => s.id == id);
        if (!story) return;

        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        col.innerHTML = `
            <div class="card h-100 shadow-sm story-card">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${story.title}</h5>
                    <p class="card-text flex-grow-1">${story.content.substring(0, 100)}...</p>
                    <button onclick="openStory(${story.id})" class="btn btn-primary btn-sm mt-auto read-btn">
                        Lexo
                    </button>
                </div>
            </div>
        `;

        container.appendChild(col);
    });

    // Optional: fade-in animation
    document.querySelectorAll(".story-card").forEach((el, i) => {
        el.classList.add("fade-in");
        el.style.animationDelay = (i * 0.1) + "s";
    });
}

/* ============================================
                  OPEN STORY
============================================ */
function openStory(id) {
    window.location.href = `story.html?id=${id}`;
}
