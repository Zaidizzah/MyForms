class ConfirmDialog {
    constructor(options = {}) {
        this.options = {
            title: "Konfirmasi",
            message: "Apakah Anda yakin?",
            icon: "⚠️",
            iconClass: "warning",
            confirmText: "OK",
            cancelText: "Batal",
            confirmClass: "primary",
            cancelClass: "secondary",
            closeOnOverlayClick: false,
            closeOnEscape: true,
            autoFocus: true,
            ...options,
        };

        this.overlay = null;
        this.resolve = null;
        this.reject = null;
        this.isActive = false;

        this.createDialog();
        this.bindEvents();
    }

    createDialog() {
        // Create overlay
        this.overlay = document.createElement("div");
        this.overlay.className = "confirm-dialog-overlay";
        this.overlay.setAttribute("aria-hidden", "true");
        this.overlay.tabIndex = -1;
        this.overlay.setAttribute("role", "dialog");
        this.overlay.setAttribute("aria-modal", "true");
        this.overlay.setAttribute("aria-labelledby", "confirm-dialog-title");
        this.overlay.setAttribute("aria-describedby", "confirm-dialog-message");

        // Create dialog HTML
        this.overlay.innerHTML = `
            <!-- Confirmation dialog -->
            <div class="confirm-dialog-container">
                <div class="confirm-dialog-header" id="confirm-dialog-title">
                    <h3 class="confirm-dialog-title">${this.options.title}</h3>
                    <button class="confirm-dialog-close" type="button">&times;</button>
                </div>
                <div class="confirm-dialog-content">
                    <span class="confirm-dialog-icon ${this.options.iconClass}">${this.options.icon}</span>
                    <span class="confirm-dialog-message" id="confirm-dialog-message">${this.options.message}</span>
                </div>
                <div class="confirm-dialog-footer">
                    <button class="confirm-dialog-button ${this.options.cancelClass}" type="button" role="button" data-action="cancel">
                        ${this.options.cancelText}
                    </button>
                    <button class="confirm-dialog-button ${this.options.confirmClass}" type="button" role="button" data-action="confirm">
                        ${this.options.confirmText}
                    </button>
                </div>
            </div>
        `;

        // Append to body
        document.body.appendChild(this.overlay);
    }

    bindEvents() {
        // Button clicks
        this.overlay.addEventListener("click", (e) => {
            if (
                e.target.classList.contains("confirm-dialog-button") &&
                e.target.dataset.action !== undefined &&
                e.target.dataset.action === "confirm"
            ) {
                this.close(true);
            } else if (
                e.target.classList.contains("confirm-dialog-button") &&
                e.target.dataset.action !== undefined &&
                e.target.dataset.action === "cancel"
            ) {
                this.close(false);
            } else if (e.target.classList.contains("confirm-dialog-close")) {
                this.close(false);
            } else if (
                this.options.closeOnOverlayClick &&
                e.target === this.overlay
            ) {
                this.close(false);
            } else if (
                this.options.closeOnOverlayClick === false &&
                e.target === this.overlay
            ) {
                // Animate dialog element with cubic bezier
                this.overlay.style.transform = "scale(1.05)";

                // Wait for animation to complete
                setTimeout(() => {
                    this.overlay.style.transform = "scale(1)";
                }, 300);
            }
        });

        // Keyboard events
        if (this.options.closeOnEscape) {
            this.keydownHandler = (e) => {
                if (e.key === "Escape" && this.isActive) {
                    this.close(false);
                }
            };
            document.addEventListener("keydown", this.keydownHandler);
        }
    }

    show() {
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
            this.isActive = true;

            // Show dialog overlay
            setTimeout(() => {
                this.overlay.classList.add("active");
                this.overlay.setAttribute("aria-hidden", "false");
            }, 300);

            // Auto focus
            if (this.options.autoFocus) {
                setTimeout(() => {
                    const confirmButton = this.overlay.querySelector(
                        '[data-action="confirm"]'
                    );
                    if (confirmButton) {
                        confirmButton.focus();
                    }
                }, 300);
            }
        });
    }

    close(confirmed) {
        if (!this.isActive) return;

        this.isActive = false;
        this.overlay.classList.remove("active");
        this.overlay.setAttribute("aria-hidden", "true");

        // Wait for animation to complete
        setTimeout(() => {
            if (this.resolve) {
                this.resolve(confirmed);
            }
            this.destroy();
        }, 300);
    }

    destroy() {
        // Remove event listeners
        if (this.keydownHandler) {
            document.removeEventListener("keydown", this.keydownHandler);
        }

        // Remove from DOM
        if (this.overlay) {
            this.overlay.remove();
        }

        // Clear references
        this.overlay = null;
        this.resolve = null;
        this.reject = null;
    }

    // Update dialog content
    updateContent(options) {
        if (!this.overlay) return;

        const titleEl = this.overlay.querySelector(".confirm-dialog-title");
        const messageEl = this.overlay.querySelector(".confirm-dialog-message");
        const iconEl = this.overlay.querySelector(".confirm-dialog-icon");
        const confirmBtn = this.overlay.querySelector(
            '[data-action="confirm"]'
        );
        const cancelBtn = this.overlay.querySelector('[data-action="cancel"]');

        if (options.title && titleEl) {
            titleEl.textContent = options.title;
        }
        if (options.message && messageEl) {
            messageEl.textContent = options.message;
        }
        if (options.icon && iconEl) {
            iconEl.textContent = options.icon;
        }
        if (options.iconClass && iconEl) {
            iconEl.className = `confirm-dialog-icon ${options.iconClass}`;
        }
        if (options.confirmText && confirmBtn) {
            confirmBtn.textContent = options.confirmText;
        }
        if (options.cancelText && cancelBtn) {
            cancelBtn.textContent = options.cancelText;
        }
    }

    // Static methods untuk kemudahan penggunaan
    static async confirm(message, title = "Konfirmasi") {
        const dialog = new ConfirmDialog({
            title,
            message,
            icon: "❓",
            iconClass: "info",
        });
        return await dialog.show();
    }

    static async alert(message, title = "Peringatan") {
        const dialog = new ConfirmDialog({
            title,
            message,
            icon: "⚠️",
            iconClass: "warning",
            confirmText: "OK",
            cancelText: "",
            closeOnOverlayClick: false,
        });

        // Hide cancel button
        const cancelBtn = dialog.overlay.querySelector(
            '[data-action="cancel"]'
        );
        if (cancelBtn) {
            cancelBtn.style.display = "none";
        }

        return await dialog.show();
    }

    static async deleteConfirm(message, title = "Hapus Data") {
        const dialog = new ConfirmDialog({
            title,
            message,
            icon: "🗑️",
            iconClass: "danger",
            confirmText: "Hapus",
            confirmClass: "danger",
        });
        return await dialog.show();
    }

    static async success(message, title = "Berhasil") {
        const dialog = new ConfirmDialog({
            title,
            message,
            icon: "✅",
            iconClass: "success",
            confirmText: "OK",
            confirmClass: "success",
            cancelText: "",
            closeOnOverlayClick: false,
        });

        // Hide cancel button
        const cancelBtn = dialog.overlay.querySelector(
            '[data-action="cancel"]'
        );
        if (cancelBtn) {
            cancelBtn.style.display = "none";
        }

        return await dialog.show();
    }
}
