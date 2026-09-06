const gallery = document.querySelector("#gallery");
const emptyState = document.querySelector("#gallery-empty");
const filters = document.querySelectorAll(".filter");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector("#lightbox-close");

const photos = Array.isArray(window.PHOTO_DATA) ? window.PHOTO_DATA : [];

document.querySelector("#year").textContent = new Date().getFullYear();

menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

function createPhotoCard(photo) {
  const article = document.createElement("article");
  article.className = "photo-card";
  article.dataset.category = photo.category;

  const img = document.createElement("img");
  img.src = photo.src;
  img.alt = photo.alt || photo.title || "Photographie";
  img.loading = "lazy";
  img.decoding = "async";

  const meta = document.createElement("div");
  meta.className = "photo-meta";
  meta.innerHTML = `
    <span class="photo-title">${escapeHtml(photo.title || "Sans titre")}</span>
    <span class="photo-category">${escapeHtml(photo.categoryLabel || photo.category || "")}</span>
  `;

  article.append(img, meta);

  article.addEventListener("click", () => {
    if (!lightbox?.showModal) return;
    lightboxImage.src = photo.src;
    lightboxImage.alt = img.alt;
    lightboxCaption.textContent = [photo.title, photo.categoryLabel, photo.year]
      .filter(Boolean)
      .join(" · ");
    lightbox.showModal();
  });

  return article;
}

function render(filter = "all") {
  gallery.innerHTML = "";

  if (!photos.length) {
    emptyState.hidden = true;
    renderDemo();
    return;
  }

  const visible = filter === "all"
    ? photos
    : photos.filter((photo) => photo.category === filter);

  visible.forEach((photo) => gallery.appendChild(createPhotoCard(photo)));
  emptyState.hidden = visible.length !== 0;
}

function renderDemo() {
  const demos = [
    ["Félins", "Portraits et regards"],
    ["Nature", "Paysages et détails"],
    ["Orages", "Lumière et atmosphère"],
    ["Costumes", "Séries et personnages"]
  ];

  demos.forEach(([title, subtitle]) => {
    const card = document.createElement("article");
    card.className = "demo-card";
    card.innerHTML = `
      <div>
        <span class="demo-label">${escapeHtml(subtitle)}</span>
        <h3>${escapeHtml(title)}</h3>
      </div>
    `;
    gallery.appendChild(card);
  });
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    render(button.dataset.filter);
  });
});

lightboxClose?.addEventListener("click", () => lightbox.close());

lightbox?.addEventListener("click", (event) => {
  const rect = lightbox.getBoundingClientRect();
  const inside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!inside) lightbox.close();
});

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

render();
