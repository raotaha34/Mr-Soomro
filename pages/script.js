(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Sticky navbar appearance on scroll */
  var navbar = document.getElementById("navbar") || document.getElementById("mainNav");
  var lastScroll = 0;
  function onScroll() {
    var scrolled = window.scrollY > 12;
    if (navbar) {
      navbar.classList.toggle("is-scrolled", scrolled);
      navbar.classList.toggle("scr", scrolled);
      navbar.classList.toggle("scrolled", scrolled);
      if (navbar.classList.contains("site-navbar") && window.innerWidth > 900) {
        if (window.scrollY <= 100 || window.scrollY < lastScroll) navbar.classList.remove("collapsed");
        else if (window.scrollY > 200) navbar.classList.add("collapsed");
      } else if (navbar.classList.contains("site-navbar")) {
        navbar.classList.remove("collapsed");
      }
    }
    lastScroll = window.scrollY;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (navbar) {
    navbar.addEventListener("mouseenter", function () {
      if (window.innerWidth > 900) navbar.classList.remove("collapsed");
    });
  }

  /* Normalize primary navbar destinations for every page depth */
  var pagePath = window.location.pathname.replace(/\\/g, "/");
  var rootPrefix = pagePath.indexOf("/pages/blog/") !== -1 || pagePath.indexOf("/pages/") !== -1 || pagePath.indexOf("/Services/") !== -1 ? "../" : "";
  if (pagePath.indexOf("/pages/blog/") !== -1) rootPrefix = "../../";
  var isBlogPage = pagePath.indexOf("/pages/blog/") !== -1;
  var isServicePage = pagePath.indexOf("/Services/") !== -1;
  var isServicesLanding = /\/pages\/services\.html$/i.test(pagePath);

  /* Use the services page navbar consistently across the rest of the site. */
  var legacyNav = document.getElementById("mainNav") || document.getElementById("navbar");
  if (legacyNav && !legacyNav.querySelector(".nav-container")) {
    legacyNav.id = "navbar";
    legacyNav.className = "navbar site-navbar";
    var navHost = legacyNav.closest("header");
    if (navHost) navHost.classList.add("site-navbar-host");
    var servicesPage = rootPrefix + "pages/services.html";
    legacyNav.innerHTML = '<div class="nav-container">' +
      '<a href="' + rootPrefix + 'index.html" class="nav-logo">' +
      '<div class="nav-logo-icon"><i class="fas fa-chart-line"></i></div>' +
      '<div class="nav-logo-text-wrap"><div class="nav-logo-text">Mr <span>Soomro</span></div><div class="nav-logo-sub">Digital Marketing Expert</div></div>' +
      '</a>' +
      '<ul class="nav-links">' +
      '<li><a href="' + rootPrefix + 'pages/about.html">About</a></li>' +
      '<li><a href="' + servicesPage + '">Services</a></li>' +
      '<li><a href="' + servicesPage + '#process">Process</a></li>' +
      '<li><a href="' + rootPrefix + 'pages/reviews.html">Reviews</a></li>' +
      (isBlogPage ? '' : '<li><a href="' + servicesPage + '#faq">FAQ</a></li>') +
      '</ul>' +
      '<a href="' + rootPrefix + 'index.html#contact" class="nav-cta">Free Audit</a>' +
      '<button class="mobile-toggle" type="button" aria-label="Open menu"><i class="fas fa-bars"></i></button>' +
      '<div class="mobile-menu">' +
      '<a href="' + rootPrefix + 'pages/about.html">About</a>' +
      '<a href="' + servicesPage + '">Services</a>' +
      '<a href="' + servicesPage + '#process">Process</a>' +
      '<a href="' + rootPrefix + 'pages/reviews.html">Reviews</a>' +
      (isBlogPage ? '' : '<a href="' + servicesPage + '#faq">FAQ</a>') +
      '<a href="' + rootPrefix + 'index.html#contact" class="nav-cta">Free SEO Audit</a>' +
      '</div></div>';
    var sharedMobileToggle = legacyNav.querySelector(".mobile-toggle");
    var sharedMobileMenu = legacyNav.querySelector(".mobile-menu");
    sharedMobileToggle.addEventListener("click", function () {
      sharedMobileMenu.classList.toggle("active");
      sharedMobileToggle.querySelector("i").classList.toggle("fa-bars");
      sharedMobileToggle.querySelector("i").classList.toggle("fa-times");
    });
    onScroll();
  }

  var primaryNavTargets = {
    home: rootPrefix + "index.html",
    about: rootPrefix + "pages/about.html",
    services: rootPrefix + "pages/services.html",
    process: isServicePage || isServicesLanding ? rootPrefix + "pages/services.html#process" : rootPrefix + "index.html#process",
    reviews: rootPrefix + "pages/reviews.html",
    faq: rootPrefix + "pages/services.html#faq",
    blog: rootPrefix + "pages/blogs.html",
    contact: rootPrefix + "index.html#contact"
  };
  document.querySelectorAll("#mainNav a, #navbar a, .mnav-links a, .nav-links a").forEach(function (link) {
    var label = link.textContent.trim().toLowerCase();
    var targetKey = label === "home" ? "home" : label === "about" ? "about" : label === "services" ? "services" : label === "process" ? "process" : label === "reviews" ? "reviews" : label === "faq" ? "faq" : label === "blog" ? "blog" : label === "contact" || label === "free seo audit" ? "contact" : null;
    if (targetKey) link.setAttribute("href", primaryNavTargets[targetKey]);
  });

  /* Keep the current top-level section visibly active. */
  var activeNavLabel = isServicePage || isServicesLanding ? "services" :
    /\/pages\/about\.html$/i.test(pagePath) ? "about" :
    /\/pages\/reviews\.html$/i.test(pagePath) ? "reviews" :
    /\/pages\/blogs\.html$/i.test(pagePath) || isBlogPage ? "blog" : "";
  if (activeNavLabel) {
    document.querySelectorAll("#navbar .nav-links a").forEach(function (link) {
      link.classList.toggle("active", link.textContent.trim().toLowerCase() === activeNavLabel);
    });
  }

  /* Add the shared service assistant where a page does not already provide it. */
  if (!document.getElementById("chatbotBtn")) {
    document.body.insertAdjacentHTML("beforeend", '<button class="chatbot-btn" id="chatbotBtn" type="button" aria-label="Open AI Assistant"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/></svg><span class="chatbot-badge">1</span></button><div class="chatbot-window" id="chatbotWindow"><div class="chatbot-header"><div class="chatbot-header-info"><div class="chatbot-avatar"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/></svg></div><div><div class="chatbot-name">Soomro AI Assistant</div><div class="chatbot-status">Online - Ready to help</div></div></div><button class="chatbot-close" type="button" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div><div class="chatbot-messages" id="chatMessages"><div class="chat-message bot"><div class="chat-msg-avatar bot">AI</div><div class="chat-msg-bubble">Hi! I am the Mr. Soomro AI Assistant. How can I help with your SEO today?</div></div><div class="chat-suggestions"><button class="chat-suggestion" type="button" data-chat="Tell me about your SEO services">Our SEO Services</button><button class="chat-suggestion" type="button" data-chat="How much does SEO cost?">Pricing</button><button class="chat-suggestion" type="button" data-chat="I need a free SEO audit">Free SEO Audit</button><button class="chat-suggestion" type="button" data-chat="How long does SEO take?">Timeline</button></div></div><div class="chatbot-input-wrap"><input class="chatbot-input" id="chatInput" type="text" placeholder="Type your question..." aria-label="Chat message"><button class="chatbot-send" type="button" aria-label="Send message"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg></button></div><div class="chatbot-footer">Powered by <strong>Mr. Soomro AI</strong></div></div>');
    var sharedChatButton = document.getElementById("chatbotBtn");
    var sharedChatWindow = document.getElementById("chatbotWindow");
    var sharedChatInput = document.getElementById("chatInput");
    var sharedChatMessages = document.getElementById("chatMessages");
    var addSharedMessage = function (text, sender) { var row = document.createElement("div"); row.className = "chat-message " + sender; var avatar = document.createElement("div"); avatar.className = "chat-msg-avatar " + sender; avatar.textContent = sender === "bot" ? "AI" : "You"; var bubble = document.createElement("div"); bubble.className = "chat-msg-bubble"; bubble.textContent = text; row.append(avatar, bubble); sharedChatMessages.appendChild(row); sharedChatMessages.scrollTop = sharedChatMessages.scrollHeight; };
    var addTypingIndicator = function () { var typing = document.createElement("div"); typing.className = "chat-message bot typing"; typing.innerHTML = '<div class="chat-msg-avatar bot">AI</div><div class="chat-msg-bubble">...</div>'; sharedChatMessages.appendChild(typing); sharedChatMessages.scrollTop = sharedChatMessages.scrollHeight; return typing; };
    var sendSharedMessage = async function () { 
      var text = sharedChatInput.value.trim(); 
      if (!text) return; 
      addSharedMessage(text, "user"); 
      sharedChatInput.value = ""; 
      var suggestions = sharedChatMessages.querySelector(".chat-suggestions"); 
      if (suggestions) suggestions.remove(); 
      var typing = addTypingIndicator();
      try {
        var response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text })
        });
        var data = await response.json();
        typing.remove();
        if (response.ok) {
          addSharedMessage(data.answer, "bot");
          if (data.sources && data.sources.length > 0) {
            var sourcesDiv = document.createElement("div");
            sourcesDiv.className = "chat-message bot";
            sourcesDiv.innerHTML = '<div class="chat-msg-avatar bot">AI</div><div class="chat-msg-bubble" style="font-size: 11px; opacity: 0.7;">Sources: ' + data.sources.join(", ") + '</div>';
            sharedChatMessages.appendChild(sourcesDiv);
            sharedChatMessages.scrollTop = sharedChatMessages.scrollHeight;
          }
        } else {
          addSharedMessage(data.error || "Sorry, I couldn't process your request. Please try again.", "bot");
        }
      } catch (error) {
        typing.remove();
        addSharedMessage("Unable to connect to the AI service. Please make sure the server is running.", "bot");
      }
    };
    sharedChatButton.addEventListener("click", function () { sharedChatWindow.classList.add("open"); sharedChatButton.querySelector(".chatbot-badge").style.display = "none"; sharedChatInput.focus(); });
    sharedChatWindow.querySelector(".chatbot-close").addEventListener("click", function () { sharedChatWindow.classList.remove("open"); });
    sharedChatWindow.querySelector(".chatbot-send").addEventListener("click", sendSharedMessage);
    sharedChatInput.addEventListener("keydown", function (event) { if (event.key === "Enter") sendSharedMessage(); });
    sharedChatWindow.querySelectorAll("[data-chat]").forEach(function (button) { button.addEventListener("click", function () { sharedChatInput.value = button.getAttribute("data-chat"); sendSharedMessage(); }); });
  }

  var sitePageTargets = {
    "index.html": rootPrefix + "index.html",
    "about.html": rootPrefix + "pages/about.html",
    "services.html": rootPrefix + "pages/services.html",
    "blogs.html": rootPrefix + "pages/blogs.html",
    "reviews.html": rootPrefix + "pages/reviews.html",
    "privacy.html": rootPrefix + "pages/privacy.html",
    "terms.html": rootPrefix + "pages/terms.html",
    "cookie-policy.html": rootPrefix + "pages/cookie-policy.html"
  };
  document.querySelectorAll("a[href]").forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || /^(https?:|mailto:|tel:|javascript:|data:|#|\/\/)/i.test(href)) return;
    var parts = href.split("#");
    var fileName = parts[0].split("?")[0].split("/").pop().toLowerCase();
    if (!sitePageTargets[fileName]) return;
    link.setAttribute("href", sitePageTargets[fileName] + (parts[1] ? "#" + parts[1] : ""));
  });

  /* Scroll to top button */
  var scrollTopBtn = document.getElementById('scrollTop') || document.getElementById('backToTop');
  if (!scrollTopBtn) {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scrollTop';
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.type = 'button';
    scrollTopBtn.setAttribute('aria-label', 'Back to top');
    scrollTopBtn.innerHTML = '<span aria-hidden="true">&#8593;</span>';
    document.body.appendChild(scrollTopBtn);
  }
  function updateScrollTop() {
    var visible = window.scrollY > 500;
    scrollTopBtn.classList.toggle('visible', visible);
    scrollTopBtn.classList.toggle('show', visible);
    scrollTopBtn.style.setProperty('opacity', visible ? '1' : '0', 'important');
    scrollTopBtn.style.setProperty('visibility', visible ? 'visible' : 'hidden', 'important');
    scrollTopBtn.style.setProperty('transform', visible ? 'translateY(0)' : 'translateY(12px)', 'important');
  }
  window.addEventListener('scroll', updateScrollTop, { passive: true });
  updateScrollTop();
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* Mobile menu */
  var burgerBtn = document.getElementById("burgerBtn") || document.getElementById("burger");
  var mobileMenu = document.getElementById("mobileMenu") || document.getElementById("mobNav");
  var mobileCloseBtn = document.getElementById("mobileCloseBtn");

  function openMenu() {
    mobileMenu.classList.add("is-open");
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    burgerBtn.classList.add("open");
    burgerBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    mobileMenu.classList.remove("is-open");
    mobileMenu.classList.remove("open");
    burgerBtn.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    burgerBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (burgerBtn && mobileMenu && (burgerBtn.id === "burgerBtn" || document.body.hasAttribute("data-shared-mobile-nav"))) {
    burgerBtn.addEventListener("click", function () {
      if (mobileMenu.classList.contains("is-open") || mobileMenu.classList.contains("open")) closeMenu();
      else openMenu();
    });
    if (mobileCloseBtn) mobileCloseBtn.addEventListener("click", closeMenu);
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu && (mobileMenu.classList.contains("is-open") || mobileMenu.classList.contains("open"))) closeMenu();
  });

  /* Smooth anchor scrolling (native scroll-behavior already handles most; ensure focus for a11y) */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });

  /* Active navigation link on scroll */
  var navLinks = document.querySelectorAll(".navbar__nav a");
  var sections = Array.prototype.map.call(navLinks, function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);

  function updateActiveLink() {
    if (!navLinks.length || !sections.length) return;
    var scrollPos = window.scrollY + 120;
    var current = sections[0];
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(function (link) {
      link.classList.toggle("is-active", link.getAttribute("href") === "#" + current.id);
    });
  }
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  updateActiveLink();

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry, i) {
          if (entry.isIntersecting) {
            var el = entry.target;
            setTimeout(function () {
              el.classList.add("is-visible");
            }, (i % 6) * 60);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Animated counters */
  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion || target === 0) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1200;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var counterIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (c) {
      counterIo.observe(c);
    });
  } else {
    counters.forEach(animateCounter);
  }

  /* FAQ accordion */
  var triggers = document.querySelectorAll(".accordion__trigger");
  triggers.forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var item = trigger.closest(".accordion__item");
      var panel = item.querySelector(".accordion__panel");
      var isOpen = trigger.getAttribute("aria-expanded") === "true";

      triggers.forEach(function (t) {
        if (t !== trigger) {
          t.setAttribute("aria-expanded", "false");
          t.closest(".accordion__item").querySelector(".accordion__panel").style.maxHeight = null;
        }
      });

      if (isOpen) {
        trigger.setAttribute("aria-expanded", "false");
        panel.style.maxHeight = null;
      } else {
        trigger.setAttribute("aria-expanded", "true");
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
})();