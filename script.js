/* ==========================================
   1. SHOPPING CART SYSTEM
   ========================================== */

// Load saved cart from browser localStorage
let cart = JSON.parse(localStorage.getItem('bakeNTasteCart')) || [];

// Save cart to browser localStorage
function saveCart() {
    localStorage.setItem('bakeNTasteCart', JSON.stringify(cart));
}


/* ==========================================
   2. ADD ITEM TO CART
   ========================================== */

function addToCart(title, price) {

    // Add product to cart
    cart.push({
        title: title,
        price: price
    });

    // Save cart
    saveCart();

    // Update cart display
    updateCartUI();

    // Open cart automatically
    toggleCart(true);
}


/* ==========================================
   3. UPDATE CART UI
   ========================================== */

function updateCartUI() {

    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');


    /* ------------------------------------------
       UPDATE CART COUNT
    ------------------------------------------ */

    if (cartCount) {
        cartCount.innerText = cart.length;
    }


    /* ------------------------------------------
       EMPTY CART
    ------------------------------------------ */

    if (cart.length === 0) {

        if (cartItems) {
            cartItems.innerHTML =
                '<p style="color: #888; font-size: 14px;">আপনার কার্ট খালি।</p>';
        }

        if (cartTotal) {
            cartTotal.innerText = '0';
        }

        return;
    }


    /* ------------------------------------------
       CREATE CART ITEMS
    ------------------------------------------ */

    let html = '';
    let subtotal = 0;


    cart.forEach((item, index) => {

        subtotal += Number(item.price);


        html += `
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                font-size: 14px;
                border-bottom: 1px dashed #efe4da;
                padding-bottom: 8px;
            ">

                <div>
                    <strong style="
                        color: #3a2e2b;
                    ">
                        ${item.title}
                    </strong>

                    <br>

                    <small style="
                        color: #d88a80;
                        font-weight: bold;
                    ">
                        ৳ ${Number(item.price).toLocaleString()}
                    </small>
                </div>


                <span
                    onclick="removeFromCart(${index})"
                    style="
                        color: #d9534f;
                        cursor: pointer;
                        font-size: 13px;
                        font-weight: bold;
                    "
                >
                    মুছে ফেলুন
                </span>

            </div>
        `;
    });


    /* ------------------------------------------
       NORMAL TOTAL
       NO DISCOUNT
    ------------------------------------------ */

    const finalTotal = subtotal;


    /* ------------------------------------------
       TOTAL BOX
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
                    ৳ ${finalTotal.toLocaleString()}
                </strong>

            </div>

        </div>
    `;


    /* ------------------------------------------
       UPDATE CART ITEMS
    ------------------------------------------ */

    if (cartItems) {
        cartItems.innerHTML = html;
    }


    /* ------------------------------------------
       UPDATE TOTAL
    ------------------------------------------ */

    if (cartTotal) {
        cartTotal.innerText =
            finalTotal.toLocaleString();
    }
}


/* ==========================================
   4. REMOVE ITEM FROM CART
   ========================================== */

function removeFromCart(index) {

    // Remove selected item
    cart.splice(index, 1);

    // Save updated cart
    saveCart();

    // Update UI
    updateCartUI();
}


/* ==========================================
   5. TOGGLE CART MODAL
   ========================================== */

function toggleCart(forceOpen = false) {

    const cartModal =
        document.getElementById('cartModal');

    if (!cartModal) {
        return;
    }


    if (forceOpen) {

        cartModal.style.display = 'flex';

    } else {

        cartModal.style.display =
            cartModal.style.display === 'flex'
                ? 'none'
                : 'flex';
    }
}


/* ==========================================
   6. SEND CART ORDER TO MESSENGER
   ========================================== */

