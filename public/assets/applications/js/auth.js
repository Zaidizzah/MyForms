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
})();
