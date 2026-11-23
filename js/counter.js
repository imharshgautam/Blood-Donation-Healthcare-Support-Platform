
/**
 * Live Impact Stats Counter Animation
 */
document.addEventListener('DOMContentLoaded', () => {
    const statCounters = document.querySelectorAll('.stat-number[data-target]');

    if (!statCounters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = Number.parseInt(counter.dataset.target, 10);

            if (!Number.isFinite(target)) {
                obs.unobserve(counter);
                return;
            }

            const suffix = counter.textContent.trim().endsWith('%') ? '%' : '+';

            animateCount(counter, target, suffix);
            obs.unobserve(counter);
        });
    }, { threshold: 0.5 });

    statCounters.forEach(counter => observer.observe(counter));
});

function animateCount(element, target, suffix) {
    const duration = 1500;
    const startTime = performance.now();

    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(target * progress);

        element.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = target.toLocaleString() + suffix;
        }
    }

    requestAnimationFrame(updateCount);
}
