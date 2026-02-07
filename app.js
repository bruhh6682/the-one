const bundleOptions = document.getElementById("bundle-options");
const galleryGrid = document.getElementById("gallery-grid");
const emptyState = document.getElementById("empty-state");

const state = {
  bundles: [],
  selectedBundles: new Set(),
};

const normalizeLabel = (filename) =>
  filename
    .replace(/[-_]/g, " ")
    .replace(/\.[^.]+$/, "")
    .replace(/\b\w/g, (match) => match.toUpperCase());

const ensureRarity = (rarity) => {
  const parsed = Number.parseInt(rarity ?? 1, 10);
  if (Number.isNaN(parsed)) {
    return 1;
  }
  return Math.min(Math.max(parsed, 1), 3);
};

const renderBundles = () => {
  bundleOptions.innerHTML = "";

  state.bundles.forEach((bundle) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = bundle.id;
    input.checked = state.selectedBundles.has(bundle.id);
    input.addEventListener("change", (event) => {
      if (event.target.checked) {
        state.selectedBundles.add(bundle.id);
      } else {
        state.selectedBundles.delete(bundle.id);
      }
      renderCards();
    });

    const span = document.createElement("span");
    span.textContent = bundle.title;

    label.appendChild(input);
    label.appendChild(span);
    bundleOptions.appendChild(label);
  });
};

const renderCards = () => {
  galleryGrid.innerHTML = "";

  const visibleBundles = state.bundles.filter((bundle) =>
    state.selectedBundles.has(bundle.id)
  );

  const cards = visibleBundles.flatMap((bundle) =>
    bundle.cards.map((card) => ({
      ...card,
      bundle,
    }))
  );

  cards.forEach((card) => {
    const cardElement = document.createElement("article");
    cardElement.className = "card";

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "card-image";

    const img = document.createElement("img");
    img.src = `${card.bundle.path}/${card.file}`;
    img.alt = card.alt ?? normalizeLabel(card.file);

    const rarityBadge = document.createElement("span");
    rarityBadge.className = "rarity";
    rarityBadge.textContent = `Rarity ${ensureRarity(card.rarity)}`;

    imageWrapper.appendChild(img);
    imageWrapper.appendChild(rarityBadge);

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h3");
    title.textContent = card.title ?? normalizeLabel(card.file);

    const description = document.createElement("p");
    description.textContent =
      card.text ?? card.description ?? "Add custom text for this card.";

    body.appendChild(title);
    body.appendChild(description);

    cardElement.appendChild(imageWrapper);
    cardElement.appendChild(body);

    galleryGrid.appendChild(cardElement);
  });

  emptyState.style.display = cards.length === 0 ? "block" : "none";
};

const loadBundles = async () => {
  try {
    const response = await fetch("cards/bundles.json");
    if (!response.ok) {
      throw new Error("Unable to load bundles.json");
    }
    const data = await response.json();
    state.bundles = data.bundles ?? [];
    state.selectedBundles = new Set(state.bundles.map((bundle) => bundle.id));
    renderBundles();
    renderCards();
  } catch (error) {
    console.error(error);
    emptyState.textContent =
      "Failed to load bundles. Check cards/bundles.json.";
    emptyState.style.display = "block";
  }
};

loadBundles();
