/**
 * Live Impact Stats Counter Animation
 */
document.addEventListener('DOMContentLoaded', () => {
    const statCounters = document.querySelectorAll('.stat-number[data-target]');
    
    if (!statCounters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'), 10);
                animateCount(entry.target, target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statCounters.forEach(counter => observer.observe(counter));
});

function animateCount(element, target) {
    let current = 0;
    const duration = 1500;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        }
    }, stepTime);
}
