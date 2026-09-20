(function () {
  const seasonFilter = document.getElementById("season-filter");
  const episodeFilter = document.getElementById("episode-filter");
  const searchBox = document.getElementById("search-box");
  const randomBtn = document.getElementById("random-btn");
  const list = document.getElementById("quote-list");

  let allQuotes = [];

  function render(quotes) {
    list.innerHTML = "";
    if (quotes.length === 0) {
      list.innerHTML = '<p class="quote-meta">No quotes match those filters.</p>';
      return;
    }
    for (const q of quotes) {
      const card = document.createElement("article");
      card.className = "quote-card";
      card.innerHTML = `
        <p class="quote-text">&ldquo;${escapeHtml(q.quote)}&rdquo;</p>
        <p class="quote-meta">&mdash; Raymond Reddington &middot; ${formatSE(q.season, q.episode)}${
        q.episodeTitle ? ` &middot; ${escapeHtml(q.episodeTitle)}` : ""
      }</p>
      `;
      list.appendChild(card);
    }
  }

  function formatSE(season, episode) {
    const pad = (n) => String(n).padStart(2, "0");
    return `S${pad(season)}E${pad(episode)}`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function populateFilters(quotes) {
    const seasons = [...new Set(quotes.map((q) => q.season))].sort((a, b) => a - b);
    for (const s of seasons) {
      const opt = document.createElement("option");
      opt.value = s;
      opt.textContent = `Season ${s}`;
      seasonFilter.appendChild(opt);
    }
  }

  function updateEpisodeFilter() {
    const season = seasonFilter.value;
    episodeFilter.innerHTML = '<option value="">All episodes</option>';
    if (!season) return;
    const episodes = [
      ...new Set(
        allQuotes.filter((q) => String(q.season) === season).map((q) => q.episode)
      ),
    ].sort((a, b) => a - b);
    for (const e of episodes) {
      const opt = document.createElement("option");
      opt.value = e;
      opt.textContent = `Episode ${e}`;
      episodeFilter.appendChild(opt);
    }
  }

  function applyFilters() {
    const season = seasonFilter.value;
    const episode = episodeFilter.value;
    const term = searchBox.value.trim().toLowerCase();

    const filtered = allQuotes.filter((q) => {
      if (season && String(q.season) !== season) return false;
      if (episode && String(q.episode) !== episode) return false;
      if (term) {
        const haystack = `${q.quote} ${(q.tags || []).join(" ")}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });
    render(filtered);
  }

  seasonFilter.addEventListener("change", () => {
    updateEpisodeFilter();
    applyFilters();
  });
  episodeFilter.addEventListener("change", applyFilters);
  searchBox.addEventListener("input", applyFilters);
  randomBtn.addEventListener("click", () => {
    const q = allQuotes[Math.floor(Math.random() * allQuotes.length)];
    render([q]);
  });

  fetch("api/quotes.json")
    .then((res) => res.json())
    .then((quotes) => {
      allQuotes = quotes;
      populateFilters(quotes);
      render(quotes);
    })
    .catch((err) => {
      list.innerHTML = `<p class="quote-meta">Failed to load quotes: ${err}</p>`;
    });
})();
