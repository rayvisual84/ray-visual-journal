const artwork = document.querySelector(".artwork");
const cursor = document.querySelector(".cursor");
const loaderNumber = document.querySelector(".loader-number");

let progress = 0;

const loading = setInterval(() => {
    progress++;
    loaderNumber.textContent = progress + "%";

    if (progress >= 100) {
        clearInterval(loading);
    }
}, 20);


/* HERO IMAGE TILT */

artwork.addEventListener("mousemove", (event) => {

    const rect = artwork.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 35;
    const rotateY = (centerX - x) / 35;

    artwork.style.transform =
        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
});


artwork.addEventListener("mouseleave", () => {

    artwork.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";

});


/* SMOOTH CURSOR */

let mouseX = 0;
let mouseY = 0;

let cursorX = 0;
let cursorY = 0;


document.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

});


function animateCursor() {

    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    cursor.style.left = cursorX + "px";
    cursor.style.top = cursorY + "px";

    requestAnimationFrame(animateCursor);

}


animateCursor();


/* CURSOR HOVER */

const clickableElements = document.querySelectorAll(
    "a, button, .gallery-item"
);


clickableElements.forEach((element) => {

    element.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });

    element.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });

});


/* SCROLL REVEAL */

const revealElements = document.querySelectorAll(
    ".journey, .philosophy, .gallery-item, footer"
);


revealElements.forEach((element) => {
    element.classList.add("reveal");
});


const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);


revealElements.forEach((element) => {
    revealObserver.observe(element);
});


/* MAGNETIC ENTER BUTTON */

const enterButton = document.querySelector(".button");


enterButton.addEventListener("mousemove", (event) => {

    const rect = enterButton.getBoundingClientRect();

    const x =
        event.clientX -
        rect.left -
        rect.width / 2;

    const y =
        event.clientY -
        rect.top -
        rect.height / 2;

    enterButton.style.transform =
        `translate(${x * 0.12}px, ${y * 0.12}px)`;

});


enterButton.addEventListener("mouseleave", () => {

    enterButton.style.transform = "translate(0, 0)";

});


/* IMAGE VIEWER */

const galleryItems =
    document.querySelectorAll(".gallery-item");

const imageViewer =
    document.querySelector(".image-viewer");

const viewerImage =
    document.querySelector(".viewer-content img");

const viewerTitle =
    document.querySelector(".viewer-title");

const viewerCounter =
    document.querySelector(".viewer-counter");

const viewerClose =
    document.querySelector(".viewer-close");

const viewerPrev =
    document.querySelector(".viewer-prev");

const viewerNext =
    document.querySelector(".viewer-next");


let currentArtwork = 0;


function updateViewer(index) {

    const item = galleryItems[index];

    const image = item.dataset.image;
    const title = item.dataset.title;
    const number = item.dataset.number;


    viewerImage.classList.add("changing");
    viewerTitle.classList.add("changing");
    viewerCounter.classList.add("changing");


    setTimeout(() => {

        viewerImage.src = image;
        viewerImage.alt = title;

        viewerTitle.textContent = title;
        viewerCounter.textContent = number;

        currentArtwork = index;


        viewerImage.classList.remove("changing");
        viewerTitle.classList.remove("changing");
        viewerCounter.classList.remove("changing");

    }, 250);

}


/* OPEN VIEWER */

galleryItems.forEach((item, index) => {

    item.addEventListener("click", () => {

        updateViewer(index);

        imageViewer.classList.add("open");

        document.body.classList.add("viewer-open");

    });

});


/* FUTURE */

viewerNext.addEventListener("click", (event) => {

    event.stopPropagation();


    let nextIndex = currentArtwork + 1;


    if (nextIndex >= galleryItems.length) {
        nextIndex = 0;
    }


    updateViewer(nextIndex);

});


/* PAST */

viewerPrev.addEventListener("click", (event) => {

    event.stopPropagation();


    let previousIndex = currentArtwork - 1;


    if (previousIndex < 0) {
        previousIndex = galleryItems.length - 1;
    }


    updateViewer(previousIndex);

});


/* CLOSE VIEWER */

function closeViewer() {

    imageViewer.classList.remove("open");

    document.body.classList.remove("viewer-open");

}


viewerClose.addEventListener(
    "click",
    closeViewer
);


/* CLICK OUTSIDE */

imageViewer.addEventListener("click", (event) => {

    if (event.target === imageViewer) {
        closeViewer();
    }

});


/* KEYBOARD */

document.addEventListener("keydown", (event) => {

    if (!imageViewer.classList.contains("open")) {
        return;
    }


    if (event.key === "Escape") {
        closeViewer();
    }


    if (event.key === "ArrowRight") {

        let nextIndex = currentArtwork + 1;

        if (nextIndex >= galleryItems.length) {
            nextIndex = 0;
        }

        updateViewer(nextIndex);

    }


    if (event.key === "ArrowLeft") {

        let previousIndex = currentArtwork - 1;

        if (previousIndex < 0) {
            previousIndex = galleryItems.length - 1;
        }

        updateViewer(previousIndex);

    }

});


/* SECTION INDICATOR */

const sectionNumber =
    document.querySelector(".section-number");

const sectionName =
    document.querySelector(".section-name");


const sections = [

    {
        element: document.querySelector("#journey"),
        number: "01",
        name: "JOURNEY"
    },

    {
        element: document.querySelector(".philosophy"),
        number: "02",
        name: "PHILOSOPHY"
    },

    {
        element: document.querySelector("#journal"),
        number: "03",
        name: "JOURNAL"
    },

    {
        element: document.querySelector("#contact"),
        number: "04",
        name: "CONTACT"
    }

];


function updateSectionIndicator() {

    const scrollPosition =
        window.scrollY +
        window.innerHeight * 0.45;


    let activeSection = sections[0];


    sections.forEach((section) => {

        if (
            section.element &&
            scrollPosition >= section.element.offsetTop
        ) {

            activeSection = section;

        }

    });


    sectionNumber.textContent =
        activeSection.number;

    sectionName.textContent =
        activeSection.name;

}


window.addEventListener(
    "scroll",
    updateSectionIndicator
);


updateSectionIndicator();


/* JOURNEY PARALLAX */

const journeyImage =
    document.querySelector(".journey-image");


function updateParallax() {

    if (!journeyImage) {
        return;
    }


    const rect =
        journeyImage.getBoundingClientRect();

    const windowHeight =
        window.innerHeight;


    const centerOffset =
        (rect.top + rect.height / 2) -
        windowHeight / 2;


    const movement =
        centerOffset * -0.08;


    journeyImage.style.transform =
        `translateY(${movement}px)`;

}


window.addEventListener(
    "scroll",
    updateParallax
);


updateParallax();