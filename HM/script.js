/* =====================================
   GLOBALPHARMA JAVASCRIPT
   ===================================== */


/* =========================
   DOM ELEMENTS
   ========================= */

const searchInput = document.getElementById("medicineSearch");
const searchButton = document.getElementById("searchButton");
const medicineResults = document.getElementById("medicineResults");
const resultsInfo = document.getElementById("resultsInfo");
const suggestionsBox = document.getElementById("suggestions");

const categoryButtons =
    document.querySelectorAll(".category-btn");

const menuToggle =
    document.getElementById("menuToggle");

const navMenu =
    document.getElementById("navMenu");

const modal =
    document.getElementById("medicineModal");

const closeModal =
    document.getElementById("closeModal");

const medicineDetails =
    document.getElementById("medicineDetails");

const enquiryForm =
    document.getElementById("enquiryForm");

const formMessage =
    document.getElementById("formMessage");

const backToTop =
    document.getElementById("backToTop");


/* =========================
   VARIABLES
   ========================= */

let currentCategory = "All";


/* =========================
   INITIAL DISPLAY
   ========================= */

displayMedicines(medicines);


/* =========================
   DISPLAY MEDICINES
   ========================= */

function displayMedicines(data) {

    medicineResults.innerHTML = "";

    if (data.length === 0) {

        resultsInfo.textContent = "";

        medicineResults.innerHTML = `
            <div class="no-results">
                <div style="font-size:45px;">🔍</div>

                <h3>Medicine not found</h3>

                <p>
                    Please check the medicine name or try another search.
                </p>
            </div>
        `;

        return;
    }


    resultsInfo.textContent =
        `${data.length} medicine${data.length > 1 ? "s" : ""} found`;


    data.forEach(medicine => {

        const card = document.createElement("div");

        card.className = "medicine-card";

        card.innerHTML = `

            <div class="medicine-icon">
                ${getMedicineIcon(medicine.category)}
            </div>

            <span class="medicine-type">
                ${escapeHTML(medicine.type)}
            </span>

            <h3>
                ${escapeHTML(medicine.name)}
            </h3>

            <p>
                <strong>Ingredient:</strong>
                ${escapeHTML(medicine.ingredient)}
            </p>

            <p>
                ${escapeHTML(medicine.description)}
            </p>

            <button
                class="details-btn"
                onclick="openMedicineDetails(${medicine.id})">
                View Details →
            </button>
        `;

        medicineResults.appendChild(card);

    });
}


/* =========================
   MEDICINE ICON
   ========================= */

function getMedicineIcon(category) {

    switch (category) {

        case "Tablet":
            return "💊";

        case "Capsule":
            return "💊";

        case "Syrup":
            return "🧴";

        case "ORS":
            return "💧";

        case "Antacid":
            return "🩺";

        default:
            return "⚕";
    }
}


/* =========================
   SEARCH
   ========================= */

function performSearch() {

    const query =
        searchInput.value.trim().toLowerCase();


    let filtered = medicines.filter(medicine => {

        const matchesSearch =
            medicine.name.toLowerCase().includes(query) ||
            medicine.ingredient.toLowerCase().includes(query) ||
            medicine.type.toLowerCase().includes(query);


        const matchesCategory =
            currentCategory === "All" ||
            medicine.category === currentCategory;


        return matchesSearch && matchesCategory;
    });


    displayMedicines(filtered);


    if (query.length > 0) {
        resultsInfo.textContent =
            `${filtered.length} result${filtered.length !== 1 ? "s" : ""} found for "${searchInput.value}"`;
    }
}


/* Search button */

searchButton.addEventListener("click", function () {

    performSearch();

    document.getElementById("medicineResults")
        .scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
});


/* Enter key */

searchInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        performSearch();
    }

});


/* =========================
   CATEGORY FILTER
   ========================= */

categoryButtons.forEach(button => {

    button.addEventListener("click", function() {

        categoryButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        currentCategory =
            this.dataset.category;

        performSearch();

    });

});


/* =========================
   SEARCH SUGGESTIONS
   ========================= */

searchInput.addEventListener("input", function() {

    const query =
        this.value.trim().toLowerCase();

    suggestionsBox.innerHTML = "";


    if (query.length < 2) {

        suggestionsBox.style.display = "none";

        return;
    }


    const matches =
        medicines
        .filter(medicine =>
            medicine.name.toLowerCase()
                .includes(query)
        )
        .slice(0, 5);


    if (matches.length === 0) {

        suggestionsBox.style.display = "none";

        return;
    }


    matches.forEach(medicine => {

        const suggestion =
            document.createElement("div");

        suggestion.className = "suggestion";

        suggestion.textContent =
            medicine.name;

        suggestion.addEventListener("click", function() {

            searchInput.value =
                medicine.name;

            suggestionsBox.style.display =
                "none";

            performSearch();

        });

        suggestionsBox.appendChild(suggestion);

    });


    suggestionsBox.style.display = "block";

});


/* Close suggestions when clicking elsewhere */

document.addEventListener("click", function(event) {

    if (!event.target.closest(".search-input-wrapper")) {

        suggestionsBox.style.display =
            "none";

    }

});


/* =========================
   MEDICINE DETAILS
   ========================= */

