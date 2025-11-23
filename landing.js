function loadLandingPage() {
    const container = document.getElementById("trendingContainer");
    const stories = JSON.parse(localStorage.getItem("stories")) || [];

    container.innerHTML = "";

    if (stories.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted">
                <p>Nuk ka histori ende. Krijo një tani! ✨</p>
            </div>
        `;
        return;
    }

    // Sort by likes descending
    stories.sort((a, b) => b.likes - a.likes);

    stories.forEach(story => {
        const col = document.createElement("div");
        col.className = "col-12 col-md-6 col-lg-4";

        col.innerHTML = `
            <div class="card h-100 shadow-sm story-card">
                <img src="${story.cover || 'img/defaultCover.png'}" class="card-img-top" alt="${story.title}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title fw-bold">${story.title}</h5>
                    <p class="card-text flex-grow-1">${story.content.substring(0, 100)}...</p>
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <span>❤️ ${story.likes}</span>
                        <button class="btn btn-primary btn-sm read-btn" onclick="openStory(${story.id})">Lexo</button>
                    </div>
                </div>
            </div>
        `;

        // efekt tingulli kur klikohen
        col.querySelector(".read-btn").addEventListener("click", () => {
            document.getElementById("bgSound").play();
        });

        container.appendChild(col);
    });
}

function openStory(id) {
    window.location.href = `story.html?id=${id}`;
}
