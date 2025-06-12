class QuestionManager {
    constructor(type, counter) {
        this.id = Date.now() + Math.random();
        this.type = type;
        this.label = "";
        this.image = null;
        this.is_required = false;
        this.score = 0;
        this.sort_order = counter;
        this.options = [];
    }

    /**
     * Updates question field
     * @param {string} field - Field name
     * @param {*} value - New value
     */
    updateField(field, value) {
        this[field] = value;
    }

    /**
     * Adds new option to question
     */
    addOption() {
        const option = {
            label: "",
            value: "",
            image: null,
            is_correct: false,
            sort_order: this.options.length,
        };
        this.options.push(option);
    }

    /**
     * Updates option field
     * @param {number} index - Option index
     * @param {string} field - Field name
     * @param {*} value - New value
     */
    updateOption(index, field, value) {
        if (this.options[index]) {
            this.options[index][field] = value;
            if (field === "label") {
                this.options[index].value = value
                    .toLowerCase()
                    .replace(/\s+/g, "_");
            }
        }
    }

    /**
     * Removes option by index
     * @param {number} index - Option index
     */
    removeOption(index) {
        this.options.splice(index, 1);
    }

    /**
     * Checks if question needs options
     * @returns {boolean}
     */
    needsOptions() {
        return ["radio", "checkbox", "dropdown"].includes(this.type);
    }

    /**
     * Validates question data
     * @returns {Object} - Validation result
     */
    validate() {
        if (!this.label.trim()) {
            return {
                valid: false,
                error: `Pertanyaan nomor ${this.sort_order} harus diisi!`,
            };
        }

        if (this.needsOptions() && this.options.length === 0) {
            return {
                valid: false,
                error: `Pertanyaan nomor ${this.sort_order} harus memiliki minimal satu pilihan!`,
            };
        }

        return { valid: true };
    }
}