function openMedicineDetails(id) {

    const medicine =
        medicines.find(item => item.id === id);


    if (!medicine) {
        return;
    }


    medicineDetails.innerHTML = `

        <div class="detail-header">

            <div class="detail-icon">
                ${getMedicineIcon(medicine.category)}
            </div>

            <div>

                <span class="medicine-type">
                    ${escapeHTML(medicine.type)}
                </span>

                <h2>
                    ${escapeHTML(medicine.name)}
                </h2>

            </div>

        </div>


        <div class="detail-grid">

            <div class="detail-box">
                <strong>Brand</strong>
                <span>${escapeHTML(medicine.brand)}</span>
            </div>

            <div class="detail-box">
                <strong>Active Ingredient</strong>
                <span>${escapeHTML(medicine.ingredient)}</span>
            </div>

            <div class="detail-box">
                <strong>Strength</strong>
                <span>${escapeHTML(medicine.strength)}</span>
            </div>

            <div class="detail-box">
                <strong>Available Form</strong>
                <span>${escapeHTML(medicine.form)}</span>
            </div>

            <div class="detail-box">
                <strong>Manufacturer</strong>
                <span>${escapeHTML(medicine.manufacturer)}</span>
            </div>

            <div class="detail-box">
                <strong>Prescription</strong>
                <span>${escapeHTML(medicine.prescription)}</span>
            </div>

        </div>


        <div class="detail-section">

            <h3>Common Uses</h3>

            <p>
                ${escapeHTML(medicine.uses)}
            </p>

        </div>


        <div class="detail-section">

            <h3>Description</h3>

            <p>
                ${escapeHTML(medicine.description)}
            </p>

        </div>


        <div class="detail-section">

            <h3>Storage Information</h3>

            <p>
                ${escapeHTML(medicine.storage)}
            </p>

        </div>


        <div class="detail-section">

            <h3>Important Warnings</h3>

            <p>
                ${escapeHTML(medicine.warnings)}
            </p>

        </div>


        <div class="detail-section">

            <h3>Possible Common Side Effects</h3>

            <p>
                ${escapeHTML(medicine.sideEffects)}
            </p>

        </div>


        <div class="detail-section"
             style="background:#fff8e8;padding:18px;border-radius:10px;">

            <h3>⚠️ Safety Information</h3>

            <p>
                This information is provided for general educational
                purposes only. Do not use this page to diagnose a
                condition or decide on a personal treatment or dosage.
                Always consult a qualified doctor or pharmacist before
                using medicine.
            </p>

        </div>

    `;


    modal.classList.add("show");

    document.body.style.overflow =
        "hidden";
}


/* =========================
   CLOSE MODAL
   ========================= */

closeModal.addEventListener("click", closeMedicineModal);


function closeMedicineModal() {

    modal.classList.remove("show");

    document.body.style.overflow =
        "auto";
}


/* Close by clicking outside */

modal.addEventListener("click", function(event) {

    if (event.target === modal) {
        closeMedicineModal();
    }

});


/* Escape key */

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        closeMedicineModal();
    }

});


/* =========================
   MOBILE NAVIGATION
   ========================= */

menuToggle.addEventListener("click", function() {

    navMenu.classList.toggle("active");

});


/* Close mobile menu after clicking link */

document.querySelectorAll("#navMenu a")
    .forEach(link => {

        link.addEventListener("click", function() {

            navMenu.classList.remove("active");

        });

    });


/* =========================
   FAQ
   ========================= */

document.querySelectorAll(".faq-question")
    .forEach(question => {

        question.addEventListener("click", function() {

            const item =
                this.parentElement;

            const wasOpen =
                item.classList.contains("open");


            document.querySelectorAll(".faq-item")
                .forEach(faq => {

                    faq.classList.remove("open");

                    const icon =
                        faq.querySelector(
                            ".faq-question span"
                        );

                    icon.textContent = "+";

                });


            if (!wasOpen) {

                item.classList.add("open");

                this.querySelector("span")
                    .textContent = "−";

            }

        });

    });


/* =========================
   ENQUIRY FORM
   ========================= */

enquiryForm.addEventListener("submit", function(event) {

    event.preventDefault();


    const name =
        document.getElementById("name")
            .value.trim();

    const phone =
        document.getElementById("phone")
            .value.trim();

    const product =
        document.getElementById("product")
            .value.trim();

    const message =
        document.getElementById("message")
            .value.trim();


    formMessage.className = "";


    if (!name || !phone || !product || !message) {

        formMessage.textContent =
            "Please fill in all fields.";

        formMessage.classList.add(
            "error-message"
        );

        return;
    }


    const phonePattern =
        /^[0-9+\-\s]{7,15}$/;


    if (!phonePattern.test(phone)) {

        formMessage.textContent =
            "Please enter a valid phone number.";

        formMessage.classList.add(
            "error-message"
        );

        return;
    }


    formMessage.textContent =
        "Thank you! Your enquiry has been received.";

    formMessage.classList.add(
        "success-message"
    );


    /*
        This is a front-end college demonstration.
        No information is sent to a server.
    */

    enquiryForm.reset();

});


/* =========================
   BACK TO TOP
   ========================= */

window.addEventListener("scroll", function() {

    if (window.scrollY > 400) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

});


backToTop.addEventListener("click", function() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


/* =========================
   HTML ESCAPE FUNCTION
   ========================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;
}