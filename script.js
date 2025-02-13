const words = [
  "performance driven",
  "impact driven",
  "result oriented",
  "premium",
];

const cyclingText = document.getElementById("cyclingText");
let currentIndex = 0;

function updateText() {
  const oldText = cyclingText.textContent;
  const newText = words[(currentIndex + 1) % words.length];

  // Create wrapper for animation
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    position: relative;
    height: 1.6em;
    overflow: hidden;
    display: inline-flex;
    align-items: baseline;
    min-width: 180px;
  `;

  cyclingText.innerHTML = "";
  cyclingText.appendChild(wrapper);

  // Create old text element
  const oldTextElement = document.createElement("div");
  oldTextElement.textContent = oldText;
  oldTextElement.style.cssText = `
    position: absolute;
    left: 0;
    bottom: 0;
    white-space: nowrap;
    animation: slideOutUp 0.5s forwards;
    line-height: 1.6;
    font-size: clamp(1.1rem, 2vw, 1.4rem);
  `;

  // Create new text element
  const newTextElement = document.createElement("div");
  newTextElement.textContent = newText;
  newTextElement.style.cssText = `
    position: absolute;
    left: 0;
    bottom: 0;
    white-space: nowrap;
    animation: slideInUp 0.5s forwards;
    line-height: 1.6;
    font-size: clamp(1.1rem, 2vw, 1.4rem);
  `;

  wrapper.appendChild(oldTextElement);
  wrapper.appendChild(newTextElement);

  currentIndex = (currentIndex + 1) % words.length;
}

// Start the cycle
setInterval(updateText, 3000);

// Optimize scroll handler with throttling
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Optimize reveal animation
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal-slide, .reveal-fade");
  const windowHeight = window.innerHeight;

  reveals.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    if (elementTop < windowHeight - 150) {
      requestAnimationFrame(() => {
        element.classList.add("active");
      });
    }
  });
}

// Throttle scroll event
window.addEventListener("scroll", throttle(revealOnScroll, 100));

// Use Intersection Observer for better performance
const observerOptions = {
  root: null,
  threshold: 0.1,
  rootMargin: "-50px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      requestAnimationFrame(() => {
        entry.target.classList.add("active");
      });
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll(".reveal-slide, .reveal-fade").forEach((element) => {
  observer.observe(element);
});
