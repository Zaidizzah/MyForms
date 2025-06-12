(() => {
    "use strict";

    const formBuilderElement = document.getElementById("form-builder");
    window.formBuilder = new FormBuilder({
        url: document.querySelector("#form-builder[data-base-url]")?.dataset
            .baseUrl,
        FileUploadManagerConfig: {
            uploadUrl: formBuilderElement?.dataset.uploadUrl,
            deleteUrl: formBuilderElement?.dataset.deleteUrl,
        },
    });

    const listsAnchorElement = document.querySelector("#lists-anchor");
    const listsAnchorTogglerElement = listsAnchorElement?.querySelector(
        ".lists-anchor-toggler"
    );

    if (listsAnchorElement && listsAnchorTogglerElement) {
        listsAnchorTogglerElement.addEventListener("click", () => {
            listsAnchorElement.classList.toggle("active");
        });

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.type === "childList") {
                    // Add event listener to new anchor items
                    mutation.addedNodes.forEach((node) => {
                        if (
                            node.classList &&
                            node.classList.contains("anchor-item")
                        ) {
                            node.addEventListener("click", () => {
                                const anchorControlElement =
                                    node.getAttribute("aria-controls") || "";
                                const anchorElement = document.querySelector(
                                    `.${anchorControlElement}`
                                );

                                // Set to slidding into anchor element
                                anchorElement?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "center",
                                });
                            });
                        }
                    });

                    // Remove event listener from removed anchor items
                    mutation.removedNodes.forEach((node) => {
                        if (
                            node.classList &&
                            node.classList.contains("anchor-item")
                        ) {
                            node.removeEventListener("click", () => {});
                        }
                    });
                }
            });
        });

        observer.observe(listsAnchorElement, {
            childList: true,
            subtree: true,
        });
    }
})();
