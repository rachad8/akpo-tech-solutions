

document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    animatedElements.forEach(function(el) {
        observer.observe(el);
    });
});