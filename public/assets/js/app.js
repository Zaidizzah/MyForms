// Initialize tooltipManager
window.tooltipManager = new TooltipManager();
tooltipManager.init();

/**
 * Gets the value of a cookie by its name
 * @param {string} cName - The name of the cookie
 * @returns {string} The value of the cookie, or "" if not found
 */
window.GET_COOKIE = (cName) => {
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
};

window.XSRF_TOKEN = GET_COOKIE("XSRF-TOKEN"); // get the XSRF-TOKEN from cookie
window.CSRF_TOKEN = document.querySelector("meta[name='csrf_token']")?.content;
window.AUTOLOAD_DATE = new Date(); // get the current date

window.CREATE_STATUS_ELEMENT = (text, timeout) => {
    // Delete existing status element and setTimeout
    REMOVE_STATUS_ELEMENT("status");

    const statusElement = document.createElement("div");
    statusElement.classList.add("upload-status");
    statusElement.textContent = text;
    statusElement.ariaLive = "polite";
    statusElement.ariaAtomic = "true";
    statusElement.role = "status";
    statusElement.id = `status`;

    // Append the status element to the body
    document.body?.appendChild(statusElement);

    // Set a timeout to remove the status element after {timeout} default is 3 seconds
    if (timeout) {
        setTimeout(() => {
            REMOVE_STATUS_ELEMENT("status");
        }, timeout);
    } else {
        // Returning the status element id
        return statusElement.id;
    }
};

window.REMOVE_STATUS_ELEMENT = function (id) {
    const statusElement = document.getElementById(id);
    if (statusElement) {
        statusElement.remove();
    }
};

/**
 * Appends a loader to the given selector
 * @param {string} appendedSelector - The selector to append the loader to
 * @param {string} [position="beforeend"] - The position of the loader relative to the appended selector, such: "beforebegin", "beforeend", "afterbegin", "afterend"
 * @param {boolean} [centerStatic=false] - If true, the loader will be centered
 * @returns {string} The ID of the loader
 */
window.APPEND_LOADER = (
    appendedSelector,
    position = "beforeend",
    centerStatic = false
) => {
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
};

/**
 * Removes the loader from the given selector
 * @param {string} removedSelector - The selector to remove the loader from
 * @returns {void}
 */
window.REMOVE_LOADER = (removedSelector) => {
    const removedElement = document.querySelector(removedSelector);
    if (removedElement) {
        removedElement.remove();
    }
};

/**
 * Appends a flash message to the main content
 * @param {{message: string, title?: string, type?: "success" | "error" | "info" | "warning", position?: "beforebegin" | "afterbegin" | "beforeend" | "afterend"}} [options={}] - The options object
 * @param {string} [options.message] - The message to be displayed in the flash message
 * @param {string} [options.title="Message"] - The title of the flash message
 * @param {"success" | "error" | "info" | "warning"} [options.type="success"] - The type of the flash message
 * @param {"beforebegin" | "afterbegin" | "beforeend" | "afterend"} [options.position="afterbegin"] - The position of the flash message relative to the main content
 * @returns {void}
 */
window.FLASH_MESSAGE = ({
    message,
    title = "Message",
    type = "success",
    position = "afterbegin",
} = {}) => {
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

    // Append the flash message to the main content if user has ben authenticated
    const mainContent = document.querySelector("main.main-content");
    if (mainContent) {
        mainContent.insertAdjacentHTML(position, FLASH_MESSAGE);
        tooltipManager.init(); // Reinitialize tooltipManager

        // Focus on flash message label
        document.querySelector(`.flash-message#${ID}`)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }

    // If user has not been authenticated, append the flash message to the begin position of form-wrapper element in (signin and signup page)
    const fromContentWrapper = document.querySelector(".form-content-wrapper");
    if (fromContentWrapper) {
        fromContentWrapper.insertAdjacentHTML(position, FLASH_MESSAGE);
        tooltipManager.init(); // Reinitialize tooltipManager

        // Focus on flash message label
        document.querySelector(`.flash-message#${ID}`)?.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }

    // Remove handling for button
    document.querySelector(`#${ID}`)?.addEventListener("click", function () {
        this.remove();
    });
};

