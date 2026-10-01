/* ==========================================
   BAKE N' TASTE - MAIN JAVASCRIPT
   ========================================== */


/* ==========================================
   1. SHOPPING CART SYSTEM
   ========================================== */

// Load saved cart from localStorage
let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("bakeNTasteCart")) || [];
} catch (error) {
    cart = [];
}


/* ==========================================
   2. SAVE CART
   ========================================== */

function saveCart() {
    localStorage.setItem(
        "bakeNTasteCart",
        JSON.stringify(cart)
    );
}


/* ==========================================
   3. ADD ITEM TO CART
   ========================================== */
function addToCart(title, price, image = "", productId = "") {

    cart.push({
        title: String(title),
        price: Number(price),
        image: String(image || ""),
        productId: String(productId || "")
    });

    saveCart();
    updateCartUI();

    // Open cart automatically
    toggleCart(true);
}

/* ==========================================
   4. UPDATE CART UI
   ========================================== */

function updateCartUI() {

    const cartCount =
        document.getElementById("cartCount");

    const cartItems =
        document.getElementById("cartItems");

    const cartTotal =
        document.getElementById("cartTotal");


    /* ------------------------------------------
       CART COUNT
    ------------------------------------------ */

    if (cartCount) {

        cartCount.innerText =
            cart.length;
    }


    /* ------------------------------------------
       CALCULATE TOTAL
    ------------------------------------------ */

    let subtotal = 0;

    cart.forEach(function (item) {

        subtotal +=
            Number(item.price) || 0;

    });


    /* ------------------------------------------
       EMPTY CART
    ------------------------------------------ */

    if (cart.length === 0) {

        if (cartItems) {

            cartItems.innerHTML = `
                <p style="
                    color: #888;
                    font-size: 14px;
                    text-align: center;
                    padding: 20px 5px;
                ">
                    আপনার কার্ট খালি।
                </p>
            `;
        }

        if (cartTotal) {
            cartTotal.innerText = "0";
        }

        return;
    }


    /* ------------------------------------------
       CREATE CART ITEMS
    ------------------------------------------ */

    let html = "";


    cart.forEach(function (item, index) {

        const price =
            Number(item.price) || 0;

        const image =
            item.image || "";


        html += `
            <div style="
                display: flex;
                align-items: center;
                gap: 10px;
                margin-bottom: 12px;
                font-size: 14px;
                border-bottom: 1px dashed #efe4da;
                padding-bottom: 10px;
            ">

                ${
                    image
                    ? `
                        <img
                            src="${escapeHTML(image)}"
                            alt="${escapeHTML(item.title)}"
                            style="
                                width: 55px;
                                height: 55px;
                                object-fit: cover;
                                border-radius: 8px;
                                flex-shrink: 0;
                            "
                        >
                    `
                    : ""
                }


                <div style="
                    flex: 1;
                    min-width: 0;
                ">

                    <strong style="
                        color: #3a2e2b;
                        display: block;
                        line-height: 1.4;
                    ">
                        ${escapeHTML(item.title)}
                    </strong>

                    <small style="
                        color: #d88a80;
                        font-weight: bold;
                    ">
                        ৳ ${price.toLocaleString()}
                    </small>

                </div>


                <button
                    type="button"
                    onclick="removeFromCart(${index})"
                    aria-label="Remove item"
                    style="
                        border: none;
                        background: none;
                        color: #d9534f;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: bold;
                        padding: 4px;
                        flex-shrink: 0;
                    "
                >
                    মুছে ফেলুন
                </button>

            </div>
        `;
    });


    /* ------------------------------------------
       TOTAL INSIDE CART ITEMS
    ------------------------------------------ */

    html += `
        <div style="
            margin-top: 15px;
            padding: 12px;
            border-radius: 10px;
            background: #fff5ef;
            font-size: 13px;
        ">

            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">

                <span>
                    সর্বমোট:
                </span>

                <strong>
                    ৳ ${subtotal.toLocaleString()}
                </strong>

            </div>

        </div>
    `;


    /* ------------------------------------------
       DISPLAY CART ITEMS
    ------------------------------------------ */

    if (cartItems) {
        cartItems.innerHTML = html;
    }


    /* ------------------------------------------
       UPDATE CART TOTAL
    ------------------------------------------ */

    if (cartTotal) {

        cartTotal.innerText =
            subtotal.toLocaleString();
    }
}


/* ==========================================
   5. REMOVE ITEM FROM CART
   ========================================== */

function removeFromCart(index) {

    if (
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }


    cart.splice(index, 1);

    saveCart();
    updateCartUI();
}


/* ==========================================
   6. CLEAR ENTIRE CART
   ========================================== */

function clearCart() {

    if (cart.length === 0) {
        return;
    }


    const confirmed =
        confirm("আপনি কি পুরো কার্ট খালি করতে চান?");


    if (!confirmed) {
        return;
    }


    cart = [];

    saveCart();
    updateCartUI();
}


