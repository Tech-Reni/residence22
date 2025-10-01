// ----------------------
// Sidebar Toggle
// ----------------------
const menuBtn = document.getElementById('menu-btn');
const closeBtn = document.getElementById('close-btn');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

if (menuBtn && closeBtn && sidebar && overlay) {
    menuBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    // ensure showOverlay exists for any inline onclick
    function showOverlay() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    }
}

// ----------------------
// Set check-in minimal date (today)
// ----------------------
const checkinInput = document.getElementById('checkin');
if (checkinInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    checkinInput.min = `${yyyy}-${mm}-${dd}`;
}

// ----------------------
// Render Shortlets
// ----------------------
function renderShortlets(listings) {
    const section = document.querySelector(".shortlets-section");
    section.innerHTML = "<h2>Available Shortlets</h2>";

    if (listings.length === 0) {
        section.innerHTML += `<p class="no-results">🚫 No shortlets found for your search.</p>`;
        return;
    }

    listings.forEach(shortlet => {
        const card = document.createElement("div");
        card.classList.add("shortlet-card");
        card.innerHTML = `
            <img src="${shortlet.images[0]}" alt="${shortlet.title}" class="shortlet-img">

            <div class="shortlet-info">
                <h3>${shortlet.title}</h3>

                <div class="shortlet-details">
                    <p class="price">${shortlet.price}</p>
                    <p class="rooms">${shortlet.rooms}</p>
                </div>

                <div class="shortlet-footer">
                    <p class="location">Location : ${shortlet.location}</p>
                    <p class="rating">${shortlet.rating}</p>
                </div>

                <button class="see-more" onclick='openModal(${JSON.stringify(shortlet).replace(/"/g, '&quot;')})'>
                    See More
                </button>
            </div>
        `;
        section.appendChild(card);
    });
}

// ----------------------
// Search Form Handling
// ----------------------
const searchForm = document.getElementById('search-form');
if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const location = document.getElementById('location').value.trim().toLowerCase();
        const rooms = document.getElementById('rooms').value.trim().toLowerCase();

        let filtered = [];

        if (location && rooms) {
            // Both selected -> return listings that match either one OR both
            filtered = shortletsData.listings.filter(shortlet => {
                const matchLocation = shortlet.location.toLowerCase().includes(location);
                const matchRooms = shortlet.rooms.toLowerCase().includes(rooms);
                return matchLocation || matchRooms;
            });
        } else if (location) {
            // Only location filter
            filtered = shortletsData.listings.filter(shortlet =>
                shortlet.location.toLowerCase().includes(location)
            );
        } else if (rooms) {
            // Only rooms filter
            filtered = shortletsData.listings.filter(shortlet =>
                shortlet.rooms.toLowerCase().includes(rooms)
            );
        } else {
            // No filters at all -> show all
            filtered = shortletsData.listings;
        }

        renderShortlets(filtered);
    });
}

// ----------------------
// Modal Logic
// ----------------------
let currentSlide = 0;

function openModal(shortlet) {
    document.getElementById("modalTitle").textContent = shortlet.title;

    // Load Images
    const slidesContainer = document.querySelector(".slides");
    slidesContainer.innerHTML = shortlet.images
        .map((img, index) => `<img src="${img}" class="${index === 0 ? "active" : ""}">`)
        .join("");
    currentSlide = 0;

    // Load Amenities
    const amenitiesList = document.querySelector(".amenities ul");
    amenitiesList.innerHTML = shortlet.amenities.map(item => `<li>${item}</li>`).join("");

    // Rent Now button (WhatsApp prefilled message)
    const rentBtn = document.getElementById("rentBtn");
    rentBtn.href = `https://wa.me/+2348165618123?text=${encodeURIComponent(shortlet.rentMessage)}`;

    // Show Modal
    document.getElementById("shortletModal").style.display = "block";
}

function closeModal() {
    document.getElementById("shortletModal").style.display = "none";
}

// ----------------------
// Slider Logic
// ----------------------
function changeSlide(n) {
    const slides = document.querySelectorAll(".slides img");
    if (!slides.length) return;

    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
}

// ----------------------
// Init
// ----------------------
document.addEventListener("DOMContentLoaded", () => {
    renderShortlets(shortletsData.listings);
});
