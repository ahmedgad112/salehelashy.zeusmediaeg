
/* ==========================================================
   DIKURAT
   Main JavaScript
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
       ELEMENTS
       ====================================================== */

    const body = document.body;

    const loader =
        document.querySelector(".page-loader");

    const header =
        document.querySelector(".site-header");

    const scrollProgress =
        document.querySelector(".scroll-progress");

    const mobileMenuBtn =
        document.querySelector(".mobile-menu-btn");

    const mobileMenu =
        document.querySelector(".mobile-menu");

    const navLinks =
        document.querySelectorAll(
            ".desktop-nav .nav-link"
        );

    const mobileLinks =
        document.querySelectorAll(
            ".mobile-menu a"
        );

    const revealElements =
        document.querySelectorAll(".reveal");

    const projectsGrid =
        document.querySelector("#projectsGrid");

    const loadMoreBtn =
        document.querySelector("#loadMoreBtn");

    const lightbox =
        document.querySelector("#lightbox");

    const lightboxImage =
        document.querySelector(".lightbox-image");

    const lightboxClose =
        document.querySelector(".lightbox-close");

    const lightboxPrev =
        document.querySelector(".lightbox-prev");

    const lightboxNext =
        document.querySelector(".lightbox-next");

    const lightboxCounter =
        document.querySelector("#lightboxCounter");


    /* ======================================================
       SETTINGS
       ====================================================== */

    const TOTAL_IMAGES = 23;

    const INITIAL_IMAGES = 6;

    const IMAGES_PER_LOAD = 6;

    let visibleImages = INITIAL_IMAGES;

    let currentImage = 0;

    let touchStartX = 0;

    let touchEndX = 0;


    /* ======================================================
       PROJECT DATA
       ====================================================== */

    const projects = Array.from(
        { length: TOTAL_IMAGES },
        (_, index) => {

            const number = index + 1;

            return {
                number,
                src: `images/${number}.jpg`,
                alt: `مشروع ديكور رقم ${number}`
            };

        }
    );


    /* ======================================================
       PAGE LOADER
       ====================================================== */

    window.addEventListener("load", () => {

        setTimeout(() => {

            loader?.classList.add("loaded");

        }, 400);

    });


    /* ======================================================
       HEADER SCROLL
       ====================================================== */

    function handleScroll() {

        const scrollY =
            window.scrollY;

        if (scrollY > 30) {

            header?.classList.add(
                "scrolled"
            );

        } else {

            header?.classList.remove(
                "scrolled"
            );

        }


        /* Scroll progress */

        if (scrollProgress) {

            const documentHeight =
                document.documentElement.scrollHeight -
                window.innerHeight;

            const progress =
                documentHeight > 0
                    ? (scrollY / documentHeight) * 100
                    : 0;

            scrollProgress.style.width =
                `${progress}%`;

        }

    }

    window.addEventListener(
        "scroll",
        handleScroll,
        { passive: true }
    );

    handleScroll();


    /* ======================================================
       MOBILE MENU
       ====================================================== */

    function openMobileMenu() {

        mobileMenu?.classList.add("active");

        mobileMenuBtn?.setAttribute(
            "aria-expanded",
            "true"
        );

        body.classList.add("menu-open");

    }


    function closeMobileMenu() {

        mobileMenu?.classList.remove("active");

        mobileMenuBtn?.setAttribute(
            "aria-expanded",
            "false"
        );

        body.classList.remove("menu-open");

    }


    mobileMenuBtn?.addEventListener(
        "click",
        () => {

            const isOpen =
                mobileMenu?.classList.contains(
                    "active"
                );

            if (isOpen) {

                closeMobileMenu();

            } else {

                openMobileMenu();

            }

        }
    );


    mobileLinks.forEach(link => {

        link.addEventListener(
            "click",
            closeMobileMenu
        );

    });


    /* ======================================================
       ESCAPE
       ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeMobileMenu();

                closeLightbox();

            }

        }
    );


    /* ======================================================
       ACTIVE NAV
       ====================================================== */

    const sections = [
        "home",
        "about",
        "services",
        "projects",
        "process",
        "contact"
    ]
        .map(id =>
            document.getElementById(id)
        )
        .filter(Boolean);


    function updateActiveNav() {

        const currentPosition =
            window.scrollY + 180;

        let currentSection =
            "home";

        sections.forEach(section => {

            if (
                currentPosition >=
                section.offsetTop
            ) {

                currentSection =
                    section.id;

            }

        });


        navLinks.forEach(link => {

            const href =
                link.getAttribute("href");

            link.classList.toggle(
                "active",
                href === `#${currentSection}`
            );

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNav,
        { passive: true }
    );

    updateActiveNav();


    /* ======================================================
       REVEAL ANIMATIONS
       ====================================================== */

    if (
        "IntersectionObserver"
        in window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(element => {

            observer.observe(element);

        });

    } else {

        revealElements.forEach(element => {

            element.classList.add(
                "visible"
            );

        });

    }


    /* ======================================================
       CREATE PROJECT CARD
       ====================================================== */

    function createProjectCard(
        project,
        index
    ) {

        const card =
            document.createElement("article");

        card.className =
            "project-card reveal";


        const image =
            document.createElement("img");

        image.src =
            project.src;

        image.alt =
            project.alt;

        image.loading =
            index < 3
                ? "eager"
                : "lazy";

        image.decoding =
            "async";


        const number =
            document.createElement("span");

        number.className =
            "project-number";

        number.textContent =
            `${String(project.number).padStart(2, "0")} / ${TOTAL_IMAGES}`;


        card.appendChild(image);

        card.appendChild(number);


        /* Image error */

        image.addEventListener(
            "error",
            () => {

                card.remove();

                updateLoadMoreButton();

            }
        );


        /* Open lightbox */

        card.addEventListener(
            "click",
            () => {

                currentImage =
                    index;

                openLightbox(
                    currentImage
                );

            }
        );


        return card;

    }


    /* ======================================================
       RENDER PROJECTS
       ====================================================== */

    function renderProjects() {

        if (!projectsGrid) {
            return;
        }


        projectsGrid.innerHTML =
            "";


        const fragment =
            document.createDocumentFragment();


        projects
            .slice(0, visibleImages)
            .forEach((project, index) => {

                const card =
                    createProjectCard(
                        project,
                        index
                    );

                fragment.appendChild(card);

            });


        projectsGrid.appendChild(
            fragment
        );


        /* Make newly created cards visible */

        requestAnimationFrame(() => {

            projectsGrid
                .querySelectorAll(".reveal")
                .forEach(card => {

                    card.classList.add(
                        "visible"
                    );

                });

        });


        updateLoadMoreButton();

    }


    /* ======================================================
       LOAD MORE
       ====================================================== */

    function updateLoadMoreButton() {

        if (!loadMoreBtn) {
            return;
        }


        if (
            visibleImages >=
            TOTAL_IMAGES
        ) {

            loadMoreBtn.classList.add(
                "hidden"
            );

            return;

        }


        loadMoreBtn.classList.remove(
            "hidden"
        );


        const remaining =
            TOTAL_IMAGES -
            visibleImages;


        const amount =
            Math.min(
                IMAGES_PER_LOAD,
                remaining
            );


        loadMoreBtn.innerHTML = `
            <span>
                عرض ${amount} صور أخرى
            </span>

            <span class="btn-arrow">
                ↓
            </span>
        `;

    }


    loadMoreBtn?.addEventListener(
        "click",
        () => {

            const oldCount =
                visibleImages;


            visibleImages =
                Math.min(
                    visibleImages +
                    IMAGES_PER_LOAD,
                    TOTAL_IMAGES
                );


            renderProjects();


            /* Scroll slightly toward new images */

            setTimeout(() => {

                const newCard =
                    projectsGrid?.children[
                        oldCount
                    ];

                newCard?.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }, 100);

        }
    );


    renderProjects();


    /* ======================================================
       LIGHTBOX
       ====================================================== */

    function openLightbox(index) {

        if (
            !lightbox ||
            !lightboxImage
        ) {
            return;
        }


        if (
            index < 0 ||
            index >= TOTAL_IMAGES
        ) {
            return;
        }


        currentImage =
            index;


        const project =
            projects[currentImage];


        lightboxImage.src =
            project.src;

        lightboxImage.alt =
            project.alt;


        updateLightboxCounter();


        lightbox.classList.add(
            "active"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        body.classList.add(
            "lightbox-open"
        );


        /* Preload next */

        preloadImage(
            getNextIndex()
        );

    }


    function closeLightbox() {

        if (!lightbox) {
            return;
        }


        lightbox.classList.remove(
            "active"
        );

        lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        body.classList.remove(
            "lightbox-open"
        );


        setTimeout(() => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {

                lightboxImage.src =
                    "";

            }

        }, 350);

    }


    function getNextIndex() {

        return (
            currentImage + 1
        ) % TOTAL_IMAGES;

    }


    function getPreviousIndex() {

        return (
            currentImage -
            1 +
            TOTAL_IMAGES
        ) % TOTAL_IMAGES;

    }


    function showNext() {

        currentImage =
            getNextIndex();


        openLightbox(
            currentImage
        );

    }


    function showPrevious() {

        currentImage =
            getPreviousIndex();


        openLightbox(
            currentImage
        );

    }


    function updateLightboxCounter() {

        if (!lightboxCounter) {
            return;
        }


        lightboxCounter.textContent =
            `${String(currentImage + 1).padStart(2, "0")} / ${String(TOTAL_IMAGES).padStart(2, "0")}`;

    }


    lightboxClose?.addEventListener(
        "click",
        closeLightbox
    );


    lightboxNext?.addEventListener(
        "click",
        showNext
    );


    lightboxPrev?.addEventListener(
        "click",
        showPrevious
    );


    /* Click outside image */

    lightbox?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );


    /* ======================================================
       KEYBOARD GALLERY
       ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !lightbox?.classList.contains(
                    "active"
                )
            ) {

                return;

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                showNext();

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                showPrevious();

            }

        }
    );


    /* ======================================================
       TOUCH SWIPE
       ====================================================== */

    lightbox?.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0]
                    .screenX;

        },
        { passive: true }
    );


    lightbox?.addEventListener(
        "touchend",
        event => {

            touchEndX =
                event.changedTouches[0]
                    .screenX;


            const difference =
                touchStartX -
                touchEndX;


            if (
                Math.abs(difference) <
                50
            ) {

                return;

            }


            if (difference > 0) {

                showNext();

            } else {

                showPrevious();

            }

        },
        { passive: true }
    );


    /* ======================================================
       IMAGE PRELOADING
       ====================================================== */

    function preloadImage(index) {

        if (
            index < 0 ||
            index >= TOTAL_IMAGES
        ) {
            return;
        }


        const image =
            new Image();

        image.src =
            projects[index].src;

    }


    /* ======================================================
       SMOOTH ANCHORS
       ====================================================== */

    document
        .querySelectorAll(
            'a[href^="#"]'
        )
        .forEach(link => {

            link.addEventListener(
                "click",
                event => {

                    const id =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !id ||
                        id === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            id
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* ======================================================
       PRELOAD FIRST IMAGES
       ====================================================== */

    projects
        .slice(0, 3)
        .forEach(project => {

            preloadImage(
                project.number - 1
            );

        });

});
