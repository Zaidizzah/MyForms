(() => {
    "use strict";

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

    const tooltipManager = new TooltipManager();
    // tooltipManager.init(); // Initialize all tooltips with data-tooltip="true"

    // Adding: recaptcha refresh feature
    const recaptcha = document.querySelector(".recaptcha#recaptcha");
    if (recaptcha) {
        const refreshCaptchaButton = document.querySelector(
            "button#refresh-captcha"
        );
        const recaptchaImage = recaptcha.querySelector("img");

        refreshCaptchaButton?.addEventListener("click", async () => {
            const loader = APPEND_LOADER(
                ".form-content-wrapper",
                "afterbegin",
                true
            );
            const status = CREATE_STATUS_ELEMENT("Refreshing captcha");

            try {
                const response = await fetch("/api/captcha/refresh", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "X-CSRF-TOKEN": CSRF_TOKEN,
                        "X-XSRF-TOKEN": XSRF_TOKEN,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(
                        result.message ||
                            "Gagal mengambil data captcha untuk refresh."
                    );
                }

                recaptchaImage.src = result.captcha_src; // Change the path of captcha image in image src attribute
            } catch (error) {
                console.error("Captcha refresh error:", error);
                FLASH_MESSAGE({
                    message: error.message,
                    type: "error",
                    position: "afterbegin", // Beginning of element with class "form-content-wrapper"
                });
            } finally {
                REMOVE_LOADER(loader);
                REMOVE_STATUS_ELEMENT(status);
            }
        });
    }
})();
