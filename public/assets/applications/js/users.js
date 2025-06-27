(() => {
    "use strict";

    // Initialize table reorder
    const tableReorder = new TableColumnReorder("#tabel-user", {
        resetButtonSelector: "#reset-table-order",
    });

    // Attach tableReorder to window object
    window.tableReorder = tableReorder;

    const panelFormEditUser = document.querySelector("#panel-form-edit-user");
    const dataBaseURLEdit = document.querySelector(
        "#tabel-user[data-base-url-edit]"
    )?.dataset.baseUrlEdit;

    const btnEditUser = document.querySelectorAll(".edit-user-button");
    if (btnEditUser) {
        btnEditUser.forEach((element) => {
            element.addEventListener("click", async (e) => {
                e.preventDefault();

                const loader = APPEND_LOADER(
                        "#panel-form-edit-user",
                        "beforeend"
                    ),
                    gettingStatus = CREATE_STATUS_ELEMENT(
                        "Mengambil data pengguna terkait"
                    );

                document.querySelector("#tab-form-edit-user")?.click();
                const endpoint = dataBaseURLEdit.replace(
                    ":uuid",
                    element?.dataset.uuid.replace(":", "")
                );

                try {
                    const response = await fetch(endpoint, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            "XSRF-TOKEN": XSRF_TOKEN,
                            "X-CSRF-TOKEN": CSRF_TOKEN,
                        },
                        credentials: "include",
                    });

                    // check status response if the status code is in (401, 403) then return false
                    if (!CHECK_STATUS_RESPONSE(response)) return false;

                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    }

                    const result = await response.json();

                    if (!result.success) {
                        throw new Error(
                            result.message ||
                                "Gagal mengambil data pengguna dari server."
                        );
                    }

                    const { message, success, view } = await result;

                    if (panelFormEditUser)
                        panelFormEditUser.insertAdjacentHTML("beforeend", view);

                    // Getting last elemen of edit user form
                    const appendedEditForm = panelFormEditUser.querySelector(
                        "form.form-edit-user:last-child"
                    );
                    if (appendedEditForm) {
                        appendedEditForm.addEventListener(
                            "submit",
                            async (e) => {
                                e.preventDefault();

                                const status = CREATE_STATUS_ELEMENT(
                                    "Menyimpan perubahan pada data pengguna"
                                );
                                try {
                                    const dialog = new ConfirmDialog({
                                        title: "Konfirmasi Simpan",
                                        message:
                                            "Apakah Anda yakin ingin menyimpan perubahan dari data pengguna ini?",
                                        icon: "✅",
                                        iconClass: "success",
                                    });

                                    const result = await dialog.show();

                                    if (result) appendedEditForm.submit();
                                } catch (error) {
                                    console.error(
                                        "Gagal menyimpan perubahan pada data pengguna:",
                                        error
                                    );
                                    FLASH_MESSAGE({
                                        message: error.message,
                                        title: "Gagal menyimpan perubahan pada data pengguna terkait",
                                        type: "error",
                                    });
                                } finally {
                                    REMOVE_STATUS_ELEMENT(status);
                                }
                            }
                        );
                    }

                    FLASH_MESSAGE({
                        message: message,
                        title: "Data pengguna terkait ditemukan",
                        type: success ? "success" : "error",
                    }); // flash message alert
                } catch (error) {
                    console.error("File upload error:", error);
                    FLASH_MESSAGE({
                        message: error.message,
                        title: "Gagal mengambil data pengguna terkait",
                        type: "error",
                    });
                } finally {
                    REMOVE_LOADER(loader);
                    REMOVE_STATUS_ELEMENT(gettingStatus);
                }
            });
        });
    }

    const formDeleteUser = document.querySelectorAll("form.form-delete-user");
    if (formDeleteUser) {
        formDeleteUser.forEach((element) => {
            element.addEventListener("submit", async (e) => {
                e.preventDefault();

                const status = CREATE_STATUS_ELEMENT("Menghapus data pengguna");
                try {
                    const dialog = new ConfirmDialog({
                        title: "Konfirmasi Hapus",
                        message:
                            "Apakah Anda yakin ingin menghapus data pengguna ini?",
                        icon: "⚠️",
                        iconClass: "warning",
                    });

                    const result = await dialog.show();

                    if (result) element.submit(); // submit form if result is true to delete user data
                } catch (error) {
                    console.error("Gagal menghapus data pengguna:", error);
                    FLASH_MESSAGE({
                        message: error.message,
                        title: "Gagal menghapus data pengguna terkait",
                        type: "error",
                    });
                } finally {
                    REMOVE_STATUS_ELEMENT(status);
                }
            });
        });
    }

    const formAddUser = document.querySelector("form.form-add-user");
    if (formAddUser) {
        formAddUser.addEventListener("submit", async (e) => {
            e.preventDefault();

            const status = CREATE_STATUS_ELEMENT("Menambahkan data pengguna");
            try {
                const dialog = new ConfirmDialog({
                    title: "Konfirmasi Tambah",
                    message:
                        "Apakah Anda yakin ingin menambahkan data pengguna ini?",
                    icon: "✅",
                    iconClass: "success",
                });

                const result = await dialog.show();

                if (result) formAddUser.submit();
            } catch (error) {
                console.error("Gagal menambahkan data pengguna baru:", error);
                FLASH_MESSAGE({
                    message: error.message,
                    title: "Gagal menambahkan data pengguna baru",
                    type: "error",
                });
            } finally {
                REMOVE_STATUS_ELEMENT(status);
            }
        });
    }

    // create observer to take record of appended dinamyc element to assign eventlistener
})();
