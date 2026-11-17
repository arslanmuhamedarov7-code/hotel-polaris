const addSwipeListener = (el, onLeft, onRight) => {
    let startX, startY;
    el.addEventListener('touchstart', e => {
        startX = e.changedTouches[0].screenX;
        startY = e.changedTouches[0].screenY;
    });
    el.addEventListener('touchend', e => {
        const endX = e.changedTouches[0].screenX;
        const endY = e.changedTouches[0].screenY;
        const dx = endX - startX;
        const dy = endY - startY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            dx > 0 ? onRight?.() : onLeft?.();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Hero slider
    const slides = document.querySelectorAll('#index-hero .background .bg');
    let i = 0;
    slides.length && setInterval(() => {
        slides[i].classList.remove('active');
        slides[i = (i + 1) % slides.length].classList.add('active');
    }, 8000);

    // preview sliders
    document.querySelectorAll('.preview-slider').forEach(slider => {
        const container = slider.querySelector('.container');
        const slideFunc = (direction) => {
            container.scrollBy({ left: container.offsetWidth * direction, behavior: 'smooth' });
        };
        slider.querySelector('.arr.left')?.addEventListener('click', () => slideFunc(-1));
        slider.querySelector('.arr.right')?.addEventListener('click', () => slideFunc(1));

        addSwipeListener(container, () => slideFunc(1), () => slideFunc(-1));
    });

    // Services
    const services = document.querySelector('#index-services');
    if (services?.querySelector('.services-menu')) {
        const container = services.querySelector('.items-container');
        const scrollW = container?.offsetWidth || 0;
        const clearActive = sel => services.querySelector(sel)?.classList.remove('active');

        services.querySelectorAll('.services-menu a.link').forEach(link => {
            link.addEventListener('click', () => {
                if (link.classList.contains('active')) return;

                clearActive('.link.active');
                clearActive('.items.active');
                link.classList.add('active');
                container?.scrollBy({ left: 0 });

                const items = services.querySelector(`.items.${link.dataset.for}`);
                items?.classList.add('active');
                if (items) {
                    const total = [...items.querySelectorAll('.item')].reduce((s, el) => s + el.offsetWidth, 0);
                    items.classList.toggle('center', total < items.offsetWidth);
                }
            });
        });

        services.querySelectorAll('.arrow').forEach(btn =>
            btn.addEventListener('click', () =>
                container?.scrollBy({
                    left: btn.classList.contains('left') ? -scrollW : scrollW,
                    behavior: 'smooth'
                })
            )
        );
    }

    // Index booking
    document.querySelector('#index-booking form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const f = e.target;
        const dateFrom = Date.parse(f.querySelector('[name=checkin]').value);
        const dateTo = Date.parse(f.querySelector('[name=checkout]').value);
        let nights = 0;
        if (!isNaN(dateFrom) && !isNaN(dateTo)) {
            nights = Math.ceil((dateTo - dateFrom) / (1000 * 3600 * 24));
        }
        nights = nights < 1 ? 1 : nights;

        const action = f.action;
        const url = new URL(action, window.location.origin);
        if (!isNaN(dateFrom)) {
            url.searchParams.set('date', new Date(dateFrom).toISOString().split('T')[0]);
        }
        url.searchParams.set('nights', nights);

        window.location.href = url.toString();
    });

    // Photo gallery
    const lightbox = GLightbox({ selector: '.photo-gallery' });

    // Mobile layouts
    const mobPlateAdditional = document.querySelector("#mob-plate .additional");
    mobPlateAdditional.querySelector('.social-links .items').appendChild(
        document.querySelector("header .social").cloneNode(true)
    );

    const mobPlateBody = document.querySelector("#mob-plate .body");
    mobPlateBody.appendChild(
        document.querySelector("#top-menu ul").cloneNode(true)
    );

    const mobPlateBottom = document.querySelector("#mob-plate .bottom");
    document.querySelectorAll("#footer .bottom > *").forEach(e => mobPlateBottom.appendChild(e.cloneNode(true)));

    // Mobile menu
    (function () {
        const b = document.querySelector('#mob-menu-btn'), p = document.querySelector('#mob-plate'), o = document.querySelector('#mob-overlay');
        if (!b || !p || !o) return;
        let s = 0, x = 0, y = 0, pos = 0;
        const w = () => innerWidth;
        const gx = () => { let m = p.style.transform.match(/-?\d+\.?\d*/); return m ? +m[0] : s ? 0 : w() };
        const st = a => {
            s = a;
            p.style.transition = 'transform .2s ease';
            p.style.transform = `translateX(${a ? 0 : w()}px)`;
            p.classList.toggle('show', a);
            b.classList.toggle('show', a);
            o.classList.toggle('show', a)
        };
        b.onclick = () => st(!s);
        o.onclick = () => st(0);

        p.addEventListener('touchstart', e => {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
            pos = gx();
            p.style.transition = 'none'
        }, { passive: true });

        p.addEventListener('touchmove', e => {
            let t = e.touches[0], dx = t.clientX - x, dy = t.clientY - y;
            if (Math.abs(dy) > Math.abs(dx)) return;
            p.style.transform = `translateX(${Math.max(0, Math.min(w(), pos + dx))}px)`;
            if (e.cancelable) e.preventDefault()
        }, { passive: false });

        p.addEventListener('touchend', e => {
            let dx = e.changedTouches[0].clientX - x;
            p.style.transition = 'transform .2s ease';
            st(Math.abs(dx) > 10 ? gx() < w() / 2 : s)
        }, { passive: true });

        onresize = () => st(s);
        st(0)
    })();
});

// Language switch: keep the current query string (e.g. a pre-selected room).
document.addEventListener("DOMContentLoaded", () => {
    const search = window.location.search;
    if (!search) return;
    document.querySelectorAll(".lang-switch a[data-lang]").forEach(link => {
        const href = link.getAttribute("href");
        if (href && href.indexOf("?") === -1) link.setAttribute("href", href + search);
    });
});

// Booking widget (Travelline): keep the whole form visible on phones.
// The widget sets a short fixed height and scrolling="no" on its iframe,
// so on a narrow screen the lower half of the form gets cut off.
(function () {
    const box = document.getElementById("tl-booking-form");
    if (!box) return;

    let attempts = 0;
    const fix = () => {
        if (window.innerWidth > 768) return;
        box.querySelectorAll("iframe").forEach(frame => {
            const rect = frame.getBoundingClientRect();
            const style = getComputedStyle(frame);
            // Ignore the hidden measuring frames the widget creates.
            if (style.display === "none" || style.opacity === "0") return;
            if (rect.width < 100 || rect.height < 10) return;
            frame.setAttribute("scrolling", "yes");
            frame.style.setProperty("width", "100%", "important");
            frame.style.setProperty("min-width", "0", "important");
            frame.style.setProperty("max-width", "100%", "important");
            frame.style.setProperty("height", "900px", "important");
            frame.style.setProperty("min-height", "900px", "important");
        });
    };

    const timer = setInterval(() => {
        fix();
        if (++attempts > 60) clearInterval(timer);
    }, 500);
    window.addEventListener("resize", () => {
        attempts = 0;
        fix();
    });
})();