/**
 * Checks the response status and handles the response accordingly
 * @param {Response} response - The response object
 * @returns {boolean} true if the response status is 200, false if the response status is 401 or 403
 */
window.CHECK_STATUS_RESPONSE = (response) => {
    if (response.status === 401) {
        window.location.href = "/signin";
        return false;
    }

    if (response.status === 403) {
        alert("Anda tidak memiliki akses ke halaman atau resources ini.");
        return false;
    }

    return true;
};

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
    if (mainContent) {
        const mainContentElementPosition = parseInt(
            window.getComputedStyle(mainContent).marginTop,
            10
        );
    }

    // Submenu toggle
    const submenuWrapper = document.querySelector(".submenu-wrapper");

    if (submenuWrapper) {
        const submenu = document.querySelector(".submenu"),
            submenuToggle = document.querySelector(".submenu-toggler");

        if (submenuToggle && submenu) {
            submenuToggle.addEventListener("click", function (e) {
                if (!submenu.classList.contains("hide")) {
                    submenu.classList.add("hide");
                    submenuWrapper.querySelector(
                        "button.submenu-toggler span"
                    ).style.transform = "rotate(315deg)";
                } else {
                    submenu.classList.remove("hide");
                    submenuWrapper.querySelector(
                        "button.submenu-toggler span"
                    ).style.transform = "rotate(0deg)";
                }
            });
        }
    }

    // Icons credit visibility
    const iconsCredit = document.querySelector(".icons-credit");
    if (iconsCredit) {
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
    searchInput?.addEventListener("focus", function () {
        this.placeholder = "Search or jump to...";
    });

    searchInput?.addEventListener("blur", function () {
        this.placeholder = "Type CTRL + / to search";
    });

    // Adding focus to search element if user press the "/" button
    document.addEventListener("keyup", function (e) {
        if (e.ctrlKey && e.key === "/" && searchInput) {
            searchInput.focus();
        }
    });

    // Button to top function
    const buttonToTop = document.querySelector(".going-to-top");
    buttonToTop?.addEventListener("click", function (e) {
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

    // SETTINGS menu listener
    const settingsButton = document.querySelector(
        'a[aria-controls="settings-submenu"]'
    );

    if (settingsButton) {
        settingsButton.addEventListener("click", function (e) {
            e.preventDefault();

            const submenu = document.querySelector(".submenu#settings-submenu");
            if (submenu && !submenu.classList.contains("show")) {
                submenu.classList.toggle("show");
            } else if (submenu && submenu.classList.contains("show")) {
                submenu.classList.toggle("show");
            }
        });
    }

    // LOGOUT leistener
    const signOutButton = document.querySelector('a[aria-label="Signout"]');
    if (signOutButton) {
        signOutButton.addEventListener("click", async function (e) {
            e.preventDefault();

            const status = CREATE_STATUS_ELEMENT("Keluar dari aplikasi");
            try {
                const dialog = new ConfirmDialog({
                    title: "Konfirmasi Keluar",
                    message:
                        "Apakah Anda yakin ingin keluar dari aplikasi ini?",
                    icon: "✅",
                    iconClass: "success",
                    confirmClass: "danger",
                });

                const result = await dialog.show();

                if (result) {
                    window.location.href = signOutButton.href || "/signout";
                }
            } catch (error) {
                console.error("Gagal keluar dari aplikasi:", error);
                FLASH_MESSAGE({
                    message: error.message,
                    title: "Gagal menyimpan perubahan pada data pengguna terkait",
                    type: "error",
                });
            } finally {
                REMOVE_STATUS_ELEMENT(status);
            }
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
    const modalDismissElements = document.querySelectorAll(
        "[data-dismiss='modal']"
    );
    if (modalDismissElements) {
        modalDismissElements.forEach((element) => {
            element.addEventListener("click", () => {
                const modal = element.closest(".modal");
                toggleModal(modal, false);
            });
        });
    }

    const modalTriggerElements = document.querySelectorAll("[data-modal]");
    if (modalTriggerElements) {
        modalTriggerElements.forEach((element) => {
            element.addEventListener("click", () => {
                const targetModal = document.querySelector(
                    element.dataset.target
                );
                toggleModal(targetModal);
            });
        });
    }
})();
