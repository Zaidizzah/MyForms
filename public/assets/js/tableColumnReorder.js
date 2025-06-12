class ColumnVisibilityToggler {
    constructor(tableSelector) {
        this.table = document.querySelector(tableSelector);
        this.columnStates = new Map();
        this.init();
    }

    init() {
        this.setupToggleVisibility();
        this.initializeColumnStates();
    }

    setupToggleVisibility() {
        const toggler = document.querySelector(".toggler-visibility");
        if (!toggler) return;

        const trigger = toggler.querySelector(".toggler-visibility-trigger");
        const dropdown = toggler.querySelector(".toggler-visibility-dropdown");

        // Toggle dropdown visibility
        trigger.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("show");
            trigger.classList.toggle("active");
        });

        // Close dropdown when clicking outside
        document.addEventListener("click", (e) => {
            if (!toggler.contains(e.target)) {
                dropdown.classList.remove("show");
                trigger.classList.remove("active");
            }
        });

        this.generateCheckboxes(dropdown);
    }

    generateCheckboxes(dropdown) {
        // Add "Show All" option
        const showAllWrapper = document.createElement("div");
        showAllWrapper.classList.add("toggler-visibility-wrapper", "show-all");
        showAllWrapper.role = "button";
        showAllWrapper.ariaLabel =
            "Toggle visibility of sortable status to original visibility";
        showAllWrapper.textContent = "Tampilkan semua";
        showAllWrapper.addEventListener("click", () => {
            this.showAllColumns();
        });
        dropdown.appendChild(showAllWrapper);

        // Get column data from thead
        const columnHeaders = this.table.querySelectorAll("thead th");
        columnHeaders.forEach((column, index) => {
            if (column.dataset.draggable !== "false") {
                // Create checkbox wrapper
                const checkboxWrapper = document.createElement("div");
                checkboxWrapper.classList.add("toggler-visibility-wrapper");
                checkboxWrapper.role = "group";
                checkboxWrapper.ariaLabel = `Toggle visibility of sortable status for column ${column.textContent.trim()}`;

                // Create checkbox
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.id = `toggle-orderable-status-${index}`;
                checkbox.checked = true;
                checkbox.ariaRequired = "false";

                // Store initial state
                this.columnStates.set(index, true);

                checkbox.addEventListener("change", () => {
                    this.toggleColumnVisibility(index, checkbox.checked);
                });

                // Create label
                const label = document.createElement("label");
                label.htmlFor = `toggle-orderable-status-${index}`;
                label.textContent = column.textContent.trim();

                // Append elements
                checkboxWrapper.appendChild(checkbox);
                checkboxWrapper.appendChild(label);
                dropdown.appendChild(checkboxWrapper);

                // Make wrapper clickable
                checkboxWrapper.addEventListener("click", (e) => {
                    if (e.target !== checkbox) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event("change"));
                    }
                });
            }
        });
    }

    initializeColumnStates() {
        const columnHeaders = this.table.querySelectorAll("thead th");
        columnHeaders.forEach((column, index) => {
            if (column.dataset.draggable !== "false") {
                this.columnStates.set(index, true);
            }
        });
    }

    toggleColumnVisibility(columnIndex, isVisible) {
        this.columnStates.set(columnIndex, isVisible);

        // Toggle header visibility
        const headerCell = this.table.querySelector(
            `thead th:nth-child(${columnIndex + 1})`
        );
        if (headerCell) {
            if (isVisible) {
                headerCell.classList.remove("column-hidden");
            } else {
                headerCell.classList.add("column-hidden");
            }
        }

        // Toggle body cells visibility
        const bodyCells = this.table.querySelectorAll(
            `tbody td:nth-child(${columnIndex + 1})`
        );
        bodyCells.forEach((cell) => {
            if (isVisible) {
                cell.classList.remove("column-hidden");
            } else {
                cell.classList.add("column-hidden");
            }
        });

        this.updateTriggerText();
    }

    showAllColumns() {
        // Reset all checkboxes to checked
        const checkboxes = document.querySelectorAll(
            '.toggler-visibility input[type="checkbox"]'
        );
        checkboxes.forEach((checkbox, index) => {
            checkbox.checked = true;
            this.columnStates.set(index, true);
        });

        // Show all columns
        const hiddenElements = this.table.querySelectorAll(".column-hidden");
        hiddenElements.forEach((element) => {
            element.classList.remove("column-hidden");
        });

        this.updateTriggerText();
    }

    updateTriggerText() {
        const trigger = document.querySelector(".toggler-visibility-trigger");
        const visibleCount = Array.from(this.columnStates.values()).filter(
            (state) => state
        ).length;
        const totalCount = this.columnStates.size;

        if (visibleCount === totalCount) {
            trigger.textContent = "Tampilkan semua";
        } else {
            trigger.textContent = `${visibleCount}/${totalCount} kolom ditampilkan`;
        }
    }
}

