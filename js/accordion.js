/**
 * Accessible FAQ Accordion Component
 */
document.addEventListener('DOMContentLoaded', () => {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.accordion-item');
            const isOpen = item.classList.contains('active');

            // Close other open accordion items
            document.querySelectorAll('.accordion-item.active').forEach(openItem => {
                if (openItem !== item) {
                    openItem.classList.remove('active');
                    const btn = openItem.querySelector('.accordion-header');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current
            if (isOpen) {
                item.classList.remove('active');
                header.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });
});