/* ==========================================
   7. TOGGLE CART
   ========================================== */

function toggleCart(forceOpen = null) {

    const cartModal =
        document.getElementById("cartModal");


    if (!cartModal) {
        return;
    }


    /* ------------------------------------------
       FORCE OPEN
    ------------------------------------------ */

    if (forceOpen === true) {

        cartModal.style.display = "flex";

        return;
    }


    /* ------------------------------------------
       FORCE CLOSE
    ------------------------------------------ */

    if (forceOpen === false) {

        cartModal.style.display = "none";

        return;
    }


    /* ------------------------------------------
       NORMAL TOGGLE
    ------------------------------------------ */

    if (
        cartModal.style.display === "flex"
    ) {

        cartModal.style.display = "none";

    } else {

        cartModal.style.display = "flex";
    }
}


/* ==========================================
   8. SEND CART TO MESSENGER
   ========================================== */

function sendMessengerOrder() {

    if (cart.length === 0) {
        alert("আপনার কার্ট খালি!");
        return;
    }

    const baseUrl = "https://bakentaste.com/";
    const messengerUrl = "https://m.me/bakenTastegouripur";

    let message =
        "হ্যালো Bake n' Taste! 🎂\n\n" +
        "আমি নিচের আইটেমগুলো অর্ডার করতে চাই:\n\n";

    let subtotal = 0;

    cart.forEach(function (item, index) {

        const price = Number(item.price) || 0;
        subtotal += price;

        // Use the image path to create a direct link to the exact cake picture
        let productUrl = "https://bakentaste.com/gallery.html";
        if (item.image) {
            // This combines your domain with the image path (e.g., https://bakentaste.com/picture/prm_van_2.jpeg)
            productUrl = baseUrl + item.image;
        }

        message +=
            `${index + 1}. ${item.title}\n` +
            `মূল্য: ৳${price.toLocaleString()}\n` +
            `কেকের ছবি: ${productUrl}\n\n`;
    });

    message +=
        `সর্বমোট মূল্য: ৳${subtotal.toLocaleString()}\n\n` +
        "⚠️ [নোট: অর্ডারটি চূড়ান্ত করার সময় ওয়েবসাইটের আসল মূল্যের সাথে মিলিয়ে বিল ভেরিফাই করা হবে।]\n\n" +
        "দয়া করে অর্ডারটি কনফার্ম করার নিয়ম জানাবেন।";

    const messengerLink =
        `${messengerUrl}?text=${encodeURIComponent(message)}`;

    window.open(messengerLink, "_blank");
}

/* ==========================================
   9. CUSTOM ORDER MODAL
   ========================================== */

function openModal() {

    const orderModal =
        document.getElementById("orderModal");


    if (orderModal) {

        orderModal.classList.add(
            "active"
        );
    }
}


function closeModal() {

    const orderModal =
        document.getElementById("orderModal");


    if (orderModal) {

        orderModal.classList.remove(
            "active"
        );
    }
}


/* ==========================================
   10. CUSTOM ORDER → WHATSAPP
   ========================================== */

function sendToWhatsApp(event) {

    if (event) {
        event.preventDefault();
    }


    /* ------------------------------------------
       WHATSAPP NUMBER
    ------------------------------------------ */

    const phoneNumber =
        "8801879369708";


    /* ------------------------------------------
       GET FORM DATA
    ------------------------------------------ */

    const nameElement =
        document.getElementById("custName");

    const dateElement =
        document.getElementById("custDate");

    const flavorElement =
        document.getElementById("custFlavor");

    const notesElement =
        document.getElementById("custNotes");


    const name =
        nameElement
            ? nameElement.value.trim()
            : "";


    const date =
        dateElement
            ? dateElement.value
            : "";


    const flavor =
        flavorElement
            ? flavorElement.value.trim()
            : "";


    const notes =
        notesElement
            ? notesElement.value.trim()
            : "";


    /* ------------------------------------------
       CREATE WHATSAPP MESSAGE
    ------------------------------------------ */

    const message =
        `Hello Bake n' Taste! 🎂\n\n` +
        `I would like to place a custom cake order:\n` +
        `• Name: ${name}\n` +
        `• Event Date: ${date}\n` +
        `• Flavor: ${flavor}\n` +
        `• Details/Notes: ${notes}`;


    /* ------------------------------------------
       OPEN WHATSAPP
    ------------------------------------------ */

    const whatsappUrl =
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;


    window.open(
        whatsappUrl,
        "_blank"
    );


    /* ------------------------------------------
       CLOSE MODAL
    ------------------------------------------ */

    closeModal();
}


/* ==========================================
   11. GALLERY FILTER
   ========================================== */

