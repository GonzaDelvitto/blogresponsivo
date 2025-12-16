// ===================== PARAMS =====================
const params = new URLSearchParams(window.location.search);
const postId = parseInt(params.get("id"), 10);

const postContainer = document.getElementById("post");

// ===================== FETCH POST =====================
fetch("../data/post.json")
  .then(res => {
    if (!res.ok) throw new Error("Error cargando JSON");
    return res.json();
  })
  .then(posts => {
    const post = posts.find(p => p.id === postId);

    if (!post) {
      postContainer.innerHTML = "<p>Artículo no encontrado.</p>";
      return;
    }

    // ===================== SEO DINÁMICO =====================
    document.title = post.title + " | Tech & Diseño";

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", post.excerpt);
    }

    // ===================== RENDER POST =====================
    postContainer.innerHTML = `
      <header class="post-header">
        <span class="post-category" data-cat="${post.category}">
          ${post.category}
        </span>
        <h1>${post.title}</h1>
        <p class="post-meta">${post.date}</p>
      </header>

      <img src="../${post.image}" class="post-image" alt="${post.title}">

      <div class="post-content">
        ${post.content.map(text => `<p>${text}</p>`).join("")}
      </div>

      <section id="related" class="related">
        <h3>Artículos relacionados</h3>
        <div class="related-grid"></div>
      </section>
    `;

    renderRelated(posts, post);
    enableCategoryFilter(post.category);
  })
  .catch(err => {
    postContainer.innerHTML = "<p>Error cargando el artículo.</p>";
    console.error(err);
  });

// ===================== RELATED POSTS =====================
function renderRelated(posts, currentPost) {
  const related = posts
    .filter(
      p => p.category === currentPost.category && p.id !== currentPost.id
    )
    .slice(0, 2);

  const container = document.querySelector(".related-grid");
  if (!container) return;

  related.forEach(post => {
    container.innerHTML += `
      <article class="related-card">
        <img src="../${post.image}" alt="${post.title}">
        <h4>${post.title}</h4>
        <a href="post.html?id=${post.id}">Leer más →</a>
      </article>
    `;
  });
}

// ===================== CATEGORY CLICK =====================
function enableCategoryFilter(category) {
  const catEl = document.querySelector(".post-category");
  if (!catEl) return;

  catEl.addEventListener("click", () => {
    window.location.href = `../index.html?cat=${encodeURIComponent(category)}`;
  });
}

// ===================== SCROLL PROGRESS =====================
window.addEventListener("scroll", () => {
  const doc = document.documentElement;
  const scroll =
    (doc.scrollTop / (doc.scrollHeight - doc.clientHeight)) * 100;

  const progress = document.getElementById("progress");
  if (progress) {
    progress.style.width = scroll + "%";
  }
});
