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

const imageInfoCache = new Map();
let renderVersion = 0;

document.querySelector("#year").textContent = new Date().getFullYear();

// Blocage du menu contextuel et du glisser-déposer.
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

function getPhotoInfo(photo) {
  if (imageInfoCache.has(photo.src)) return imageInfoCache.get(photo.src);

  const promise = new Promise((resolve) => {
    const probe = new Image();
    probe.onload = () => {
      const width = probe.naturalWidth || 1;
      const height = probe.naturalHeight || 1;
      const ratio = width / height;
      resolve({
        photo,
        width,
        height,
        ratio,
        orientation: ratio >= 1 ? "landscape" : "portrait"
      });
    };
    probe.onerror = () => resolve({
      photo,
      width: 1,
      height: 1,
      ratio: 1,
      orientation: "landscape"
    });
    probe.src = photo.src;
  });

  imageInfoCache.set(photo.src, promise);
  return promise;
}

function getThumbnailWidth(info) {
  // On garde une taille compacte et le ratio réel de l'image.
  if (info.orientation === "landscape") {
    return Math.round(Math.max(175, Math.min(info.ratio * 138, 285)));
  }

  return Math.round(Math.max(135, Math.min(info.ratio * 215, 195)));
}

function createPhotoCard(info) {
  const { photo, orientation } = info;
  const article = document.createElement("article");
  article.className = `photo-card photo-card-${orientation}`;
  article.dataset.category = photo.category;
  article.style.width = `${getThumbnailWidth(info)}px`;

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

function createOrientationGroup(title, orientation, items) {
  if (!items.length) return null;

  const section = document.createElement("section");
  section.className = "orientation-group";

  const heading = document.createElement("h3");
  heading.className = "orientation-title";
  heading.textContent = title;

  const row = document.createElement("div");
  row.className = `orientation-grid orientation-grid-${orientation}`;

  // Les tailles proches restent ensemble au lieu de créer une ligne chaotique.
  const sorted = [...items].sort((a, b) => getThumbnailWidth(b) - getThumbnailWidth(a));
  sorted.forEach((item) => row.appendChild(createPhotoCard(item)));

  section.append(heading, row);
  return section;
}

async function render(filter = "all") {
  const currentRender = ++renderVersion;
  gallery.innerHTML = "";

  const visible = filter === "all"
    ? photos
    : photos.filter((photo) => photo.category === filter);

  if (!visible.length) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;
  const loaded = await Promise.all(visible.map(getPhotoInfo));
  if (currentRender !== renderVersion) return;

  const landscapes = loaded.filter((item) => item.orientation === "landscape");
  const portraits = loaded.filter((item) => item.orientation === "portrait");

  const landscapeGroup = createOrientationGroup("Format paysage", "landscape", landscapes);
  const portraitGroup = createOrientationGroup("Format portrait", "portrait", portraits);

  if (landscapeGroup) gallery.appendChild(landscapeGroup);
  if (portraitGroup) gallery.appendChild(portraitGroup);
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
