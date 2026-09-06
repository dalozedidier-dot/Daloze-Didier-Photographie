const gallery = document.querySelector("#gallery");
const emptyState = document.querySelector("#gallery-empty");
const filters = document.querySelectorAll(".filter");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");
const lightboxClose = document.querySelector("#lightbox-close");

const photos = Array.isArray(window.PHOTO_DATA)
  ? window.PHOTO_DATA.filter((photo) => !String(photo.src || "").startsWith("data:image/"))
  : [];

document.querySelector("#year").textContent = new Date().getFullYear();

function blockContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

window.addEventListener("contextmenu", blockContextMenu, true);
document.addEventListener("contextmenu", blockContextMenu, true);
document.documentElement.oncontextmenu = () => false;
if (document.body) document.body.oncontextmenu = () => false;

window.addEventListener("mousedown", (event) => {
  if (event.button === 2) event.preventDefault();
}, true);

document.addEventListener("dragstart", (event) => {
  if (event.target instanceof HTMLImageElement) event.preventDefault();
}, true);

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
  img.draggable = false;
  img.oncontextmenu = () => false;

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
    lightboxImage.draggable = false;
    lightboxImage.oncontextmenu = () => false;
    lightboxCaption.textContent = [photo.title, photo.categoryLabel, photo.year]
      .filter(Boolean)
      .join(" · ");
    lightbox.showModal();
  });

  return article;
}

function render(filter = "all") {
  gallery.innerHTML = "";

  const visible = filter === "all"
    ? photos
    : photos.filter((photo) => photo.category === filter);

  if (!visible.length) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  visible.forEach((photo) => gallery.appendChild(createPhotoCard(photo)));
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
