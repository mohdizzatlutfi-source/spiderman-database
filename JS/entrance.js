// JS/animation.js

document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ENTRANCE HERO ANIMATION (Bila Page Load)
    // ==========================================
    const heroTitle = document.querySelector(".hero-title h1");
    const heroImage = document.querySelector(".hero-image img");
    const actorNames = document.querySelectorAll(".actor-name span");

    if (heroTitle) heroTitle.classList.add("reveal-active");
    if (heroImage) heroImage.classList.add("reveal-active");
    
    actorNames.forEach((span, index) => {
        setTimeout(() => {
            span.classList.add("reveal-active");
        }, 150 * (index + 1));
    });

    // ==========================================
    // 2. SCROLL REVEAL (UNTUK KEDUA-DUA HTML)
    // ==========================================
    const revealOptions = {
        threshold: 0.15, // Ditingkatkan ke 0.15 (15%) supaya elemen pantas muncul sebaik sahaja disentuh scroll
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Munculkan content apabila mula masuk skrin
                entry.target.classList.add("reveal-active");
            } else {
                // KAWALAN KELUAR:
                // Jika elemen terkeluar dari skrin sebelah BAWAH (user scroll naik ke atas semula)
                if (entry.boundingClientRect.top > 0) {
                    entry.target.classList.remove("reveal-active");
                }
            }
        });
    }, revealOptions);

    // Senarai elemen dari INDEX.HTML dan SPIDERMAN 1.HTML
    const selectorList = [
        ".title", 
        ".cast-card", 
        ".movie-card",
        ".hero-container",
        ".production-content",
        ".prod-block",
        ".info-section",
        ".casting-card",
        ".stat-card",
        ".mkt-card",
        ".media-card",
        ".review-quote",
        ".table-responsive"
    ].join(", ");

    // Cari semua elemen terlibat
    const elementsToReveal = document.querySelectorAll(selectorList);
    
    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });
});