// Initialize the toggler when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new ColumnVisibilityToggler("#data-table");
});

// Your original method integrated into the class structure
// You can use this method if you prefer the original approach
function setupTogglerVisibility(element) {
    const togglerVisibility = document.createElement("div");
    togglerVisibility.classList.add("toggler-visibility");
    togglerVisibility.ariaLabel = "Toggle visibility of sortable status";
    togglerVisibility.setAttribute("aria-controls", "orderable-status");
    togglerVisibility.ariaHidden = "true";

    // Set wrapper element for all toggler visibility or reset visibility to original visibility
    const wrapper = document.createElement("div");
    wrapper.classList.add("toggler-visibility-wrapper", "show-all");
    wrapper.role = "button";
    wrapper.ariaLabel =
        "Toggle visibility of sortable status to original visibility";
    wrapper.textContent = "Tampilkan semua";
    wrapper.addEventListener("click", () => {
        // Show all columns
        const table = document.querySelector("#data-table");
        const hiddenElements = table.querySelectorAll(".column-hidden");
        hiddenElements.forEach((element) => {
            element.classList.remove("column-hidden");
        });

        // Reset all checkboxes
        const checkboxes = togglerVisibility.querySelectorAll(
            'input[type="checkbox"]'
        );
        checkboxes.forEach((checkbox) => {
            checkbox.checked = true;
        });
    });
    togglerVisibility.appendChild(wrapper);

    // Get data from thead table or column
    const table = document.querySelector("#data-table");
    const columnData = table.querySelectorAll("thead th");
    columnData.forEach((column, index) => {
        if (column.dataset.draggable !== "false") {
            // create wrapper element
            const checkboxWrapper = document.createElement("div");
            checkboxWrapper.classList.add("toggler-visibility-wrapper");
            checkboxWrapper.role = "group";
            checkboxWrapper.ariaLabel = `Toggle visibility of sortable status for column ${column.textContent.trim()}`;

            // create checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `toggle-orderable-status-${index}`;
            checkbox.checked = true;
            checkbox.ariaRequired = "false";
            checkbox.addEventListener("change", () => {
                const columnIndex = index + 1; // CSS nth-child is 1-based

                if (checkbox.checked) {
                    // Show column
                    const headerCell = table.querySelector(
                        `thead th:nth-child(${columnIndex})`
                    );
                    const bodyCells = table.querySelectorAll(
                        `tbody td:nth-child(${columnIndex})`
                    );

                    if (headerCell)
                        headerCell.classList.remove("column-hidden");
                    bodyCells.forEach((cell) =>
                        cell.classList.remove("column-hidden")
                    );
                } else {
                    // Hide column
                    const headerCell = table.querySelector(
                        `thead th:nth-child(${columnIndex})`
                    );
                    const bodyCells = table.querySelectorAll(
                        `tbody td:nth-child(${columnIndex})`
                    );

                    if (headerCell) headerCell.classList.add("column-hidden");
                    bodyCells.forEach((cell) =>
                        cell.classList.add("column-hidden")
                    );
                }
            });

            // create label
            const label = document.createElement("label");
            label.htmlFor = `toggle-orderable-status-${index}`;
            label.textContent = column.textContent.trim();

            // Append to wrapper
            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
            togglerVisibility.appendChild(checkboxWrapper);
        }
    });

    element.appendChild(togglerVisibility);
    return element;
}

