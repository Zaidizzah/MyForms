class TabList {
    constructor(container) {
        this.container = container;
        this.tabs = container.querySelectorAll('[role="tab"]');
        this.panels = container.querySelectorAll('[role="tabpanel"]');

        if (!this.tabs.length || !this.panels.length) {
            throw new Error("Tabs and panels elements not found.");
        }

        this.init();
    }

    init() {
        this.tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                this.setActiveTab(tab.id);
            });

            tab.addEventListener("keydown", (e) => {
                const tabsArray = Array.from(this.tabs);
                const index = tabsArray.indexOf(tab);

                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    const nextTab = tabsArray[(index + 1) % tabsArray.length];
                    nextTab.focus();
                    this.setActiveTab(nextTab.id);
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    const prevTab =
                        tabsArray[
                            (index - 1 + tabsArray.length) % tabsArray.length
                        ];
                    prevTab.focus();
                    this.setActiveTab(prevTab.id);
                }
            });
        });
    }

    setActiveTab(tabId) {
        this.tabs.forEach((tab) => {
            tab.setAttribute("aria-selected", "false");
            tab.setAttribute("aria-disabled", "false");
        });

        this.panels.forEach((panel) => {
            panel.setAttribute("aria-hidden", "true");
        });

        const selectedTab = this.container.querySelector(`#${tabId}`);
        selectedTab.setAttribute("aria-selected", "true");
        selectedTab.setAttribute("aria-disabled", "true");

        const panelId = selectedTab.getAttribute("aria-controls");
        const selectedPanel = this.container.querySelector(`#${panelId}`);
        selectedPanel.setAttribute("aria-hidden", "false");
    }
}
