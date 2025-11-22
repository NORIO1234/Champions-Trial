function loadLandingPage() {
    const container = document.getElementById("trendingContainer");
    const stories = JSON.parse(localStorage.getItem("stories")) || [];

    if (stories.length === 0) {
        container.innerHTML = "<p>Nuk ka histori ende. Krijo një tani! ✨</p>";
        return;
    }

    stories.sort((a,b) => b.likes - a.likes);

    stories.forEach(story => {
        const div = document.createElement("div");
        div.className = "story-card";
        div.innerHTML = `
            <img src="${story.cover || 'img/defaultCover.png'}" class="cover-img">
            <h3>${story.title}</h3>
            <p>${story.content.substring(0, 100)}...</p>
            <span>❤️ ${story.likes}</span>
            <button class="read-btn" onclick="openStory(${story.id})">Lexo</button>
        `;

        // efekt tingulli kur klikohen
        div.querySelector(".read-btn").addEventListener("click", () => {
            document.getElementById("bgSound").play();
        });

        container.appendChild(div);
    });
}

function openStory(id) {
    window.location.href = `story.html?id=${id}`;
}
