(() => {
    "use strict";

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
                );

                document.querySelector("#tab-form-edit-user")?.click();
                const endpoint = dataBaseURLEdit.replace(
                    ":uuid",
                    element?.dataset.uuid.replace(":", "")
                );
                const response = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        "XSRF-TOKEN": XSRF_TOKEN,
                        "X-CSRF-TOKEN": CSRF_TOKEN,
                    },
                })
                    .then(
                        (response) => response.json(),
                        (error) => console.log(error)
                    )
                    .catch((error) => console.log(error))
                    .finally(() => REMOVE_LOADER(loader));

                const { message, success, view } = await response;

                if (panelFormEditUser)
                    panelFormEditUser.insertAdjacentHTML("beforeend", view);

                FLASH_MESSAGE({
                    message: message,
                    title: "Edit User",
                    type: success ? "success" : "error",
                }); // flash message alert
            });
        });
    }
})();
