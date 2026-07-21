document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    // 1. Cipta Kawalan Carian (Anak Panah, Counter & Butang Pangkah)
    let searchNav = document.querySelector('.search-nav-controls');
    if (!searchNav) {
        searchNav = document.createElement('div');
        searchNav.className = 'search-nav-controls';
        searchNav.style.cssText = 'display:none; align-items:center; gap:5px; margin-left:8px;';
        
        searchNav.innerHTML = `
            <span id="searchCounter" style="color:#e5a93b; font-weight:bold; font-size:12px; min-width:30px; text-align:center;">0/0</span>
            <button id="prevSearchBtn" type="button" title="Sebelumnya" style="background:#222; color:#fff; border:1px solid #555; border-radius:50%; width:22px; height:22px; cursor:pointer; font-size:10px; display:flex; align-items:center; justify-content:center; padding:0;">▲</button>
            <button id="nextSearchBtn" type="button" title="Seterusnya" style="background:#222; color:#fff; border:1px solid #555; border-radius:50%; width:22px; height:22px; cursor:pointer; font-size:10px; display:flex; align-items:center; justify-content:center; padding:0;">▼</button>
            <button id="clearSearchBtn" type="button" title="Tutup Carian" style="background:#d61f22; color:#fff; border:none; border-radius:50%; width:22px; height:22px; cursor:pointer; font-size:11px; font-weight:bold; display:flex; align-items:center; justify-content:center; padding:0; margin-left:2px;">✖</button>
        `;

        searchInput.parentNode.appendChild(searchNav);
    }

    const counterSpan = document.getElementById('searchCounter');
    const prevBtn = document.getElementById('prevSearchBtn');
    const nextBtn = document.getElementById('nextSearchBtn');
    const clearBtn = document.getElementById('clearSearchBtn');

    let matches = [];
    let currentIndex = -1;
    let lastQuery = "";

    // 2. FUNGSI PADAM HIGHLIGHT & RESET CARIAN
    function clearHighlights() {
        const highlighted = document.querySelectorAll('.spidey-highlight');
        highlighted.forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize(); // Cantumkan semula pecahan text node
        });
        matches = [];
        currentIndex = -1;
        lastQuery = "";
        searchInput.value = ""; // Kosongkan petak carian
        searchNav.style.display = 'none'; // Sembunyikan kawalan
    }

    // 3. FUNGSI HIGHLIGHT SEMUA PERKATAAN
    function highlightAll(text) {
        // Bersihkan carian lama tanpa memadam input baharu
        const highlighted = document.querySelectorAll('.spidey-highlight');
        highlighted.forEach(el => {
            const parent = el.parentNode;
            parent.replaceChild(document.createTextNode(el.textContent), el);
            parent.normalize();
        });
        matches = [];
        currentIndex = -1;

        if (!text) {
            searchNav.style.display = 'none';
            return;
        }

        lastQuery = text;

        // Kawasan Carian Utama sahaja
        const targetContainers = document.querySelectorAll('main, section, .leftcontent, .production-box');

        targetContainers.forEach(container => {
            const walk = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
            let node;
            const nodesToReplace = [];

            while (node = walk.nextNode()) {
                const parentTag = node.parentNode.tagName;
                if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || parentTag === 'INPUT' || parentTag === 'TEXTAREA') {
                    continue;
                }

                if (node.nodeValue.toLowerCase().includes(text)) {
                    nodesToReplace.push(node);
                }
            }

            nodesToReplace.forEach(node => {
                const regex = new RegExp(`(${text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
                const span = document.createElement('span');
                span.innerHTML = node.nodeValue.replace(regex, '<mark class="spidey-highlight">$1</mark>');
                node.parentNode.replaceChild(span, node);
            });
        });

        matches = Array.from(document.querySelectorAll('.spidey-highlight'));

        if (matches.length > 0) {
            currentIndex = 0;
            searchNav.style.display = 'inline-flex';
            updateNavigation();
        } else {
            searchNav.style.display = 'none';
            alert(`Perkataan "${text}" tidak dijumpai!`);
        }
    }

    // 4. FUNGSI SKROL & HOVER KPD PERKATAAN AKTIF
    function updateNavigation() {
        if (matches.length === 0) return;

        matches.forEach(m => {
            m.style.backgroundColor = '#ffeb3b';
            m.style.color = '#000';
            m.style.outline = 'none';
            m.style.boxShadow = 'none';
        });

        const activeMatch = matches[currentIndex];
        activeMatch.style.backgroundColor = '#d61f22';
        activeMatch.style.color = '#ffffff';
        activeMatch.style.outline = '2px solid #ffffff';
        activeMatch.style.borderRadius = '3px';
        activeMatch.style.boxShadow = '0 0 10px #d61f22';

        counterSpan.textContent = `${currentIndex + 1}/${matches.length}`;

        activeMatch.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    }

    // 5. EVENT LISTENERS
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = searchInput.value.toLowerCase().trim();

            if (query === "") {
                clearHighlights();
                return;
            }

            if (query === lastQuery && matches.length > 0) {
                currentIndex = (currentIndex + 1) % matches.length;
                updateNavigation();
            } else {
                highlightAll(query);
            }
        }
    });

    searchInput.addEventListener('input', function () {
        if (this.value.trim() === "") {
            clearHighlights();
        }
    });

    // Butang Next
    nextBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (matches.length > 0) {
            currentIndex = (currentIndex + 1) % matches.length;
            updateNavigation();
        }
    });

    // Butang Prev
    prevBtn.addEventListener('click', function (e) {
        e.preventDefault();
        if (matches.length > 0) {
            currentIndex = (currentIndex - 1 + matches.length) % matches.length;
            updateNavigation();
        }
    });

    // Butang Pangkah (Clear Search)
    clearBtn.addEventListener('click', function (e) {
        e.preventDefault();
        clearHighlights();
    });
});