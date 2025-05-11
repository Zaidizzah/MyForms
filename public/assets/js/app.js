// Initialize tooltipManager
const tooltipManager = new TooltipManager();
tooltipManager.init();

/**
 * Gets the value of a cookie by its name
 * @param {string} cName - The name of the cookie
 * @returns {string} The value of the cookie, or "" if not found
 */
function GET_COOKIE(cName) {
    let name = cName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

const XSRF_TOKEN = GET_COOKIE("XSRF-TOKEN"); // get the XSRF-TOKEN from cookie
const CSRF_TOKEN = document.querySelector("meta[name='csrf_token']")?.content;
const AUTOLOAD_DATE = new Date(); // get the current date

/**
 * Appends a loader to the given selector
 * @param {string} appendedSelector - The selector to append the loader to
 * @param {string} [position="beforeend"] - The position of the loader relative to the appended selector, such: "beforebegin", "beforeend", "afterbegin", "afterend"
 * @param {boolean} [centerStatic=false] - If true, the loader will be centered
 * @returns {string} The ID of the loader
 */
function APPEND_LOADER(
    appendedSelector,
    position = "beforeend",
    centerStatic = false
) {
    const ID = `loader-${AUTOLOAD_DATE.getTime()}`;
    const LOADER = `
        <div class="loader-wrapper ${
            centerStatic === true ? "center-static" : ""
        }" id="${ID}" role="alert" aria-live="assertive" aria-atomic="true" aria-relevant="additions">
            <div class="loader"></div>
            <p>Memproses<span class="dot">.</span><span class="dot">.</span><span class="dot">.</span></p>
        </div>
    `;

    const appendedElement = document.querySelector(appendedSelector);
    if (appendedElement) {
        appendedElement.insertAdjacentHTML(position, LOADER);

        return `#${ID}`;
    }
}

/**
 * Removes the loader from the given selector
 * @param {string} removedSelector - The selector to remove the loader from
 * @returns {void}
 */
function REMOVE_LOADER(removedSelector) {
    const removedElement = document.querySelector(removedSelector);
    if (removedElement) {
        removedElement.remove();
    }
}

/**
 * Appends a flash message to the main content
 * @param {{message: string, title?: string, type?: "success" | "error" | "info" | "warning", position?: "beforebegin" | "afterbegin" | "beforeend" | "afterend"}} [options={}] - The options object
 * @param {string} [options.message] - The message to be displayed in the flash message
 * @param {string} [options.title="Message"] - The title of the flash message
 * @param {"success" | "error" | "info" | "warning"} [options.type="success"] - The type of the flash message
 * @param {"beforebegin" | "afterbegin" | "beforeend" | "afterend"} [options.position="afterbegin"] - The position of the flash message relative to the main content
 * @returns {void}
 */
function FLASH_MESSAGE({
    message,
    title = "Message",
    type = "success",
    position = "afterbegin",
} = {}) {
    const ID = `flash-message-${AUTOLOAD_DATE.getTime()}`;
    const FLASH_MESSAGE = `
        <!-- Flash message section -->
        <div class="flash-message ${type}" id="${ID}" role="alert" aria-live="assertive" aria-atomic="true" aria-labelledby="flash-message-label" aria-describedby="flash-message-describe" aria-hidden="false">
            <h2 id="flash-message-label-${AUTOLOAD_DATE.getTime()}" class="flash-message-label">${title}</h2>
            <p id="flash-message-describe-${AUTOLOAD_DATE.getTime()}" class="flash-message-describe">${message}</p>

            <!-- Close button -->
            <button class="flash-message-close" type="button" role="button" data-tooltip="true" data-tooltip-title="Close message" aria-label="Close flash message"></button>
        </div>
    `;

    const mainContent = document.querySelector("main.main-content");
    if (mainContent) {
        mainContent.insertAdjacentHTML(position, FLASH_MESSAGE);
        tooltipManager.init(); // Reinitialize tooltipManager
    }

    // Remove handling for button
    document.querySelector(`#${ID}`)?.addEventListener("click", function () {
        this.remove();
    });
}

(() => {
    "use strict";

    // Debounce
    function debounce(func, time = 100) {
        let timer;
        return function (event) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(func, time, event);
        };
    }

    // Main content
    const mainContent = document.querySelector("main.main-content");
    const mainContentElementPosition = parseInt(
        window.getComputedStyle(mainContent).marginTop,
        10
    );

    // Submenu toggle
    const submenuWrapper = document.querySelector(".submenu-wrapper");

    if (submenuWrapper) {
        const submenuWrapperElementPosition = parseInt(
            window.getComputedStyle(submenuWrapper).top,
            10
        );
        const submenu = document.querySelector(".submenu");
        const submenuToggle = document.querySelector(".submenu-toggler");

        if (submenuToggle && submenu) {
            submenuToggle.addEventListener("click", function (e) {
                if (!submenu.classList.contains("hide")) {
                    submenu.classList.add("hide");
                    submenuWrapper.style.top = `${
                        submenuWrapperElementPosition + 1 - submenu.offsetHeight
                    }px`;
                    mainContent.style.marginTop = `${
                        mainContentElementPosition - submenu.offsetHeight
                    }px`;
                } else {
                    submenu.classList.remove("hide");
                    submenuWrapper.style.top = `${submenuWrapperElementPosition}px`;
                    mainContent.style.marginTop = `${submenu.offsetHeight}px`;
                }
            });
        }
    }

    // Icons credit visibility
    const iconsCredit = document.querySelector(".icons-credit");
    const iconsCreditElementPosition = parseInt(
        window.getComputedStyle(iconsCredit).bottom,
        10
    );

    // Resizesing document
    window.addEventListener(
        "resize",
        debounce(function (e) {
            if (iconsCredit && !iconsCredit.classList.contains("show")) {
                iconsCredit.style.bottom = `${
                    iconsCreditElementPosition - iconsCredit.offsetHeight
                }px`;
            }
        }, 500)
    );

    // Initializing style for icons credit elemnt
    if (iconsCredit) {
        if (!iconsCredit.classList.contains("show")) {
            iconsCredit.style.bottom = `${
                iconsCreditElementPosition - iconsCredit.offsetHeight
            }px`;
        }

        // For button toggle
        const toggleIconsCredit = iconsCredit.querySelector(
            ".icons-credit-toggler"
        );
        if (toggleIconsCredit) {
            toggleIconsCredit.addEventListener("click", function (e) {
                if (!iconsCredit.classList.contains("show")) {
                    iconsCredit.classList.add("show");
                    iconsCredit.style.bottom = `${iconsCreditElementPosition}px`;
                } else {
                    iconsCredit.classList.remove("show");
                    iconsCredit.style.bottom = `${
                        iconsCreditElementPosition - iconsCredit.offsetHeight
                    }px`;
                }
            });
        }
    }

    // Search function
    const searchInput = document.querySelector(".search-input");
    searchInput.addEventListener("focus", function () {
        this.placeholder = "Search or jump to...";
    });

    searchInput.addEventListener("blur", function () {
        this.placeholder = "Type / to search";
    });

    // Adding focus to search element if user press the "/" button
    document.addEventListener("keyup", function (e) {
        if (e.key === "/") {
            searchInput.focus();
        }
    });

    // Button to top function
    const buttonToTop = document.querySelector(".going-to-top");
    buttonToTop.addEventListener("click", function (e) {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    // Adding functionality to flash message (session)
    const flashMessageContainers = document.querySelectorAll(
        ".flash-message[role='alert']"
    );
    if (flashMessageContainers) {
        flashMessageContainers.forEach((container) => {
            const buttonClose = container.querySelector(".flash-message-close");

            if (buttonClose) {
                buttonClose.addEventListener("click", () => {
                    container.remove();
                });
            }
        });
    }

    // Initialize errors notification
    const errorNotificationContainers = document.querySelectorAll(
        ".error-notification-container[role='alert']"
    );
    if (errorNotificationContainers) {
        errorNotificationContainers.forEach((container) => {
            new ErrorNotification(container);
        });
    }

    // Initialize tablist
    const tablistContainers = document.querySelectorAll(".tablist-container");
    if (tablistContainers) {
        tablistContainers.forEach((container) => {
            new TabList(container);
        });
    }

    // Show/hide the modal
    function toggleModal(selector, show = true) {
        if (selector) {
            document.body.style.pointerEvents = show ? "none" : "auto";

            // Add/remove class show in modal element
            if (show) {
                selector.classList.add("show");
            } else {
                if (selector.classList.contains("show"))
                    selector.classList.remove("show");
            }
        }
    }

    // Modals events2
    document.querySelectorAll("[data-dismiss='modal'")?.forEach((element) => {
        element.addEventListener("click", () => {
            toggleModal(element.closest(".modal"), false);
        });
    });
    document.querySelectorAll("[data-modal]")?.forEach((element) => {
        element.addEventListener("click", () => {
            toggleModal(document.querySelector(element.dataset.target));
        });
    });
})();
