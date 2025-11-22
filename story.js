/* ===============================
        STORY PAGE - Consolidated
================================ */

let storyId;
let storyData;
let currentUser;

// Load page and initialize
function loadStoryPage() {
    currentUser = localStorage.getItem("currentUser");
    // Allow viewing by guests? Original code redirected to auth; keep that behavior
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

    // populate fields
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

    // ensure comments array
    storyData.comments = storyData.comments || [];

    loadComments();
}

function saveStories() {
    const stories = JSON.parse(localStorage.getItem("stories")) || [];
    const idx = stories.findIndex(s => String(s.id) === String(storyId));
    if (idx !== -1) {
        stories[idx] = storyData;
        localStorage.setItem("stories", JSON.stringify(stories));
    }
}

/* ========== Likes ========== */
function likeStory() {
    const liked = JSON.parse(localStorage.getItem("likedStories")) || {};
    if (!liked[currentUser]) liked[currentUser] = [];

    if (liked[currentUser].includes(String(storyId))) {
           if (typeof showNotification === 'function') showNotification("E ke pëlqyer këtë histori më parë!", { duration: 2000 });
        return;
    }

    liked[currentUser].push(String(storyId));
    localStorage.setItem("likedStories", JSON.stringify(liked));

    storyData.likes = (storyData.likes || 0) + 1;
    saveStories();
    document.getElementById("likeCount").textContent = storyData.likes;
        if (typeof showNotification === 'function') showNotification('U pëlqye historia!', { duration: 1800 });
}

/* ========== Comments ========== */
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
        div.className = "comment-box";

        // main comment
        const header = document.createElement('div');
        header.innerHTML = `<strong>${c.user}</strong> <small class='comment-date'>${c.date || ''}</small>`;

        const text = document.createElement('p');
        text.textContent = c.text;

        const actions = document.createElement('div');
        actions.className = 'comment-actions';
        const replyBtn = document.createElement('button');
        replyBtn.textContent = 'Përgjigju';
        replyBtn.onclick = () => replyComment(index);
        actions.appendChild(replyBtn);

        div.appendChild(header);
        div.appendChild(text);
        div.appendChild(actions);

        // replies
        if (Array.isArray(c.replies) && c.replies.length) {
            const repliesDiv = document.createElement('div');
            repliesDiv.className = 'replies';
            c.replies.forEach(r => {
                const rDiv = document.createElement('div');
                rDiv.className = 'reply';
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

    const date = new Date().toLocaleString();
    const comment = { user: currentUser, text, date, replies: [] };

    storyData.comments.push(comment);
    saveStories();

    input.value = '';
    loadComments();
    if (typeof showNotification === 'function') showNotification('Komenti u shtua me sukses!');
}

function replyComment(index) {
    const reply = prompt("Shkruaj përgjigjen:");
    if (!reply) return;
    storyData.comments[index].replies = storyData.comments[index].replies || [];
    storyData.comments[index].replies.push({ user: currentUser, text: reply });
    saveStories();
    loadComments();
}

/* ========== Share & Bookmark ========== */
function shareStory(platform) {
    if (!platform) {
        navigator.clipboard.writeText(window.location.href);
            if (typeof showNotification === 'function') showNotification("Linku i historisë u kopjua!");
        return;
    }
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(storyData.title || '');
    if (platform === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
    if (platform === 'twitter') window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
    if (platform === 'whatsapp') window.open(`https://wa.me/?text=${text}%20${url}`);
}

function bookmarkStory() {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || {};
    if (!bookmarks[currentUser]) bookmarks[currentUser] = [];
    if (bookmarks[currentUser].includes(String(storyId))) {
            if (typeof showNotification === 'function') showNotification("Historia është tashmë në Favoritet!");
        return;
    }
    bookmarks[currentUser].push(String(storyId));
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
        if (typeof showNotification === 'function') showNotification("Historia u shtua në Favoritet! ⭐");
}

// expose saveStories for potential reuse
window.saveStories = saveStories;
