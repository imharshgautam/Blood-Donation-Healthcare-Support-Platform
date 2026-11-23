
/**
 * Accessible FAQ Accordion Component
 * Supports single-open accordion behavior.
 */

document.addEventListener('DOMContentLoaded', () => {

    const accordionHeaders = document.querySelectorAll('.accordion-header');

    if (!accordionHeaders.length) return;

    // Update accordion state and accessibility attributes
    function setAccordionState(item, header, isOpen) {

        item.classList.toggle('active', isOpen);

        header.setAttribute('aria-expanded', String(isOpen));
    }

    // Initialize accordion states
    accordionHeaders.forEach(header => {

        const item = header.closest('.accordion-item');

        if (!item) return;

        const isOpen = item.classList.contains('active');

        setAccordionState(item, header, isOpen);

        // Handle click
        header.addEventListener('click', () => {

            const currentItem = header.closest('.accordion-item');

            if (!currentItem) return;

            const isCurrentlyOpen =
                currentItem.classList.contains('active');

            // Close other open accordion items
            document.querySelectorAll('.accordion-item.active').forEach(openItem => {

                if (openItem !== currentItem) {

                    const openHeader =
                        openItem.querySelector('.accordion-header');

                    if (openHeader) {
                        setAccordionState(openItem, openHeader, false);
                    } else {
                        openItem.classList.remove('active');
                    }
                }
            });

            // Toggle current accordion
            setAccordionState(
                currentItem,
                header,
                !isCurrentlyOpen
            );

        });

    });

});
