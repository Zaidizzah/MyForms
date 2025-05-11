/**
 * Tooltip Manager Class
 * Manages tooltips for elements with data-tooltip attribute
 */
class TooltipManager {
    constructor() {
        // Store all initialized elements to prevent duplication
        this.initializedElements = new WeakMap();
        // Store tooltip elements for cleanup
        this.tooltipElements = {};
        // Counter for unique tooltip IDs
        this.tooltipCounter = 0;
    }

    /**
     * Initialize tooltip functionality for specified elements or all elements with data-tooltip="true"
     * @param {NodeList|Array|Element} [elements] - Optional elements to initialize (if not provided, will find all elements with data-tooltip="true")
     */
    init(elements) {
        // If no elements provided, find all elements with data-tooltip="true"
        if (!elements) {
            elements = document.querySelectorAll('[data-tooltip="true"]');
        }

        // Ensure we're working with an array of elements
        const elementsArray =
            elements instanceof Element ? [elements] : Array.from(elements);

        // Filter elements that have valid tooltip titles and haven't been initialized yet
        const filteredElements = elementsArray.filter((element) => {
            return (
                element.dataset.tooltipTitle &&
                element.dataset.tooltipTitle.trim() !== "" &&
                !this.initializedElements.has(element)
            );
        });

        // Initialize each element
        filteredElements.forEach((element) => {
            this.setupTooltip(element);
        });
    }

    /**
     * Set up tooltip functionality for a single element
     * @param {Element} element - The element to setup tooltip for
     */
    setupTooltip(element) {
        if (this.initializedElements.has(element)) {
            return; // Skip if already initialized
        }

        const tooltipId = this.tooltipCounter++;

        // Store tooltipId in WeakMap to mark this element as initialized
        this.initializedElements.set(element, tooltipId);

        // Add mouseenter event listener
        element.addEventListener("mouseenter", (e) => {
            this.showTooltip(element, tooltipId);
        });

        // Add mouseleave event listener
        element.addEventListener("mouseleave", () => {
            this.removeTooltip(tooltipId);
        });

        // Set up observer to remove tooltip when element is removed from DOM
        this.setupRemovalObserver(element, tooltipId);
    }

    /**
     * Show tooltip for an element
     * @param {Element} element - Element to show tooltip for
     * @param {number} tooltipId - Unique ID for this tooltip
     */
    showTooltip(element, tooltipId) {
        const tooltipTitle = element.dataset.tooltipTitle;
        const elementPosition = element.getBoundingClientRect();

        // Create tooltip element
        const displayingElement = document.createElement("div");
        displayingElement.id = `tooltip-element-${tooltipId}`;
        displayingElement.className = "tooltip";
        displayingElement.style.position = "fixed";
        displayingElement.style.visibility = "hidden";
        displayingElement.style.display = "block";

        // Check if element is invalid input element
        if (
            (element.tagName === "INPUT" ||
                element.tagName === "TEXTAREA" ||
                element.tagName === "SELECT") &&
            !element.validity.valid
        ) {
            displayingElement.classList.add("invalid");
        }

        // Adding attribute aria and role
        displayingElement.setAttribute("role", "tooltip");
        displayingElement.setAttribute("aria-live", "polite");
        displayingElement.setAttribute("aria-atomic", "true");
        displayingElement.setAttribute("aria-hidden", "true");
        element.setAttribute(
            "aria-describedby",
            `tooltip-element-${tooltipId}`
        );

        displayingElement.textContent = tooltipTitle;

        document.body.appendChild(displayingElement);

        // Store the tooltip element for later cleanup
        this.tooltipElements[tooltipId] = displayingElement;

        const tooltipWidth = displayingElement.offsetWidth;
        const tooltipHeight = displayingElement.offsetHeight;

        // Detect viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate positions
        const horizontalPosition = this.calculateHorizontalPosition(
            elementPosition,
            element.offsetWidth,
            tooltipWidth,
            viewportWidth
        );

        const verticalPosition = this.calculateVerticalPosition(
            elementPosition,
            element.offsetHeight,
            tooltipHeight,
            viewportHeight
        );

        // Apply positions
        displayingElement.style.top = `${verticalPosition.top}px`;
        displayingElement.style.left = `${
            horizontalPosition.left + window.scrollX
        }px`;

        // Add position classes for styling
        displayingElement.classList.add(verticalPosition.position);
        displayingElement.classList.add(horizontalPosition.position);

        displayingElement.style.zIndex = 551;
        displayingElement.tabIndex = -1;
        displayingElement.style.visibility = "visible";
    }

    /**
     * Remove a tooltip by its ID
     * @param {number} tooltipId - ID of tooltip to remove
     */
    removeTooltip(tooltipId) {
        const tooltipElement = this.tooltipElements[tooltipId];
        if (tooltipElement) {
            tooltipElement.remove();
            delete this.tooltipElements[tooltipId];
        }
    }

