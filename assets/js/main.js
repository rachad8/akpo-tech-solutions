

document.addEventListener('DOMContentLoaded', function() {

    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', function() {
            loader.classList.add('hidden');
        });
    }

    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        });
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        });

        // Boutons d'authentification sur la page d'accueil.
        // Ils sont ajoutés dynamiquement afin de préserver la navigation existante.
        const navList = navbar.querySelector('.navbar-nav');
        const isHomePage = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html');

        if (navList && isHomePage && !navList.querySelector('[data-auth-buttons]')) {
            const loginItem = document.createElement('li');
            loginItem.className = 'nav-item ms-lg-2';
            loginItem.setAttribute('data-auth-buttons', 'true');
            loginItem.innerHTML = `
                <a class="btn btn-outline-primary btn-sm px-3" href="auth/login.html">
                    <i class="bi bi-box-arrow-in-right"></i> Se connecter
                </a>
            `;

            const registerItem = document.createElement('li');
            registerItem.className = 'nav-item';
            registerItem.setAttribute('data-auth-buttons', 'true');
            registerItem.innerHTML = `
                <a class="btn btn-primary btn-sm px-3" href="auth/register.html">
                    <i class="bi bi-person-plus"></i> Créer un compte
                </a>
            `;

            navList.appendChild(loginItem);
            navList.appendChild(registerItem);
        }
    }

    console.log('AKPO TECH SOLUTIONS - Site chargé');
});