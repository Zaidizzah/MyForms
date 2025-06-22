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
        this.columnVisibility = [];
        this.headerElements = [];
        this.originalHeaders = [];

        this.init();
    }

    init() {
        if (!this.table) {
            console.error("Table tidak ditemukan");
            return;
        }

        // Setup original order FIRST before anything else
        this.setupOriginalOrder();
        this.setupOrderableStatus();
        this.setupDragAndDrop();
        this.setupResetButton();
        this.updateStatus("kolom siap dipindahkan");
    }

    setupOrderableStatus() {
        const orderableStatus = document.createElement("div");
        orderableStatus.classList.add("orderable-status");
        orderableStatus.id = "orderable-status";
        orderableStatus.role = "status";
        orderableStatus.setAttribute("aria-atomic", "true");
        orderableStatus.setAttribute("aria-haspopup", "true");
        orderableStatus.setAttribute("aria-live", "polite");

        if (this.table.id) {
            orderableStatus.setAttribute("aria-controls", this.table.id);
        }

        const statusText = document.createElement("span");
        statusText.classList.add("orderable-status-text");
        statusText.role = "button";
        statusText.textContent =
            "This table is sortable. Click a column header and drag to reorder.";
        statusText.dataset.tooltip = "true";
        statusText.dataset.tooltipTitle =
            "Tabel ini dapat diurutkan dengan mengklik judul kolom dan menggeser judul kolom, serta klik untuk melihat opsi visibilitas kolom.";

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

        // Initialize tooltip if tooltipManager exists
        if (typeof tooltipManager !== "undefined") {
            tooltipManager.init(statusText);
        }

        const tableWrapper = this.table.parentElement;
        if (tableWrapper && tableWrapper.classList.contains("table-wrapper")) {
            tableWrapper.insertAdjacentElement(
                "afterend",
                this.#setupToggleVisibility(orderableStatus)
            );
        } else {
            this.table.insertAdjacentElement(
                "afterend",
                this.#setupToggleVisibility(orderableStatus)
            );
        }
    }

    #setupToggleVisibility(element) {
        const togglerVisibility = document.createElement("div");
        togglerVisibility.classList.add("toggler-visibility");
        togglerVisibility.setAttribute(
            "aria-label",
            "Toggle visibility of sortable status"
        );
        togglerVisibility.setAttribute("aria-controls", "orderable-status");
        togglerVisibility.setAttribute("aria-hidden", "true");

        // Show all button
        const wrapper = document.createElement("div");
        wrapper.classList.add("toggler-visibility-wrapper", "show-all");
        wrapper.role = "button";
        wrapper.setAttribute("aria-label", "Show all columns");
        wrapper.setAttribute("aria-disabled", "false");
        wrapper.textContent = "Tampilkan semua";
        wrapper.addEventListener("click", () => this.showAllColumns());
        togglerVisibility.appendChild(wrapper);

        // Create checkboxes for each column using original headers
        this.originalHeaders.forEach((headerText, index) => {
            this.columnVisibility[index] = true;

            const checkboxWrapper = document.createElement("div");
            checkboxWrapper.classList.add("toggler-visibility-wrapper");
            checkboxWrapper.role = "group";
            checkboxWrapper.setAttribute(
                "aria-label",
                `Toggle visibility for column ${headerText}`
            );

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `toggle-orderable-status-${index}`;
            checkbox.checked = true;
            checkbox.setAttribute("aria-required", "false");
            checkbox.dataset.originalIndex = index;

            checkbox.addEventListener("change", (e) =>
                this.handleVisibilityChange(e, index)
            );

            const label = document.createElement("label");
            label.htmlFor = `toggle-orderable-status-${index}`;
            label.textContent = headerText;

            checkboxWrapper.appendChild(checkbox);
            checkboxWrapper.appendChild(label);
            togglerVisibility.appendChild(checkboxWrapper);
        });

        element.appendChild(togglerVisibility);
        return element;
    }

    showAllColumns() {
        // Show all columns
        this.columnVisibility.fill(true);
        this.applyColumnVisibility();

        // Reset all checkboxes
        const togglerVisibility = document.querySelector(".toggler-visibility");
        if (togglerVisibility) {
            const checkboxes = togglerVisibility.querySelectorAll(
                'input[type="checkbox"]'
            );
            checkboxes.forEach((checkbox) => {
                checkbox.checked = true;
                checkbox.disabled = false;
                checkbox.setAttribute("aria-disabled", "false");
            });
        }
    }

    handleVisibilityChange(event, originalIndex) {
        const checkbox = event.target;
        this.columnVisibility[originalIndex] = checkbox.checked;
        this.applyColumnVisibility();
        this.updateVisibilityControls();
    }

    applyColumnVisibility() {
        const headerRow = this.table.querySelector("thead tr");
        const bodyRows = this.table.querySelectorAll("tbody tr");

        if (!headerRow) return;

        const headers = Array.from(headerRow.children);

        // Apply visibility to headers based on their current position
        headers.forEach((header, currentIndex) => {
            const originalIndex = parseInt(
                header.getAttribute("data-original-index")
            );

            // Check if originalIndex is valid
            if (
                isNaN(originalIndex) ||
                originalIndex < 0 ||
                originalIndex >= this.columnVisibility.length
            ) {
                return;
            }

            const isVisible = this.columnVisibility[originalIndex];
            header.style.display = isVisible ? "" : "none";

            // Apply to corresponding body cells
            bodyRows.forEach((row) => {
                const cell = row.children[currentIndex];
                if (cell) {
                    cell.style.display = isVisible ? "" : "none";
                }
            });
        });
    }

    updateVisibilityControls() {
        const togglerVisibility = document.querySelector(".toggler-visibility");
        if (!togglerVisibility) return;

        const checkboxes = togglerVisibility.querySelectorAll(
            'input[type="checkbox"]'
        );
        const visibleCount = this.columnVisibility.filter(
            (visible) => visible
        ).length;

        if (visibleCount === 1) {
            checkboxes.forEach((checkbox) => {
                const originalIndex = parseInt(checkbox.dataset.originalIndex);
                if (this.columnVisibility[originalIndex]) {
                    checkbox.disabled = true;
                    checkbox.setAttribute("aria-disabled", "true");
                } else {
                    checkbox.disabled = false;
                    checkbox.setAttribute("aria-disabled", "false");
                }
            });
        } else {
            checkboxes.forEach((checkbox) => {
                checkbox.disabled = false;
                checkbox.setAttribute("aria-disabled", "false");
            });
        }
    }

    setupOriginalOrder() {
        const headers = this.table.querySelectorAll("thead th");

        // Clear arrays first
        this.originalHeaders = [];
        this.originalOrder = [];
        this.currentOrder = [];
        this.columnVisibility = [];

        // Store original headers and setup tracking
        headers.forEach((header, index) => {
            const headerText = header.textContent.trim();
            this.originalHeaders.push(headerText);

            if (!header.hasAttribute("data-original-index")) {
                header.setAttribute("data-original-index", index);
            }

            this.originalOrder.push(index);
            this.currentOrder.push(index);
            this.columnVisibility.push(true); // Initialize visibility
        });

        // Store reference to header elements
        this.headerElements = Array.from(headers);
    }

    setupDragAndDrop() {
        this.refreshDragHandlers();
    }

    refreshDragHandlers() {
        const headers = this.table.querySelectorAll("thead th");

        headers.forEach((header, currentIndex) => {
            // Clear existing handlers
            if (header._dragHandlers) {
                Object.entries(header._dragHandlers).forEach(
                    ([event, handler]) => {
                        header.removeEventListener(event, handler);
                    }
                );
            }

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

            const handlers = {
                dragstart: (e) => this.handleDragStart(e, currentIndex),
                dragover: (e) => this.handleDragOver(e),
                dragenter: (e) => this.handleDragEnter(e),
                dragleave: (e) => this.handleDragLeave(e),
                drop: (e) => this.handleDrop(e, currentIndex),
                dragend: (e) => this.handleDragEnd(e),
            };

            Object.entries(handlers).forEach(([event, handler]) => {
                header.addEventListener(event, handler);
            });

            header._dragHandlers = handlers;
        });
    }

    handleDragStart(e, columnIndex) {
        this.draggedColumn = columnIndex;
        e.target.classList.add("dragging");
        e.target.style.cursor = "grabbing";

        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/html", e.target.outerHTML);

        // Custom drag image
        const original = e.target;
        const computedStyle = window.getComputedStyle(original);
        const preview = document.createElement("div");

        preview.textContent = original.textContent.trim();
        Object.assign(preview.style, {
            width: computedStyle.width,
            height: computedStyle.height,
            padding: computedStyle.padding,
            margin: computedStyle.margin,
            font: computedStyle.font,
            fontSize: computedStyle.fontSize,
            fontWeight: computedStyle.fontWeight,
            lineHeight: computedStyle.lineHeight,
            textAlign: computedStyle.textAlign,
            verticalAlign: computedStyle.verticalAlign,
            color: "var(--white-color, #fff)",
            backgroundColor: "var(--black-1-color, #333)",
            border: "2px solid var(--border-color, #ddd)",
            boxShadow: computedStyle.boxShadow,
            borderRadius: computedStyle.borderRadius,
            opacity: "1",
            position: "absolute",
            top: "-1000px",
            left: "-1000px",
        });

        document.body.appendChild(preview);
        e.dataTransfer.setDragImage(preview, 10, 10);
        setTimeout(() => {
            if (document.body.contains(preview)) {
                document.body.removeChild(preview);
            }
        }, 0);

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
        const headerRow = this.table.querySelector("thead tr");
        const bodyRows = Array.from(this.table.querySelectorAll("tbody tr"));

        if (!headerRow) return;

        // Get current DOM order
        const headers = Array.from(headerRow.children);
        const draggedHeader = headers[fromIndex];

        if (!draggedHeader) return;

        // Move header
        headerRow.removeChild(draggedHeader);

        if (toIndex >= headers.length) {
            headerRow.appendChild(draggedHeader);
        } else {
            const referenceHeader = headers[toIndex];
            if (referenceHeader) {
                headerRow.insertBefore(draggedHeader, referenceHeader);
            } else {
                headerRow.appendChild(draggedHeader);
            }
        }

        // Move corresponding cells in each body row
        bodyRows.forEach((row) => {
            const cells = Array.from(row.children);
            const draggedCell = cells[fromIndex];

            if (!draggedCell) return;

            row.removeChild(draggedCell);

            if (toIndex >= cells.length) {
                row.appendChild(draggedCell);
            } else {
                const referenceCell = cells[toIndex];
                if (referenceCell) {
                    row.insertBefore(draggedCell, referenceCell);
                } else {
                    row.appendChild(draggedCell);
                }
            }
        });

        // Update currentOrder array
        const movedOriginalIndex = this.currentOrder.splice(fromIndex, 1)[0];
        this.currentOrder.splice(toIndex, 0, movedOriginalIndex);

        // Refresh drag handlers with new positions
        this.refreshDragHandlers();

        // Reapply visibility after reorder
        this.applyColumnVisibility();

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
                resetBtn.setAttribute(
                    "aria-disabled",
                    hasChanged ? "false" : "true"
                );
            }
        }
    }

    resetOrder() {
        if (this.arraysEqual(this.currentOrder, this.originalOrder)) {
            return;
        }

        const headerRow = this.table.querySelector("thead tr");
        const bodyRows = Array.from(this.table.querySelectorAll("tbody tr"));

        if (!headerRow) return;

        // Create mapping of current position to original position
        const currentHeaders = Array.from(headerRow.children);
        const currentBodiesMatrix = bodyRows.map((row) =>
            Array.from(row.children)
        );

        // Sort by original index
        const sortedData = this.originalOrder
            .map((originalIndex) => {
                const currentPos = this.currentOrder.indexOf(originalIndex);
                if (currentPos === -1) return null;

                return {
                    header: currentHeaders[currentPos],
                    bodyCells: currentBodiesMatrix.map(
                        (rowCells) => rowCells[currentPos]
                    ),
                };
            })
            .filter((data) => data !== null);

        // Clear and rebuild header
        headerRow.innerHTML = "";
        sortedData.forEach((data) => {
            if (data.header) {
                headerRow.appendChild(data.header);
            }
        });

        // Clear and rebuild body rows
        bodyRows.forEach((row, rowIndex) => {
            row.innerHTML = "";
            sortedData.forEach((data) => {
                if (data.bodyCells && data.bodyCells[rowIndex]) {
                    row.appendChild(data.bodyCells[rowIndex]);
                }
            });
        });

        // Reset order arrays
        this.currentOrder = [...this.originalOrder];

        // Refresh handlers and visibility
        this.refreshDragHandlers();
        this.applyColumnVisibility();

        this.updateStatus("Urutan kolom telah direset ke posisi asli");
        this.updateResetButton();

        if (this.options.onReset) {
            this.options.onReset(this.currentOrder);
        }
    }

    updateStatus(message) {
        if (typeof CREATE_STATUS_ELEMENT === "function") {
            const statusElementId = CREATE_STATUS_ELEMENT(message);
            setTimeout(() => {
                if (typeof REMOVE_STATUS_ELEMENT === "function") {
                    REMOVE_STATUS_ELEMENT(statusElementId);
                }
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

    getColumnVisibility() {
        return [...this.columnVisibility];
    }

    setColumnVisibility(index, visible) {
        if (index >= 0 && index < this.columnVisibility.length) {
            this.columnVisibility[index] = visible;
            this.applyColumnVisibility();
            this.updateVisibilityControls();

            // Update corresponding checkbox
            const checkbox = document.querySelector(
                `#toggle-orderable-status-${index}`
            );
            if (checkbox) {
                checkbox.checked = visible;
            }
        }
    }

    destroy() {
        const headers = this.table.querySelectorAll("thead th");
        headers.forEach((header) => {
            header.draggable = false;
            header.style.cursor = "default";

            if (header._dragHandlers) {
                Object.entries(header._dragHandlers).forEach(
                    ([event, handler]) => {
                        header.removeEventListener(event, handler);
                    }
                );
                delete header._dragHandlers;
            }
        });

        const statusElement = document.getElementById("orderable-status");
        if (statusElement) {
            statusElement.remove();
        }

        const togglerVisibility = document.querySelector(".toggler-visibility");
        if (togglerVisibility) {
            togglerVisibility.remove();
        }
    }
}

// Usage example
/*
const tableReorder = new TableColumnReorder("#tabel-user", {
    resetButtonSelector: "#reset-table-order",
    onReorder: function (fromIndex, toIndex, currentOrder) {
        console.log("Kolom dipindahkan dari", fromIndex, "ke", toIndex);
        console.log("Urutan saat ini:", currentOrder);
    },
    onReset: function (currentOrder) {
        console.log("Tabel direset, urutan:", currentOrder);
    },
});
*/
