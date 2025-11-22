function loadTrending() {
    const container = document.getElementById("trendingList");
    const stories = JSON.parse(localStorage.getItem("stories")) || [];

    if (stories.length === 0) {
        container.innerHTML = "<p>Nuk ka histori ende. 🌟</p>";
        return;
    }

    // rendit historitë nga më shumë likes
    stories.sort((a, b) => b.likes - a.likes);

    stories.forEach(story => {
        const div = document.createElement("div");
        div.className = "story-card";
        div.innerHTML = `
            <h3>${story.title}</h3>
            <p>${story.content.substring(0, 80)}...</p>
            <span>❤️ ${story.likes}</span>
            <button class="read-btn" onclick="openStory(${story.id})">Lexo</button>
        `;
        container.appendChild(div);
    });
}

function openStory(id) {
    window.location.href = `story.html?id=${id}`;
}
