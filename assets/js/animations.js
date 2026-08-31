function animateCounter(el, target, duration) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
        el.textContent = target + '+';
        return;
    }
    const startTime = performance.now();
    function frame(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + '+';
        if (progress < 1) window.requestAnimationFrame(frame);
        else el.textContent = target + '+';
    }
    window.requestAnimationFrame(frame);
}

document.addEventListener('DOMContentLoaded', function() {
    const counters = document.querySelectorAll('.counter[data-target]');
    if (!counters.length || !('IntersectionObserver' in window)) {
        counters.forEach((counter) => {
            counter.textContent = (parseInt(counter.getAttribute('data-target'), 10) || 0) + '+';
        });
        return;
    }
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'), 10) || 0;
            animateCounter(el, target, 900);
            observer.unobserve(el);
        });
    }, { rootMargin: '0px 0px 120px', threshold: 0.1 });
    counters.forEach((counter) => observer.observe(counter));
});
