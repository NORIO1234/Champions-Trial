/* ===============================
        STORY PAGE
=============================== */

let storyId;
let storyData;
let currentUser;

/* ===========================
        INIT PAGE
=========================== */
function loadStoryPage() {
    currentUser = localStorage.getItem("currentUser");

    if (!currentUser) {
        window.location.href = "auth.html";
        return;
    }

    const params = new URLSearchParams(window.location.search);
    storyId = params.get("id");

    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    storyData = stories.find(s => String(s.id) === String(storyId));

    if (!storyData) {
        alert("Historia nuk u gjet!");
        return;
    }

    populateStoryFields();
    storyData.comments = storyData.comments || [];
    loadComments();
}

/* ===========================
        POPULATE STORY
=========================== */
function populateStoryFields() {
    const titleEl = document.getElementById("storyTitle");
    const contentEl = document.getElementById("storyContent");
    const likeEl = document.getElementById("likeCount");
    const authorAvatar = document.getElementById("authorAvatar");
    const authorName = document.getElementById("authorName");

    if (titleEl) titleEl.textContent = storyData.title || "";
    if (contentEl) contentEl.textContent = storyData.content || "";
    if (likeEl) likeEl.textContent = storyData.likes || 0;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const author = users.find(u => u.username === storyData.author) || {};
    if (authorAvatar && author.avatar) authorAvatar.src = author.avatar;
    if (authorName) authorName.textContent = author.username || storyData.author;
}

/* ===========================
        SAVE STORIES
=========================== */
function saveStories() {
    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    const idx = stories.findIndex(s => String(s.id) === String(storyId));
    if (idx !== -1) {
        stories[idx] = storyData;
        localStorage.setItem("stories", JSON.stringify(stories));
    }
}

/* ===========================
        LIKE STORY
=========================== */
function likeStory() {
    const liked = JSON.parse(localStorage.getItem("likedStories")) || {};
    if (!liked[currentUser]) liked[currentUser] = [];

    if (liked[currentUser].includes(String(storyId))) {
        showNotificationSafe("E ke pëlqyer këtë histori më parë!");
        return;
    }

    liked[currentUser].push(String(storyId));
    localStorage.setItem("likedStories", JSON.stringify(liked));

    storyData.likes = (storyData.likes || 0) + 1;
    saveStories();

    const likeEl = document.getElementById("likeCount");
    if (likeEl) likeEl.textContent = storyData.likes;

    showNotificationSafe("U pëlqye historia!");
}

/* ===========================
        COMMENTS
=========================== */
function loadComments() {
    const list = document.getElementById("commentsList");
    if (!list) return;
    list.innerHTML = "";

    if (!storyData.comments || storyData.comments.length === 0) {
        list.innerHTML = "<p>Ende s’ka komente. Bëhu i pari! ✨</p>";
        return;
    }

    storyData.comments.forEach((c, index) => {
        const div = document.createElement("div");
        div.className = "comment-box mb-2 p-2 border rounded";

        const header = document.createElement("div");
        header.innerHTML = `<strong>${c.user}</strong> <small class='text-muted'>${c.date || ''}</small>`;

        const text = document.createElement("p");
        text.textContent = c.text;

        const actions = document.createElement("div");
        actions.className = "comment-actions";
        const replyBtn = document.createElement("button");
        replyBtn.textContent = "Përgjigju";
        replyBtn.className = "btn btn-sm btn-outline-primary mt-1";
        replyBtn.onclick = () => replyComment(index);
        actions.appendChild(replyBtn);

        div.appendChild(header);
        div.appendChild(text);
        div.appendChild(actions);

        if (Array.isArray(c.replies) && c.replies.length) {
            const repliesDiv = document.createElement("div");
            repliesDiv.className = "replies ms-3 mt-2";
            c.replies.forEach(r => {
                const rDiv = document.createElement("div");
                rDiv.className = "reply p-1 border rounded mb-1";
                rDiv.textContent = `${r.user}: ${r.text}`;
                repliesDiv.appendChild(rDiv);
            });
            div.appendChild(repliesDiv);
        }

        list.appendChild(div);
    });
}

function addComment() {
    const input = document.getElementById("commentInput");
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const comment = { user: currentUser, text, date: new Date().toLocaleString(), replies: [] };
    storyData.comments.push(comment);
    saveStories();

    input.value = "";
    loadComments();
    showNotificationSafe("Komenti u shtua me sukses!");
}

function replyComment(index) {
    const replyText = prompt("Shkruaj përgjigjen:");
    if (!replyText) return;

    storyData.comments[index].replies = storyData.comments[index].replies || [];
    storyData.comments[index].replies.push({ user: currentUser, text: replyText });
    saveStories();
    loadComments();
}

/* ===========================
        SHARE & BOOKMARK
=========================== */
function shareStory(platform) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(storyData.title || "");

    if (!platform) {
        navigator.clipboard.writeText(window.location.href);
        showNotificationSafe("Linku i historisë u kopjua!");
        return;
    }

    if (platform === "facebook") window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
    if (platform === "twitter") window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
    if (platform === "whatsapp") window.open(`https://wa.me/?text=${text}%20${url}`);
}

function bookmarkStory() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    if (!bookmarks[currentUser]) bookmarks[currentUser] = [];

    if (bookmarks[currentUser].includes(String(storyId))) {
        showNotificationSafe("Historia është tashmë në Favoritet!");
        return;
    }

    bookmarks[currentUser].push(String(storyId));
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    showNotificationSafe("Historia u shtua në Favoritet! ⭐");
}

/* ===========================
        UTILITIES
=========================== */
function showNotificationSafe(message) {
    if (typeof showNotification === "function") showNotification(message);
    else alert(message);
}

// expose saveStories in case other scripts need it
window.saveStories = saveStories;

/* ===========================
        INIT
=========================== */
document.addEventListener("DOMContentLoaded", loadStoryPage);


