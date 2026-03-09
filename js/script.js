const body = document.body;
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const navAnchors = Array.from(document.querySelectorAll(".nav-link"));
const sections = Array.from(document.querySelectorAll("main section[id]"));
const themeBtn = document.getElementById("themeBtn");
const roleTicker = document.getElementById("roleTicker");
const scrollProgress = document.getElementById("scrollProgress");
const revealElements = document.querySelectorAll(".reveal");
const portraitCard = document.getElementById("portraitCard");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const yearEl = document.getElementById("year");

if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
}

if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("open");
        menuBtn.classList.toggle("open", isOpen);
        menuBtn.setAttribute("aria-expanded", String(isOpen));
    });
}

navAnchors.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) {
            return;
        }

        const target = document.querySelector(targetId);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });

        if (navLinks && navLinks.classList.contains("open")) {
            navLinks.classList.remove("open");
            menuBtn?.classList.remove("open");
            menuBtn?.setAttribute("aria-expanded", "false");
        }
    });
});

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.16,
        rootMargin: "0px 0px -60px 0px"
    }
);

revealElements.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const currentId = entry.target.getAttribute("id");
            navAnchors.forEach((anchor) => {
                const isActive = anchor.getAttribute("href") === `#${currentId}`;
                anchor.classList.toggle("active", isActive);
            });
        });
    },
    {
        threshold: 0.55
    }
);

sections.forEach((section) => sectionObserver.observe(section));

function updateProgress() {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
    }
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

const roles = [
    "Frontend Engineer",
    "Full-stack Developer",
    "UI Motion Crafter",
    "Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;

function runTicker() {
    if (!roleTicker) {
        return;
    }

    const currentRole = roles[roleIndex];

    if (!deleting) {
        charIndex += 1;
        roleTicker.textContent = currentRole.slice(0, charIndex);

        if (charIndex === currentRole.length) {
            deleting = true;
            setTimeout(runTicker, 1200);
            return;
        }
    } else {
        charIndex -= 1;
        roleTicker.textContent = currentRole.slice(0, Math.max(0, charIndex));

        if (charIndex <= 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(runTicker, deleting ? 42 : 80);
}

runTicker();

const storedTheme = localStorage.getItem("arpit-theme");
if (storedTheme === "dark") {
    body.setAttribute("data-theme", "dark");
}

if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const isDark = body.getAttribute("data-theme") === "dark";
        if (isDark) {
            body.removeAttribute("data-theme");
            localStorage.setItem("arpit-theme", "light");
        } else {
            body.setAttribute("data-theme", "dark");
            localStorage.setItem("arpit-theme", "dark");
        }
    });
}

const allowMotion = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (portraitCard && allowMotion) {
    portraitCard.addEventListener("mousemove", (event) => {
        const rect = portraitCard.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 10;
        const rotateY = (x - 0.5) * 12;
        portraitCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    portraitCard.addEventListener("mouseleave", () => {
        portraitCard.style.transform = "rotateX(0deg) rotateY(0deg)";
    });
}

if (contactForm && formStatus) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const message = String(formData.get("message") || "").trim();

        if (!name || !email || !message) {
            formStatus.textContent = "Please fill all fields before sending.";
            formStatus.style.color = "#c92b11";
            return;
        }

        formStatus.textContent = "Thanks. Message captured. Connect this form to your email/API next.";
        formStatus.style.color = "#15745f";
        contactForm.reset();
    });
}
