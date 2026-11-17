document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton)
        toggleButton.addEventListener('click', () => {
            // Get the current active theme state
            const currentTheme = document.documentElement.getAttribute('data-theme');
            // Flip the state
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            // Apply globally and save it for future visits
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
});
export {};
//# sourceMappingURL=light-dark-toggle.js.map