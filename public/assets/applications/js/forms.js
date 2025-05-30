// Forms data
const formsData = [
    {
        id: 1,
        title: "Survey Kepuasan Pelanggan 2024",
        description:
            "Kuesioner untuk mengukur tingkat kepuasan pelanggan terhadap layanan kami",
        status: "active",
        responses: 45,
        views: 128,
        createdDate: "15 Jan 2024",
    },
    {
        id: 2,
        title: "Quiz Pengetahuan Umum",
        description: "Tes pengetahuan umum dengan 20 pertanyaan pilihan ganda",
        status: "active",
        responses: 89,
        views: 256,
        createdDate: "12 Jan 2024",
    },
    {
        id: 3,
        title: "Feedback Webinar Digital Marketing",
        description: "Form feedback untuk peserta webinar digital marketing",
        status: "closed",
        responses: 67,
        views: 145,
        createdDate: "8 Jan 2024",
    },
    {
        id: 4,
        title: "Pendaftaran Event Tech Conference",
        description: "Form pendaftaran untuk acara teknologi tahunan",
        status: "draft",
        responses: 0,
        views: 23,
        createdDate: "20 Jan 2024",
    },
    {
        id: 5,
        title: "Evaluasi Kinerja Karyawan Q1",
        description: "Form evaluasi kinerja karyawan untuk kuartal pertama",
        status: "active",
        responses: 34,
        views: 78,
        createdDate: "18 Jan 2024",
    },
    {
        id: 6,
        title: "Survey Gaya Hidup Sehat",
        description:
            "Penelitian tentang gaya hidup dan kebiasaan sehat masyarakat",
        status: "active",
        responses: 12,
        views: 45,
        createdDate: "22 Jan 2024",
    },
];

// Function to create form card HTML
function createFormCard(form) {
    const statusClass = `status-${form.status}`;
    const statusText = {
        active: "Aktif",
        draft: "Draft",
        closed: "Ditutup",
    };

    return `
        <div class="form-card" role="gridcell" id="form-card-${
            form.id
        }" aria-labelledby="form-card-header-${
        form.id
    }" aria-describedby="form-card-description-${form.id}" onclick="openForm(${
        form.id
    })">
            <div class="form-header" id="form-card-header-${form.id}">
                <div>
                    <div class="form-title">${form.title}</div>
                    <div class="form-date">${form.createdDate}</div>
                </div>
                <div class="form-status ${statusClass}">
                    ${statusText[form.status]}
                </div>
            </div>
            <div class="form-description" id="form-card-description-${
                form.id
            }">${form.description}</div>
            <div class="form-stats" id="form-card-stats-${form.id}">
                <div class="form-stat">
                    <div class="form-stat-number">${form.responses}</div>
                    <div class="form-stat-label">Respon</div>
                </div>
                <div class="form-stat">
                    <div class="form-stat-number">${form.views}</div>
                    <div class="form-stat-label">Views</div>
                </div>
            </div>
            <div class="form-actions" id="form-card-actions-${form.id}">
                <button type="button" role="button" class="btn" data-tooltip="true" data-tooltip-title="Edit form" onclick="event.stopPropagation(); editForm(${
                    form.id
                })">
                    Edit
                </button>
                <button type="button" role="button" class="btn" data-tooltip="true" data-tooltip-title="Bagikan form" onclick="event.stopPropagation(); shareForm(${
                    form.id
                })">
                    Share
                </button>
                <button type="button" role="button" class="btn" data-tooltip="true" data-tooltip-title="Lihat hasil form" onclick="event.stopPropagation(); viewResults(${
                    form.id
                })">
                    Hasil
                </button>
            </div>
        </div>
    `;
}

// Function to render forms
const formsGrid = document.getElementById("forms-grid");
function renderForms(forms) {
    const loader = APPEND_LOADER("#forms-grid", "afterbegin", true);
    if (forms.length === 0) {
        formsGrid.innerHTML = `
            <div class="empty-state" role="alert" aria-assertive="true" aria-live="polite" aria-labelledby="empty-state-label">
                <div class="empty-icon">
                    <img class="icon" src="../../../images/application icons/forms.png" loading="lazy" alt="Forms icon">
                </div>
                <h3 id="empty-state-label">Belum ada form</h3>
                <p>Mulai dengan membuat form pertama Anda</p>
            </div>
        `;
        return;
    }

    formsGrid.innerHTML = forms.map((form) => createFormCard(form)).join("");

    // re-initialize tooltip
    tooltipManager.init();

    // remove loader
    REMOVE_LOADER(loader);
}

// Function to filter forms
const filterFormsElement = document.getElementById("filter-forms");
filterFormsElement.addEventListener("change", function () {
    filterForms(formsData, this.value);
});

function filterForms(formsData, status) {
    let filteredForms;

    if (status !== "all") {
        filteredForms = formsData.filter((form) => form.status === status);
    }

    renderForms(filteredForms || formsData);
}

function shareForm(formId) {
    alert(`Share form dengan ID: ${formId}`);
}

(() => {
    "use strict";

    // Render forms
    renderForms(formsData);

    const statCards = document.querySelectorAll(".stat-card");
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            card.style.transition = "all 0.5s ease";

            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, 100);
        }, index * 100);
    });
})();
