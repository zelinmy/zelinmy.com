/* ==========================================================================
   Zelin Trading Co., Limited — Global Site Script
   Single source of truth for: header injection, footer injection, SEO
   configuration + JSON-LD, reveal observers, SVG sprite loading, navigation
   toggle, smooth anchor scrolling, back-to-top, news filtering + pagination
   and contact form validation.
   ========================================================================== */
(function () {
  "use strict";

  /* Scroll-reveal hidden states are gated behind this class. If main.js never
     runs (blocked, parse error, offline), the page stays fully readable
     instead of rendering every .reveal element at opacity:0. */
  document.documentElement.classList.add("reveal-ready");

  /* ---------------------------------------------------------------------
     0. SITE CONSTANTS — single place for every replaceable company detail
     --------------------------------------------------------------------- */
  var CURRENT_SCRIPT = document.currentScript;

  var SITE = {
    company: "Zelin Trading Co., Limited",
    companyShort: "Zelin Trading",
    address:
      "RM 701, UNIT 108, 7/F, TWR B NEW MANDARIN PLAZA, 14 SCIENCE MUSEUM RD, TSIM SHA TSUI, HONG KONG",
    website: "zelinmy.com",
    origin: "https://zelinmy.com",
    emailSupport: "support@zelinmy.com",
    emailAccount: "aiyangping@zelinmy.com",
    phone: "+852 2151 8860",
    spriteUrl: "images/sprite.svg"
  };

  /* Resolve the sprite next to the script, so the site works at a domain
     root or inside a sub-directory without a hard-coded absolute path. */
  (function resolveSprite() {
    var src = CURRENT_SCRIPT && CURRENT_SCRIPT.src;
    if (!src) return;
    var idx = src.lastIndexOf("/js/");
    if (idx === -1) return;
    SITE.spriteUrl = src.slice(0, idx) + "/images/sprite.svg";
  })();

  var NAV = [
    { label: "Home", href: "./", key: "home" },
    { label: "Services", href: "services.html", key: "services" },
    { label: "Culture", href: "culture.html", key: "culture" },
    { label: "News", href: "news.html", key: "news" },
    { label: "Contact", href: "contact.html", key: "contact" }
  ];

  /* ---------------------------------------------------------------------
     1. SEO CONFIGURATION — one entry per route
     --------------------------------------------------------------------- */
  var SEO = {
    "/": {
      title: "Zelin Trading Co., Limited — Global Trade & Supply Chain, Hong Kong",
      description:
        "Zelin Trading Co., Limited is a Hong Kong trading company delivering wholesale and retail of daily necessities, hardware, household and electronic goods, textiles and garments, import and export, business consultation and supply chain services.",
      canonical: "https://zelinmy.com/",
      og: "website",
      image: "https://zelinmy.com/images/hero.png"
    },
    "/index.html": {
      title: "Zelin Trading Co., Limited — Global Trade & Supply Chain, Hong Kong",
      description:
        "Zelin Trading Co., Limited is a Hong Kong trading company delivering wholesale and retail of daily necessities, hardware, household and electronic goods, textiles and garments, import and export, business consultation and supply chain services.",
      canonical: "https://zelinmy.com/",
      og: "website",
      image: "https://zelinmy.com/images/hero.png"
    },
    "/services.html": {
      title: "Services — Trading, Wholesale, Import & Export | Zelin Trading",
      description:
        "Eight business lines and one mobile management console: daily necessities, hardware, household goods, electronics, textiles and garments, import and export of goods and technology, business consultation, supply chain and general trade.",
      canonical: "https://zelinmy.com/services.html",
      og: "website",
      image: "https://zelinmy.com/images/app-1.png"
    },
    "/culture.html": {
      title: "Our Culture, Mission & Milestones | Zelin Trading",
      description:
        "The mission, vision and values behind Zelin Trading Co., Limited, our milestones from a Hong Kong trade desk to a multi-category supply chain, and our approach to compliance and responsible trade.",
      canonical: "https://zelinmy.com/culture.html",
      og: "website",
      image: "https://zelinmy.com/images/hero.png"
    },
    "/news.html": {
      title: "News & Market Insights | Zelin Trading",
      description:
        "Category updates from Zelin Trading Co., Limited covering supply chain moves, product category notes, partnership announcements and mobile app releases.",
      canonical: "https://zelinmy.com/news.html",
      og: "website",
      image: "https://zelinmy.com/images/news-1.png"
    },
    "/contact.html": {
      title: "Contact Zelin Trading Co., Limited — Hong Kong Office",
      description:
        "Reach the Zelin Trading team in Tsim Sha Tsui, Hong Kong for business support, key account enquiries and wholesale supply enquiries.",
      canonical: "https://zelinmy.com/contact.html",
      og: "website",
      image: "https://zelinmy.com/images/map.png"
    },
    "/privacy.html": {
      title: "Privacy Policy | Zelin Trading Co., Limited",
      description:
        "How Zelin Trading Co., Limited collects, uses, shares and protects personal data across its website and mobile app, including advertising partners and regional privacy rights.",
      canonical: "https://zelinmy.com/privacy.html",
      og: "website",
      image: "https://zelinmy.com/images/hero.png"
    },
    "/terms.html": {
      title: "Terms of Service | Zelin Trading Co., Limited",
      description:
        "The terms governing use of the Zelin Trading website and mobile management app, including services, acceptable use, intellectual property, purchases and dispute resolution.",
      canonical: "https://zelinmy.com/terms.html",
      og: "website",
      image: "https://zelinmy.com/images/hero.png"
    },
    "/404.html": {
      title: "Page Not Found | Zelin Trading Co., Limited",
      description:
        "The page you requested could not be found. Return to the Zelin Trading Co., Limited homepage.",
      canonical: "https://zelinmy.com/",
      og: "website",
      image: "https://zelinmy.com/images/hero.png"
    }
  };

  /* ---------------------------------------------------------------------
     2. SMALL HELPERS
     --------------------------------------------------------------------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") node.className = attrs[k];
        else if (k === "href") node.setAttribute("href", attrs[k]);
        else node.setAttribute(k, attrs[k]);
      });
    }
    if (html != null) node.innerHTML = html;
    return node;
  }

  function icon(name, cls) {
    return (
      '<svg class="' + (cls || "") + '" aria-hidden="true" focusable="false"><use href="#' +
      name + '"></use></svg>'
    );
  }

  function currentKey() {
    var path = window.location.pathname || "/";
    if (path === "" || path === "/" || path === "/index.html") return "home";
    var file = path.substring(path.lastIndexOf("/") + 1).toLowerCase();
    if (file === "index.html") return "home";
    if (file === "404.html") return "";
    return file.replace(".html", "");
  }

  function isLegal() {
    var key = currentKey();
    return key === "privacy" || key === "terms";
  }

  /* ---------------------------------------------------------------------
     3. HEADER INJECTION  [Reuse-C]
     --------------------------------------------------------------------- */
  function buildHeader() {
    var host = $("#site-header");
    if (!host) return;

    var key = currentKey();

    var links = NAV.map(function (item) {
      var active = item.key === key ? " is-active" : "";
      return '<a class="site-nav__link' + active + '" href="' + item.href + '">' + item.label + "</a>";
    }).join("");

    var mobileLinks = NAV.map(function (item) {
      var active = item.key === key ? " is-active" : "";
      return (
        '<a class="mobile-nav__link' + active + '" href="' + item.href + '">' + item.label +
        icon("arrow-right") + "</a>"
      );
    }).join("");

    host.className = "site-header";
    host.innerHTML =
      '<div class="container site-header__inner">' +
        '<a class="brand" href="./" aria-label="' + SITE.company + ' — home">' +
          icon("logo", "brand__mark") +
          '<span><span class="brand__name"><span>ZELIN</span><span>TRADING</span></span>' +
          '<span class="brand__sub">Hong Kong</span></span>' +
        "</a>" +
        '<nav class="site-nav" aria-label="Primary">' + links + "</nav>" +
        '<div class="header__actions">' +
          '<a class="btn btn--primary btn--sm" href="services.html#app">Get the App' + icon("arrow-right") + "</a>" +
          '<button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="mobile-nav">' +
            icon("menu", "icon-menu") + icon("close", "icon-close") +
          "</button>" +
        "</div>" +
      "</div>" +
      '<div class="mobile-nav" id="mobile-nav">' +
        '<div class="container">' + mobileLinks +
          '<a class="btn btn--primary btn--block mt-5" href="services.html#app">Get the App' + icon("arrow-right") + "</a>" +
        "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------
     4. FOOTER INJECTION  [Reuse-D]
     --------------------------------------------------------------------- */
  function buildFooter() {
    var host = $("#site-footer");
    if (!host) return;

    var year = new Date().getFullYear();

    host.className = "site-footer";
    host.innerHTML =
      '<div class="speedlines" aria-hidden="true"></div>' +
      '<div class="container site-footer__grid">' +
        '<div class="footer-brand">' +
          '<a class="brand" href="./">' + icon("logo", "brand__mark") +
            '<span><span class="brand__name"><span>ZELIN</span><span>TRADING</span></span>' +
            '<span class="brand__sub">Hong Kong</span></span></a>' +
          "<p>Wholesale, retail, import and export, business information consultation and supporting supply chain services — operated from Hong Kong for customers worldwide.</p>" +
        "</div>" +
        '<div class="footer-col"><h4>Company</h4><ul>' +
          "<li><a href=\"/services.html\">Services</a></li>" +
          "<li><a href=\"/culture.html\">Culture</a></li>" +
          "<li><a href=\"/news.html\">News</a></li>" +
          "<li><a href=\"/contact.html\">Contact</a></li>" +
        "</ul></div>" +
        '<div class="footer-col"><h4>Services</h4><ul>' +
          "<li><a href=\"/services.html#daily-necessities\">Daily necessities</a></li>" +
          "<li><a href=\"/services.html#hardware\">Hardware products</a></li>" +
          "<li><a href=\"/services.html#household\">Household goods</a></li>" +
          "<li><a href=\"/services.html#electronics\">Electronic products</a></li>" +
          "<li><a href=\"/services.html#textiles\">Textiles &amp; garments</a></li>" +
          "<li><a href=\"/services.html#app\">Mobile management app</a></li>" +
        "</ul></div>" +
        '<div class="footer-col"><h4>Company details</h4>' +
          '<dl class="footer-info">' +
            "<dt>Company</dt><dd>" + SITE.company + "</dd>" +
            "<dt>Office</dt><dd>" + SITE.address + "</dd>" +
            "<dt>Website</dt><dd>" + SITE.website + "</dd>" +
            "<dt>Business support</dt><dd><a href=\"mailto:" + SITE.emailSupport + '">' + SITE.emailSupport + "</a></dd>" +
            "<dt>Key accounts</dt><dd><a href=\"mailto:" + SITE.emailAccount + '">' + SITE.emailAccount + "</a></dd>" +
          "</dl>" +
        "</div>" +
      "</div>" +
      '<div class="container site-footer__bottom">' +
        "<span>&copy; " + year + " " + SITE.company + ". All rights reserved.</span>" +
        '<div class="footer-legal">' +
          '<a href="privacy.html">Privacy Policy</a>' +
          '<a href="terms.html">Terms of Service</a>' +
          '<a href="contact.html">Contact</a>' +
        "</div>" +
      "</div>";
  }

  /* ---------------------------------------------------------------------
     5. SEO APPLICATION + JSON-LD  [Reuse-F]
     --------------------------------------------------------------------- */
  function applySEO() {
    var path = window.location.pathname || "/";
    var key = path;
    var entry = SEO[key];

    if (!entry) {
      var name = path.substring(path.lastIndexOf("/") + 1).toLowerCase();
      entry = SEO["/" + name] || SEO["/"];
    }
    if (!entry) return;

    document.title = entry.title;

    function setMeta(attr, keyName, content) {
      var selector = 'meta[' + attr + '="' + keyName + '"]';
      var tag = document.head.querySelector(selector);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, keyName);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    }

    setMeta("name", "description", entry.description);
    setMeta("name", "robots", "index, follow");

    var canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", entry.canonical);

    setMeta("property", "og:site_name", SITE.company);
    setMeta("property", "og:type", entry.og || "website");
    setMeta("property", "og:title", entry.title);
    setMeta("property", "og:description", entry.description);
    setMeta("property", "og:url", entry.canonical);
    setMeta("property", "og:locale", "en_US");
    setMeta("property", "og:image", entry.image);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", entry.title);
    setMeta("name", "twitter:description", entry.description);
    setMeta("name", "twitter:image", entry.image);

    injectJsonLd();
  }

  function injectJsonLd() {
    if (document.getElementById("jsonld-organization")) return;

    var data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": SITE.origin + "/#organization",
      name: SITE.company,
      url: SITE.origin + "/",
      logo: SITE.origin + "/images/hero.png",
      description:
        "Wholesale and retail of daily necessities, hardware products, household goods, electronic products, textiles and garments; import and export of goods and technology; business information consultation; supporting supply chain services; general trade (excluding regulated businesses such as finance, insurance and lending).",
      email: SITE.emailSupport,
      telephone: SITE.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: "RM 701, UNIT 108, 7/F, TWR B NEW MANDARIN PLAZA, 14 SCIENCE MUSEUM RD",
        addressLocality: "TSIM SHA TSUI",
        addressRegion: "Hong Kong",
        addressCountry: "HK"
      },
      areaServed: "Worldwide",
      sameAs: ["https://" + SITE.website + "/"]
    };

    var script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "jsonld-organization";
    script.textContent = JSON.stringify(data, null, 2);
    document.head.appendChild(script);
  }

  /* ---------------------------------------------------------------------
     6. SPRITE LOADING + MASCOT RESOLUTION  [Reuse-E]
     --------------------------------------------------------------------- */
  function loadSprite() {
    if (!("fetch" in window)) {
      loadSpriteByXhr();
      return;
    }

    fetch(SITE.spriteUrl, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then(function (markup) {
        installSprite(markup);
      })
      .catch(function () {
        loadSpriteByXhr();
      });
  }

  /* Second chance: some browsers block fetch() for local files but allow a
     same-directory XMLHttpRequest. */
  function loadSpriteByXhr() {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", SITE.spriteUrl, true);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
          installSprite(xhr.responseText);
        } else {
          spriteMissing();
        }
      };
      xhr.onerror = spriteMissing;
      xhr.ontimeout = spriteMissing;
      xhr.send();
    } catch (e) {
      spriteMissing();
    }
  }

  function installSprite(markup) {
    try {
      var holder = document.createElement("div");
      holder.style.display = "none";
      holder.setAttribute("aria-hidden", "true");
      holder.innerHTML = markup;
      var svg = holder.querySelector("svg");
      if (!svg) throw new Error("no svg root");

      var existing = document.getElementById("site-sprite");
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

      svg.setAttribute("id", "site-sprite");
      svg.setAttribute("aria-hidden", "true");
      svg.style.display = "none";
      document.body.insertBefore(svg, document.body.firstChild);

      document.documentElement.classList.remove("sprite-missing");
      hydrateMascots(false);
      document.dispatchEvent(new CustomEvent("sprite:ready"));
    } catch (e) {
      spriteMissing();
    }
  }

  /* Last resort: no sprite at all (typically a file:// preview, where the
     browser refuses to fetch a local sibling file). Draw geometric
     placeholders so nothing is left as an invisible hole. */
  function spriteMissing() {
    document.documentElement.classList.add("sprite-missing");
    hydrateMascots(true);
    if (window.console && console.warn) {
      console.warn(
        "[Zelin] SVG sprite could not be loaded (" + SITE.spriteUrl + "). " +
        "Icons fall back to placeholders. Preview over HTTP for the full set " +
        "(e.g. node preview-server.mjs)."
      );
    }
  }

  function hydrateMascots(failed) {
    $$("[data-mascot]").forEach(function (node) {
      if (node.getAttribute("data-mascot-ready") === "1") return;
      var name = node.getAttribute("data-mascot");
      node.setAttribute("data-mascot-ready", "1");

      var sizeClass = "";
      if (node.classList.contains("mascot--lg")) sizeClass = " mascot--lg";
      else if (node.classList.contains("mascot--xl")) sizeClass = " mascot--xl";
      else if (node.classList.contains("mascot--sm")) sizeClass = " mascot--sm";

      if (failed) {
        node.innerHTML =
          '<span class="mascot' + sizeClass + '" aria-hidden="true">&#9786;</span>';
        return;
      }

      node.innerHTML =
        '<span class="mascot' + sizeClass + '"><svg class="mascot-svg" viewBox="0 0 64 64" ' +
        'aria-hidden="true" focusable="false"><use href="#' + name + '"></use></svg></span>';
    });
  }

  /* ---------------------------------------------------------------------
     7. REVEAL OBSERVERS  [Reuse-G]
     --------------------------------------------------------------------- */
  function initReveal() {
    var targets = $$(".reveal, .fade-up, .fade-in, .slide-left, .slide-right, .zoom-in, .stagger");

    function show(t) {
      t.classList.add("in");
    }

    if (!("IntersectionObserver" in window)) {
      targets.forEach(show);
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          show(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach(function (t) { observer.observe(t); });

    /* Backstop: content must never stay invisible because the observer did
       not fire. Any target that is inside the viewport is revealed on a
       scroll / resize sweep regardless of the observer. */
    function sweep() {
      var h = window.innerHeight || document.documentElement.clientHeight;
      targets.forEach(function (t) {
        if (t.classList.contains("in")) return;
        var r = t.getBoundingClientRect();
        if (r.top < h * 0.92 && r.bottom > 0) {
          show(t);
          try { observer.unobserve(t); } catch (e) { /* already unobserved */ }
        }
      });
    }

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          sweep();
          ticking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", sweep, { passive: true });

    sweep();
    window.setTimeout(sweep, 300);
    window.setTimeout(sweep, 1200);
  }

  /* ---------------------------------------------------------------------
     8. NAVIGATION TOGGLE + SMOOTH SCROLL + HEADER STATE
     --------------------------------------------------------------------- */
  function initNavigation() {
    var toggle = $(".nav-toggle");
    var panel = $("#mobile-nav");

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var open = panel.classList.toggle("is-open");
        toggle.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        document.body.style.overflow = open ? "hidden" : "";
      });

      $$(".mobile-nav__link", panel).forEach(function (link) {
        link.addEventListener("click", function () {
          panel.classList.remove("is-open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        });
      });

      window.addEventListener("resize", function () {
        if (window.innerWidth > 768 && panel.classList.contains("is-open")) {
          panel.classList.remove("is-open");
          toggle.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          document.body.style.overflow = "";
        }
      });
    }

    var header = $(".site-header");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("is-scrolled", window.scrollY > 12);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    $$('a[href^="#"]').forEach(function (anchor) {
      var href = anchor.getAttribute("href");
      if (!href || href === "#" || href.length < 2) return;
      var target = document.querySelector(href);
      if (!target) return;
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({ top: top, behavior: "smooth" });
        if (history.replaceState) history.replaceState(null, "", href);
      });
    });
  }

  /* ---------------------------------------------------------------------
     9. BACK TO TOP
     --------------------------------------------------------------------- */
  function initBackToTop() {
    var host = $(".back-top");
    if (!host) {
      host = el("button", { class: "back-top", type: "button", "aria-label": "Back to top" });
      host.innerHTML = icon("arrow-up");
      document.body.appendChild(host);
    }

    host.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    window.addEventListener(
      "scroll",
      function () {
        host.classList.toggle("is-visible", window.scrollY > 460);
      },
      { passive: true }
    );
  }

  /* ---------------------------------------------------------------------
     10. NEWS FILTER + PAGINATION
     --------------------------------------------------------------------- */
  function initNews() {
    var filters = $$("[data-filter]");
    var cards = $$("[data-category]");
    var pager = $("[data-pagination]");
    if (!filters.length || !cards.length) return;

    var active = "all";
    var perPage = 4;
    var page = 1;

    function apply(resetPage) {
      if (resetPage) page = 1;

      var matched = cards.filter(function (card) {
        var cat = (card.getAttribute("data-category") || "").toLowerCase();
        return active === "all" || cat === active;
      });

      var totalPages = Math.max(1, Math.ceil(matched.length / perPage));
      if (page > totalPages) page = totalPages;

      cards.forEach(function (card) {
        var cat = (card.getAttribute("data-category") || "").toLowerCase();
        var inFilter = active === "all" || cat === active;
        var index = matched.indexOf(card);
        var inPage = inFilter && index >= (page - 1) * perPage && index < page * perPage;
        card.classList.toggle("is-hidden", !inPage);
      });

      renderPager(totalPages);
    }

    function renderPager(totalPages) {
      if (!pager) return;
      var html = '<button type="button" data-page="prev" aria-label="Previous page"' +
        (page === 1 ? " disabled" : "") + ">&lsaquo;</button>";

      for (var i = 1; i <= totalPages; i++) {
        html += '<button type="button" data-page="' + i + '" class="' +
          (i === page ? "is-active" : "") + '">' + i + "</button>";
      }

      html += '<button type="button" data-page="next" aria-label="Next page"' +
        (page === totalPages ? " disabled" : "") + ">&rsaquo;</button>";

      pager.innerHTML = html;

      $$("button", pager).forEach(function (btn) {
        btn.addEventListener("click", function () {
          var value = btn.getAttribute("data-page");
          if (value === "prev") page = Math.max(1, page - 1);
          else if (value === "next") page = Math.min(totalPages, page + 1);
          else page = parseInt(value, 10) || 1;
          apply(false);
          var grid = $(".news-grid");
          if (grid) {
            var top = grid.getBoundingClientRect().top + window.scrollY - 110;
            window.scrollTo({ top: top, behavior: "smooth" });
          }
        });
      });
    }

    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
        active = (btn.getAttribute("data-filter") || "all").toLowerCase();
        apply(true);
      });
    });

    apply(true);
  }

  /* ---------------------------------------------------------------------
     11. CONTACT FORM VALIDATION
     --------------------------------------------------------------------- */
  function initForm() {
    var form = $("[data-contact-form]");
    if (!form) return;

    var status = $("[data-form-status]", form);

    function setError(field, message) {
      var row = field.closest(".form-row");
      if (!row) return;
      var slot = $(".form-error", row);
      if (message) {
        row.classList.add("has-error");
        if (slot) slot.textContent = message;
        field.setAttribute("aria-invalid", "true");
      } else {
        row.classList.remove("has-error");
        field.removeAttribute("aria-invalid");
      }
    }

    function validateField(field) {
      var value = (field.value || "").trim();
      var name = field.getAttribute("name");

      if (field.type === "checkbox") {
        if (field.required && !field.checked) {
          setError(field, "Please confirm before submitting.");
          return false;
        }
        setError(field, "");
        return true;
      }

      if (field.required && !value) {
        setError(field, "This field is required.");
        return false;
      }

      if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        setError(field, "Please enter a valid email address.");
        return false;
      }

      if (name === "message" && value && value.length < 10) {
        setError(field, "Please add a little more detail (10 characters minimum).");
        return false;
      }

      setError(field, "");
      return true;
    }

    var fields = $$("input, textarea, select", form);
    fields.forEach(function (field) {
      field.addEventListener("blur", function () { validateField(field); });
      field.addEventListener("input", function () {
        var row = field.closest(".form-row");
        if (row && row.classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      fields.forEach(function (field) {
        if (!validateField(field)) valid = false;
      });

      if (!valid) {
        if (status) {
          status.hidden = true;
        }
        var firstError = $(".has-error", form);
        if (firstError) {
          var target = $("input, textarea, select", firstError);
          if (target) target.focus({ preventScroll: true });
        }
        return;
      }

      if (status) {
        status.hidden = false;
        status.textContent =
          "Thank you. Your enquiry has been received — our business support team will reply within one business day.";
      }
      form.reset();
    });
  }

  /* ---------------------------------------------------------------------
     12. MISC — legal year, external links, current year spans
     --------------------------------------------------------------------- */
  function initMisc() {
    $$("[data-year]").forEach(function (node) {
      node.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------------------------------------------------------------------
     13. BOOT
     Each step is isolated: a failure in one must never leave the page
     half-initialised (an un-run step previously meant every .reveal element
     stayed at opacity:0 and the whole site rendered blank).
     --------------------------------------------------------------------- */
  function boot() {
    var steps = [
      ["header", buildHeader],
      ["footer", buildFooter],
      ["seo", applySEO],
      ["reveal", initReveal],
      ["navigation", initNavigation],
      ["back-to-top", initBackToTop],
      ["news", initNews],
      ["form", initForm],
      ["misc", initMisc],
      ["sprite", loadSprite]
    ];

    steps.forEach(function (step) {
      try {
        step[1]();
      } catch (err) {
        if (window.console && console.warn) {
          console.warn("[Zelin] init step failed: " + step[0], err);
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