class TableColumnReorder {
    constructor(tableSelector, options = {}) {
        this.table = document.querySelector(tableSelector);
        this.options = {
            resetButtonSelector: options.resetButtonSelector || null,
            onReorder: options.onReorder || null,
            onReset: options.onReset || null,
            ...options,
        };

        this.draggedColumn = null;
        this.originalOrder = [];
        this.currentOrder = [];

        this.init();
    }

    init() {
        if (!this.table) {
            console.error("Table tidak ditemukan");
            return;
        }

        this.setupOrderableStatus();
        this.setupOriginalOrder();
        this.setupDragAndDrop();
        this.setupResetButton();
        this.updateStatus("kolom siap dipindahkan");
    }

    setupOrderableStatus() {
        const orderableStatus = document.createElement("div");
        orderableStatus.classList.add("orderable-status");
        orderableStatus.id = "orderable-status";
        orderableStatus.role = "status";
        orderableStatus.ariaAtomic = "true";
        orderableStatus.ariaHasPopup = "true";
        orderableStatus.setAttribute("aria-live", "polite");

        // Check if table id is defined
        if (!this.table.id)
            orderableStatus.setAttribute("aria-controls", this.table.id);

        const statusText = document.createElement("span");
        statusText.classList.add("orderable-status-text");
        statusText.role = "button";
        statusText.textContent =
            "This table is sortable. Click a column header and drag to reorder.";
        statusText.dataset.tooltip = "true";
        statusText.dataset.tooltipTitle =
            "Tabel ini dapat diurutkan dengan mengklik judul kolom dan menggeser judul kolom, serta klik untuk melihat opsi visibilitas kolom.";
        // Setup eventListener for status text
        statusText.addEventListener("click", () => {
            const togglerVisibilityElement = statusText.nextElementSibling;
            if (
                togglerVisibilityElement &&
                togglerVisibilityElement.classList.contains(
                    "toggler-visibility"
                )
            ) {
                togglerVisibilityElement.classList.toggle("show");
            }
        });
        orderableStatus.appendChild(statusText);

        // initialize tooltip
        tooltipManager.init(statusText);

        // Initialize element toggler visibility
        const tableWrapper = this.table.parentElement;
        if (tableWrapper && tableWrapper.classList.contains(".table-wrapper")) {
            tableWrapper.insertAdjacentElement(
                "afterbegin",
                this.#setupTogllerVisibility(orderableStatus)
            );
        } else {
            this.table.insertAdjacentElement(
                "afterend",
                this.#setupTogllerVisibility(orderableStatus)
            );
        }
    }

    #setupTogllerVisibility(element) {
        const togglerVisibility = document.createElement("div");
        togglerVisibility.classList.add("toggler-visibility");
        togglerVisibility.ariaLabel = "Toggle visibility of sortable status";
        togglerVisibility.setAttribute("aria-controls", "orderable-status");
        togglerVisibility.ariaHidden = "true";

        // Set wrapper element for all toggler visibility or reset visibility to original visibility
        const wrapper = document.createElement("div");
        wrapper.classList.add("toggler-visibility-wrapper", "show-all");
        wrapper.role = "button";
        wrapper.ariaLabel =
            "Toggle visibility of sortable status to original visibility";
        wrapper.ariaDisabled = "false";
        wrapper.textContent = "Tampilkan semua";
        wrapper.addEventListener("click", () => {
            // Show all columns
            const hiddenElements =
                this.table.querySelectorAll(".column-hidden");
            hiddenElements.forEach((element) => {
                element.classList.remove("column-hidden");
            });

            // Reset all checkboxes
            const checkboxes = togglerVisibility.querySelectorAll(
                'input[type="checkbox"]'
            );
            checkboxes.forEach((checkbox) => {
                checkbox.checked = true;
            });
        });
        togglerVisibility.appendChild(wrapper);

