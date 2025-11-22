let currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
    window.location.href = "auth.html";
}

function loadBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    const myBookmarks = bookmarks[currentUser] || [];

    const container = document.getElementById("bookmarkList");
    container.innerHTML = "";

    if (myBookmarks.length === 0) {
        container.innerHTML = "<p>Nuk ke favoritet ende. 🌟</p>";
        return;
    }

    let stories = JSON.parse(localStorage.getItem("stories")) || [];

    myBookmarks.forEach(id => {
        let story = stories.find(s => s.id == id);
        if (!story) return;

        const div = document.createElement("div");
        div.className = "story-card";
        div.innerHTML = `
            <h3>${story.title}</h3>
            <p>${story.content.substring(0, 80)}...</p>
            <button class="read-btn" onclick="openStory(${story.id})">Lexo</button>
        `;
        container.appendChild(div);
    });
}

function openStory(id) {
    window.location.href = `story.html?id=${id}`;
}
