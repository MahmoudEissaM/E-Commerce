const darkModeToggle = document.getElementById('darkModeToggle');
const logo = document.getElementById('logo');

const currentTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', currentTheme);

if (currentTheme === 'dark') {
    darkModeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    logo.src = "../img/footer-logo.png";
} else {
    logo.src = "../img/logo.png";
}

darkModeToggle.addEventListener('click', () => {
    const newTheme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    const icon = darkModeToggle.querySelector('i');
    if (icon) {
        if (newTheme === 'dark') {
            icon.classList.replace('fa-sun', 'fa-moon');
            logo.src = "../img/footer-logo.png";
        } else {
            icon.classList.replace('fa-moon', 'fa-sun');
            logo.src = "../img/logo.png";
        }
    }
});