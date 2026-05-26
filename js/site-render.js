(function () {
  const DATA = window.TMRC_DATA;
  const params = new URLSearchParams(window.location.search);
  const rawLang = params.get("lang") || "zh-TW";
  const lang = rawLang === "en" ? "en" : "zh-TW";
  const key = lang === "en" ? "en" : "zhTW";
  const otherLang = lang === "en" ? "zh-TW" : "en";
  const otherKey = otherLang === "en" ? "en" : "zhTW";
  const ui = DATA.ui[key];

  document.documentElement.lang = lang;
  document.body.classList.toggle("lang-en", lang === "en");

  function esc(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function lineBreakSafe(value) {
    return esc(value).replaceAll("&lt;br&gt;", "<br>").replaceAll("&lt;br/&gt;", "<br>").replaceAll("&lt;br /&gt;", "<br>");
  }

  function mailLink(line) {
    const escaped = esc(line);
    const match = String(line).match(/([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i);
    if (!match) return escaped;
    const email = match[1];
    return escaped.replace(esc(email), `<a href="mailto:${esc(email)}">${esc(email)}</a>`);
  }

  function withLang(path, targetLang = lang, extra = {}) {
    const url = new URL(path, window.location.href);
    url.searchParams.set("lang", targetLang);
    Object.entries(extra).forEach(([k, v]) => url.searchParams.set(k, v));
    return url.pathname.split("/").pop() + url.search;
  }

  function currentPage() {
    return document.body.dataset.page || "home";
  }

  function pageTitle(page) {
    const titleMap = {
      home: DATA.site.title[key],
      research: `${ui.research} - ${DATA.site.title[key]}`,
      members: `${ui.members} - ${DATA.site.title[key]}`,
      news: `${ui.news} - ${DATA.site.title[key]}`,
      article: DATA.site.title[key],
      member: DATA.site.title[key]
    };
    return titleMap[page] || DATA.site.title[key];
  }

  function header() {
    const page = currentPage();
    const switchExtra = {};
    if (page === "article") {
      switchExtra.type = params.get("type") || "research";
      switchExtra.id = params.get("id") || "";
    }
    if (page === "member") {
      switchExtra.id = params.get("id") || "";
    }

    const navs = [
      ["home", "index.html", ui.home],
      ["research", "research.html", ui.research],
      ["members", "members.html", ui.members],
      ["news", "news.html", ui.news]
    ];

    return `
      <header>
        <div class="site-brand">
          <img src="${esc(DATA.site.brand.logo)}" alt="TMRC" class="tmrc-logo">
          <div class="site-title">
            <div class="site-title-zh">${esc(DATA.site.brand.zhTitle)}</div>
            <div class="site-title-en">${esc(DATA.site.brand.enTitle)}</div>
          </div>
        </div>
        <nav>
          ${navs.map(([id, href, label]) => `<a href="${withLang(href)}" class="${page === id ? "nav-active" : ""}">${esc(label)}</a>`).join("")}
          <a href="${withLang(location.pathname.split("/").pop() || "index.html", otherLang, switchExtra)}" class="lang-link">${esc(DATA.ui[key].languageSwitch)}</a>
        </nav>
      </header>
    `;
  }

  function footer() {
    const f = DATA.site.footer[key];
    return `
      <footer>
        <div class="footer-container">
          <div class="footer-left">
            <div class="zh-title">
              ${f.titleLines.map(t => `<h4>${esc(t)}</h4>`).join("")}
            </div>
            <div class="en-title">
              ${f.subtitleLines.map(t => `<p>${esc(t)}</p>`).join("")}
            </div>
          </div>
          <div class="footer-right">
            <div class="contact-info">
              ${f.contactLines.map(line => `<p>${mailLink(line)}</p>`).join("")}
            </div>
            <div class="copyright-info">
              <p>&copy; <span id="currentYear"></span> ${esc(f.copyright)}</p>
            </div>
          </div>
        </div>
      </footer>
    `;
  }

  function pageHero(title, cls) {
    return `
      <section class="page-hero-title-section ${cls || ""}">
        <div class="page-hero-title-content">
          <h2>${esc(title)}</h2>
        </div>
      </section>
    `;
  }

  function newsLink(item) {
    return `article.html?type=news&id=${encodeURIComponent(item.id)}&lang=${encodeURIComponent(lang)}`;
  }

  function researchLink(id) {
    return `article.html?type=research&id=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}`;
  }

  function memberLink(id) {
    return `member.html?id=${encodeURIComponent(id)}&lang=${encodeURIComponent(lang)}`;
  }

  function renderHome() {
    const home = DATA.home[key];
    const latest = DATA.news.slice(0, 3);
    return `
      <section class="hero-section">
        <div class="hero-content ${lang === "en" ? "en-hero" : ""}">
          <h2>${esc(home.title)}</h2>
          ${home.paragraphs.map(p => `<p class="indent-first-line">${esc(p)}</p>`).join("")}
        </div>
      </section>
      <main>
        <section class="content-card news">
          <h2>${esc(ui.news)}</h2>
          <ul id="latest-news-list">
            ${latest.map(item => `<li><a href="${newsLink(item)}">${esc(item[key].title)}</a></li>`).join("")}
          </ul>
          <div class="view-all-container">
            <a href="${withLang("news.html")}" class="view-all-link">${esc(ui.viewAllNews)}</a>
          </div>
        </section>
      </main>
    `;
  }

  function renderOrgChart() {
    const org = DATA.orgChart[key];
    return `
      <div class="org-chart-container">
        <div class="org-box box-chief">${esc(org.director)}</div>
        <div class="org-line-vertical"></div>
        <div class="org-middle-section">
          <div class="committee-branch">
            <div class="org-box box-committee">${esc(org.committee)}</div>
            <div class="committee-connector"></div>
          </div>
          <div class="vertical-spine"></div>
        </div>
        <div class="org-groups-wrapper">
          ${org.groups.map(group => `
            <div class="group-col">
              <div class="box-group">
                <h4>${esc(group.title)}</h4>
                <p><strong>${esc(org.convenerLabel)}</strong>${esc(group.convener)}</p>
                <p><strong>${esc(org.membersLabel)}</strong>${esc(group.members)}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  function renderResearch() {
    const articleById = Object.fromEntries(DATA.researchArticles.map(a => [a.id, a]));
    return `
      <main>
        ${pageHero(ui.research, "hero-research")}
        <section class="content-card about-content">
          <p>${esc(DATA.researchIntro[key])}</p>
          ${renderOrgChart()}
          ${DATA.researchCategories.map(cat => `
            <h3>${esc(cat[key].title)}</h3>
            <p>${esc(cat[key].description)}</p>
            <ol>
              ${cat.items.map(id => {
                const art = articleById[id];
                return `<li><a href="${researchLink(id)}">${esc(art[key].title)}</a></li>`;
              }).join("")}
            </ol>
          `).join("")}
        </section>
      </main>
    `;
  }

  function renderMembers() {
    const rows = [];
    for (let i = 0; i < DATA.members.length; i += 2) {
      rows.push(DATA.members.slice(i, i + 2));
    }
    return `
      <main>
        ${pageHero(ui.members, "hero-members")}
        <section class="content-card faculty">
          ${rows.map(row => `
            <div class="faculty-row">
              ${row.map(member => `
                <div class="faculty-member">
                  <img src="${esc(member.image)}" alt="${esc(member[key].name)}">
                  <div class="faculty-info">
                    <h4>${esc(member[key].name)}</h4>
                    <p>${esc(ui.education)}：${esc(member[key].card.education)}</p>
                    <p>${esc(ui.specialization)}：${esc(member[key].card.specialization)}</p>
                    <a href="${memberLink(member.id)}" class="btn-more">${esc(ui.more)}</a>
                  </div>
                </div>
              `).join("")}
            </div>
          `).join("")}
        </section>
      </main>
    `;
  }

  function renderNews() {
    return `
      <main>
        ${pageHero(ui.news, "hero-news")}
        <section class="content-card">
          <ul class="news">
            ${DATA.news.map(item => `<li><a href="${newsLink(item)}">${esc(item[key].title)}</a></li>`).join("")}
          </ul>
        </section>
      </main>
    `;
  }

  function renderArticle() {
    const type = params.get("type") || "research";
    const id = params.get("id");
    const item = type === "news"
      ? DATA.news.find(n => n.id === id)
      : DATA.researchArticles.find(r => r.id === id);

    if (!item) return renderNotFound();

    if (type === "news") {
      return `
        <main class="no-banner-main">
          <section class="content-card article-content">
            <h2>${esc(item[key].title)}</h2>
            <div class="article-meta">${esc(ui.published)}${esc(item.date[key])}</div>
            <div class="article-content">
              ${item[key].paragraphs.map(p => `<p class="indent-first-line">${esc(p)}</p>`).join("")}
              <a href="${withLang("news.html")}" class="back-link">${esc(ui.backToNews)}</a>
            </div>
          </section>
        </main>
      `;
    }

    return `
      <main class="no-banner-main">
        <section class="content-card article-content">
          <h2>${esc(item[key].title)}</h2>
          ${item[key].sections.map(section => `
            <h3>${esc(section.heading)}</h3>
            ${section.paragraphs.map(p => `<p>${esc(p)}</p>`).join("")}
            ${section.images.map(img => `
              <figure class="research-image-container">
                <img src="${esc(img.src)}" alt="${esc(img.alt)}" style="max-width: 100%; height: auto;">
                <figcaption>${esc(img.caption)}</figcaption>
              </figure>
            `).join("")}
          `).join("")}
          <a href="${withLang("research.html")}" class="back-link">${esc(ui.backToResearch)}</a>
        </section>
      </main>
    `;
  }

  function renderProjectTable(member) {
    const projects = member[key].projects || [];
    if (projects.length === 0) {
      return `<p>${esc(ui.noProjects)}</p>`;
    }
    return `
      <div class="table-container">
        <table class="research-table project-table">
          <thead>
            <tr>
              <th>${esc(ui.role)}</th>
              <th>${esc(ui.name)}</th>
              <th>${esc(ui.projectTitle)}</th>
              <th>${esc(ui.duration)}</th>
              <th>${esc(ui.agency)}</th>
            </tr>
          </thead>
          <tbody id="projectTableBody"></tbody>
        </table>
      </div>
      <div class="pagination-container" id="paginationControls"></div>
      <script type="application/json" id="projectDataJson">${JSON.stringify(projects).replaceAll("<", "\\u003c")}</script>
    `;
  }

  function initProjectPagination() {
    const node = document.getElementById("projectDataJson");
    const tbody = document.getElementById("projectTableBody");
    const controls = document.getElementById("paginationControls");
    if (!node || !tbody || !controls) return;
    const rowsPerPage = 10;
    const projects = JSON.parse(node.textContent);
    let current = 1;

    function render(page) {
      current = page;
      const start = (page - 1) * rowsPerPage;
      const items = projects.slice(start, start + rowsPerPage);
      tbody.innerHTML = items.map(p => `
        <tr>
          <td>${esc(p.role)}</td>
          <td>${esc(p.name)}</td>
          <td>${lineBreakSafe(p.title)}</td>
          <td class="col-date">${esc(p.date)}</td>
          <td>${esc(p.agency)}</td>
        </tr>
      `).join("");
      renderControls();
    }

    function renderControls() {
      const totalPages = Math.ceil(projects.length / rowsPerPage);
      controls.innerHTML = "";
      if (totalPages <= 1) return;
      function btn(text, page, disabled, active) {
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = text;
        a.className = `pagination-btn${disabled ? " disabled" : ""}${active ? " active" : ""}`;
        if (!disabled) {
          a.addEventListener("click", function (e) {
            e.preventDefault();
            render(page);
          });
        }
        controls.appendChild(a);
      }
      btn("«", 1, current === 1, false);
      btn("<", Math.max(1, current - 1), current === 1, false);
      const start = Math.max(1, current - 2);
      const end = Math.min(totalPages, start + 4);
      for (let i = start; i <= end; i++) btn(String(i), i, false, i === current);
      btn(">", Math.min(totalPages, current + 1), current === totalPages, false);
      btn("»", totalPages, current === totalPages, false);
    }

    render(1);
  }

  function renderMember() {
    const id = params.get("id");
    const member = DATA.members.find(m => m.id === id);
    if (!member) return renderNotFound();
    return `
      <main class="no-banner-main">
        <section class="content-card article-content">
          <div class="member-profile">
            <img src="${esc(member.image)}" alt="${esc(member[key].name)}">
            <div>
              <h2>${esc(member[key].name)}</h2>
            </div>
          </div>

          <h3>${esc(ui.biography)}</h3>
          <p>${lang === "en" ? "Highest Degree:" : "最高學位:"}</p>
          <p>${esc(member[key].degree)}</p>

          <h3>${esc(ui.team)}</h3>
          <p>${member[key].team.map(esc).join("<br>")}</p>

          <h3>${esc(ui.areas)}</h3>
          <p>${member[key].areas.map(esc).join("<br>")}</p>

          <h3>${esc(ui.projects)}</h3>
          ${renderProjectTable(member)}

          <h3>${esc(ui.contact)}</h3>
          <p>${member[key].contact.map(mailLink).join("<br>")}</p>

          <a href="${withLang("members.html")}" class="back-link">${esc(ui.backToMembers)}</a>
        </section>
      </main>
    `;
  }

  function renderNotFound() {
    return `
      <main class="no-banner-main">
        <section class="content-card">
          <h2>${esc(ui.pageNotFound)}</h2>
        </section>
      </main>
    `;
  }

  function render() {
    const page = currentPage();
    document.title = pageTitle(page);
    let content = "";
    if (page === "home") content = renderHome();
    else if (page === "research") content = renderResearch();
    else if (page === "members") content = renderMembers();
    else if (page === "news") content = renderNews();
    else if (page === "article") content = renderArticle();
    else if (page === "member") content = renderMember();
    else content = renderNotFound();

    const root = document.getElementById("site-root");
    root.innerHTML = header() + content + footer();
    const year = document.getElementById("currentYear");
    if (year) year.textContent = new Date().getFullYear();
    initProjectPagination();
  }

  window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", function () {
    const btn = document.getElementById("scrollTopBtn");
    if (btn) btn.style.display = document.documentElement.scrollTop > 200 ? "block" : "none";
  });

  render();
})();
