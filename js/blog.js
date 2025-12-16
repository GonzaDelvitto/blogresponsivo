const postsGrid = document.getElementById("posts");
const categoriesEl = document.getElementById("categories");
const searchInput = document.getElementById("searchInput");
const paginationEl = document.getElementById("pagination");

const params = new URLSearchParams(window.location.search);
const activeCategory = params.get("cat");

let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
const perPage = 6;

/* ================= INTERSECTION OBSERVER ================= */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

/* ================= FETCH ================= */
fetch("./data/post.json")
  .then(res => res.json())
  .then(posts => {
    allPosts = posts;
    filteredPosts = activeCategory
      ? posts.filter(p => p.category === activeCategory)
      : posts;

    renderCategories(posts);
    render();
  })
  .catch(() => {
    postsGrid.innerHTML = "<p>Error cargando artículos.</p>";
  });

/* ================= RENDER ================= */
function render() {
  renderPosts();
  renderPagination();
}

/* ================= POSTS ================= */
function renderPosts() {
  postsGrid.innerHTML = "";

  const start = (currentPage - 1) * perPage;
  const paginated = filteredPosts.slice(start, start + perPage);

  if (!paginated.length) {
    postsGrid.innerHTML = "<p>No hay artículos.</p>";
    return;
  }

  paginated.forEach(post => {
    const article = document.createElement("article");
    article.className = "post-card fade-up";

    article.innerHTML = `
      <img src="${post.image}" alt="${post.title}">
      <div class="content">
        <span class="tag" data-cat="${post.category}">
          ${post.category}
        </span>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
        <a href="./pag/post.html?id=${post.id}">
          Leer más →
        </a>
      </div>
    `;

    postsGrid.appendChild(article);
    observer.observe(article);
  });

  enableCategoryClicks();
}

/* ================= CATEGORIES ================= */
function renderCategories(posts) {
  const cats = [...new Set(posts.map(p => p.category))];

  categoriesEl.innerHTML = `
    <span class="cat ${!activeCategory ? "active" : ""}" data-cat="all">
      Todas
    </span>
  `;

  cats.forEach(cat => {
    categoriesEl.innerHTML += `
      <span class="cat ${cat === activeCategory ? "active" : ""}" data-cat="${cat}">
        ${cat}
      </span>
    `;
  });

  categoriesEl.querySelectorAll(".cat").forEach(catEl => {
    catEl.addEventListener("click", () => {
      const cat = catEl.dataset.cat;
      currentPage = 1;

      filteredPosts =
        cat === "all"
          ? allPosts
          : allPosts.filter(p => p.category === cat);

      render();
    });
  });
}

/* ================= TAG CLICK ================= */
function enableCategoryClicks() {
  document.querySelectorAll(".tag").forEach(tag => {
    tag.addEventListener("click", () => {
      window.location.href = `index.html?cat=${encodeURIComponent(
        tag.dataset.cat
      )}`;
    });
  });
}

/* ================= SEARCH ================= */
searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  currentPage = 1;

  filteredPosts = allPosts.filter(
    p =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q)
  );

  render();
});

/* ================= PAGINATION ================= */
function renderPagination() {
  paginationEl.innerHTML = "";

  const pages = Math.ceil(filteredPosts.length / perPage);

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");

    btn.addEventListener("click", () => {
      currentPage = i;
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    paginationEl.appendChild(btn);
  }
}
