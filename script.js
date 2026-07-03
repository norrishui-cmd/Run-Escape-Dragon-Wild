const searchInput = document.querySelector("#guideSearch");
const filters = Array.from(document.querySelectorAll(".filter"));
const cards = Array.from(document.querySelectorAll(".guide-card"));

let activeFilter = "all";

function normalize(value) {
  return value.trim().toLowerCase();
}

function applyGuideFilters() {
  const query = normalize(searchInput.value);

  cards.forEach((card) => {
    const tags = card.dataset.tags || "";
    const searchable = normalize(card.textContent || "");
    const matchesFilter = activeFilter === "all" || tags.includes(activeFilter);
    const matchesSearch = !query || searchable.includes(query) || tags.includes(query);

    card.classList.toggle("is-hidden", !(matchesFilter && matchesSearch));
  });
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    applyGuideFilters();
  });
});

searchInput.addEventListener("input", applyGuideFilters);
