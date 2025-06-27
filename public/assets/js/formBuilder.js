class FormBuilder {
    /**
     * Constructor for FormBuilder
     *
     * @param {Object} config - Configuration object
     * @param {string} [config.url=null] - URL to send request to
     * @param {string} [config.method="CREATE"] - HTTP Method to use ('CREATE' => 'POST', and 'EDIT' => 'UPDATE')
     * @param {Object} [config.FileUploadManagerConfig] - Configuration object
     *     for FileUploadManager
     * @param {string} [config.FileUploadManagerConfig.uploadUrl=""] - URL to
     *     upload files to
     * @param {string} [config.FileUploadManagerConfig.deleteUrl=""] - URL to
     *     delete files from
     */
    constructor({
        url = null,
        method = "CREATE",
        FileUploadManagerConfig = {
            uploadUrl: "",
            deleteUrl: "",
        },
    }) {
        this.url = url;
        this.method = method;
        this.questions = [];
        this.selectedQuestionType = null;
        this.fileManager = new FileUploadManager(FileUploadManagerConfig);
        this.tooltipManager = window.tooltipManager;
        this.FormBuilderElement =
            document.getElementById("form-builder") || null;
        this.questionCounterNum = 0;

        // Flags untuk mencegah bug
        this.eventsInitialized = false;
        this.saveInProgress = false;

        this.init();
    }

    /**
     * Initializes the form builder
     */
    init() {
        this.bindEvents();
        // If question image doesn't exist or not object value return;

        // Set status if form is already modified
        CREATE_STATUS_ELEMENT("Formulir telah siap untuk dimodifikasi", 3000);
    }

    /**
     * Removes all event listeners to prevent duplicates
     */
    unbindEvents() {
        // Remove event listeners dari save button
        const saveBtn = document.querySelector(".save-form-btn");
        if (saveBtn) {
            saveBtn.replaceWith(saveBtn.cloneNode(true));
        }

        // Remove event listeners dari question types
        document.querySelectorAll(".question-type").forEach((type) => {
            const newType = type.cloneNode(true);
            type.parentNode.replaceChild(newType, type);
        });

        // Remove event listeners dari form type select
        const formTypeSelect = document.getElementById("form-type");
        if (formTypeSelect) {
            const newSelect = formTypeSelect.cloneNode(true);
            formTypeSelect.parentNode.replaceChild(newSelect, formTypeSelect);
        }
    }

    /**
     * Binds event listeners
     */
    bindEvents() {
        // Prevent duplicate event binding
        if (this.eventsInitialized) {
            this.unbindEvents();
        }

        // Question type selection dengan error handling
        document.querySelectorAll(".question-type").forEach((type) => {
            type.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.selectQuestionType(type);
            });
        });

        // Form type change
        const formTypeSelect = document.getElementById("form-type");
        if (formTypeSelect) {
            formTypeSelect.addEventListener("change", () => {
                this.render();
            });
        }

        // Save form button dengan protection
        const saveBtn = document.querySelector(".save-form-btn");
        if (saveBtn) {
            saveBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.saveForm();
            });
        }

        // Reset form button
        const resetBtn = document.querySelector(".reset-form-btn");
        if (resetBtn) {
            resetBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const status = CREATE_STATUS_ELEMENT(
                    "Menghapus atau mereset ulang formulir"
                );
                try {
                    const dialog = new ConfirmDialog({
                        title: "Konfirmasi reset formulir",
                        message:
                            "Apakah Anda yakin ingin menghapus atau mereset ulang formulir ini?",
                        icon: "⚠️",
                        iconClass: "warning",
                    });

                    const result = await dialog.show();

                    if (result) this.resetForm();
                } catch (error) {
                    console.error(
                        "Gagal menghapus atau mereset ulang formulir:",
                        error
                    );
                    FLASH_MESSAGE({
                        message: error.message,
                        title: "Gagal menghapus atau mereset ulang formulir",
                        type: "error",
                    });
                } finally {
                    REMOVE_STATUS_ELEMENT(status);
                }
            });
        }

        // Add question button
        const addQuestionBtn = document.querySelector(".add-question-btn");
        if (addQuestionBtn) {
            addQuestionBtn.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addQuestion();
            });
        }

        this.eventsInitialized = true;
    }

    /**
     * Selects question type and auto-adds question
     * @param {HTMLElement} element - Clicked element
     */
    selectQuestionType(element) {
        try {
            // Remove active class from all
            document
                .querySelectorAll(".question-type")
                .forEach((t) => t.classList.remove("active"));

            // Add active class to clicked
            element.classList.add("active");

            // Set selectedQuestionType first
            this.selectedQuestionType = element.dataset.type;

            // Validate and add question
            if (this.selectedQuestionType) {
                this.addQuestion(this.selectedQuestionType);
            } else {
                console.warn("Question type not found in dataset");
                FLASH_MESSAGE({
                    type: "error",
                    message:
                        "Gagal untuk memilih jenis pertanyaan: Jenis pertanyaan tidak ditemukan dalam dataset elemen",
                });
            }
        } catch (error) {
            console.error("Error selecting question type:", error);
            FLASH_MESSAGE({
                type: "error",
                message:
                    "Gagal untuk memilih jenis pertanyaan: " + error.message,
            });
        }
    }

    /**
     * Adds a new question
     * @param {string|null} type - Question type
     */
    addQuestion(type = null) {
        const questionType = type || this.selectedQuestionType;

        // Robust validation
        if (!questionType) {
            console.warn("Question type not specified, skipping add");
            FLASH_MESSAGE({
                type: "error",
                message:
                    "Gagal menambahkan pertanyaan baru: Jenis pertanyaan tidak ditemukan",
            });
            return;
        }

        try {
            this.questionCounter({
                added: true,
            });
            const question = new QuestionManager(
                questionType,
                this.questionCounterNum
            );
            this.questions.push(question);
            // set anchor item
            this.setAchorQuestions(question.sort_order);

            this.render();
        } catch (error) {
            console.error("Error adding question:", error);
            FLASH_MESSAGE({
                type: "error",
                message: "Gagal menambahkan pertanyaan baru: " + error.message,
            });

            this.questionCounter({
                added: false,
            }); // Rollback counter

            // rollback anchor item
            this.deleteAnchorQuestions(false);
        }
    }

    /**
     * Updates question field
     * @param {number} id - Question ID
     * @param {string} field - Field name
     * @param {*} value - New value
     */
    updateQuestion(id, field, value) {
        try {
            const question = this.questions.find((q) => q.id === id);
            if (question) {
                question.updateField(field, value);
                if (field === "type") {
                    question.options = [];
                    this.render();
                }
            }
        } catch (error) {
            console.error("Error updating question:", error);
            FLASH_MESSAGE({
                type: "error",
                message: "Gagal memperbarui pertanyaan: " + error.message,
            });
        }
    }

    /**
     * Handles file upload for question image
     * @param {number} questionId - Question ID
     * @param {File} file - Uploaded file
     */
    async handleQuestionImageUpload(questionId, file) {
        if (!file) return;

        const validation = this.fileManager.validateFile(file);
        if (!validation.valid) {
            FLASH_MESSAGE({
                type: "error",
                message:
                    "Gagal mengunggah gambar pertanyaan: " + validation.error,
            });
            return;
        }

        try {
            // Upload file using new method
            const result = await this.fileManager.uploadFile(file, "question");
            console.log(result);

            const question = this.questions.find((q) => q.id === questionId);
            if (question) {
                // Check if result is an object
                if (typeof result !== "object") {
                    throw new Error("Invalid file format");
                }
                // Store both URL and file info
                question.image = result;

                console.log(question);

                this.render();
            }
        } catch (error) {
            console.error("Error uploading question image:", error);
            FLASH_MESSAGE({
                type: "error",
                message: "Gagal mengunggah gambar pertanyaan: " + error.message,
            });
        }
    }

    /**
     * Handles file upload for option image
     * @param {number} questionId - Question ID
     * @param {number} optionIndex - Option index
     * @param {File} file - Uploaded file
     */
    async handleOptionImageUpload(questionId, optionIndex, file) {
        if (!file) return;

        const validation = this.fileManager.validateFile(file);
        if (!validation.valid) {
            FLASH_MESSAGE({
                type: "error",
                message: "Gagal mengupload gambar pilihan: " + validation.error,
            });
            return;
        }

        try {
            // Upload file using new method
            const result = await this.fileManager.uploadFile(file, "option");

            const question = this.questions.find((q) => q.id === questionId);
            if (question && question.options[optionIndex]) {
                // Check if result is an object
                if (typeof result !== "object") {
                    throw new Error("Invalid file format");
                }
                // Store both URL and file info
                question.options[optionIndex].image = result;

                this.render();
            }
        } catch (error) {
            console.error("Error uploading option image:", error);
            FLASH_MESSAGE({
                type: "error",
                message: "Gagal mengupload gambar pilihan: " + error.message,
            });
        }
    }

    /**
     * Handles deletion of question image
     * @param {number} questionId - Question ID
     */
    async handleQuestionImageDelete(questionId) {
        const question = this.questions.find((q) => q.id === questionId);
        // If question image doesn't exist or not object value return
        if (!question) return;
        if (typeof question.image !== "object" || !question.image) return;

        try {
            // Delete from server if it's not a blob URL
            if (!question.image.url.startsWith("blob:")) {
                await this.fileManager.deleteFile(question.image.id);
            } else {
                // Revoke blob URL
                this.fileManager.revokePreviewUrl(question.image.url);
            }

            // Clear image data
            question.image = null;

            this.render();
        } catch (error) {
            console.error("Error deleting question image:", error);
            FLASH_MESSAGE({
                type: "error",
                message: "Gagal menghapus gambar pertanyaan: " + error.message,
            });
        }
    }

    /**
     * Handles deletion of option image
     * @param {number} questionId - Question ID
     * @param {number} optionIndex - Option index
     */
    async handleOptionImageDelete(questionId, optionIndex) {
        const question = this.questions.find((q) => q.id === questionId);
        // If question image doesn't exist or not object value return
        if (!question || !question.options[optionIndex]) return;
        if (
            typeof question.options[optionIndex].image !== "object" ||
            !question.options[optionIndex].image
        )
            return;

        try {
            const option = question.options[optionIndex];

            // Delete from server if it's not a blob URL
            if (!option.image.url.startsWith("blob:")) {
                await this.fileManager.deleteFile(option.image.id);
            } else {
                // Revoke blob URL
                this.fileManager.revokePreviewUrl(option.image.url);
            }

            // Clear image data
            option.image = null;

            this.render();
        } catch (error) {
            console.error("Error deleting option image:", error);
            FLASH_MESSAGE({
                message: "Gagal menghapus gambar pilihan: " + error.message,
                type: "error",
            });
        }
    }

    /**
     * Adds option to question
     * @param {number} questionId - Question ID
     */
    addOption(questionId) {
        try {
            const question = this.questions.find((q) => q.id === questionId);
            if (question) {
                question.addOption();
                console.log(question);

                this.render();
            }
        } catch (error) {
            console.error("Error adding option:", error);
            FLASH_MESSAGE({
                type: "error",
                message: "Gagal menambahkan pilihan: " + error.message,
            });
        }
    }

    /**
     * Updates option field
     * @param {number} questionId - Question ID
     * @param {number} optionIndex - Option index
     * @param {string} field - Field name
     * @param {*} value - New value
     */
    updateOption(questionId, optionIndex, field, value) {
        try {
            const question = this.questions.find((q) => q.id === questionId);
            if (question) {
                question.updateOption(optionIndex, field, value);
            }
        } catch (error) {
            console.error("Error updating option:", error);
            FLASH_MESSAGE({
                type: "error",
                message: "Gagal memperbarui pilihan: " + error.message,
            });
        }
    }

    /**
     * Removes option from question
     * @param {number} questionId - Question ID
     * @param {number} optionIndex - Option index
     */
    removeOption(questionId, optionIndex) {
        try {
            const question = this.questions.find((q) => q.id === questionId);
            if (question) {
                // Delete associated image if exists
                if (question.options[optionIndex]?.image.url) {
                    this.handleOptionImageDelete(questionId, optionIndex);
                }

                question.removeOption(optionIndex);
                this.render();
            }
        } catch (error) {
            console.error("Error removing option:", error);
            FLASH_MESSAGE({
                type: "error",
                message: "Gagal menghapus pilihan: " + error.message,
            });
        }
    }

    /**
     * Deletes question
     * @param {number} id - Question ID
     */
    async deleteQuestion(id) {
        const status = CREATE_STATUS_ELEMENT(
            "Menghapus atau mereset ulang formulir"
        );
        try {
            const dialog = new ConfirmDialog({
                title: "Konfirmasi Hapus",
                message: "Apakah Anda yakin ingin menghapus pertanyaan ini?",
                icon: "⚠️",
                iconClass: "warning",
            });

            const result = await dialog.show();

            if (result) {
                const question = this.questions.find((q) => q.id === id);

                // Delete associated images
                if (question) {
                    // Delete question image
                    if (question.image.url) {
                        this.handleQuestionImageDelete(id);
                    }

                    // Delete option images
                    if (question.options) {
                        question.options.forEach((option, index) => {
                            if (option.image.url) {
                                this.handleOptionImageDelete(id, index);
                            }
                        });
                    }
                }

                this.questionCounter({
                    added: false,
                });

                // delete anchor
                this.deleteAnchorQuestions(false);
                this.questions = this.questions.filter((q) => q.id !== id);

                // re-sort question
                this.questions.sort((a, b) => a.sort_order - b.sort_order);
                this.questions.forEach((q, index) => {
                    q.sort_order = index + 1;
                });

                this.render();
            }
        } catch (error) {
            console.error("Error deleting question:", error);
            FLASH_MESSAGE({
                type: "error",
                message: "Gagal menghapus pertanyaan: " + error.message,
            });
        } finally {
            REMOVE_STATUS_ELEMENT(status);
        }
    }

    /**
     * Moves question up or down
     * @param {number} id - Question ID
     * @param {string} direction - 'up' or 'down'
     */
    moveQuestion(id, direction) {
        try {
            const index = this.questions.findIndex((q) => q.id === id);
            if (index === -1) return;

            const newIndex = direction === "up" ? index - 1 : index + 1;
            if (newIndex < 0 || newIndex >= this.questions.length) return;

            [this.questions[index], this.questions[newIndex]] = [
                this.questions[newIndex],
                this.questions[index],
            ];

            // Update sort order
            this.questions.forEach((q, i) => {
                q.sort_order = i + 1;
            });

            this.render();
        } catch (error) {
            console.error("Error moving question:", error);
            FLASH_MESSAGE({
                type: "error",
                message: "Gagal memindahkan pertanyaan: " + error.message,
            });
        }
    }

    /**
     * Renders question options
     * @param {Question} question - Question object
     * @returns {string} - HTML string
     */
    renderQuestionOptions(question) {
        if (!question.needsOptions()) return "";

        const isQuiz = document.getElementById("form-type")?.value === "quiz";

        return `
            <div class="options-container" id="options-container-${
                question.id
            }" aria-labelledby="options-label-${question.id}" role="list">
                <h4 id="options-label-${question.id}">Pilihan Jawaban:</h4>
                ${question.options
                    .map(
                        (option, index) => `
                    <div class="option-item" role="listitem" aria-label="Pertanyaan ke ${
                        index + 1
                    }">
                        <div class="option-content">
                            <input type="text" 
                                   class="btn option-input" 
                                   placeholder="Pilihan ${index + 1}" 
                                   value="${option.label}"
                                   onchange="formBuilder.updateOption(${
                                       question.id
                                   }, ${index}, 'label', this.value)" aria-required="true" required>
                            
                            <div class="image-upload-section">
                                <input type="file" 
                                       class="file-input"
                                       accept="image/jpeg, image/jpg, image/png, image/gif, image/webp"
                                       onchange="formBuilder.handleOptionImageUpload(${
                                           question.id
                                       }, ${index}, this.files[0])"
                                       style="display: none;"
                                       id="option-file-${
                                           question.id
                                       }-${index}" aria-required="false">
                                <button type="button" 
                                        role="button"
                                        class="btn upload-btn"
                                        data-tooltip="true"
                                        data-tooltip-title="Upload Gambar"
                                        onclick="document.getElementById('option-file-${
                                            question.id
                                        }-${index}').click()">
                                    📷 Upload Gambar
                                </button>
                                ${
                                    question.options[index].image &&
                                    typeof question.options[index].image ===
                                        "object" &&
                                    question.options[index].image.url &&
                                    typeof question.options[index].image.url ===
                                        "string" &&
                                    question.options[index].image.url.trim() !==
                                        ""
                                        ? `
                                    <div class="image-preview">
                                        <img src="${option.image.url}" 
                                             style="max-width: 100px; max-height: 75px; border-radius: 4px; object-fit: cover;" 
                                             data-tooltip="true" 
                                             data-tooltip-title="Gambar Pilihan ${
                                                 index + 1
                                             }${
                                              option.image.fileName
                                                  ? " - " +
                                                    option.image.fileName
                                                  : ""
                                          }" 
                                             loading="lazy" 
                                             alt="Gambar Pilihan ${index + 1}">
                                        <button type="button" 
                                                role="button"
                                                tabindex="0"
                                                class="btn cancel-btn"
                                                data-tooltip="true"
                                                data-tooltip-title="Hapus Gambar"
                                                onclick="formBuilder.handleOptionImageDelete(${
                                                    question.id
                                                }, ${index})">
                                            × Hapus
                                        </button>
                                    </div>
                                `
                                        : ""
                                }
                            </div>
                        </div>
                        
                        ${
                            isQuiz
                                ? `
                            <div class="checkbox-group">
                                <input type="checkbox" 
                                       class="correct-answer"
                                       ${option.is_correct ? "checked" : ""}
                                       onchange="formBuilder.updateOption(${
                                           question.id
                                       }, ${index}, 'is_correct', this.checked)" aria-required="false">
                                <label>Benar</label>
                            </div>
                        `
                                : ""
                        }
                        
                        <button type="button" 
                                role="button"
                                tabindex="0"
                                class="btn action-btn delete-btn" 
                                data-tooltip="true"
                                data-tooltip-title="Hapus Pilihan"
                                onclick="formBuilder.removeOption(${
                                    question.id
                                }, ${index})">×</button>
                    </div>
                `
                    )
                    .join("")}
                <button type="button" 
                        role="button"
                        tabindex="0"
                        class="btn add-option-btn" 
                        data-tooltip="true"
                        data-tooltip-title="Tambah Pilihan"
                        onclick="formBuilder.addOption(${
                            question.id
                        })">+ Tambah Pilihan</button>
            </div>
        `;
    }

    /**
     * Renders all questions
     */
    render() {
        const container = document.getElementById("questions-list");
        if (!container) return;

        if (this.questions.length === 0) {
            container.innerHTML = `
                <div class="empty-state" role="listitem" aria-labelledby="empty-state-label">
                    <div class="empty-state-icon">
                        <img class="icon" src="../../../images/application icons/empty state.jpg" loading="lazy" alt="Empty state icon">
                    </div>
                    <h4 id="empty-state-label">Belum ada pertanyaan</h4>
                    <p>Klik "Tambah Pertanyaan" atau pilih jenis pertanyaan di sebelah kiri untuk memulai</p>
                </div>
            `;
            return;
        }

        const isQuiz = document.getElementById("form-type")?.value === "quiz";

        container.innerHTML = this.questions
            .map(
                (question, index) => `
            <div class="question-item" role="listitem" data-id="${
                question.id
            }" aria-labelledby="question-label-${
                    question.id
                }" aria-describedby="question-description-${question.id}">
                <div class="question-header">
                    <div class="question-number" id="question-label-${
                        question.id
                    }">${question.sort_order}</div>
                    <div class="question-content" id="question-description-${
                        question.id
                    }">
                        <div class="question-form">
                            <div>
                                <input type="text" 
                                       class="input input-control"
                                       placeholder="Tulis pertanyaan Anda..." 
                                       value="${question.label}"
                                       onchange="formBuilder.updateQuestion(${
                                           question.id
                                       }, 'label', this.value)" aria-required="false">
                                
                                <div class="image-upload-section" style="margin-top: 10px;">
                                    <input type="file" 
                                           class="file-input"
                                           accept="image/jpeg, image/jpg, image/png, image/gif, image/webp"
                                           onchange="formBuilder.handleQuestionImageUpload(${
                                               question.id
                                           }, this.files[0])"
                                           style="display: none;"
                                           id="question-file-${
                                               question.id
                                           }" aria-required="false">
                                    <button type="button" 
                                            role="button"
                                            tabindex="0"
                                            class="btn upload-btn"
                                            data-tooltip="true"
                                            data-tooltip-title="Upload Gambar Pertanyaan"
                                            onclick="document.getElementById('question-file-${
                                                question.id
                                            }').click()">
                                        📷 Upload Gambar Pertanyaan
                                    </button>
                                    ${
                                        question.image &&
                                        typeof question.image === "object" &&
                                        question.image.url &&
                                        typeof question.image.url ===
                                            "string" &&
                                        question.image.url.trim() !== ""
                                            ? `
                                        <div class="image-preview" style="margin-top: 10px;">
                                            <img src="${question.image.url}" 
                                                 style="max-width: 200px; max-height: 150px; border-radius: 8px; object-fit: cover;" 
                                                 data-tooltip="true" 
                                                 data-tooltip-title="Gambar Pertanyaan ${
                                                     index + 1
                                                 }${
                                                  question.image.fileName
                                                      ? " - " +
                                                        question.image.fileName
                                                      : ""
                                              }" 
                                                 loading="lazy" 
                                                 alt="${question.label}">
                                            <button type="button" 
                                                    role="button"
                                                    tabindex="0"
                                                    class="btn cancel-btn"
                                                    data-tooltip="true"
                                                    data-tooltip-title="Hapus Gambar"
                                                    onclick="formBuilder.handleQuestionImageDelete(${
                                                        question.id
                                                    })">
                                                × Hapus Gambar
                                            </button>
                                        </div>
                                    `
                                            : ""
                                    }
                                </div>
                            </div>
                            
                            <div class="question-settings">
                                <select class="input" tabindex="0" onchange="formBuilder.updateQuestion(${
                                    question.id
                                }, 'type', this.value)" aria-required="false">
                                    <option value="text" ${
                                        question.type === "text"
                                            ? "selected"
                                            : ""
                                    }>Teks Singkat</option>
                                    <option value="textarea" ${
                                        question.type === "textarea"
                                            ? "selected"
                                            : ""
                                    }>Teks Panjang</option>
                                    <option value="number" ${
                                        question.type === "number"
                                            ? "selected"
                                            : ""
                                    }>Angka</option>
                                    <option value="date" ${
                                        question.type === "date"
                                            ? "selected"
                                            : ""
                                    }>Tanggal</option>
                                    <option value="radio" ${
                                        question.type === "radio"
                                            ? "selected"
                                            : ""
                                    }>Pilihan Ganda</option>
                                    <option value="checkbox" ${
                                        question.type === "checkbox"
                                            ? "selected"
                                            : ""
                                    }>Kotak Centang</option>
                                    <option value="dropdown" ${
                                        question.type === "dropdown"
                                            ? "selected"
                                            : ""
                                    }>Dropdown</option>
                                    <option value="file" ${
                                        question.type === "file"
                                            ? "selected"
                                            : ""
                                    }>Upload File</option>
                                </select>
                                
                                <div class="checkbox-group">
                                    <input type="checkbox" 
                                           id="required-${question.id}"
                                           ${
                                               question.is_required
                                                   ? "checked"
                                                   : ""
                                           }
                                           data-tooltip="true"
                                           data-tooltip-title="Pertanyaan ini wajib diisi"
                                           onchange="formBuilder.updateQuestion(${
                                               question.id
                                           }, 'is_required', this.checked)" aria-required="false">
                                    <label for="required-${
                                        question.id
                                    }">Wajib</label>
                                </div>
                                
                                ${
                                    isQuiz
                                        ? `
                                    <input type="number" 
                                           class="input"
                                           min="0"
                                           placeholder="Skor" 
                                           value="${question.score}"
                                           onchange="formBuilder.updateQuestion(${question.id}, 'score', parseInt(this.value) || 0)" aria-required="true" required>
                                `
                                        : ""
                                }
                            </div>
                        </div>
                        ${this.renderQuestionOptions(question)}
                    </div>
                    
                    <div class="question-actions">
                        <button type="button" 
                                role="button"
                                tabindex="0"
                                class="btn action-btn" 
                                data-tooltip="true"
                                data-tooltip-title="Pindah pertanyaan ke atas"
                                onclick="formBuilder.moveQuestion(${
                                    question.id
                                }, 'up')" 
                                title="Pindah ke atas">↑</button>
                        <button type="button" 
                                role="button"
                                tabindex="0"
                                class="btn action-btn" 
                                data-tooltip="true"
                                data-tooltip-title="Pindah pertanyaan ke bawah"
                                onclick="formBuilder.moveQuestion(${
                                    question.id
                                }, 'down')" 
                                title="Pindah ke bawah">↓</button>
                        <button type="button" 
                                role="button"
                                tabindex="0"
                                class="btn action-btn delete-btn" 
                                data-tooltip="true"
                                data-tooltip-title="Hapus pertanyaan"
                                onclick="formBuilder.deleteQuestion(${
                                    question.id
                                })" 
                                title="Hapus">🗑️</button>
                    </div>
                </div>
            </div>
        `
            )
            .join("");

        // Re-initialize tooltips if available
        if (this.tooltipManager) {
            this.tooltipManager.init();
        }
    }

    /**
     * Menage question counter
     *
     * @param {Object} [params={ added: true, reset: false }] - Option for managing question counter
     * @param {boolean} [params.added=true] - If true, the counter will be incremented, if false, the counter will be decremented
     * @param {boolean} [params.reset=false] - If true, the counter will be reset
     * @returns {void}
     */
    questionCounter(params = { added: true, reset: false }) {
        if (params.reset === true) {
            this.questionCounterNum = 0;
        } else if (params.added === true) {
            this.questionCounterNum += 1;
        } else if (params.added === false) {
            this.questionCounterNum =
                this.questionCounterNum <= 0 ? 0 : this.questionCounterNum - 1;
        }

        // Update counter element
        const counterElement = document.createElement("span");
        counterElement.classList.add("question-counter");
        counterElement.id = "question-counter";
        counterElement.role = "status";
        counterElement.ariaLive = "polite";
        counterElement.ariaAtomic = "true";
        counterElement.ariaLabel = "Jumlah pertanyaan";
        counterElement.dataset.tooltip = "true";
        counterElement.dataset.tooltipTitle = `Jumlah pertanyaan yang ada yaitu ${this.questionCounterNum}`;
        counterElement.textContent = `Jumlah pertanyaan: ${this.questionCounterNum}`;
        document
            .getElementById("question-counter")
            ?.replaceWith(counterElement);
    }

    setAchorQuestions(questionNumber) {
        const anchorItem = document.createElement("div");
        anchorItem.className = "anchor-item";
        anchorItem.role = "button";
        anchorItem.setAttribute(
            "aria-controls",
            `question-item:nth-child(${questionNumber})`
        );
        anchorItem.ariaLabel = `Pertanyaan ke ${questionNumber}`;
        anchorItem.dataset.tooltip = "true";
        anchorItem.dataset.tooltipTitle = `Pertanyaan ke ${questionNumber}`;
        anchorItem.textContent = `Pertanyaan ke ${questionNumber}`;

        const anchorScrollElement = document.querySelector(
            ".lists-anchor .lists-scroll"
        );
        anchorScrollElement.appendChild(anchorItem); // Add anchor item after the last anchor item
    }

    deleteAnchorQuestions(isReset) {
        if (isReset === false) {
            const anchorElement = document.querySelector(
                `.anchor-item:last-child`
            );

            // delete anchor element
            anchorElement?.remove();
        } else {
            const anchorElements = document.querySelectorAll(
                ".lists-anchor .anchor-item"
            );
            anchorElements.forEach((anchorElement) => {
                anchorElement.remove();
            });
        }
    }

    /**
     * Validates all form data
     * @returns {Object} - Validation result
     */
    validateForm() {
        const formTitle = document.getElementById("form-title")?.value;

        if (!formTitle?.trim()) {
            return { valid: false, error: "Judul formulir harus diisi!" };
        }

        if (this.questions.length === 0) {
            return {
                valid: false,
                error: "Minimal harus ada satu pertanyaan!",
            };
        }

        // Validate each question
        for (let question of this.questions) {
            const validation = question.validate();
            if (!validation.valid) {
                return validation;
            }
        }

        return { valid: true };
    }

    /**
     * Saves the form with duplicate prevention
     */
    async saveForm() {
        // check if url has been set
        if (!this.url) {
            console.warn("URL not set, skipping save");
            FLASH_MESSAGE({
                message:
                    "URL formulir belum diset! Silahkan set URL formulir terlebih dahulu. (Proses penyimpanan dibatalkan)",
                type: "error",
            });
            return;
        }

        // Prevent duplicate saves
        if (this.saveInProgress) {
            return;
        }

        this.saveInProgress = true;

        const loader = APPEND_LOADER(".save-form-btn", "afterbegin", true);
        const status = CREATE_STATUS_ELEMENT("Menyimpan formulir");
        try {
            const validation = this.validateForm();
            if (!validation.valid) {
                FLASH_MESSAGE({
                    message: "Gagal menyimpan formulir: " + validation.error,
                    type: "error",
                });
                return;
            }

            const formData = {
                title: document.getElementById("form-title")?.value,
                description: document.getElementById("form-description")?.value,
                type: document.getElementById("form-type")?.value,
                allow_edit: document.getElementById("allow-edit")?.checked,
                only_once_submit: document.getElementById("only-once")?.checked,
                questions: this.questions,
            };

            const response = await fetch(this.url, {
                method: this.method,
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "XSRF-TOKEN": XSRF_TOKEN,
                    "X-CSRF-TOKEN": CSRF_TOKEN,
                },
                body: JSON.stringify(formData),
                credentials: true,
            });

            console.log(formData, JSON.stringify(formData), response);

            // check status response if the status code is in (401, 403) then return false
            if (!CHECK_STATUS_RESPONSE(response)) return false;

            if (!response.ok) {
                throw new Error("Failed to save form");
            }

            const data = await response.json();

            const dialog = new ConfirmDialog({
                title: "Konfirmasi",
                message: "Apakah Anda ingin membuat formulir baru?",
                icon: "✅",
                iconClass: "success",
            });

            const result = await dialog.show();

            if (result) this.resetForm();
        } catch (error) {
            console.error("Error saving form:", error);
            FLASH_MESSAGE({
                message: error.message,
                type: "error",
            });
        } finally {
            this.saveInProgress = false;
            REMOVE_LOADER(loader);
            REMOVE_STATUS_ELEMENT(status);
        }
    }

    /**
     * Resets the form to initial state
     */
    resetForm() {
        const status = CREATE_STATUS_ELEMENT(
            "Menghapus atau memuat ulang formulir baru"
        );
        try {
            // Reset form fields
            const formTitle = document.getElementById("form-title");
            const formDescription = document.getElementById("form-description");
            const formType = document.getElementById("form-type");
            const allowEdit = document.getElementById("allow-edit");
            const onlyOnce = document.getElementById("only-once");

            if (formTitle) formTitle.value = "";
            if (formDescription) formDescription.value = "";
            if (formType) formType.value = "form";
            if (allowEdit) allowEdit.checked = false;
            if (onlyOnce) onlyOnce.checked = true;

            // Reset questions
            this.questions = [];
            this.questionCounterNum = 0;
            this.selectedQuestionType = null;

            // Remove active class from question types
            document
                .querySelectorAll(".question-type")
                .forEach((t) => t.classList.remove("active"));

            // Reset flags
            this.saveInProgress = false;

            // delete anchor questions
            this.deleteAnchorQuestions(true);

            this.render();
            this.questionCounter({
                reset: true,
            });
        } catch (error) {
            console.error("Error resetting form:", error);
            FLASH_MESSAGE({
                message: "Terjadi kesalahan saat memuat ulang formulir",
                type: "error",
            });
        } finally {
            REMOVE_STATUS_ELEMENT(status);
        }
    }
}