function sendMessengerOrder() {

    /* ------------------------------------------
       CHECK EMPTY CART
    ------------------------------------------ */

    if (cart.length === 0) {

        alert('আপনার কার্ট খালি!');

        return;
    }


    /* ------------------------------------------
       MESSENGER PAGE
    ------------------------------------------ */

    const messengerUrl =
        "https://m.me/bakenTastegouripur";


    /* ------------------------------------------
       CREATE MESSAGE
    ------------------------------------------ */

    let message =
        "হ্যালো Bake n' Taste! 🎂\n\n" +
        "আমি নিচের আইটেমগুলো অর্ডার করতে চাই:\n\n";


    let subtotal = 0;


    /* ------------------------------------------
       ADD PRODUCTS
    ------------------------------------------ */

    cart.forEach((item, index) => {

        message +=
            `${index + 1}. ${item.title} - ৳${Number(item.price).toLocaleString()}\n`;

        subtotal += Number(item.price);
    });


    /* ------------------------------------------
       NORMAL TOTAL
       NO DISCOUNT
    ------------------------------------------ */

    const finalTotal = subtotal;


    /* ------------------------------------------
       ADD TOTAL TO MESSAGE
    ------------------------------------------ */

    message +=
        `\nসর্বমোট মূল্য: ৳${finalTotal.toLocaleString()}`;


    /* ------------------------------------------
       CREATE MESSENGER LINK
    ------------------------------------------ */

    const messengerLink =
        `${messengerUrl}?text=${encodeURIComponent(message)}`;


    /* ------------------------------------------
       OPEN MESSENGER
    ------------------------------------------ */

    window.open(
        messengerLink,
        '_blank'
    );
}


/* ==========================================
   7. CUSTOM ORDER MODAL
   ========================================== */

function openModal() {

    const orderModal =
        document.getElementById('orderModal');

    if (orderModal) {
        orderModal.classList.add('active');
    }
}


function closeModal() {

    const orderModal =
        document.getElementById('orderModal');

    if (orderModal) {
        orderModal.classList.remove('active');
    }
}


/* ==========================================
   8. CUSTOM ORDER → WHATSAPP
   ========================================== */

function sendToWhatsApp(event) {

    event.preventDefault();


    /* ------------------------------------------
       WHATSAPP NUMBER
    ------------------------------------------ */

    const phoneNumber =
        "8801879369708";


    /* ------------------------------------------
       GET FORM DATA
    ------------------------------------------ */

    const name =
        document.getElementById('custName').value;

    const date =
        document.getElementById('custDate').value;

    const flavor =
        document.getElementById('custFlavor').value;

    const notes =
        document.getElementById('custNotes').value;


    /* ------------------------------------------
       CREATE WHATSAPP MESSAGE
    ------------------------------------------ */

    const message =
        `Hello Bake n' Taste! 🎂\n\n` +
        `I would like to place a custom cake order:\n` +
        `• *Name:* ${name}\n` +
        `• *Event Date:* ${date}\n` +
        `• *Flavor:* ${flavor}\n` +
        `• *Details/Notes:* ${notes}`;


    /* ------------------------------------------
       OPEN WHATSAPP
    ------------------------------------------ */

    window.open(
        `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
        '_blank'
    );


    /* ------------------------------------------
       CLOSE MODAL
    ------------------------------------------ */

    closeModal();
}


/* ==========================================
   9. MOBILE NAVIGATION MENU
   ========================================== */

document.addEventListener(
    'DOMContentLoaded',
    () => {

        /* --------------------------------------
           RESTORE CART
        -------------------------------------- */

        updateCartUI();


        /* --------------------------------------
           MOBILE MENU
        -------------------------------------- */

        const mobileMenuBtn =
            document.getElementById('mobileMenuBtn');

        const navLinks =
            document.getElementById('navLinks');


        if (mobileMenuBtn && navLinks) {

            mobileMenuBtn.addEventListener(
                'click',
                () => {

                    navLinks.classList.toggle(
                        'nav-active'
                    );


                    /* ------------------------------
                       CHANGE HAMBURGER ICON
                    ------------------------------ */

                    const icon =
                        mobileMenuBtn.querySelector('i');


                    if (icon) {

                        if (
                            icon.classList.contains(
                                'fa-bars'
                            )
                        ) {

                            icon.classList.remove(
                                'fa-bars'
                            );

                            icon.classList.add(
                                'fa-xmark'
                            );

                        } else {

                            icon.classList.remove(
                                'fa-xmark'
                            );

                            icon.classList.add(
                                'fa-bars'
                            );
                        }
                    }

                }
            );
        }

    }
);