class ErrorNotification {
    constructor(container) {
        this.container = container;
        this.init();
    }

    init() {
        this.container
            .querySelector(".error-notification-remove")
            ?.addEventListener("click", () => {
                this.container.remove();
            });

        this.container
            .querySelector(".error-notification-toggle")
            ?.addEventListener("click", () => {
                const elementContent = this.container.querySelector(
                    ".error-notification-content"
                );

                elementContent.classList.toggle("show");
                elementContent.setAttribute(
                    "aria-expanded",
                    elementContent.classList.contains("show")
                );
                elementContent.setAttribute(
                    "aria-hidden",
                    !elementContent.classList.contains("show")
                );
            });
    }
}
