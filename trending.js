function loadTrending() {
    const container = document.getElementById("trendingList");
    const stories = JSON.parse(localStorage.getItem("stories")) || [];

    if (stories.length === 0) {
        container.innerHTML = `<div class="col-12 text-center"><p class="text-muted mt-5">Nuk ka histori për momentin. Krijo një tani! ✨</p></div>`;
        return;
    }

    stories.sort((a,b) => b.likes - a.likes);

    container.innerHTML = ''; // pastroj container

    stories.forEach(story => {
        const div = document.createElement("div");
        div.className = "col-md-4 mb-4";

        div.innerHTML = `
            <div class="card h-100 shadow-sm">
                <img src="${story.cover || 'img/defaultCover.png'}" class="card-img-top" alt="Cover">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${story.title}</h5>
                    <p class="card-text">${story.content.substring(0,100)}...</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="text-danger">❤️ ${story.likes}</span>
                        <button class="btn btn-primary btn-sm" onclick="openStory(${story.id})">Lexo</button>
                    </div>
                </div>
            </div>
        `;

        container.appendChild(div);
    });
}

function openStory(id) {
    window.location.href = `story.html?id=${id}`;
}