    /**
     * Set up observer to remove tooltip when element is removed from DOM
     * @param {Element} element - Element to observe
     * @param {number} tooltipId - ID of tooltip to remove when element is removed
     */
    setupRemovalObserver(element, tooltipId) {
        new MutationObserver(() => {
            if (!document.contains(element)) {
                this.removeTooltip(tooltipId);
            }
        }).observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    /**
     * Calculates the horizontal position of the tooltip
     * @param {Object} elementPosition - Element position from getBoundingClientRect()
     * @param {number} elementWidth - Width of the element
     * @param {number} tooltipWidth - Width of the tooltip
     * @param {number} viewportWidth - Width of the viewport
     * @returns {Object} Position object with left and position properties
     */
    calculateHorizontalPosition(
        elementPosition,
        elementWidth,
        tooltipWidth,
        viewportWidth
    ) {
        const padding = 8;
        const elementCenter = elementPosition.left + elementWidth / 2;

        // Default position (center aligned)
        let position = "center";
        let left = elementCenter - tooltipWidth / 2;

        // Check if tooltip would overflow right side
        const rightOverflow = left + tooltipWidth + padding > viewportWidth;
        // Check if tooltip would overflow left side
        const leftOverflow = left < padding;

        // Detect element position in viewport (left, center, right)
        const isElementOnRightSide =
            elementPosition.right > viewportWidth * 0.7;
        const isElementOnLeftSide = elementPosition.left < viewportWidth * 0.3;

        if (elementWidth >= tooltipWidth) {
            // Center if element is wide enough
            position = "center";
            left = elementPosition.left + (elementWidth - tooltipWidth) / 2;
        } else if (rightOverflow || isElementOnRightSide) {
            // If tooltip would overflow to the right or element is on the right side
            position = "right";
            // Align right with element or use padding
            left = elementPosition.right - tooltipWidth;
            // Ensure it doesn't overflow to the left
            if (left < padding) {
                left = padding;
            }
        } else if (leftOverflow || isElementOnLeftSide) {
            // If tooltip would overflow to the left or element is on the left side
            position = "left";
            // Align left with element
            left = elementPosition.left;
            // Ensure it doesn't overflow to the right
            if (left + tooltipWidth + padding > viewportWidth) {
                left = viewportWidth - tooltipWidth - padding;
            }
        } else {
            // Center, but ensure it doesn't overflow
            const maxLeft = viewportWidth - tooltipWidth - padding;
            const minLeft = padding;
            if (left < minLeft) left = minLeft;
            if (left > maxLeft) left = maxLeft;
        }

        return {
            left: left,
            position: position,
        };
    }

    /**
     * Calculates the vertical position of the tooltip
     * @param {Object} elementPosition - Element position from getBoundingClientRect()
     * @param {number} elementHeight - Height of the element
     * @param {number} tooltipHeight - Height of the tooltip
     * @param {number} viewportHeight - Height of the viewport
     * @returns {Object} Position object with top and position properties
     */
    calculateVerticalPosition(
        elementPosition,
        elementHeight,
        tooltipHeight,
        viewportHeight
    ) {
        const padding = 8;
        const verticalGap = 10; // Vertical gap between element and tooltip

        // Calculate the available space above and below the element
        const spaceBelow =
            viewportHeight -
            (elementPosition.bottom + tooltipHeight + verticalGap);
        const spaceAbove = elementPosition.top - tooltipHeight - verticalGap;

        let position = "bottom"; // Default position
        let top;

        if (spaceBelow >= padding) {
            // If there is enough space below
            position = "bottom";
            top = elementPosition.bottom + verticalGap;
        } else if (spaceAbove >= padding) {
            // If there is enough space above
            position = "top";
            top = elementPosition.top - tooltipHeight - verticalGap;
        } else {
            // If neither space is enough, pick the larger one
            if (spaceBelow >= spaceAbove) {
                position = "bottom";
                top = elementPosition.bottom + verticalGap;
            } else {
                position = "top";
                top = elementPosition.top - tooltipHeight - verticalGap;
            }
        }

        return {
            top: top,
            position: position,
        };
    }

    /**
     * Clean up all tooltips and event listeners
     */
    destroy() {
        // Remove all tooltip elements
        Object.values(this.tooltipElements).forEach((element) => {
            if (element && element.parentNode) {
                element.remove();
            }
        });

        // Reset storage
        this.tooltipElements = {};
        this.initializedElements = new WeakMap();
    }
}

// Export the class for usage
// Usage:
// const tooltipManager = new TooltipManager();
// tooltipManager.init(); // Initialize all tooltips with data-tooltip="true"
//
// // Or initialize specific elements:
// tooltipManager.init(document.querySelectorAll('.my-tooltip-elements'));
//
// // Initialize a single element:
// tooltipManager.init(document.getElementById('my-tooltip-element'));
