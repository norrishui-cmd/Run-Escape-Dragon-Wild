const searchInput = document.querySelector("#guideSearch");
const filters = Array.from(document.querySelectorAll(".filter"));
const cards = Array.from(document.querySelectorAll(".guide-card"));
const countdown = document.querySelector(".release-countdown");

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

if (searchInput) {
  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      filters.forEach((item) => item.classList.toggle("active", item === button));
      applyGuideFilters();
    });
  });

  searchInput.addEventListener("input", applyGuideFilters);
}

function updateReleaseCountdown() {
  if (!countdown) return;

  const target = new Date(countdown.dataset.releaseTarget);
  const remaining = target.getTime() - Date.now();
  const daysNode = countdown.querySelector("[data-countdown-days]");
  const hoursNode = countdown.querySelector("[data-countdown-hours]");
  const minutesNode = countdown.querySelector("[data-countdown-minutes]");
  const secondsNode = countdown.querySelector("[data-countdown-seconds]");

  if (Number.isNaN(target.getTime()) || remaining <= 0) {
    daysNode.textContent = "000";
    hoursNode.textContent = "00";
    minutesNode.textContent = "00";
    secondsNode.textContent = "00";
    countdown.querySelector("p").textContent =
      "The official 2026 full release window has been reached; exact date remains TBA.";
    return;
  }

  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysNode.textContent = String(days).padStart(3, "0");
  hoursNode.textContent = String(hours).padStart(2, "0");
  minutesNode.textContent = String(minutes).padStart(2, "0");
  secondsNode.textContent = String(seconds).padStart(2, "0");
}

updateReleaseCountdown();
setInterval(updateReleaseCountdown, 1000);