        // Get data from thead table or column
        const columnData = this.table.querySelectorAll("thead th");
        columnData.forEach((column, index) => {
            // create wrapper element
            const checkboxWrapper = document.createElement("div");
            checkboxWrapper.classList.add("toggler-visibility-wrapper");
            checkboxWrapper.role = "group";
            checkboxWrapper.ariaLabel = `Toggle visibility of sortable status for column ${column.textContent.trim()}`;

            // create checkbox
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `toggle-orderable-status-${index}`;
            checkbox.checked = true;
            checkbox.ariaRequired = "false";

            checkbox.addEventListener("change", () => {
                const columnIndex = index + 1;

                if (checkbox.checked) {
                    // Show column
                    const headerCell = this.table.querySelector(
                        `thead th:nth-child(${columnIndex})`
                    );
                    const bodyCells = this.table.querySelectorAll(
                        `tbody td:nth-child(${columnIndex})`
                    );

                    if (headerCell)
                        headerCell.classList.remove("column-hidden");
                    bodyCells.forEach((cell) =>
                        cell.classList.remove("column-hidden")
                    );
                } else {
                    // Hide column
                    const headerCell = this.table.querySelector(
                        `thead th:nth-child(${columnIndex})`
                    );
                    const bodyCells = this.table.querySelectorAll(
                        `tbody td:nth-child(${columnIndex})`
                    );

                    if (headerCell) headerCell.classList.add("column-hidden");
                    bodyCells.forEach((cell) =>
                        cell.classList.add("column-hidden")
                    );
                }

                // Disable last checkbox if there is only one left
                const uncheckedCheckboxes = togglerVisibility.querySelectorAll(
                    '.toggler-visibility-wrapper input[type="checkbox"]:not(:checked)'
                );
                if (uncheckedCheckboxes.length === 1) {
                    uncheckedCheckboxes.forEach((checkbox) => {
                        checkbox.disabled = true;
                        checkbox.ariaDisabled = "true";
                    });
                }
            });

            // create label
            const label = document.createElement("label");
            label.htmlFor = `toggle-orderable-status-${index}`;
            label.textContent = column.textContent.trim();

            // Append to wrapper
            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
            togglerVisibility.appendChild(checkboxWrapper);
        });