function filterCategory(category, button) {

    const cards =
        document.querySelectorAll(
            ".gallery-card"
        );


    const buttons =
        document.querySelectorAll(
            ".filter-btn"
        );


    /* ------------------------------------------
       UPDATE ACTIVE BUTTON
    ------------------------------------------ */

    buttons.forEach(function (btn) {

        btn.classList.remove(
            "active"
        );

    });


    if (button) {

        button.classList.add(
            "active"
        );
    }


    /* ------------------------------------------
       FILTER CARDS (Supports Multiple Categories)
    ------------------------------------------ */

    cards.forEach(function (card) {

        const cardCategory =
            card.dataset.category;

        // একাধিক ক্যাটাগরি স্পেস দিয়ে আলাদা করা থাকলে তা চেক করবে
        if (
            category === "all" ||
            (cardCategory && cardCategory.split(' ').includes(category))
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";
        }
    });
}


/* ==========================================
   12. GALLERY SEARCH
   ========================================== */

function searchGallery() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    if (!searchInput) {
        return;
    }


    const searchTerm =
        searchInput.value
            .trim()
            .toLowerCase();


    const cards =
        document.querySelectorAll(
            ".gallery-card"
        );


    cards.forEach(function (card) {

        const text =
            card.textContent.toLowerCase();


        if (
            searchTerm === "" ||
            text.includes(searchTerm)
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";
        }
    });
}


/* ==========================================
   13. HAMBURGER MENU
   ========================================== */

function setupMobileMenu() {

    const mobileMenuBtn =
        document.getElementById(
            "mobileMenuBtn"
        );


    const navLinks =
        document.getElementById(
            "navLinks"
        );


    if (
        !mobileMenuBtn ||
        !navLinks
    ) {

        return;
    }


    /* ------------------------------------------
       PREVENT DUPLICATE EVENT LISTENER
    ------------------------------------------ */

    if (
        mobileMenuBtn.dataset.menuInitialized ===
        "true"
    ) {

        return;
    }


    mobileMenuBtn.dataset.menuInitialized =
        "true";


    /* ------------------------------------------
       HAMBURGER BUTTON
    ------------------------------------------ */

    mobileMenuBtn.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();


            navLinks.classList.toggle(
                "nav-active"
            );


            /* ----------------------------------
               CHANGE ICON
            ---------------------------------- */

            const icon =
                mobileMenuBtn.querySelector(
                    "i"
                );


            if (!icon) {
                return;
            }


            if (
                navLinks.classList.contains(
                    "nav-active"
                )
            ) {

                icon.classList.remove(
                    "fa-bars"
                );

                icon.classList.add(
                    "fa-xmark"
                );

            } else {

                icon.classList.remove(
                    "fa-xmark"
                );

                icon.classList.add(
                    "fa-bars"
                );
            }

        }
    );


    /* ------------------------------------------
       CLOSE MENU AFTER LINK CLICK
    ------------------------------------------ */

    const links =
        navLinks.querySelectorAll("a");


    links.forEach(function (link) {

        link.addEventListener(
            "click",
            function () {

                navLinks.classList.remove(
                    "nav-active"
                );


                const icon =
                    mobileMenuBtn.querySelector(
                        "i"
                    );


                if (icon) {

                    icon.classList.remove(
                        "fa-xmark"
                    );

                    icon.classList.add(
                        "fa-bars"
                    );
                }

            }
        );

    });
}


/* ==========================================
   14. ESCAPE HTML
   ========================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/* ==========================================
   15. INITIALIZE EVERYTHING
   ========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Restore cart */
        updateCartUI();


        /* Setup hamburger */
        setupMobileMenu();

    }
);


/* ==========================================
   16. SYNC CART BETWEEN PAGES / TABS
   ========================================== */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key !==
            "bakeNTasteCart"
        ) {

            return;
        }


        try {

            cart =
                JSON.parse(
                    event.newValue
                ) || [];

        } catch (error) {

            cart = [];
        }


        updateCartUI();
    }
);
/* ==========================================
   17. IMAGE LIGHTBOX (VIEW IMAGE)
   ========================================== */

function initLightbox() {
    const lightbox = document.getElementById("imageLightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const galleryImages = document.querySelectorAll(".card-img-wrapper img");

    if (!lightbox || !lightboxImg) return;

    galleryImages.forEach(img => {
        // Remove any inline click actions that open new tabs
        img.removeAttribute("onclick");

        img.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();
            lightboxImg.src = this.src;
            lightbox.style.display = "flex";
        });
    });

    lightboxImg.addEventListener("click", function (e) {
        e.stopPropagation();
    });
}

// Run immediately if page is already loaded, otherwise wait for load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLightbox);
} else {
    initLightbox();
}

function closeLightbox() {
    const lightbox = document.getElementById("imageLightbox");
    if (lightbox) {
        lightbox.style.display = "none";
        document.getElementById("lightboxImg").src = "";
    }
}

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeLightbox();
    }
});