        element.appendChild(togglerVisibility);
        return element;
    }

    setupOriginalOrder() {
        const headers = this.table.querySelectorAll("thead th");
        headers.forEach((header, index) => {
            if (!header.hasAttribute("data-original-index")) {
                header.setAttribute("data-original-index", index);
            }
            this.originalOrder.push(index);
            this.currentOrder.push(index);
        });
    }

    setupDragAndDrop() {
        const headers = this.table.querySelectorAll("thead th");

        headers.forEach((header, index) => {
            // Check if column is draggable
            const isDraggable = header.dataset.draggable !== "false";

            if (!isDraggable) {
                header.draggable = false;
                header.style.cursor = "not-allowed";
                header.setAttribute("aria-disabled", "true");
                header.setAttribute("tabindex", "-1");
                header.setAttribute("data-tooltip", "true");
                header.setAttribute(
                    "data-tooltip-text",
                    "Kolom tidak dapat dipindahkan"
                );
                return;
            }

            header.draggable = true;
            header.style.cursor = "grab";

            header.addEventListener("dragstart", (e) =>
                this.handleDragStart(e, index)
            );
            header.addEventListener("dragover", (e) => this.handleDragOver(e));
            header.addEventListener("dragenter", (e) =>
                this.handleDragEnter(e)
            );
            header.addEventListener("dragleave", (e) =>
                this.handleDragLeave(e)
            );
            header.addEventListener("drop", (e) => this.handleDrop(e, index));
            header.addEventListener("dragend", (e) => this.handleDragEnd(e));
        });
    }

    handleDragStart(e, columnIndex) {
        this.draggedColumn = columnIndex;
        e.target.classList.add("dragging");
        e.target.style.cursor = "grabbing";

        // Set drag effect
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.outerHTML);

        // === Custom drag image preview ===
        const original = e.target;
        const computedStyle = window.getComputedStyle(original);

        const preview = document.createElement("div");
        preview.textContent = original.textContent.trim();
        preview.style.width = computedStyle.width;
        preview.style.height = computedStyle.height;
        preview.style.padding = computedStyle.padding;
        preview.style.margin = computedStyle.margin;
        preview.style.font = computedStyle.font;
        preview.style.fontSize = computedStyle.fontSize;
        preview.style.fontWeight = computedStyle.fontWeight;
        preview.style.lineHeight = computedStyle.lineHeight;
        preview.style.textAlign = computedStyle.textAlign;
        preview.style.verticalAlign = computedStyle.verticalAlign;
        preview.style.color = "var(--white-color)";
        preview.style.backgroundColor = "var(--black-1-color)";
        preview.style.border = "2px solid var(--border-color)";
        preview.style.boxShadow = computedStyle.boxShadow;
        preview.style.borderRadius = computedStyle.borderRadius;
        preview.style.opacity = "1";

        document.body.appendChild(preview);
        e.dataTransfer.setDragImage(preview, 10, 10);
        setTimeout(() => document.body.removeChild(preview), 0);

        this.updateStatus(
            `Sedang memindahkan kolom "${e.target.textContent.trim()}"`
        );
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    }

    handleDragEnter(e) {
        e.preventDefault();
        if (
            e.target.tagName === "TH" &&
            !e.target.classList.contains("dragging") &&
            e.target.dataset.draggable !== "false"
        ) {
            e.target.classList.add("drag-over");
        }
    }

    handleDragLeave(e) {
        if (e.target.tagName === "TH") {
            e.target.classList.remove("drag-over");
        }
    }

    handleDrop(e, targetIndex) {
        e.preventDefault();

        // Check if target column is draggable
        const targetHeader =
            this.table.querySelectorAll("thead th")[targetIndex];
        if (targetHeader && targetHeader.dataset.draggable === "false") {
            this.updateStatus(
                "Tidak dapat meletakkan di kolom yang tidak dapat dipindahkan"
            );
            this.clearDragStyles();
            return;
        }

        if (this.draggedColumn !== null && this.draggedColumn !== targetIndex) {
            this.reorderColumns(this.draggedColumn, targetIndex);
            this.updateStatus(
                `Kolom berhasil dipindahkan ke posisi ${targetIndex + 1}`
            );

            // Callback
            if (this.options.onReorder) {
                this.options.onReorder(
                    this.draggedColumn,
                    targetIndex,
                    this.currentOrder
                );
            }
        }

        this.clearDragStyles();
    }

    handleDragEnd(e) {
        this.clearDragStyles();
        e.target.style.cursor = "grab";
        this.draggedColumn = null;
    }

    clearDragStyles() {
        const headers = this.table.querySelectorAll("thead th");
        headers.forEach((header) => {
            header.classList.remove("dragging", "drag-over");
        });
    }

    reorderColumns(fromIndex, toIndex) {
        const headers = Array.from(this.table.querySelectorAll("thead th"));
        const rows = Array.from(this.table.querySelectorAll("tbody tr"));

        // Reorder headers
        const headerRow = this.table.querySelector("thead tr");
        const movedHeader = headers[fromIndex];
        headerRow.removeChild(movedHeader);

        if (toIndex >= headers.length - 1) {
            headerRow.appendChild(movedHeader);
        } else {
            headerRow.insertBefore(movedHeader, headers[toIndex]);
        }

        // Reorder body cells
        rows.forEach((row) => {
            const cells = Array.from(row.children);
            const movedCell = cells[fromIndex];
            row.removeChild(movedCell);

            if (toIndex >= cells.length - 1) {
                row.appendChild(movedCell);
            } else {
                row.insertBefore(movedCell, cells[toIndex]);
            }
        });

        // Update current order
        const movedItem = this.currentOrder.splice(fromIndex, 1)[0];
        this.currentOrder.splice(toIndex, 0, movedItem);

        // Update reset button state
        this.updateResetButton();
    }

    setupResetButton() {
        if (this.options.resetButtonSelector) {
            const resetBtn = document.querySelector(
                this.options.resetButtonSelector
            );
            if (resetBtn) {
                resetBtn.addEventListener("click", () => this.resetOrder());
                this.updateResetButton();
            }
        }
    }

    updateResetButton() {
        if (this.options.resetButtonSelector) {
            const resetBtn = document.querySelector(
                this.options.resetButtonSelector
            );
            if (resetBtn) {
                const hasChanged = !this.arraysEqual(
                    this.currentOrder,
                    this.originalOrder
                );
                resetBtn.disabled = !hasChanged;
            }
        }
    }

    resetOrder() {
        if (this.arraysEqual(this.currentOrder, this.originalOrder)) {
            return;
        }

        // Rebuild table with original order
        const headers = Array.from(this.table.querySelectorAll("thead th"));
        const rows = Array.from(this.table.querySelectorAll("tbody tr"));

        // Sort headers by original index
        const sortedHeaders = headers.sort((a, b) => {
            return (
                parseInt(a.getAttribute("data-original-index")) -
                parseInt(b.getAttribute("data-original-index"))
            );
        });

        // Clear and rebuild header row
        const headerRow = this.table.querySelector("thead tr");
        headerRow.innerHTML = "";
        sortedHeaders.forEach((header) => headerRow.appendChild(header));

        // Rebuild body rows
        rows.forEach((row) => {
            const cells = Array.from(row.children);
            const sortedCells = [];

            this.originalOrder.forEach((originalIndex) => {
                const currentIndex = this.currentOrder.indexOf(originalIndex);
                sortedCells.push(cells[currentIndex]);
            });

            row.innerHTML = "";
            sortedCells.forEach((cell) => row.appendChild(cell));
        });

        // Reset order arrays
        this.currentOrder = [...this.originalOrder];

        this.updateStatus("Urutan kolom telah direset ke posisi asli");
        this.updateResetButton();

        // Callback
        if (this.options.onReset) {
            this.options.onReset(this.currentOrder);
        }
    }

    updateStatus(message) {
        if (typeof CREATE_STATUS_ELEMENT === "function") {
            const statusElementId = CREATE_STATUS_ELEMENT(message);

            // Clear status after 2.5 seconds
            setTimeout(() => {
                REMOVE_STATUS_ELEMENT(statusElementId);
            }, 2500);
        }
    }

    arraysEqual(a, b) {
        return a.length === b.length && a.every((val, i) => val === b[i]);
    }

    // Public methods
    getCurrentOrder() {
        return [...this.currentOrder];
    }

    getOriginalOrder() {
        return [...this.originalOrder];
    }

    isModified() {
        return !this.arraysEqual(this.currentOrder, this.originalOrder);
    }

    destroy() {
        const headers = this.table.querySelectorAll("thead th");
        headers.forEach((header) => {
            header.draggable = false;
            header.style.cursor = "default";

            // Remove event listeners would need more complex implementation
            // header.removeEventListener("dragstart", this.handleDragStart);
            // header.removeEventListener("dragover", this.handleDragOver);
            // header.removeEventListener("dragenter", this.handleDragEnter);
            // header.removeEventListener("dragleave", this.handleDragLeave);
            // header.removeEventListener("drop", this.handleDrop);
            // header.removeEventListener("dragend", this.handleDragEnd);
        });
    }
}

// ===CONTOH PENGGUNAAN=== //
// const tableReorder = new TableColumnReorder("#tabel-user", {
//     resetButtonSelector: "#reset-table-order",
//     onReorder: function (fromIndex, toIndex, currentOrder) {
//         console.log("Kolom dipindahkan dari", fromIndex, "ke", toIndex);
//         console.log("Urutan saat ini:", currentOrder);
//     },
//     onReset: function (currentOrder) {
//         console.log("Tabel direset, urutan:", currentOrder);
//     },
// });
