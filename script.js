/* =========================================================
   KURIOS STORES
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   1. BASIC SETTINGS
   ========================================================= */

/*
    This is the address of our Node.js backend.

    Our frontend is here:

    C:\Users\HomePC\Desktop\CODE WITH ELKURIOS\kurios-stores

    Our backend is here:

    C:\Users\HomePC\Desktop\kurios-stores-backend
*/

const API_URL = "https://kurios-stores-backend.onrender.com";


/*
    Wait until the HTML has completely loaded
    before JavaScript starts working.
*/

document.addEventListener("DOMContentLoaded", function () {


    console.log("Kurios Stores website loaded successfully.");



    /* =====================================================
       2. GET IMPORTANT HTML ELEMENTS
       ===================================================== */


    const productGrid =
        document.getElementById("productGrid");


    const cartButton =
        document.getElementById("cartButton");


    const cartOverlay =
        document.getElementById("cartOverlay");


    const closeCart =
        document.getElementById("closeCart");


    const cartItems =
        document.getElementById("cartItems");


    const cartCount =
        document.getElementById("cartBadge");


    const cartTotal =
        document.getElementById("cartTotal");


    const checkoutButton =
        document.getElementById("checkoutButton");



    /* =====================================================
       3. SHOPPING CART
       ===================================================== */


    /*
        The cart is stored in this array.

        Example:

        [
            {
                id: 1,
                name: "Instant Noodles",
                price: 1200,
                quantity: 2
            }
        ]
    */

    let cart = JSON.parse(
        localStorage.getItem("kuriosCart")
    ) || [];



    /*
        Save the cart in the browser.

        This means refreshing the page
        won't immediately empty the cart.
    */

    function saveCart() {

        localStorage.setItem(
            "kuriosCart",
            JSON.stringify(cart)
        );

    }



    /*
        Format Nigerian currency.
    */

    function formatMoney(amount) {

        return "₦" + Number(amount).toLocaleString();

    }

    window.formatMoney = formatMoney;



    /* =====================================================
       4. DISPLAY CART
       ===================================================== */


    function updateCart() {


        /*
            Make sure the cart container exists.
        */

        if (!cartItems) {
            return;
        }


        /*
            Empty the current cart display.
        */

        cartItems.innerHTML = "";



        /*
            If there are no products...
        */

        if (cart.length === 0) {

            cartItems.innerHTML = `

                <div class="empty-cart">

                    <i class="fa-solid fa-cart-shopping"></i>

                    <h3>
                        Your cart is empty
                    </h3>

                    <p>
                        Add some products to get started.
                    </p>

                </div>

            `;

        }



        /*
            Otherwise display the products.
        */

        else {

            cart.forEach(function (item, index) {


                const itemTotal =
                    item.price * item.quantity;


                cartItems.innerHTML += `

                    <div class="cart-item">


                        <div class="cart-item-image">

                            <i class="fa-solid fa-bag-shopping"></i>

                        </div>



                        <div class="cart-item-info">

                            <h3>
                                ${item.name}
                            </h3>


                            <div class="cart-item-price">

                                ${formatMoney(item.price)}

                            </div>



                            <div class="quantity-controls">


                                <button
                                    class="quantity-button"
                                    data-action="decrease"
                                    data-index="${index}"
                                >
                                    −
                                </button>


                                <strong>
                                    ${item.quantity}
                                </strong>


                                <button
                                    class="quantity-button"
                                    data-action="increase"
                                    data-index="${index}"
                                >
                                    +
                                </button>


                                <button
                                    class="remove-item"
                                    data-action="remove"
                                    data-index="${index}"
                                >
                                    Remove
                                </button>


                            </div>


                        </div>



                        <strong>

                            ${formatMoney(itemTotal)}

                        </strong>


                    </div>

                `;

            });

        }



        /*
            Calculate total number of items.
        */

        let totalQuantity = 0;


        cart.forEach(function (item) {

            totalQuantity += item.quantity;

        });



        /*
            Update cart badge.
        */

        if (cartCount) {

            cartCount.textContent =
                totalQuantity;

        }



        /*
            Calculate total price.
        */

        let totalPrice = 0;


        cart.forEach(function (item) {

            totalPrice +=
                item.price * item.quantity;

        });



        /*
            Display total price.
        */

        if (cartTotal) {

            cartTotal.textContent =
                formatMoney(totalPrice);

        }

    }

    window.clearKuriosCartAfterPayment = function () {

        cart = [];
        saveCart();
        updateCart();

    };



    /* =====================================================
       5. ADD PRODUCT TO CART
       ===================================================== */


    function addToCart(product) {


        /*
            Check whether the product
            already exists in the cart.
        */

        const existingProduct =
            cart.find(function (item) {

                return item.id === product.id;

            });



        /*
            If it already exists,
            increase quantity.
        */

        if (existingProduct) {

            existingProduct.quantity += 1;

        }



        /*
            Otherwise add a new product.
        */

        else {

            cart.push({

                id: product.id,

                name: product.name,

                price: Number(product.effective_price !== undefined ? product.effective_price : product.price),

                quantity: 1

            });

        }



        /*
            Save cart.
        */

        saveCart();


        /*
            Update display.
        */

        updateCart();


        /*
            Open cart.
        */

        openCart();


        /*
            Show confirmation.
        */

        showMessage(
            product.name + " added to your cart."
        );

    }

    window.addToCart = addToCart;



    /* =====================================================
       6. CART BUTTON
       ===================================================== */


    function openCart() {

        if (typeof closeNotificationPanel === "function") {
            closeNotificationPanel();
        }

        if (cartOverlay) {

            cartOverlay.classList.add("open");

        }

        document.body.classList.add("cart-open");

        const choiceEl =
            document.getElementById("orderPaymentChoice");

        if (choiceEl) {
            choiceEl.style.display = "none";
        }

        if (checkoutButton) {
            checkoutButton.style.display = "";
        }

    }



    function closeCartPanel() {

        if (cartOverlay) {

            cartOverlay.classList.remove("open");

        }

        document.body.classList.remove("cart-open");

    }

    window.closeCartPanel = closeCartPanel;



    if (cartButton) {

        cartButton.addEventListener(
            "click",
            openCart
        );

    }



    if (closeCart) {

        closeCart.addEventListener(
            "click",
            closeCartPanel
        );

    }



    /*
        The cart overlay is click-through now
        (so the shop stays interactive behind it),
        so there's no "click outside" region to
        listen for anymore — closing happens via
        the visible X button instead.
    */



    /* =====================================================
       7. CART QUANTITY BUTTONS
       ===================================================== */


    if (cartItems) {

        cartItems.addEventListener(
            "click",
            function (event) {


                const button =
                    event.target.closest("button");


                if (!button) {
                    return;
                }


                const action =
                    button.dataset.action;


                const index =
                    Number(button.dataset.index);



                /*
                    Increase quantity.
                */

                if (action === "increase") {

                    cart[index].quantity += 1;

                }



                /*
                    Decrease quantity.
                */

                if (action === "decrease") {

                    cart[index].quantity -= 1;


                    /*
                        Remove product when
                        quantity reaches zero.
                    */

                    if (
                        cart[index].quantity <= 0
                    ) {

                        cart.splice(index, 1);

                    }

                }



                /*
                    Remove product.
                */

                if (action === "remove") {

                    cart.splice(index, 1);

                }



                saveCart();

                updateCart();

            }
        );

    }



    /* =====================================================
       8. LOAD PRODUCTS FROM NODE BACKEND
       ===================================================== */


    async function loadProducts(filters) {


        /*
            Tell the browser:

            "Go to my backend and
             ask for the products."
        */

        try {

            const params =
                new URLSearchParams();

            if (filters) {

                if (filters.search) params.set("search", filters.search);
                if (filters.category) params.set("category", filters.category);
                if (filters.minPrice) params.set("minPrice", filters.minPrice);
                if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
                if (filters.sort) params.set("sort", filters.sort);

            }

            const queryString =
                params.toString();

            const response =
                await fetch(
                    API_URL + "/api/products" + (queryString ? "?" + queryString : "")
                );



            /*
                Check whether the backend
                responded successfully.
            */

            if (!response.ok) {

                throw new Error(
                    "Backend returned an error."
                );

            }



            /*
                Convert the response
                into JavaScript data.
            */

            const products =
                await response.json();

            const loggedInStudentForWishlist =
                typeof getLoggedInStudent === "function" ? getLoggedInStudent() : null;

            window.__kuriosWishlistIds = new Set();

            if (loggedInStudentForWishlist) {

                try {

                    const wishlistResponse =
                        await fetch(API_URL + "/api/wishlist/ids?studentId=" + loggedInStudentForWishlist.id);

                    const wishlistData =
                        await wishlistResponse.json();

                    if (wishlistData.success) {

                        window.__kuriosWishlistIds =
                            new Set(wishlistData.productIds);

                    }

                } catch (wishlistError) {

                    console.error("Fetch wishlist ids error:", wishlistError);

                }

            }



            console.log(
                "Products from Kurios Backend:",
                products
            );



            /*
                Display products
                on the website.
            */

            displayProducts(products);


            /*
                Show a handful of them as
                "Recommended for You" on the
                logged-in student dashboard.
            */

            if (typeof renderDashboardRecommendations === "function") {

                renderDashboardRecommendations(
                    products.slice(0, 4)
                );

            }


        }


        catch (error) {


            console.error(
                "Error connecting to backend:",
                error
            );



            /*
                Tell the user that
                the backend isn't available.
            */

            if (productGrid) {

                productGrid.innerHTML = `

                    <div class="empty-state">

                        <i class="fa-solid fa-triangle-exclamation"></i>

                        <h3>
                            Products could not be loaded
                        </h3>

                        <p>
                            Please make sure the Kurios Stores
                            backend is running.
                        </p>

                    </div>

                `;

            }

        }

    }

    window.loadProducts = loadProducts;



    /* =====================================================
       9. DISPLAY PRODUCTS
       ===================================================== */


    function displayProducts(products) {


        if (!productGrid) {
            return;
        }


        /*
            Remove the old hard-coded products.
        */

        productGrid.innerHTML = "";



        /*
            If there are no products.
        */

        if (
            !products ||
            products.length === 0
        ) {

            productGrid.innerHTML = `

                <div class="empty-state">

                    <i class="fa-solid fa-box-open"></i>

                    <h3>
                        No products available
                    </h3>

                    <p>
                        Please check back later.
                    </p>

                </div>

            `;

            return;

        }



        /*
            Go through each product.
        */

        const categoryIcons = {
            "Fashion": "fa-shirt",
            "Electronics": "fa-plug",
            "Beauty": "fa-spray-can-sparkles",
            "Food": "fa-utensils",
            "Books": "fa-book",
            "School Materials": "fa-pen",
            "Phones": "fa-mobile-screen",
            "Accessories": "fa-gem",
            "Health": "fa-heart-pulse",
            "Home": "fa-house",
            "Services": "fa-screwdriver-wrench",
            "Others": "fa-box"
        };

        products.forEach(function (product) {

            const category =
                product.category || "General";

            const icon =
                categoryIcons[category] || "fa-box";


            /*
                Create the product card.
            */

            const productCard =
                document.createElement("article");


            productCard.className =
                "product-card";


            productCard.dataset.category =
                category;


            const imageMarkup =
                product.image_url ?
                    `<img src="${API_URL + product.image_url}" alt="${product.name}">` :
                    `<i class="fa-solid ${icon}"></i>`;

            const soldByMarkup =
                product.seller_id ?
                    `<span class="product-sold-by" data-seller-id="${product.seller_id}">
                        Sold by ${product.seller_store_name || "a Kurios seller"}
                    </span>` :
                    `<p>Available at Kurios Stores.</p>`;

            const ratingMarkup =
                product.review_count > 0 ?
                    `<span class="product-rating">
                        <i class="fa-solid fa-star"></i>
                        ${Number(product.avg_rating).toFixed(1)}
                        <span class="product-rating-count">(${product.review_count})</span>
                    </span>` :
                    "";

            const saleBadgeMarkup =
                product.is_on_sale ?
                    `<span class="product-sale-badge">SALE</span>` :
                    "";

            const priceMarkup =
                product.is_on_sale ?
                    `<span class="product-price-original">${formatMoney(product.price)}</span>
                     <strong class="product-price-discounted">${formatMoney(product.effective_price)}</strong>` :
                    `<strong>${formatMoney(product.price)}</strong>`;

            productCard.innerHTML = `

                <div class="product-image">

                    ${saleBadgeMarkup}

                    ${imageMarkup}

                </div>


                <div class="product-info">


                    <span class="product-category">

                        ${category}

                    </span>


                    <h3>

                        ${product.name}

                    </h3>


                    ${ratingMarkup}


                    ${soldByMarkup}


                    <div class="product-bottom">


                        ${priceMarkup}


                        <div style="display:flex; gap:6px;">

                            <button
                                type="button"
                                class="wishlist-toggle-btn"
                                data-product-id="${product.id}"
                                title="Save to wishlist"
                            >
                                <i class="fa-regular fa-heart"></i>
                            </button>

                            ${product.seller_id ? `
                                <button
                                    class="contact-seller-btn"
                                    data-product-id="${product.id}"
                                    title="Message the seller about this product"
                                >
                                    <i class="fa-regular fa-comment"></i>
                                </button>
                            ` : ""}

                            <button

                                class="add-to-cart"

                                data-product-id="${product.id}"

                            >

                                <i class="fa-solid fa-plus"></i>

                                Add

                            </button>

                        </div>


                    </div>


                </div>

            `;



            /*
                Put the card inside
                the product grid.
            */

            productGrid.appendChild(
                productCard
            );



            /*
                Add click event to
                the Add button.
            */

            const addButton =
                productCard.querySelector(
                    ".add-to-cart"
                );


            addButton.addEventListener(
                "click",
                function () {

                    addToCart(product);

                }
            );


            /*
                Contact Seller button.
            */

            const contactSellerBtn =
                productCard.querySelector(
                    ".contact-seller-btn"
                );

            if (contactSellerBtn) {

                contactSellerBtn.addEventListener(
                    "click",
                    function () {

                        if (typeof contactSellerAboutProduct === "function") {
                            contactSellerAboutProduct(product.id);
                        }

                    }
                );

            }


            /*
                Wishlist heart button.
            */

            const wishlistBtn =
                productCard.querySelector(
                    ".wishlist-toggle-btn"
                );

            if (wishlistBtn) {

                if (window.__kuriosWishlistIds && window.__kuriosWishlistIds.has(product.id)) {

                    wishlistBtn.classList.add("active");
                    wishlistBtn.querySelector("i").className = "fa-solid fa-heart";

                }

                wishlistBtn.addEventListener(
                    "click",
                    function () {

                        if (typeof toggleWishlist === "function") {
                            toggleWishlist(product.id, wishlistBtn);
                        }

                    }
                );

            }


            /*
                Add click event to
                the "Sold by" label.
            */

            const soldByLabel =
                productCard.querySelector(
                    ".product-sold-by"
                );

            if (soldByLabel) {

                soldByLabel.addEventListener(
                    "click",
                    function () {

                        window.location.hash =
                            "store-" + product.seller_id;

                    }
                );

            }

        });

    }



    /* =====================================================
       10. PRODUCT FILTERS (now handled server-side —
       see the Shop search bar wiring further down)
       ===================================================== */



    /* =====================================================
       11. CATEGORY CARDS
       ===================================================== */


    const categoryCards =
        document.querySelectorAll(
            ".category-card"
        );


    categoryCards.forEach(
        function (card) {

            card.addEventListener(
                "click",
                function () {

                    const category =
                        card.dataset.category;

                    window.__kuriosPendingShopFilter = category;

                    window.location.hash = "shop";

                }
            );

        }
    );

// ========================================
// UPDATE HEADER LOGIN STATE
// ========================================

function updateLoginState() {

        // ========================================
    // HERO LOGIN STATE
    // ========================================

    const loggedOutHero =
        document.getElementById("loggedOutHero");

    const loggedInHero =
        document.getElementById("loggedInHero");

    const heroStudentName =
        document.getElementById("heroStudentName");

    const heroStudentCampus =
        document.getElementById("heroStudentCampus");

    const signInButton =
        document.getElementById("openSignIn");

    if (!signInButton) {
        return;
    }


    // ========================================
    // GET LOGGED-IN STUDENT
    // ========================================

    let storedStudent =
        localStorage.getItem("kuriosLoggedInStudent");

    if (!storedStudent) {

        storedStudent =
            sessionStorage.getItem(
                "kuriosLoggedInStudent"
            );

    }


    // ========================================
    // STUDENT IS NOT LOGGED IN
    // ========================================

    if (!storedStudent) {

    signInButton.classList.remove("has-avatar");

    signInButton.innerHTML = `
        <i class="fa-regular fa-user"></i>

        <span>
            Sign In
        </span>
    `;


    // ========================================
    // SHOW LOGGED-OUT HERO
    // ========================================

    if (loggedOutHero) {

        loggedOutHero.style.display =
            "block";

    }


    if (loggedInHero) {

        loggedInHero.style.display =
            "none";

    }

    const mainNavEl =
        document.getElementById("mainNav");

    if (mainNavEl) {
        mainNavEl.style.display = "flex";
    }

    return;

}


    // ========================================
    // READ STUDENT DATA
    // ========================================

    let student;

    try {

        student =
            JSON.parse(storedStudent);

    } catch (error) {

        console.error(
            "Unable to read logged-in student:",
            error
        );

        return;

    }


    // ========================================
    // UPDATE HERO FOR LOGGED-IN STUDENT
    // ========================================


    // ========================================
    // HIDE LOGGED-OUT HERO
    // ========================================

    if (loggedOutHero) {

        loggedOutHero.style.display =
            "none";

    }

    // ========================================
    // SHOW LOGGED-IN HERO
    // ========================================

    if (loggedInHero) {

        loggedInHero.style.display =
            "block";

    }

    const mainNavEl =
        document.getElementById("mainNav");

    if (mainNavEl) {
        mainNavEl.style.display = "none";
    }


    // ========================================
    // STUDENT NAME
    // ========================================

    if (heroStudentName) {

        heroStudentName.textContent =
            student.first_name ||
            student.firstName ||
            "Student";

    }


    // ========================================
    // STUDENT INFORMATION
    // ========================================

    if (heroStudentCampus) {

        const university =
            student.university ||
            "";

        const studentId =
            student.student_id ||
            student.studentId ||
            "";


        if (university) {

            heroStudentCampus.textContent =
                university;

        } else if (studentId) {

            heroStudentCampus.textContent =
                studentId;

        } else {

            heroStudentCampus.textContent =
                "Your campus";

        }

    }


    // ========================================
    // ACTIVE ORDERS
    // ========================================

    refreshOrderCountBadge(student.id);

    if (typeof loadDashboardRecentOrders === "function") {
        loadDashboardRecentOrders(student.id);
    }

    if (typeof loadDashboardWalletBalance === "function") {
        loadDashboardWalletBalance(student.id);
    }

    if (typeof loadDashboardWishlistCount === "function") {
        loadDashboardWishlistCount(student.id);
    }

    if (typeof updateSellerMenuLabel === "function") {
        updateSellerMenuLabel(student.id);
    }


    // ========================================
    // GET DISPLAY NAME
    // ========================================

    const firstName =
        student.first_name || "";

    const lastName =
        student.last_name || "";

    const displayName =
        firstName ||
        lastName ||
        "Account";


    // ========================================
    // UPDATE HEADER
    // ========================================

    const avatarMarkup =
        student.profile_picture ?
            `<img src="${API_URL + student.profile_picture}" alt="${displayName}">` :
            `<span class="header-avatar-initial">${displayName.charAt(0).toUpperCase()}</span>`;

    signInButton.classList.add("has-avatar");

    signInButton.innerHTML = `
        <span class="header-avatar-circle">
            ${avatarMarkup}
        </span>
    `;

    signInButton.setAttribute("aria-label", displayName);


    // ========================================
    // ACCOUNT DROPDOWN MENU HEADER
    // ========================================

    const accountMenuName =
        document.getElementById("accountMenuName");

    const accountMenuStudentInfo =
        document.getElementById("accountMenuStudentInfo");

    if (accountMenuName) {

        const fullName =
            `${firstName} ${lastName}`.trim();

        accountMenuName.textContent =
            fullName || "Student";

    }

    if (accountMenuStudentInfo) {

        const university =
            student.university || "";

        const studentIdValue =
            student.student_id ||
            student.studentId ||
            "";

        if (university && studentIdValue) {

            accountMenuStudentInfo.textContent =
                university + " · " + studentIdValue;

        } else {

            accountMenuStudentInfo.textContent =
                university ||
                studentIdValue ||
                "Student account";

        }

    }

}

// ========================================
// CHECK LOGIN STATE
// ========================================

updateLoginState();


// ========================================
// SIGN OUT
// ========================================

const signOutButton =
    document.getElementById("signOutButton");

if (signOutButton) {

    signOutButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            localStorage.removeItem(
                "kuriosLoggedInStudent"
            );

            sessionStorage.removeItem(
                "kuriosLoggedInStudent"
            );

            updateLoginState();

            const studentAccountMenu =
                document.getElementById(
                    "studentAccountMenu"
                );

            if (studentAccountMenu) {

                studentAccountMenu.classList.remove(
                    "open"
                );

            }

            const notificationsPanel =
                document.getElementById(
                    "notificationPanel"
                );

            if (notificationsPanel) {

                notificationsPanel.classList.remove(
                    "open"
                );

            }

            window.location.hash = "";

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}

    /* =====================================================
       12. SIGN IN MODAL
       ===================================================== */


    const openSignIn =
        document.getElementById(
            "openSignIn"
        );


    const signInModal =
        document.getElementById(
            "signInModal"
        );


    const closeSignIn =
        document.getElementById(
            "closeSignIn"
        );


    const signInForm =
        document.getElementById(
            "signinForm"
        );



    function openSignInModal() {

        if (typeof closeNotificationPanel === "function") {
            closeNotificationPanel();
        }

        if (signInModal) {

            signInModal.classList.add(
                "open"
            );

        }

        const emailStep =
            document.getElementById("signinEmailStep");

        const passcodeStep =
            document.getElementById("signinPasscodeStep");

        const adminPasswordStep =
            document.getElementById("signinAdminPasswordStep");

        if (emailStep) {
            emailStep.style.display = "block";
        }

        if (passcodeStep) {
            passcodeStep.style.display = "none";
        }

        if (adminPasswordStep) {
            adminPasswordStep.style.display = "none";
        }

    }



    function closeSignInModal() {

        if (signInModal) {

            signInModal.classList.remove(
                "open"
            );

        }

    }



    // ========================================
// STUDENT ACCOUNT / SIGN IN BUTTON
// ========================================

const studentAccountMenu =
    document.getElementById(
        "studentAccountMenu"
    );


if (openSignIn) {

    openSignIn.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            // ========================================
            // CHECK LOGIN STATE
            // ========================================

            const loggedInStudent =
                localStorage.getItem(
                    "kuriosLoggedInStudent"
                ) ||
                sessionStorage.getItem(
                    "kuriosLoggedInStudent"
                );


            // ========================================
            // NOT LOGGED IN
            // ========================================

            if (!loggedInStudent) {

                if (studentAccountMenu) {

                    studentAccountMenu.classList.remove(
                        "open"
                    );

                }

                openSignInModal();

                return;

            }


            // ========================================
            // LOGGED IN
            // ========================================

            if (studentAccountMenu) {

                const willOpen =
                    !studentAccountMenu.classList.contains("open");

                studentAccountMenu.classList.toggle(
                    "open"
                );

                if (
                    willOpen &&
                    typeof closeNotificationPanel === "function"
                ) {
                    closeNotificationPanel();
                }

            }

        }
    );

}


// ========================================
// CLOSE ACCOUNT MENU WHEN CLICKING OUTSIDE
// ========================================

document.addEventListener(
    "click",
    function (event) {

        if (!studentAccountMenu) {
            return;
        }


        if (
            !studentAccountMenu.contains(event.target) &&
            event.target !== openSignIn &&
            !openSignIn.contains(event.target)
        ) {

            studentAccountMenu.classList.remove(
                "open"
            );

        }

    }
);

// ========================================
// GET CURRENTLY LOGGED-IN STUDENT
// ========================================

function getLoggedInStudent() {

    const storedStudent =
        localStorage.getItem(
            "kuriosLoggedInStudent"
        ) ||
        sessionStorage.getItem(
            "kuriosLoggedInStudent"
        );

    if (!storedStudent) {
        return null;
    }

    try {

        return JSON.parse(storedStudent);

    } catch (error) {

        console.error(
            "Unable to read logged-in student:",
            error
        );

        return null;

    }

}


// ========================================
// SAVE AN UPDATED STUDENT OBJECT BACK TO
// WHICHEVER STORAGE IT CAME FROM
// ========================================

function saveLoggedInStudent(student) {

    const studentJson =
        JSON.stringify(student);

    if (
        localStorage.getItem("kuriosLoggedInStudent")
    ) {

        localStorage.setItem(
            "kuriosLoggedInStudent",
            studentJson
        );

    } else {

        sessionStorage.setItem(
            "kuriosLoggedInStudent",
            studentJson
        );

    }

}


// ========================================
// MY PROFILE PANEL
// ========================================

const accountProfile =
    document.getElementById("accountProfile");

const profileOverlay =
    document.getElementById("profileOverlay");

const profilePanel =
    document.getElementById("profilePanel");

const closeProfile =
    document.getElementById("closeProfile");

const editProfileButton =
    document.getElementById("editProfileButton");

const cancelProfileEdit =
    document.getElementById("cancelProfileEdit");

const saveProfileEdit =
    document.getElementById("saveProfileEdit");

const profilePhoneInput =
    document.getElementById("profilePhoneInput");

const profileWhatsappInput =
    document.getElementById("profileWhatsappInput");

const profileDobInput =
    document.getElementById("profileDobInput");

const profilePictureInput =
    document.getElementById("profilePictureInput");

const profileAvatarCircle =
    document.getElementById("profileAvatarCircle");

const profileAvatarEditBadge =
    document.getElementById("profileAvatarEditBadge");


// Holds the file the student just picked,
// until they hit Save.

let selectedProfilePictureFile = null;


// ========================================
// SHOW A STUDENT'S DATA IN THE PANEL
// (view mode fields)
// ========================================

function renderProfilePanel(student) {

    // FULL NAME

    const fullNameEl =
        document.getElementById("profileFullName");

    if (fullNameEl) {

        const firstName =
            student.first_name ||
            student.firstName ||
            "";

        const lastName =
            student.last_name ||
            student.lastName ||
            "";

        const fullName =
            `${firstName} ${lastName}`.trim();

        fullNameEl.textContent =
            fullName ||
            "Student";

    }


    // STUDENT ID

    const studentIdEl =
        document.getElementById("profileStudentId");

    if (studentIdEl) {

        studentIdEl.textContent =
            student.student_id ||
            student.studentId ||
            "Not provided";

    }


    // UNIVERSITY

    const universityEl =
        document.getElementById("profileUniversity");

    if (universityEl) {

        universityEl.textContent =
            student.university ||
            "Not provided";

    }


    // EMAIL

    const emailEl =
        document.getElementById("profileEmail");

    if (emailEl) {

        emailEl.textContent =
            student.email ||
            "Not provided";

    }


    // WHATSAPP NUMBER

    const whatsappEl =
        document.getElementById("profileWhatsapp");

    if (whatsappEl) {

        whatsappEl.textContent =
            student.whatsapp_number ||
            student.whatsappNumber ||
            "Not provided";

    }

    if (profileWhatsappInput) {

        profileWhatsappInput.value =
            student.whatsapp_number ||
            student.whatsappNumber ||
            "";

    }


    // PHONE NUMBER

    const phoneEl =
        document.getElementById("profilePhone");

    if (phoneEl) {

        phoneEl.textContent =
            student.phone ||
            "Not provided";

    }

    if (profilePhoneInput) {

        profilePhoneInput.value =
            student.phone ||
            "";

    }


    // DATE OF BIRTH

    const dobEl =
        document.getElementById("profileDob");

    const dobRaw =
        student.date_of_birth ||
        student.dob ||
        null;

    // The database sends this back as a full
    // timestamp — we only want the date part,
    // both for display and for the date input.

    const dobShort =
        dobRaw ?
            dobRaw.slice(0, 10) :
            null;

    if (dobEl) {

        dobEl.textContent =
            dobShort ||
            "Not provided";

    }

    if (profileDobInput) {

        profileDobInput.value =
            dobShort ||
            "";

    }


    // ACCOUNT STATUS

    const statusEl =
        document.getElementById("profileAccountStatus");

    if (statusEl) {

        statusEl.textContent =
            student.email_verified === false ?
                "Unverified" :
                "Active";

    }


    // PROFILE PICTURE

    renderProfileAvatar(
        student.profile_picture
    );

}


// ========================================
// SHOW THE AVATAR — PICTURE IF THERE IS ONE,
// OTHERWISE THE PLAIN PERSON ICON
// ========================================

function renderProfileAvatar(profilePicturePath) {

    if (!profileAvatarCircle) {
        return;
    }


    const existingImg =
        profileAvatarCircle.querySelector("img");

    if (existingImg) {
        existingImg.remove();
    }


    if (profilePicturePath) {

        const img =
            document.createElement("img");

        img.src =
            API_URL + profilePicturePath;

        img.alt =
            "Profile picture";

        profileAvatarCircle.insertBefore(
            img,
            profileAvatarCircle.firstChild
        );

    }

}


// ========================================
// OPEN THE PANEL
// ========================================

function openProfilePanel() {

    const student =
        getLoggedInStudent();


    // NOT LOGGED IN — SEND TO SIGN IN INSTEAD

    if (!student) {

        if (studentAccountMenu) {

            studentAccountMenu.classList.remove(
                "open"
            );

        }

        if (window.location.hash === "#profile") {

            history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search
            );

        }

        openSignInModal();

        return;

    }


    renderProfilePanel(student);
    exitProfileEditMode();


    if (studentAccountMenu) {

        studentAccountMenu.classList.remove(
            "open"
        );

    }

    if (profileOverlay) {

        profileOverlay.classList.add(
            "open"
        );

    }

    const mainEl =
        document.getElementById("mainContent");

    if (mainEl) {
        mainEl.style.display = "none";
    }

    window.scrollTo({ top: 0 });

}


function closeProfilePanel() {

    if (profileOverlay) {

        profileOverlay.classList.remove(
            "open"
        );

    }

    exitProfileEditMode();

    if (typeof goBack === "function") {
        goBack();
    } else if (typeof goHome === "function") {
        goHome();
    }

}


// ========================================
// ENTER / EXIT EDIT MODE
// ========================================

function enterProfileEditMode() {

    if (profilePanel) {

        profilePanel.classList.add(
            "editing"
        );

    }

}


function exitProfileEditMode() {

    if (profilePanel) {

        profilePanel.classList.remove(
            "editing"
        );

    }


    // Undo any unsaved picture preview and
    // clear the picked file.

    selectedProfilePictureFile = null;

    if (profilePictureInput) {

        profilePictureInput.value = "";

    }

    const student =
        getLoggedInStudent();

    if (student) {

        renderProfileAvatar(
            student.profile_picture
        );

    }

}


// ========================================
// PICK A NEW PROFILE PICTURE
// ========================================

if (profileAvatarEditBadge) {

    profileAvatarEditBadge.addEventListener(
        "click",
        function () {

            if (profilePictureInput) {

                profilePictureInput.click();

            }

        }
    );

}


if (profilePictureInput) {

    profilePictureInput.addEventListener(
        "change",
        function () {

            const file =
                profilePictureInput.files[0];

            if (!file) {
                return;
            }


            selectedProfilePictureFile =
                file;


            // Instant local preview before saving.

            const reader =
                new FileReader();

            reader.onload = function () {

                if (!profileAvatarCircle) {
                    return;
                }

                const existingImg =
                    profileAvatarCircle.querySelector("img");

                if (existingImg) {
                    existingImg.remove();
                }

                const img =
                    document.createElement("img");

                img.src =
                    reader.result;

                img.alt =
                    "Profile picture preview";

                profileAvatarCircle.insertBefore(
                    img,
                    profileAvatarCircle.firstChild
                );

            };

            reader.readAsDataURL(file);

        }
    );

}


// ========================================
// SAVE PROFILE CHANGES
// ========================================

if (saveProfileEdit) {

    saveProfileEdit.addEventListener(
        "click",
        async function () {

            const student =
                getLoggedInStudent();

            if (!student) {
                return;
            }


            if (
                profileWhatsappInput &&
                !profileWhatsappInput.value.trim()
            ) {

                showMessage(
                    "WhatsApp number is required."
                );

                profileWhatsappInput.focus();

                return;

            }


            const formData =
                new FormData();

            formData.append(
                "studentId",
                student.id
            );

            if (profilePhoneInput) {

                formData.append(
                    "phone",
                    profilePhoneInput.value.trim()
                );

            }

            if (profileWhatsappInput) {

                formData.append(
                    "whatsappNumber",
                    profileWhatsappInput.value.trim()
                );

            }

            if (profileDobInput && profileDobInput.value) {

                formData.append(
                    "dateOfBirth",
                    profileDobInput.value
                );

            }

            if (selectedProfilePictureFile) {

                formData.append(
                    "profilePicture",
                    selectedProfilePictureFile
                );

            }


            saveProfileEdit.disabled = true;

            saveProfileEdit.textContent =
                "Saving...";


            try {

                const response =
                    await fetch(
                        API_URL + "/api/students/update-profile",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                const data =
                    await response.json();


                if (!data.success) {

                    showMessage(
                        data.message ||
                        "Could not update your profile."
                    );

                    return;

                }


                // Merge the returned fields into the
                // stored student so nothing already
                // held (like the password-free login
                // fields) gets lost.

                const updatedStudent =
                    Object.assign(
                        {},
                        student,
                        data.student
                    );

                saveLoggedInStudent(
                    updatedStudent
                );

                renderProfilePanel(
                    updatedStudent
                );

                exitProfileEditMode();

                showMessage(
                    "Profile updated successfully."
                );

            } catch (error) {

                console.error(
                    "Profile update error:",
                    error
                );

                showMessage(
                    "Could not reach the server. Please try again."
                );

            } finally {

                saveProfileEdit.disabled = false;

                saveProfileEdit.textContent =
                    "Save Changes";

            }

        }
    );

}


if (editProfileButton) {

    editProfileButton.addEventListener(
        "click",
        enterProfileEditMode
    );

}


if (cancelProfileEdit) {

    cancelProfileEdit.addEventListener(
        "click",
        function () {

            const student =
                getLoggedInStudent();

            if (student) {

                renderProfilePanel(
                    student
                );

            }

            exitProfileEditMode();

        }
    );

}


if (accountProfile) {

    accountProfile.addEventListener(
        "click",
        function () {
            window.location.hash = "profile";
        }
    );

}


if (closeProfile) {

    closeProfile.addEventListener(
        "click",
        closeProfilePanel
    );

}


// Clicking outside the profile panel closes it.

if (profileOverlay) {

    profileOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target === profileOverlay
            ) {

                closeProfilePanel();

            }

        }
    );

}


// ========================================
// ACCOUNT SETTINGS — OPENS PROFILE IN EDIT MODE
// ========================================

const accountSettings =
    document.getElementById("accountSettings");

if (accountSettings) {

    accountSettings.addEventListener(
        "click",
        function () {

            if (typeof hideAllFullPages === "function") {
                hideAllFullPages();
            }

            history.pushState(null, "", "#profile");

            openProfilePanel();

            if (typeof enterProfileEditMode === "function") {
                enterProfileEditMode();
            }

        }
    );

}


// ========================================
// WISHLIST / WALLET
// (real pages, feature itself isn't built yet)
// ========================================

const accountWishlist =
    document.getElementById("accountWishlist");

if (accountWishlist) {

    accountWishlist.addEventListener(
        "click",
        function () {

            if (studentAccountMenu) {
                studentAccountMenu.classList.remove("open");
            }

            window.location.hash = "wishlist";

        }
    );

}

const accountWallet =
    document.getElementById("accountWallet");

if (accountWallet) {

    accountWallet.addEventListener(
        "click",
        function () {

            if (studentAccountMenu) {
                studentAccountMenu.classList.remove("open");
            }

            window.location.hash = "wallet";

        }
    );

}

const accountErrands =
    document.getElementById("accountErrands");

if (accountErrands) {

    accountErrands.addEventListener(
        "click",
        function () {

            if (studentAccountMenu) {
                studentAccountMenu.classList.remove("open");
            }

            window.location.hash = "errands";

        }
    );

}


// ========================================
// MY ORDERS PANEL
// ========================================

const accountOrders =
    document.getElementById("accountOrders");

const dashboardMyOrders =
    document.getElementById("dashboardMyOrders");

const ordersOverlay =
    document.getElementById("ordersOverlay");

const closeOrders =
    document.getElementById("closeOrders");

const ordersPanelBody =
    document.getElementById("ordersPanelBody");


const ORDERS_EMPTY_STATE_HTML = `
    <div class="empty-cart">
        <i class="fa-solid fa-box"></i>
        <h3>No orders yet</h3>
        <p>Your past orders will show up here once you check out.</p>
    </div>
`;


function formatOrderDate(dateString) {

    const date =
        new Date(dateString);

    if (isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(
        "en-NG",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


function renderOrderCard(order) {

    const statusClass =
        "status-" + order.status;

    const statusLabel =
        order.status.charAt(0).toUpperCase() +
        order.status.slice(1);

    const itemRows =
        order.items.map(function (item) {

            return `
                <div class="order-card-item-row">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>${formatMoney(item.price * item.quantity)}</span>
                </div>
            `;

        }).join("");

    let actionsHtml = "";

    if (order.status === "pending") {

        actionsHtml = `
            <div class="order-card-actions">
                <button type="button" class="order-action-btn secondary" data-order-action="edit" data-order-id="${order.id}">
                    <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button type="button" class="order-action-btn primary" data-order-action="checkout" data-order-id="${order.id}" data-order-ref="${order.payment_reference}">
                    <i class="fa-solid fa-credit-card"></i> Checkout
                </button>
            </div>
        `;

    } else if (order.status === "failed") {

        actionsHtml = `
            <div class="order-card-actions">
                <button type="button" class="order-action-btn danger" data-order-action="delete" data-order-id="${order.id}">
                    <i class="fa-solid fa-trash"></i> Delete
                </button>
                <button type="button" class="order-action-btn primary" data-order-action="checkout" data-order-id="${order.id}" data-order-ref="${order.payment_reference}">
                    <i class="fa-solid fa-rotate-right"></i> Retry Payment
                </button>
            </div>
        `;

    } else if (order.status === "paid") {

        actionsHtml = `
            <div class="order-card-actions">
                <button type="button" class="order-action-btn secondary" data-order-action="print" data-order-id="${order.id}">
                    <i class="fa-solid fa-print"></i> Print Receipt
                </button>
                <button type="button" class="order-action-btn secondary" data-order-action="message-seller" data-order-id="${order.id}">
                    <i class="fa-solid fa-comment"></i> Message Seller
                </button>
            </div>
        `;

    }

    return `
        <div class="order-card" data-order-json='${JSON.stringify(order).replace(/'/g, "&apos;")}'>

            <div class="order-card-top">

                <div>
                    <div class="order-card-reference">
                        ${order.payment_reference}
                    </div>
                    <div class="order-card-date">
                        ${formatOrderDate(order.created_at)}
                    </div>
                </div>

                <span class="order-status-badge ${statusClass}">
                    ${statusLabel}
                </span>

            </div>

            <div class="order-card-items">
                ${itemRows}
            </div>

            <div class="order-card-total">
                <span>Total</span>
                <strong>${formatMoney(order.amount)}</strong>
            </div>

            ${actionsHtml}

        </div>
    `;

}


async function loadOrdersIntoPanel(studentId) {

    if (!ordersPanelBody) {
        return;
    }

    if (typeof loadReviewablePrompts === "function") {
        loadReviewablePrompts(studentId);
    }

    ordersPanelBody.innerHTML = `
        <div class="empty-cart">
            <i class="fa-solid fa-spinner"></i>
            <h3>Loading your orders...</h3>
        </div>
    `;

    try {

        const response =
            await fetch(
                API_URL + "/api/orders?studentId=" + studentId
            );

        const data =
            await response.json();

        if (!data.success) {

            ordersPanelBody.innerHTML = `
                <div class="empty-cart">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <h3>Could not load your orders</h3>
                    <p>${data.message || "Please try again."}</p>
                </div>
            `;

            return;

        }

        if (data.orders.length === 0) {

            ordersPanelBody.innerHTML =
                ORDERS_EMPTY_STATE_HTML;

            return;

        }

        ordersPanelBody.innerHTML =
            data.orders.map(renderOrderCard).join("");

    } catch (error) {

        console.error(
            "Load orders error:",
            error
        );

        ordersPanelBody.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <h3>Could not reach the server</h3>
                <p>Please try again.</p>
            </div>
        `;

    }

}


function openOrdersPanel() {

    const student =
        getLoggedInStudent();

    if (!student) {

        if (studentAccountMenu) {

            studentAccountMenu.classList.remove(
                "open"
            );

        }

        if (window.location.hash === "#orders") {

            history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search
            );

        }

        openSignInModal();

        return;

    }

    if (studentAccountMenu) {

        studentAccountMenu.classList.remove(
            "open"
        );

    }

    if (ordersOverlay) {

        ordersOverlay.classList.add(
            "open"
        );

    }

    const mainEl =
        document.getElementById("mainContent");

    if (mainEl) {
        mainEl.style.display = "none";
    }

    window.scrollTo({ top: 0 });

    loadOrdersIntoPanel(
        student.id
    );

}


function closeOrdersPanel() {

    if (ordersOverlay) {

        ordersOverlay.classList.remove(
            "open"
        );

    }

    if (typeof goBack === "function") {
        goBack();
    } else if (typeof goHome === "function") {
        goHome();
    }

}


// ========================================
// KEEP THE HERO'S ORDER COUNT ACCURATE
// ("active" = paid, not yet fulfilled)
// ========================================

async function refreshOrderCountBadge(studentId) {

    const heroActiveOrdersEl =
        document.getElementById("heroActiveOrders");

    const heroOrdersBadgeEl =
        document.getElementById("heroOrdersBadge");

    if (!heroActiveOrdersEl || !heroOrdersBadgeEl) {
        return;
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/orders?studentId=" + studentId
            );

        const data =
            await response.json();

        if (!data.success) {
            return;
        }

        const activeOrderCount =
            data.orders.filter(function (order) {

                return order.status === "paid";

            }).length;

        heroActiveOrdersEl.textContent =
            `${activeOrderCount} active order${activeOrderCount === 1 ? "" : "s"}`;

        heroOrdersBadgeEl.textContent =
            activeOrderCount;

    } catch (error) {

        console.error(
            "Order count refresh error:",
            error
        );

    }

}


if (accountOrders) {

    accountOrders.addEventListener(
        "click",
        function () {
            window.location.hash = "orders";
        }
    );

}


if (dashboardMyOrders) {

    dashboardMyOrders.addEventListener(
        "click",
        function () {
            window.location.hash = "orders";
        }
    );

}


if (closeOrders) {

    closeOrders.addEventListener(
        "click",
        closeOrdersPanel
    );

}


if (ordersOverlay) {

    ordersOverlay.addEventListener(
        "click",
        function (event) {

            if (
                event.target === ordersOverlay
            ) {

                closeOrdersPanel();

            }

        }
    );

}




    if (closeSignIn) {

        closeSignIn.addEventListener(
            "click",
            closeSignInModal
        );

    }



    if (signInModal) {

        signInModal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target ===
                    signInModal
                ) {

                    closeSignInModal();

                }

            }
        );

    }



    /*
        Current sign-in is still
        a frontend demonstration.

        REAL authentication will be
        connected to PostgreSQL later.
    */

    // ========================================
// STUDENT SIGN IN
// ========================================

if (signInForm) {

    signInForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // ========================================
            // GET FORM VALUES
            // ========================================

            const identifier =
                document.getElementById(
                    "signinIdentifierValue"
                ).value.trim();

            const passcode =
                document.getElementById(
                    "signinPasscode"
                ).value;


            // ========================================
            // VALIDATE INPUT
            // ========================================

            if (
                identifier === "" ||
                passcode.length !== 6
            ) {

                showMessage(
                    "Please enter your email/phone and 6-digit passcode."
                );

                return;

            }


            // ========================================
            // GET SIGN IN BUTTON
            // ========================================

            const signInButton =
                signInForm.querySelector(
                    'button[type="submit"]'
                );


            // ========================================
            // DISABLE BUTTON
            // ========================================

            if (signInButton) {

                signInButton.disabled = true;

                signInButton.innerHTML = `
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    Signing In...
                `;

            }


            try {

                // ========================================
                // SEND LOGIN REQUEST
                // ========================================

                const response =
                    await fetch(
                        API_URL + "/api/students/login",
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                identifier:
                                    identifier,

                                passcode:
                                    passcode

                            })

                        }
                    );


                // ========================================
                // READ RESPONSE
                // ========================================

                const data =
                    await response.json();


                // ========================================
                // LOGIN FAILED
                // ========================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    // ====================================
                    // UNVERIFIED EMAIL — SEND THEM TO
                    // THE OTP VERIFICATION SCREEN
                    // ====================================

                    if (
                        data.requiresVerification &&
                        data.studentId &&
                        data.email
                    ) {

                        closeSignInModal();

                        if (signUpModal) {

                            signUpModal.classList.add(
                                "open"
                            );

                        }

                        showOtpVerificationScreen(
                            data.studentId,
                            data.email
                        );

                        if (resendOtpButton) {

                            resendOtpButton.click();

                        }

                        return;

                    }

                    showMessage(
                        data.message ||
                        "Invalid email or password."
                    );

                    return;

                }


                // ========================================
                // LOGIN SUCCESSFUL
                // ========================================

                console.log(
                    "Student logged in successfully:",
                    data.student
                );


                // ========================================
                // SAVE LOGGED-IN STUDENT
                // ========================================

                const rememberMe =
                    document.getElementById(
                        "rememberMe"
                    );


                if (
                    rememberMe &&
                    rememberMe.checked
                ) {

                    localStorage.setItem(
                        "kuriosLoggedInStudent",
                        JSON.stringify(
                            data.student
                        )
                    );

                } else {

                    sessionStorage.setItem(
                        "kuriosLoggedInStudent",
                        JSON.stringify(
                            data.student
                        )
                    );

                }


                // ========================================
                // SUCCESS MESSAGE
                // ========================================

                showMessage(
                    "Login successful. Welcome back to Kurios Stores."
                );

                if (
                    window.__kuriosChatSocket &&
                    window.__kuriosChatSocket.connected
                ) {

                    window.__kuriosChatSocket.emit(
                        "join",
                        data.student.id
                    );

                }

                const postLoginSplash =
                    document.getElementById("postLoginSplash");

                if (postLoginSplash) {
                    postLoginSplash.style.display = "flex";
                }

                const splashShownAt = Date.now();
                const SPLASH_MIN_DISPLAY_MS = 5000;

                function proceedAfterSplashDelay(callback) {

                    const elapsed =
                        Date.now() - splashShownAt;

                    const remaining =
                        Math.max(0, SPLASH_MIN_DISPLAY_MS - elapsed);

                    setTimeout(callback, remaining);

                }

updateLoginState();

                if (typeof showDashboardChoiceModal === "function") {

                    fetch(
                        API_URL + "/api/sellers/me?studentId=" + data.student.id
                    )
                        .then(function (response) { return response.json(); })
                        .then(function (sellerData) {

                            const isApprovedSeller =
                                sellerData.success &&
                                sellerData.seller &&
                                sellerData.seller.status === "approved";

                            proceedAfterSplashDelay(function () {

                                if (isApprovedSeller) {

                                    // Keep the splash up — the choice
                                    // modal renders on top of it.

                                    showDashboardChoiceModal(data.student);

                                } else if (postLoginSplash) {

                                    postLoginSplash.style.display = "none";

                                }

                            });

                        })
                        .catch(function (error) {

                            console.error(
                                "Post-login seller check error:",
                                error
                            );

                            proceedAfterSplashDelay(function () {

                                if (postLoginSplash) {
                                    postLoginSplash.style.display = "none";
                                }

                            });

                        });

                } else {

                    proceedAfterSplashDelay(function () {

                        if (postLoginSplash) {
                            postLoginSplash.style.display = "none";
                        }

                    });

                }





                // ========================================
                // CLOSE SIGN-IN MODAL
                // ========================================

                if (signInModal) {

                    signInModal.classList.remove(
                        "open"
                    );

                }


                // ========================================
                // CLEAR PASSCODE
                // ========================================

                signinPasscodeGroup.clear();


                // ========================================
                // UPDATE UI
                // ========================================

                console.log(
                    "Logged-in student:",
                    data.student
                );


            } catch (error) {

                console.error(
                    "Sign-in error:",
                    error
                );


                showMessage(
                    "Unable to connect to Kurios Stores server."
                );


            } finally {

                // ========================================
                // RESTORE BUTTON
                // ========================================

                if (signInButton) {

                    signInButton.disabled = false;

                    signInButton.innerHTML = `
                        Sign In
                    `;

                }

            }

        }
    );

}



    /* =====================================================
       13. SIGN UP MODAL
       ===================================================== */


    const signUpModal =
        document.getElementById(
            "signUpModal"
        );


    const openSignUp =
        document.getElementById(
            "openSignUp"
        );


    const closeSignUp =
        document.getElementById(
            "closeSignUp"
        );


    const signupForm =
        document.getElementById(
            "signupForm"
        );


    const backToSignIn =
        document.getElementById(
            "backToSignIn"
        );



    function openSignUpModal() {

        if (typeof closeNotificationPanel === "function") {
            closeNotificationPanel();
        }

        if (signInModal) {

            signInModal.classList.remove(
                "active"
            );

        }


        if (signUpModal) {

            signUpModal.classList.add(
                "active"
            );

        }

    }



    function closeSignUpModal() {

        if (signUpModal) {

            signUpModal.classList.remove(
                "active"
            );

        }

    }



    if (openSignUp) {

        openSignUp.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                openSignUpModal();

            }
        );

    }



    if (closeSignUp) {

        closeSignUp.addEventListener(
            "click",
            closeSignUpModal
        );

    }



    if (backToSignIn) {

        backToSignIn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                closeSignUpModal();

                openSignInModal();

            }
        );

    }



    if (signupForm) {

    signupForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            // ========================================
            // GET FORM VALUES
            // ========================================

            const firstName =
                document.getElementById("signupFirstName").value.trim();

            const lastName =
                document.getElementById("signupLastName").value.trim();

            const email =
                document.getElementById("signupEmail").value.trim();

            const phone =
                document.getElementById("signupPhone").value.trim();

            const whatsappNumber =
                document.getElementById("signupWhatsapp").value.trim();

            const university =
                document.getElementById("signupUniversity").value.trim();

            const studentId =
                document.getElementById("signupStudentId").value.trim();

            const passcode =
                document.getElementById("signupPasscode").value;

            const confirmPasscode =
                document.getElementById("signupConfirmPasscode").value;

            const agreedStudent =
                document.getElementById("agreedStudent").checked;

            const agreedTerms =
                document.getElementById("agreedTerms").checked;

            const agreedPrivacy =
                document.getElementById("agreedPrivacy").checked;

            const receiveNotifications =
                document.getElementById("receiveNotifications").checked;


            // ========================================
            // FRONTEND VALIDATION
            // ========================================

            if (
                !firstName ||
                !lastName ||
                !email ||
                !phone ||
                !whatsappNumber ||
                !university ||
                !studentId ||
                !passcode ||
                !confirmPasscode
            ) {

                showMessage(
                    "Please fill in all required fields."
                );

                return;
            }


            // ========================================
            // PASSCODE CHECK
            // ========================================

            if (!/^\d{6}$/.test(passcode)) {

                showMessage(
                    "Your passcode must be exactly 6 digits."
                );

                return;
            }


            if (passcode !== confirmPasscode) {

                showMessage(
                    "Passcodes do not match."
                );

                return;
            }


            // ========================================
            // PHONE / WHATSAPP FORMAT CHECK
            // ========================================

            const digitsOnlyPhone =
                phone.replace(/\D/g, "");

            if (!/^0\d{10}$/.test(digitsOnlyPhone)) {

                showMessage(
                    "Please enter a complete, valid phone number (11 digits, starting with 0)."
                );

                return;
            }

            const digitsOnlyWhatsapp =
                whatsappNumber.replace(/\D/g, "");

            if (!/^0\d{10}$/.test(digitsOnlyWhatsapp)) {

                showMessage(
                    "Please enter a complete, valid WhatsApp number (11 digits, starting with 0)."
                );

                return;
            }


            // ========================================
            // STUDENT CONFIRMATION
            // ========================================

            if (!agreedStudent) {

                showMessage(
                    "Please confirm that you are a student."
                );

                return;
            }


            // ========================================
            // TERMS & PRIVACY
            // ========================================

            if (!agreedTerms || !agreedPrivacy) {

                showMessage(
                    "Please agree to the Terms and Privacy Policy."
                );

                return;
            }


            // ========================================
            // DISABLE BUTTON WHILE REGISTERING
            // ========================================

            const submitButton =
                document.getElementById("signupSubmit");

            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Creating Account...";
            }


            // ========================================
            // SEND DATA TO BACKEND
            // ========================================

            try {

                const response = await fetch(
                    API_URL + "/api/students/register",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({

                            firstName: firstName,

                            lastName: lastName,

                            email: email,

                            phone: digitsOnlyPhone,

                            whatsappNumber:
                                digitsOnlyWhatsapp,

                            university: university,

                            studentId: studentId,

                            passcode: passcode,

                            confirmPasscode:
                                confirmPasscode,

                            agreedStudent:
                                agreedStudent,

                            agreedTerms:
                                agreedTerms,

                            agreedPrivacy:
                                agreedPrivacy,

                            receiveNotifications:
                                receiveNotifications

                        })

                    }
                );


                // ========================================
// READ BACKEND RESPONSE
// ========================================

const data =
    await response.json();


// ========================================
// CONTINUE UNVERIFIED REGISTRATION
// ========================================

if (
    response.ok &&
    data.success &&
    data.requiresVerification &&
    data.continueRegistration
) {

    console.log(
        "Continuing unverified registration:",
        data.student
    );


    showOtpVerificationScreen(
        data.studentId,
        data.email
    );


    return;

}


// ========================================
// INVALID OTP
// ========================================

if (!response.ok || !data.success) {

    showMessage(
        data.message ||
        "Something went wrong while creating the account."
    );

    return;
}


// ========================================
// SUCCESS - OTP VERIFICATION
// ========================================

console.log(
    "Registration successful:",
    data
);


// ========================================
// CONFIRM VERIFICATION DATA
// ========================================

if (
    !data.studentId ||
    !data.email
) {

    console.error(
        "Missing verification data:",
        data
    );

    showMessage(
        "Account was created, but verification information is missing."
    );

    return;
}


// ========================================
// CLEAR REGISTRATION FORM
// ========================================

signupForm.reset();


// ========================================
// SHOW OTP VERIFICATION SCREEN
// ========================================

showOtpVerificationScreen(
    data.studentId,
    data.email
);


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                showMessage(
                    "Unable to connect to Kurios Stores server."
                );

            } finally {

                // ========================================
                // ENABLE BUTTON AGAIN
                // ========================================

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "Create Student Account";

                }

            }

        }
    );

}


    /* =====================================================
       14. NOTIFICATIONS
       ===================================================== */


    const notificationButton =
        document.getElementById(
            "notificationButton"
        );


    const notificationPanel =
        document.getElementById(
            "notificationPanel"
        );


    function closeNotificationPanel() {

        if (notificationPanel) {

            notificationPanel.classList.remove(
                "open"
            );

        }

    }

    window.closeNotificationPanel = closeNotificationPanel;


    const closeNotifications =
        document.getElementById(
            "closeNotifications"
        );


    const notificationList =
        document.getElementById(
            "notificationList"
        );


    const notificationBadge =
        document.getElementById(
            "notificationBadge"
        );



    /*
        Notifications now come from the server —
        every student sees the same admin announcements.
    */

    let notifications = [];



    function saveNotifications() {

        localStorage.setItem(
            "kuriosNotifications",
            JSON.stringify(
                notifications
            )
        );

    }



    function renderNotifications() {


        if (!notificationList) {
            return;
        }



        notificationList.innerHTML = "";



        if (
            notifications.length === 0
        ) {

            notificationList.innerHTML = `

                <div class="empty-state">

                    <i class="fa-regular fa-bell-slash"></i>

                    <h4>
                        No notifications
                    </h4>

                    <p>
                        You're all caught up.
                    </p>

                </div>

            `;

        }



        notifications.forEach(
            function (notification) {


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "notification-item";


                item.innerHTML = `

                    <div class="notification-icon">

                        <i class="fa-solid fa-bell"></i>

                    </div>

                    <div>

                        <strong>

                            ${notification.title}

                        </strong>

                        <p>

                            ${notification.message}

                        </p>

                    </div>

                `;


                notificationList.appendChild(
                    item
                );

            }
        );



        /*
            Update notification badge — only show
            a count for notifications the student
            hasn't seen yet (tracked locally).
        */

        if (notificationBadge) {

            const seenCount =
                parseInt(
                    localStorage.getItem("kuriosNotificationsSeenCount") || "0",
                    10
                );

            const unseenCount =
                Math.max(0, notifications.length - seenCount);

            if (unseenCount > 0) {

                notificationBadge.textContent = unseenCount;
                notificationBadge.style.display = "";

            } else {

                notificationBadge.style.display = "none";

            }

        }

    }



    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            function () {

                let willOpen = true;

                if (notificationPanel) {

                    willOpen =
                        !notificationPanel.classList.contains("open");

                    notificationPanel.classList.toggle(
                        "open"
                    );

                }

                if (willOpen) {

                    localStorage.setItem(
                        "kuriosNotificationsSeenCount",
                        notifications.length
                    );

                    if (notificationBadge) {
                        notificationBadge.style.display = "none";
                    }

                }

            }
        );

    }



    if (closeNotifications) {

        closeNotifications.addEventListener(
            "click",
            function () {

                if (notificationPanel) {

                    notificationPanel.classList.remove(
                        "open"
                    );

                }

            }
        );

    }



    /* =====================================================
       15. CHAT SYSTEM — REAL, BACKEND-POWERED
       ===================================================== */


    const chatContactList =
        document.getElementById("chatContactList");

    const chatContactsLoading =
        document.getElementById("chatContactsLoading");

    const chatContactsEmpty =
        document.getElementById("chatContactsEmpty");

    const activeChatName =
        document.getElementById(
            "activeChatName"
        );


    const activeChatStatus =
        document.getElementById(
            "activeChatStatus"
        );


    const activeChatAvatar =
        document.getElementById(
            "activeChatAvatar"
        );


    const messages =
        document.getElementById(
            "messages"
        );


    const messageForm =
        document.getElementById(
            "messageForm"
        );


    const messageInput =
        document.getElementById(
            "messageInput"
        );


    let __kuriosLastTypingEmit = 0;

    if (messageInput) {

        messageInput.addEventListener(
            "input",
            function () {

                if (
                    !activeChatPartnerId ||
                    !window.__kuriosChatSocket
                ) {
                    return;
                }

                const now = Date.now();

                // Throttle — no need to emit on every
                // keystroke, once every couple seconds
                // is enough for a "typing..." indicator.

                if (now - __kuriosLastTypingEmit < 2000) {
                    return;
                }

                __kuriosLastTypingEmit = now;

                window.__kuriosChatSocket.emit(
                    "typing",
                    { recipientId: activeChatPartnerId }
                );

            }
        );

    }


    const chatSearch =
        document.getElementById(
            "chatSearch"
        );


    let activeChatPartnerId = null;
    let activeConversationId = null;
    let activeChatIsSupport = false;
    let chatPollInterval = null;
    let conversationsPollInterval = null;
    let cachedConversations = [];
    let onlineStudentIds = new Set();

    async function refreshOnlinePresence() {

        try {

            const response =
                await fetch(API_URL + "/api/chat/online-students");

            const data = await response.json();

            if (data.success) {

                onlineStudentIds =
                    new Set(data.onlineIds.map(String));

                if (activeChatPartnerId) {

                    updateHeaderPresence(activeChatPartnerId);

                }

            }

        } catch (error) {

            console.error(
                "Refresh online presence error:",
                error
            );

        }

    }

    function updateHeaderPresence(partnerId) {

        const isOnline =
            onlineStudentIds.has(String(partnerId));

        const dot =
            document.getElementById("activeChatStatusDot");

        if (dot) {
            dot.classList.toggle("online", isOnline && !activeChatIsSupport);
        }

        if (activeChatStatus) {

            activeChatStatus.textContent =
                activeChatIsSupport ?
                    "KSupport" :
                    (isOnline ? "Online" : "Kurios Stores student");

        }

    }


    function chatInitial(firstName, lastName) {

        const name =
            (firstName || "?").trim();

        return name.charAt(0).toUpperCase();

    }


    function renderChatContactList() {

        if (!chatContactList) {
            return;
        }

        chatContactList.innerHTML = "";

        const activeFilter =
            (typeof __kuriosChatFilter !== "undefined" && __kuriosChatFilter) || "all";

        const visibleConversations =
            activeFilter === "all" ?
                cachedConversations :
                (activeFilter === "ERRAND" ?
                    cachedConversations.filter(function (c) {
                        return c.type === "ERRAND" || c.type === "CRAFT";
                    }) :
                    cachedConversations.filter(function (c) {
                        return c.type === activeFilter;
                    })
                );

        if (visibleConversations.length === 0) {

            if (chatContactsEmpty) {
                chatContactsEmpty.style.display = "block";
            }

            return;

        }

        if (chatContactsEmpty) {
            chatContactsEmpty.style.display = "none";
        }

        visibleConversations.forEach(function (conversation) {

            const fullName =
                ((conversation.first_name || "") + " " + (conversation.last_name || "")).trim();

            const button =
                document.createElement("button");

            button.className = "chat-contact";

            if (conversation.conversation_id === activeConversationId) {
                button.classList.add("active");
            }

            const avatarMarkup =
                conversation.profile_picture ?
                    `<img src="${API_URL + conversation.profile_picture}" alt="${fullName}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">` :
                    chatInitial(conversation.first_name, conversation.last_name);

            const unreadBadge =
                conversation.unread_count > 0 ?
                    `<span class="chat-contact-unread-badge">${conversation.unread_count}</span>` :
                    "";

            const isProduct =
                conversation.type === "PRODUCT" && conversation.product_name;

            const sellerTag =
                conversation.type === "SUPPORT" ?
                    `<span class="chat-contact-seller-tag support">KSupport</span>` :
                    (conversation.partner_store_name ?
                        `<span class="chat-contact-seller-tag">Seller</span>` :
                        "");

            const previewLine =
                isProduct ?
                    `<i class="fa-solid fa-box"></i> ${conversation.product_name}` :
                    (conversation.last_message ? conversation.last_message.slice(0, 32) : "");

            button.innerHTML = `
                <div class="chat-avatar">${avatarMarkup}</div>
                <div class="chat-contact-info">
                    <strong>${fullName || "Kurios Student"}${sellerTag}</strong>
                    <span>${previewLine}</span>
                </div>
                ${unreadBadge}
            `;

            button.addEventListener(
                "click",
                function () {

                    const contextMarker =
                        conversation.type === "SUPPORT" ?
                            "__SUPPORT__" :
                            (isProduct ? conversation.product_name : null);

                    openChatWith(
                        conversation.id,
                        fullName,
                        conversation.conversation_id,
                        contextMarker
                    );

                }
            );

            chatContactList.appendChild(button);

        });

    }

    window.renderChatContactList = renderChatContactList;


    async function loadConversations() {

        const student =
            getLoggedInStudent();

        if (!student) {

            if (chatContactsLoading) {
                chatContactsLoading.style.display = "none";
            }

            return;
        }

        const sidebarAvatar =
            document.getElementById("chatAppSidebarAvatar");

        const sidebarName =
            document.getElementById("chatAppSidebarName");

        const avatarMarkup =
            student.profile_picture ?
                `<img src="${API_URL + student.profile_picture}" alt="You">` :
                `<i class="fa-regular fa-user"></i>`;

        if (sidebarAvatar) {
            sidebarAvatar.innerHTML = avatarMarkup;
        }

        if (sidebarName) {

            sidebarName.textContent =
                (student.first_name || "You");

        }

        try {

            const response =
                await fetch(
                    API_URL + "/api/chat/conversations?studentId=" + student.id
                );

            const data = await response.json();

            if (chatContactsLoading) {
                chatContactsLoading.style.display = "none";
            }

            if (data.success) {

                cachedConversations = data.conversations;
                renderChatContactList();

            }

            if (window.__kuriosPendingChatOpen) {

                const pending = window.__kuriosPendingChatOpen;
                window.__kuriosPendingChatOpen = null;

                openChatWith(
                    pending.sellerStudentId,
                    pending.storeName || "Seller",
                    pending.conversationId,
                    pending.productName
                );

            }

        } catch (error) {

            console.error(
                "Load conversations error:",
                error
            );

            if (chatContactsLoading) {
                chatContactsLoading.style.display = "none";
            }

        }

    }

    window.loadConversations = loadConversations;


    function renderMessages(messageRows, myId) {

        if (!messages) {
            return;
        }

        messages.innerHTML = "";

        if (messageRows.length === 0) {

            messages.innerHTML = `
                <p class="chat-contacts-status" style="padding: 20px;">
                    No messages yet. Say hello!
                </p>
            `;

            return;

        }

        messageRows.forEach(function (message) {

            const isSent =
                message.sender_id === myId;

            const messageElement =
                document.createElement("div");

            messageElement.className =
                "message " + (isSent ? "sent" : "received");

            messageElement.dataset.messageId = message.id;

            const time =
                new Date(message.created_at).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                );

            const receiptMarkup =
                isSent ?
                    `<i class="fa-solid fa-check-double message-read-receipt ${message.read_at ? "read" : ""}"></i>` :
                    "";

            let bubbleContent;

            const attachmentUrl =
                message.attachment_url ?
                    (message.attachment_url.indexOf("http") === 0 ? message.attachment_url : API_URL + message.attachment_url) :
                    null;

            const isTextMessage =
                !message.message_type || message.message_type === "TEXT";

            if (message.message_type === "IMAGE" && attachmentUrl) {

                bubbleContent = `<a href="${attachmentUrl}" target="_blank" rel="noopener"><img src="${attachmentUrl}" class="message-image" alt="Shared photo"></a>`;

            } else if (message.message_type === "VOICE" && attachmentUrl) {

                bubbleContent = `
                    <div class="message-voice-note">
                        <i class="fa-solid fa-microphone" style="color: var(--purple);"></i>
                        <audio controls src="${attachmentUrl}"></audio>
                    </div>
                `;

            } else if (message.message_type === "FILE" && attachmentUrl) {

                const sizeLabel =
                    message.attachment_size ?
                        (message.attachment_size > 1024 * 1024 ?
                            (message.attachment_size / (1024 * 1024)).toFixed(1) + " MB" :
                            Math.round(message.attachment_size / 1024) + " KB") :
                        "";

                bubbleContent = `
                    <a href="${attachmentUrl}" target="_blank" rel="noopener" class="message-file-card">
                        <span class="message-file-icon"><i class="fa-solid fa-file"></i></span>
                        <span>
                            <strong>${escapeChatText(message.attachment_name || "File")}</strong>
                            <span>${sizeLabel}</span>
                        </span>
                    </a>
                `;

            } else {

                bubbleContent =
                    `<div class="message-bubble" data-bubble-text="${encodeURIComponent(message.body)}">${escapeChatText(message.body)}</div>`;

            }

            const editedLabel =
                message.edited_at ? ' <span class="message-edited-label">(edited)</span>' : "";

            // Reactions
            const reactions =
                Array.isArray(message.reactions) ? message.reactions : [];

            const reactionsMarkup =
                reactions.length > 0 ?
                    `<div class="message-reactions">` +
                    reactions.map(function (r) {
                        return `<button type="button" class="message-reaction-pill ${r.reactedByMe ? "mine" : ""}" data-reaction-emoji="${r.emoji}">${r.emoji} ${r.count}</button>`;
                    }).join("") +
                    `</div>` :
                    "";

            // Hover actions: react, and edit (own text messages < 15 min old)
            const ageMs =
                Date.now() - new Date(message.created_at).getTime();

            const canEdit =
                isSent && isTextMessage && ageMs < 15 * 60 * 1000;

            const actionsMarkup = `
                <div class="message-hover-actions">
                    <button type="button" class="message-react-trigger" title="React"><i class="fa-regular fa-face-smile"></i></button>
                    ${canEdit ? '<button type="button" class="message-edit-trigger" title="Edit"><i class="fa-solid fa-pen"></i></button>' : ""}
                </div>
            `;

            messageElement.innerHTML = `
                ${actionsMarkup}
                ${bubbleContent}
                ${reactionsMarkup}
                <span>${time}${editedLabel}${receiptMarkup}</span>
            `;

            messages.appendChild(messageElement);

        });

        // "Seen" indicator — shown once, under the most
        // recent message YOU sent that the other person
        // has actually read (not on every message).

        let lastSeenMessage = null;

        for (let i = messageRows.length - 1; i >= 0; i--) {

            const m = messageRows[i];

            if (m.sender_id === myId) {

                if (m.read_at) {
                    lastSeenMessage = m;
                }

                break;

            }

        }

        if (lastSeenMessage) {

            const seenEl =
                messages.querySelector('[data-message-id="' + lastSeenMessage.id + '"]');

            if (seenEl) {

                const seenLabel =
                    document.createElement("div");

                seenLabel.className = "message-seen-label";

                seenLabel.textContent =
                    "Seen " + new Date(lastSeenMessage.read_at).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                    );

                seenEl.appendChild(seenLabel);

            }

        }

        messages.scrollTop = messages.scrollHeight;

    }


    function escapeChatText(text) {

        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;

    }


    async function loadThread(partnerId, myId, conversationId) {

        try {

            let url =
                API_URL + "/api/chat/messages?studentId=" + myId + "&withId=" + partnerId;

            if (conversationId) {
                url += "&conversationId=" + conversationId;
            }

            const response =
                await fetch(url);

            const data = await response.json();

            if (data.success && activeChatPartnerId === partnerId) {

                renderMessages(data.messages, myId);

            }

            // A message may have just been marked read —
            // refresh the sidebar's unread badges too.

            loadConversations();

        } catch (error) {

            console.error(
                "Load thread error:",
                error
            );

        }

    }

    window.loadThread = loadThread;


    function openChatWith(partnerId, partnerName, conversationId, productContext, partnerData) {

        const student =
            getLoggedInStudent();

        if (!student) {
            return;
        }

        activeChatPartnerId = partnerId;
        activeConversationId = conversationId || null;
        activeChatIsSupport = productContext === "__SUPPORT__";

        window.activeChatPartnerId = activeChatPartnerId;
        window.activeConversationId = activeConversationId;

        const blockBtnEl =
            document.getElementById("blockStudentBtn");

        const reportBtnEl =
            document.getElementById("reportStudentBtn");

        if (blockBtnEl) {
            blockBtnEl.style.display = activeChatIsSupport ? "none" : "flex";
        }

        if (reportBtnEl) {
            reportBtnEl.style.display = activeChatIsSupport ? "none" : "flex";
        }

        const nameTextEl =
            document.getElementById("activeChatNameText");

        if (nameTextEl) {
            nameTextEl.textContent = partnerName || "Kurios Student";
        }

        updateHeaderPresence(partnerId);

        if (activeChatAvatar) {
            activeChatAvatar.innerHTML = `<i class="fa-solid fa-user"></i>`;
        }


        // ------------------------------------
        // PROFILE PANEL — real data only
        // ------------------------------------

        const partner =
            partnerData ||
            cachedConversations.find(function (c) { return c.id === partnerId; }) ||
            {};

        const profilePanel =
            document.getElementById("chatProfilePanel");

        const chatPreviewApp =
            document.getElementById("chatPreviewApp");

        if (profilePanel) {

            profilePanel.style.display = "block";

            if (chatPreviewApp) {
                chatPreviewApp.classList.add("has-profile-panel");
            }

            const profileAvatar =
                document.getElementById("chatProfileAvatar");

            if (profileAvatar) {

                profileAvatar.innerHTML =
                    partner.profile_picture ?
                        `<img src="${API_URL + partner.profile_picture}" alt="${partnerName}">` :
                        `<i class="fa-regular fa-user"></i>`;

            }

            const profileName =
                document.getElementById("chatProfileName");

            if (profileName) {
                profileName.textContent = partnerName || "Kurios Student";
            }

            const profileBadge =
                document.querySelector(".chat-profile-badge");

            if (profileBadge) {

                profileBadge.innerHTML =
                    activeChatIsSupport ?
                        `<i class="fa-solid fa-headset"></i> KSupport` :
                        `<i class="fa-solid fa-graduation-cap"></i> Student`;

            }

            const profileUniversity =
                document.getElementById("chatProfileUniversity");

            if (profileUniversity) {

                profileUniversity.textContent =
                    partner.university || "";

                profileUniversity.style.display =
                    partner.university ? "block" : "none";

            }

            const infoList =
                document.getElementById("chatProfileInfoList");

            if (infoList) {

                let infoRows = "";

                if (partner.university) {

                    infoRows += `
                        <div class="chat-profile-info-row">
                            <i class="fa-solid fa-building-columns"></i>
                            <span>${partner.university}</span>
                        </div>
                    `;

                }

                if (partner.phone) {

                    infoRows += `
                        <div class="chat-profile-info-row">
                            <i class="fa-solid fa-phone"></i>
                            <span>${partner.phone}</span>
                        </div>
                    `;

                }

                if (partner.whatsapp_number) {

                    infoRows += `
                        <div class="chat-profile-info-row">
                            <i class="fa-brands fa-whatsapp"></i>
                            <span>${partner.whatsapp_number}</span>
                        </div>
                    `;

                }

                infoList.innerHTML =
                    infoRows ||
                    `<p style="font-size:11px; color:#9ca3af;">No further details available.</p>`;

            }

        }

        const contextBanner =
            document.getElementById("chatContextBanner");

        if (contextBanner) {

            contextBanner.style.display = "flex";

            const bannerIcon =
                contextBanner.querySelector("i");

            const bannerText =
                contextBanner.querySelector("span");

            if (productContext === "__SUPPORT__") {

                if (bannerIcon) {
                    bannerIcon.className = "fa-solid fa-headset";
                }

                if (bannerText) {
                    bannerText.textContent = "You're chatting with Kurios Stores Support.";
                }

            } else if (productContext) {

                if (bannerIcon) {
                    bannerIcon.className = "fa-solid fa-box";
                }

                if (bannerText) {
                    bannerText.textContent = "You're chatting about: " + productContext;
                }

            } else {

                if (bannerIcon) {
                    bannerIcon.className = "fa-solid fa-user-group";
                }

                if (bannerText) {
                    bannerText.textContent = "This is a normal conversation — you're chatting with a fellow student.";
                }

            }

        }

        const resolveTicketBtn =
            document.getElementById("resolveTicketBtn");

        const closeTicketBtn =
            document.getElementById("closeTicketBtn");

        const transferTicketBtn =
            document.getElementById("transferTicketBtn");

        const currentStudent =
            getLoggedInStudent();

        const showTicketActions =
            productContext === "__SUPPORT__" &&
            currentStudent &&
            currentStudent.is_support;

        if (resolveTicketBtn) {
            resolveTicketBtn.style.display = showTicketActions ? "flex" : "none";
        }

        if (closeTicketBtn) {
            closeTicketBtn.style.display = showTicketActions ? "flex" : "none";
        }

        if (transferTicketBtn) {
            transferTicketBtn.style.display = showTicketActions ? "flex" : "none";
        }

        const chatApp =
            document.getElementById("chatPreviewApp");

        if (chatApp) {
            chatApp.classList.add("conversation-open");
        }

        const typingIndicator =
            document.getElementById("chatTypingIndicator");

        if (typingIndicator) {
            typingIndicator.style.display = "none";
        }

        renderChatContactList();

        loadThread(partnerId, student.id, activeConversationId);

        clearInterval(chatPollInterval);

        chatPollInterval = setInterval(
            function () {
                loadThread(partnerId, student.id, activeConversationId);
            },
            20000
        );

    }

    window.openChatWith = openChatWith;


    /*
        Send a message.
    */

    if (messageForm) {

        messageForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                const student =
                    getLoggedInStudent();

                if (!student) {

                    showMessage("Please sign in to chat.");
                    return;

                }

                if (!activeChatPartnerId && !activeConversationId) {

                    showMessage("Select or start a conversation first.");
                    return;

                }

                if (!messageInput) {
                    return;
                }

                const text =
                    messageInput.value.trim();

                if (text === "") {
                    return;
                }

                messageInput.value = "";

                try {

                    const response =
                        await fetch(
                            API_URL + "/api/chat/messages",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    senderId: student.id,
                                    recipientId: activeChatPartnerId,
                                    body: text,
                                    conversationId: activeConversationId
                                })
                            }
                        );

                    const data = await response.json();

                    if (!data.success) {

                        showMessage(
                            data.message || "Could not send your message."
                        );

                        return;

                    }

                    loadThread(activeChatPartnerId, student.id, activeConversationId);

                } catch (error) {

                    console.error(
                        "Send message error:",
                        error
                    );

                    showMessage("Unable to connect to Kurios Stores server.");

                }

            }
        );

    }



    /* =====================================================
       16. CHAT SEARCH
       ===================================================== */


    if (chatSearch) {

        chatSearch.addEventListener(
            "input",
            function () {

                const search =
                    chatSearch.value
                        .toLowerCase()
                        .trim();

                const contactButtons =
                    chatContactList ?
                        chatContactList.querySelectorAll(".chat-contact") :
                        [];

                contactButtons.forEach(
                    function (contact) {

                        const name =
                            contact
                                .querySelector("strong")
                                .textContent
                                .toLowerCase();

                        contact.style.display =
                            name.includes(search) ? "" : "none";

                    }
                );

            }
        );

    }



    /* =====================================================
       17. NEW CHAT BUTTON — ADD BY PHONE NUMBER
       ===================================================== */


    const chatBackButton =
        document.getElementById("chatBackButton");

    if (chatBackButton) {

        chatBackButton.addEventListener(
            "click",
            function () {

                const chatApp =
                    document.getElementById("chatPreviewApp");

                if (chatApp) {
                    chatApp.classList.remove("conversation-open");
                }

            }
        );

    }


    const newChatButton =
        document.getElementById(
            "newChatButton"
        );

    const newChatForm =
        document.getElementById("newChatForm");

    const newChatPhoneInput =
        document.getElementById("newChatPhoneInput");

    const newChatFindButton =
        document.getElementById("newChatFindButton");

    const newChatStatus =
        document.getElementById("newChatStatus");


    if (newChatButton) {

        newChatButton.addEventListener(
            "click",
            function () {

                const student =
                    getLoggedInStudent();

                if (!student) {

                    showMessage("Please sign in to start a chat.");
                    openSignInModal();
                    return;

                }

                if (newChatForm) {

                    const isVisible =
                        newChatForm.style.display === "block";

                    newChatForm.style.display =
                        isVisible ? "none" : "block";

                    if (!isVisible && newChatPhoneInput) {
                        newChatPhoneInput.focus();
                    }

                }

            }
        );

    }


    if (newChatFindButton) {

        newChatFindButton.addEventListener(
            "click",
            async function () {

                const student =
                    getLoggedInStudent();

                if (!student) {
                    return;
                }

                const phoneNumber =
                    newChatPhoneInput ? newChatPhoneInput.value.trim() : "";

                if (!phoneNumber) {

                    if (newChatStatus) {
                        newChatStatus.textContent = "Please enter a phone number.";
                    }

                    return;

                }

                newChatFindButton.disabled = true;

                if (newChatStatus) {
                    newChatStatus.textContent = "Searching...";
                }

                try {

                    const response =
                        await fetch(
                            API_URL + "/api/chat/find",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    studentId: student.id,
                                    phoneNumber: phoneNumber
                                })
                            }
                        );

                    const data = await response.json();

                    if (!data.success) {

                        if (newChatStatus) {
                            newChatStatus.textContent = data.message;
                        }

                        return;

                    }

                    const fullName =
                        ((data.student.first_name || "") + " " + (data.student.last_name || "")).trim();

                    if (newChatStatus) {
                        newChatStatus.textContent = "";
                    }

                    if (newChatPhoneInput) {
                        newChatPhoneInput.value = "";
                    }

                    if (newChatForm) {
                        newChatForm.style.display = "none";
                    }

                    openChatWith(data.student.id, fullName, data.conversationId || null, null, data.student);

                } catch (error) {

                    console.error(
                        "Find student by phone error:",
                        error
                    );

                    if (newChatStatus) {
                        newChatStatus.textContent = "Unable to connect to Kurios Stores server.";
                    }

                } finally {

                    newChatFindButton.disabled = false;

                }

            }
        );

    }


    let newChatSearchDebounce = null;

    if (newChatPhoneInput) {

        newChatPhoneInput.addEventListener("input", function () {

            const query =
                newChatPhoneInput.value.trim();

            const resultsEl =
                document.getElementById("newChatSearchResults");

            if (!resultsEl) return;

            if (newChatSearchDebounce) {
                clearTimeout(newChatSearchDebounce);
            }

            // A mostly-numeric query is someone typing a
            // phone number, not a name — leave that to the
            // explicit Find button instead of live-searching.

            const isPhoneLike =
                query.replace(/\D/g, "").length >= query.length - 2 && query.length > 0;

            if (query.length < 2 || isPhoneLike) {

                resultsEl.innerHTML = "";
                return;

            }

            newChatSearchDebounce = setTimeout(function () {
                searchStudentsByName(query);
            }, 350);

        });

    }

    async function searchStudentsByName(query) {

        const student =
            getLoggedInStudent();

        if (!student) return;

        const resultsEl =
            document.getElementById("newChatSearchResults");

        if (!resultsEl) return;

        try {

            const response =
                await fetch(
                    API_URL + "/api/chat/search-students?studentId=" + student.id + "&query=" + encodeURIComponent(query)
                );

            const data = await response.json();

            if (!data.success || data.students.length === 0) {

                resultsEl.innerHTML =
                    `<p class="new-chat-status">No students found.</p>`;

                return;

            }

            resultsEl.innerHTML =
                data.students.map(function (s) {

                    const fullName =
                        `${s.first_name || ""} ${s.last_name || ""}`.trim();

                    const initial =
                        (s.first_name || "?").charAt(0).toUpperCase();

                    const avatarMarkup =
                        s.profile_picture ?
                            `<img src="${API_URL + s.profile_picture}" alt="${fullName}">` :
                            initial;

                    return `
                        <div class="new-chat-search-result-row" data-search-student-id="${s.id}" data-search-student-name="${fullName}">
                            <div class="new-chat-search-result-avatar">${avatarMarkup}</div>
                            <div class="new-chat-search-result-info">
                                <strong>${fullName}</strong>
                                <span>${s.university || ""}</span>
                            </div>
                        </div>
                    `;

                }).join("");

        } catch (error) {

            console.error("Search students error:", error);

        }

    }

    const newChatSearchResultsEl =
        document.getElementById("newChatSearchResults");

    if (newChatSearchResultsEl) {

        newChatSearchResultsEl.addEventListener("click", function (event) {

            const row =
                event.target.closest("[data-search-student-id]");

            if (!row) return;

            const partnerId =
                parseInt(row.dataset.searchStudentId, 10);

            const partnerName =
                row.dataset.searchStudentName;

            if (newChatPhoneInput) {
                newChatPhoneInput.value = "";
            }

            const resultsEl =
                document.getElementById("newChatSearchResults");

            if (resultsEl) resultsEl.innerHTML = "";

            if (newChatForm) {
                newChatForm.style.display = "none";
            }

            openChatWith(partnerId, partnerName, null, null);

        });

    }


    // Load the conversation list once, and keep it
    // fresh while the student is on the site. (Now
    // that Socket.IO delivers messages instantly,
    // this poll is just a resilience fallback in
    // case the socket connection drops.)

    loadConversations();

    conversationsPollInterval = setInterval(
        loadConversations,
        30000
    );

    refreshOnlinePresence();

    setInterval(refreshOnlinePresence, 15000);


    // ========================================
    // REAL-TIME CHAT (Socket.IO)
    // ========================================

    if (typeof io !== "undefined") {

        const chatSocket =
            io(API_URL);

        window.__kuriosChatSocket = chatSocket;

        chatSocket.on("connect", function () {

            const currentStudent =
                getLoggedInStudent();

            if (currentStudent) {

                chatSocket.emit("join", currentStudent.id);

            }

        });

        chatSocket.on("new_message", function (incomingMessage) {

            const currentStudent =
                getLoggedInStudent();

            if (!currentStudent) {
                return;
            }

            // Don't play a sound for our own message
            // echoing back — only for messages we receive.

            if (String(incomingMessage.sender_id) !== String(currentStudent.id)) {

                if (typeof playChatNotificationSound === "function") {
                    playChatNotificationSound();
                }

            }

            // Refresh the sidebar either way, so
            // unread badges/previews stay current.

            loadConversations();

            // If this message belongs to the thread
            // that's currently open, refresh it too.

            if (
                activeChatPartnerId &&
                String(incomingMessage.sender_id) === String(activeChatPartnerId)
            ) {

                loadThread(activeChatPartnerId, currentStudent.id, activeConversationId);

            }

        });

        let __kuriosTypingHideTimeout = null;

        chatSocket.on("typing", function (data) {

            if (
                !activeChatPartnerId ||
                !data ||
                String(data.fromStudentId) !== String(activeChatPartnerId)
            ) {
                return;
            }

            const typingIndicator =
                document.getElementById("chatTypingIndicator");

            const typingText =
                document.getElementById("chatTypingText");

            if (typingText && activeChatName) {

                typingText.textContent =
                    activeChatName.textContent + " is typing...";

            }

            if (typingIndicator) {

                typingIndicator.style.display = "flex";

                if (__kuriosTypingHideTimeout) {
                    clearTimeout(__kuriosTypingHideTimeout);
                }

                __kuriosTypingHideTimeout = setTimeout(
                    function () {
                        typingIndicator.style.display = "none";
                    },
                    3000
                );

            }

        });

        chatSocket.on("kurios_update", function (update) {

            if (typeof showMessage === "function" && update && update.message) {
                showMessage(update.message);
            }

            // Each of these safely does nothing if its
            // elements aren't currently in the DOM, so it's
            // fine to call all of them regardless of which
            // page the student happens to be on.

            if (typeof loadErrandPool === "function") loadErrandPool();
            if (typeof loadMyErrands === "function") loadMyErrands();
            if (typeof loadMyErrandTasks === "function") loadMyErrandTasks();
            if (typeof loadCraftDashboard === "function") loadCraftDashboard();
            if (typeof loadMyCraftJobs === "function") loadMyCraftJobs();
            if (typeof loadMyCraftRequests === "function") loadMyCraftRequests();

        });

    }




    /* =====================================================
       18. ELKURIOS BROADCAST
       ===================================================== */


    const broadcastForm =
        document.getElementById(
            "broadcastForm"
        );


    const broadcastModal =
        document.getElementById(
            "broadcastModal"
        );


    const closeBroadcast =
        document.getElementById(
            "closeBroadcast"
        );



    if (closeBroadcast) {

        closeBroadcast.addEventListener(
            "click",
            function () {

                if (broadcastModal) {

                    broadcastModal.classList.remove(
                        "active"
                    );

                }

            }
        );

    }



    /*
        IMPORTANT:

        This currently demonstrates
        the frontend behaviour only.

        The real broadcast system will be
        connected to PostgreSQL and Node.js
        after we create the notification API.
    */

    if (broadcastForm) {

        broadcastForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const title =
                    document.getElementById(
                        "broadcastTitle"
                    ).value.trim();


                const message =
                    document.getElementById(
                        "broadcastMessage"
                    ).value.trim();



                if (
                    title === "" ||
                    message === ""
                ) {

                    showMessage(
                        "Please enter a title and message."
                    );

                    return;

                }



                /*
                    Add a temporary notification
                    to this browser.
                */

                notifications.unshift({

                    title: title,

                    message: message

                });



                saveNotifications();

                renderNotifications();



                showMessage(
                    "Announcement created. The real all-students broadcast API comes next."
                );



                broadcastForm.reset();

            }
        );

    }



    /* =====================================================
       19. CHECKOUT
       ===================================================== */


    let currentOrderPaymentReference = null;

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            async function () {


                if (
                    cart.length === 0
                ) {

                    showMessage(
                        "Your cart is empty."
                    );

                    return;

                }


                // ========================================
                // MUST BE SIGNED IN TO CHECK OUT
                // ========================================

                const student =
                    getLoggedInStudent();

                if (!student) {

                    closeCartPanel();

                    showMessage(
                        "Please sign in to check out."
                    );

                    openSignInModal();

                    return;

                }


                checkoutButton.disabled = true;

                checkoutButton.textContent =
                    "Starting checkout...";


                try {

                    // ========================================
                    // DELIVERY METHOD
                    // ========================================

                    const selectedDeliveryMethod =
                        document.querySelector('input[name="deliveryMethod"]:checked');

                    const deliveryMethod =
                        selectedDeliveryMethod ? selectedDeliveryMethod.value : "pickup";

                    const deliveryLocationInput =
                        document.getElementById("cartDeliveryLocationInput");

                    const deliveryLocation =
                        deliveryLocationInput ? deliveryLocationInput.value.trim() : "";

                    if (deliveryMethod === "errand" && !deliveryLocation) {

                        showMessage("Please enter a delivery location.");
                        checkoutButton.disabled = false;
                        checkoutButton.textContent = "Proceed to Checkout";
                        return;

                    }

                    let deliveryLat = null;
                    let deliveryLng = null;

                    if (deliveryMethod === "errand" && typeof getCurrentGeolocation === "function") {

                        const position = await getCurrentGeolocation();

                        if (position) {
                            deliveryLat = position.lat;
                            deliveryLng = position.lng;
                        }

                    }

                    // ========================================
                    // START THE ORDER ON OUR SERVER
                    // (server recalculates the real total —
                    // never trust prices from the browser)
                    // ========================================

                    const initiateResponse =
                        await fetch(
                            API_URL + "/api/orders/initiate",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    studentId: student.id,
                                    items: cart,
                                    customerName:
                                        `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                                    customerEmail: student.email,
                                    deliveryMethod: deliveryMethod,
                                    deliveryLocation: deliveryLocation,
                                    deliveryLat: deliveryLat,
                                    deliveryLng: deliveryLng
                                })
                            }
                        );

                    const initiateData =
                        await initiateResponse.json();

                    if (!initiateData.success) {

                        showMessage(
                            initiateData.message ||
                            "Could not start checkout."
                        );

                        return;

                    }

                    currentOrderPaymentReference =
                        initiateData.paymentReference;

                    checkoutButton.style.display = "none";

                    const choiceEl =
                        document.getElementById("orderPaymentChoice");

                    if (choiceEl) {
                        choiceEl.style.display = "block";
                    }

                    if (student && typeof checkWalletBalanceForCheckout === "function") {

                        checkWalletBalanceForCheckout(
                            student.id,
                            initiateData.amount
                        );

                    }

                } catch (error) {

                    console.error(
                        "Checkout error:",
                        error
                    );

                    showMessage(
                        "Could not reach the server. Please try again."
                    );

                } finally {

                    checkoutButton.disabled = false;

                    checkoutButton.textContent =
                        "Proceed to Checkout";

                }

            }
        );

    }


    // ========================================
    // PAY ORDER WITH MONNIFY
    // ========================================

    const payOrderWithMonnifyButton =
        document.getElementById("payOrderWithMonnifyButton");

    if (payOrderWithMonnifyButton) {

        payOrderWithMonnifyButton.addEventListener(
            "click",
            async function () {

                const statusEl =
                    document.getElementById("orderPaymentStatus");

                if (!currentOrderPaymentReference) {
                    return;
                }

                const student =
                    getLoggedInStudent();

                if (!student) {
                    return;
                }

                payOrderWithMonnifyButton.disabled = true;

                if (statusEl) statusEl.textContent = "";

                try {

                    const response =
                        await fetch(
                            API_URL + "/api/orders/pay/monnify",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    paymentReference: currentOrderPaymentReference
                                })
                            }
                        );

                    const data = await response.json();

                    if (!data.success) {

                        if (statusEl) {
                            statusEl.textContent =
                                data.message || "Could not start Monnify checkout.";
                        }

                        return;

                    }

                    if (typeof MonnifySDK === "undefined") {

                        if (statusEl) {
                            statusEl.textContent =
                                "Payment could not load. Please refresh and try again.";
                        }

                        return;

                    }

                    if (
                        !data.apiKey ||
                        !data.contractCode
                    ) {

                        console.error(
                            "Checkout error: missing Monnify credentials from server",
                            data
                        );

                        if (statusEl) {
                            statusEl.textContent =
                                "Monnify is not fully configured yet. Try OPay instead, or contact support.";
                        }

                        return;

                    }

                    closeCartPanel();

                    MonnifySDK.initialize({

                        amount: data.amount,

                        currency: "NGN",

                        reference: data.paymentReference,

                        customerFullName:
                            `${student.first_name || ""} ${student.last_name || ""}`.trim(),

                        customerEmail: student.email,

                        apiKey: data.apiKey,

                        contractCode: data.contractCode,

                        paymentDescription:
                            "Kurios Stores order",

                        onComplete: async function () {

                            await verifyOrderPayment(
                                data.paymentReference
                            );

                        },

                        onClose: function () {

                            // Student closed the widget without
                            // finishing — we'll still catch a
                            // completed payment via the webhook,
                            // so nothing else to do here.

                        }

                    });

                } catch (error) {

                    console.error(
                        "Order Monnify checkout error:",
                        error
                    );

                    if (statusEl) {
                        statusEl.textContent =
                            "Unable to connect to Kurios Stores server.";
                    }

                } finally {

                    payOrderWithMonnifyButton.disabled = false;

                }

            }
        );

    }


    // ========================================
    // PAY ORDER WITH OPAY
    // ========================================

    const payOrderWithOpayButton =
        document.getElementById("payOrderWithOpayButton");

    if (payOrderWithOpayButton) {

        payOrderWithOpayButton.addEventListener(
            "click",
            async function () {

                const statusEl =
                    document.getElementById("orderPaymentStatus");

                if (!currentOrderPaymentReference) {
                    return;
                }

                const student =
                    getLoggedInStudent();

                if (!student) {
                    return;
                }

                payOrderWithOpayButton.disabled = true;

                if (statusEl) statusEl.textContent = "Redirecting to OPay...";

                try {

                    const returnUrl =
                        window.location.origin + "/#orders";

                    const response =
                        await fetch(
                            API_URL + "/api/orders/pay/opay",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    paymentReference: currentOrderPaymentReference,
                                    returnUrl: returnUrl,
                                    customerName:
                                        `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                                    customerEmail: student.email
                                })
                            }
                        );

                    const data = await response.json();

                    if (!data.success || !data.cashierUrl) {

                        if (statusEl) {
                            statusEl.textContent =
                                data.message || "Could not start OPay checkout.";
                        }

                        payOrderWithOpayButton.disabled = false;

                        return;

                    }

                    localStorage.setItem(
                        "kuriosPendingOpayOrderRef",
                        currentOrderPaymentReference
                    );

                    window.location.href = data.cashierUrl;

                } catch (error) {

                    console.error(
                        "Order OPay checkout error:",
                        error
                    );

                    if (statusEl) {
                        statusEl.textContent =
                            "Unable to connect to Kurios Stores server.";
                    }

                    payOrderWithOpayButton.disabled = false;

                }

            }
        );

    }


    const payOrderWithPaystackButton =
        document.getElementById("payOrderWithPaystackButton");

    if (payOrderWithPaystackButton) {

        payOrderWithPaystackButton.addEventListener(
            "click",
            async function () {

                const statusEl =
                    document.getElementById("orderPaymentStatus");

                if (!currentOrderPaymentReference) {
                    return;
                }

                const student =
                    getLoggedInStudent();

                if (!student) {
                    return;
                }

                payOrderWithPaystackButton.disabled = true;

                if (statusEl) statusEl.textContent = "Redirecting to Paystack...";

                try {

                    const returnUrl =
                        window.location.origin + "/#orders";

                    const response =
                        await fetch(
                            API_URL + "/api/orders/pay/paystack",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    paymentReference: currentOrderPaymentReference,
                                    returnUrl: returnUrl,
                                    customerEmail: student.email
                                })
                            }
                        );

                    const data = await response.json();

                    if (!data.success || !data.authorizationUrl) {

                        if (statusEl) {
                            statusEl.textContent =
                                data.message || "Could not start Paystack checkout.";
                        }

                        payOrderWithPaystackButton.disabled = false;

                        return;

                    }

                    localStorage.setItem(
                        "kuriosPendingOpayOrderRef",
                        currentOrderPaymentReference
                    );

                    window.location.href = data.authorizationUrl;

                } catch (error) {

                    console.error(
                        "Order Paystack checkout error:",
                        error
                    );

                    if (statusEl) {
                        statusEl.textContent =
                            "Unable to connect to Kurios Stores server.";
                    }

                    payOrderWithPaystackButton.disabled = false;

                }

            }
        );

    }


    // ========================================
    // CONFIRM A PAYMENT WITH OUR SERVER
    // (never trust the widget's onComplete alone)
    // ========================================

    async function verifyOrderPayment(paymentReference) {

        try {

            const response =
                await fetch(
                    API_URL + "/api/orders/verify",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            paymentReference: paymentReference
                        })
                    }
                );

            const data =
                await response.json();

            if (data.success) {

                cart = [];

                saveCart();

                updateCart();

                showMessage(
                    "Payment confirmed! Your order has been placed."
                );

            } else {

                showMessage(
                    "We couldn't confirm your payment yet. Check My Orders shortly, or contact support if this continues."
                );

            }

        } catch (error) {

            console.error(
                "Payment verification error:",
                error
            );

            showMessage(
                "We couldn't confirm your payment. Check My Orders shortly, or contact support if this continues."
            );

        } finally {

            currentOrderPaymentReference = null;

            if (checkoutButton) {
                checkoutButton.style.display = "";
            }

            const choiceEl =
                document.getElementById("orderPaymentChoice");

            if (choiceEl) {
                choiceEl.style.display = "none";
            }

        }

    }

    window.verifyOrderPayment = verifyOrderPayment;


    // ========================================
    // RESUME AN OPAY ORDER PAYMENT IF WE'RE
    // RETURNING FROM THE OPAY CHECKOUT PAGE
    // ========================================

    const pendingOpayOrderRef =
        localStorage.getItem("kuriosPendingOpayOrderRef");

    if (pendingOpayOrderRef) {

        localStorage.removeItem("kuriosPendingOpayOrderRef");

        verifyOrderPayment(pendingOpayOrderRef);

    }



    /* =====================================================
       20. FOOTER INTERACTIONS
       ===================================================== */


    const socialLinks =
        document.querySelectorAll(
            ".social-links a"
        );


    socialLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    const label =
                        link.getAttribute(
                            "aria-label"
                        ) ||
                        "Social media";


                    showMessage(
                        label +
                        " link will be connected soon."
                    );

                }
            );

        }
    );



    /*
        Footer policy links.
    */

    const privacyLink =
        document.getElementById(
            "privacyLink"
        );


    const termsLink =
        document.getElementById(
            "termsLink"
        );


    const refundLink =
        document.getElementById(
            "refundLink"
        );



    if (privacyLink) {

        privacyLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showMessage(
                    "Privacy Policy page coming soon."
                );

            }
        );

    }



    if (termsLink) {

        termsLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showMessage(
                    "Terms of Service page coming soon."
                );

            }
        );

    }



    if (refundLink) {

        refundLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showMessage(
                    "Refund Policy page coming soon."
                );

            }
        );

    }



    /* =====================================================
       21. FOOTER HEART
       ===================================================== */


    const footerHeart =
        document.querySelector(
            ".footer-love i"
        );


    if (footerHeart) {

        footerHeart.addEventListener(
            "click",
            function () {


                footerHeart.classList.toggle(
                    "fa-regular"
                );


                footerHeart.classList.toggle(
                    "fa-solid"
                );


                showMessage(
                    "Together for a greater campus ❤️"
                );

            }
        );

    }



    /* =====================================================
       22. GENERAL MESSAGE / TOAST
       ===================================================== */


    function showMessage(message, type) {


        /*
            Create a toast notification.
        */

        let toast =
            document.getElementById(
                "kuriosToast"
            );



        /*
            If the toast doesn't exist,
            create it.
        */

        if (!toast) {

            toast =
                document.createElement(
                    "div"
                );


            toast.id =
                "kuriosToast";


            toast.className =
                "kurios-toast";


            document.body.appendChild(
                toast
            );

        }



        const isError =
            type === "error";

        toast.classList.toggle("toast-error", isError);

        toast.innerHTML = `
            <span class="kurios-toast-icon">
                <i class="fa-solid ${isError ? "fa-exclamation" : "fa-check"}"></i>
            </span>
            <span>${message}</span>
        `;


        toast.classList.add(
            "show"
        );



        /*
            Remove it after 3 seconds.
        */

        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            3000
        );

    }

    window.showMessage = showMessage;



    /* =====================================================
       23. SMOOTH SCROLLING
       ===================================================== */


    /*
        Smooth-scrolling for plain "#section" links
        used to be handled here directly — but that
        approach called preventDefault() on every
        "#" link click and did its own manual scroll,
        which silently broke navigation the moment the
        target section was hidden (i.e. from any page
        other than the homepage itself). The unified
        hash router below now owns all of this — it
        already scrolls to the right section as part
        of normal navigation, and works correctly from
        any page, not just the homepage.
    */

    document.querySelectorAll('a[href="#signin"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            event.preventDefault();
            openSignInModal();

        });

    });





    /* =====================================================
       24. INITIALIZE EVERYTHING
       ===================================================== */


    /*
        Show saved cart.
    */

    updateCart();



    /*
        Load notifications from the server.
    */

    async function loadNotificationsFromServer() {

        try {

            const response =
                await fetch(API_URL + "/api/notifications");

            const data =
                await response.json();

            let combined =
                data.success ? data.notifications : [];

            const student =
                typeof getLoggedInStudent === "function" ? getLoggedInStudent() : null;

            if (student) {

                try {

                    const mineResponse =
                        await fetch(API_URL + "/api/notifications/mine?studentId=" + student.id);

                    const mineData =
                        await mineResponse.json();

                    if (mineData.success) {
                        combined = combined.concat(mineData.notifications);
                    }

                } catch (personalError) {

                    console.error(
                        "Load personal notifications error:",
                        personalError
                    );

                }

            }

            combined.sort(function (a, b) {
                return new Date(b.created_at) - new Date(a.created_at);
            });

            notifications = combined;

            renderNotifications();

        } catch (error) {

            console.error(
                "Load notifications error:",
                error
            );

        }

    }

    loadNotificationsFromServer();



    /*
        IMPORTANT:

        This is where the frontend
        contacts our Node.js backend.
    */

    loadProducts();


    // =====================================================
    // UNIFIED FULL-PAGE ROUTER
    // (single source of truth for every #hash-based full
    // page: #sell, #store-<id>, #profile, #orders,
    // #wishlist, #wallet — replaces the separate per-page
    // listeners that used to duplicate this logic)
    // =====================================================

    function hideAllFullPages() {

        ["sellerPage", "storefrontPage", "wishlistPage", "walletPage", "chatPage", "shopPage", "errandsPage"]
            .forEach(function (id) {

                const el = document.getElementById(id);

                if (el) {
                    el.style.display = "none";
                }

            });

        if (profileOverlay) {
            profileOverlay.classList.remove("open");
        }

        if (ordersOverlay) {
            ordersOverlay.classList.remove("open");
        }

    }

    window.hideAllFullPages = hideAllFullPages;

    function goHome() {

        if (window.location.hash) {

            history.pushState(
                null,
                "",
                window.location.pathname + window.location.search
            );

        }

        hideAllFullPages();

        const mainEl =
            document.getElementById("mainContent");

        if (mainEl) {
            mainEl.style.display = "block";
        }

    }

    function goBack() {

        const previousHash =
            window.__kuriosPreviousHash;

        const currentHash =
            window.location.hash;

        // Only honor it if it's a real, different, non-empty
        // page — never bounce back to the page we're already
        // on, and never chase an empty/home-equivalent hash.

        if (
            previousHash &&
            previousHash.length > 1 &&
            previousHash !== currentHash
        ) {

            window.location.hash =
                previousHash.slice(1);

        } else {

            goHome();

        }

    }

    window.goBack = goBack;

    function showSimplePage(pageId) {

        hideAllFullPages();

        const pageEl =
            document.getElementById(pageId);

        if (pageEl) {
            pageEl.style.display = "block";
        }

        const mainEl =
            document.getElementById("mainContent");

        if (mainEl) {
            mainEl.style.display = "none";
        }

        window.scrollTo({ top: 0 });

    }

    let __kuriosRouteToken = 0;
    let __kuriosLastKnownHash = "";

    function syncPageFromHash() {

        const hash = window.location.hash;

        // Remember what page we were just on, so "back"
        // buttons can return there instead of always
        // dropping the user on the dashboard home.

        window.__kuriosPreviousHash = __kuriosLastKnownHash;
        __kuriosLastKnownHash = hash;

        const thisRouteToken =
            ++__kuriosRouteToken;

        const splashMessages = {
            "#sell": "Loading your store...",
            "#profile": "Loading your profile...",
            "#orders": "Loading your orders...",
            "#wishlist": "Loading your wishlist...",
            "#wallet": "Loading your wallet...",
            "#chat": "Loading chat..."
        };

        const splashMessage =
            hash.indexOf("#store-") === 0 ?
                "Loading store..." :
                (splashMessages[hash] || "Loading...");

        const splashEl =
            document.getElementById("postLoginSplash");

        const splashTextEl =
            splashEl ? splashEl.querySelector("p") : null;

        if (splashTextEl) {
            splashTextEl.textContent = splashMessage;
        }

        if (splashEl) {
            splashEl.style.display = "flex";
        }

        setTimeout(
            function () {

                // If another navigation started after this
                // one, let that one win — don't route to a
                // now-stale destination.

                if (thisRouteToken !== __kuriosRouteToken) {
                    return;
                }

                performPageRouting(hash);

                if (splashEl) {
                    splashEl.style.display = "none";
                }

            },
            800
        );

    }

    function performPageRouting(hash) {

        if (typeof closeNotificationPanel === "function") {
            closeNotificationPanel();
        }

        if (hash !== "#sell" && typeof setAccountMenuContext === "function") {
            setAccountMenuContext(false);
        }

        if (hash === "#sell") {

            hideAllFullPages();

            if (typeof openSellerPanel === "function") {
                openSellerPanel();
            }

            return;

        }

        if (hash.indexOf("#store-") === 0) {

            const sellerId =
                hash.replace("#store-", "");

            if (sellerId && typeof openStorefront === "function") {

                hideAllFullPages();
                openStorefront(sellerId);
                return;

            }

        }

        if (hash === "#profile") {

            hideAllFullPages();
            openProfilePanel();
            return;

        }

        if (hash === "#orders") {

            hideAllFullPages();
            openOrdersPanel();
            return;

        }

        if (hash === "#wishlist") {

            showSimplePage("wishlistPage");

            if (typeof loadWishlistPage === "function") {
                loadWishlistPage();
            }

            return;

        }

        if (hash === "#errands") {

            showSimplePage("errandsPage");

            if (typeof loadErrandsPage === "function") {
                loadErrandsPage();
            }

            return;

        }

        if (hash === "#wallet") {

            showSimplePage("walletPage");

            if (typeof loadWalletPage === "function") {
                loadWalletPage();
            }

            return;

        }

        if (hash === "#shop") {

            showSimplePage("shopPage");

            if (window.__kuriosPendingShopFilter) {

                const pendingCategory =
                    window.__kuriosPendingShopFilter;

                window.__kuriosPendingShopFilter = null;

                const categorySelect =
                    document.getElementById("shopCategorySelect");

                if (categorySelect) {
                    categorySelect.value = pendingCategory;
                }

                if (typeof loadProducts === "function") {
                    loadProducts({ category: pendingCategory });
                }

            } else if (typeof loadProducts === "function") {

                loadProducts();

            }

            return;

        }

        if (hash === "#chat") {

            const student =
                typeof getLoggedInStudent === "function" ?
                    getLoggedInStudent() :
                    null;

            if (!student) {

                // Not logged in — don't show the chat page,
                // just prompt sign-in and clear the #chat
                // hash so the URL doesn't claim to be there.

                history.replaceState(null, "", window.location.pathname + window.location.search);

                if (typeof openSignInModalStandalone === "function") {
                    openSignInModalStandalone();
                }

                return;

            }

            showSimplePage("chatPage");

            if (typeof loadConversations === "function") {
                loadConversations();
            }

            return;

        }

        // No matching hash — show the homepage.
        // (This also covers plain section anchors like
        // #categories, #rewards — the browser's native
        // scroll-to-anchor can silently fail if that
        // section was hidden at the moment the hash
        // changed, e.g. coming back from another page, so
        // we scroll to it manually here instead.)

        hideAllFullPages();

        const mainEl =
            document.getElementById("mainContent");

        if (mainEl) {
            mainEl.style.display = "block";
        }

        if (hash && hash.length > 1) {

            const targetEl =
                document.getElementById(hash.slice(1));

            if (targetEl) {

                setTimeout(
                    function () {
                        targetEl.scrollIntoView({ behavior: "smooth" });
                    },
                    0
                );

            }

        }

    }

    // Generic "Back" links used across full pages
    // (Wishlist, Wallet, Chat, Seller Dashboard) —
    // return to wherever the student actually came
    // from, not always the dashboard home.

    document.querySelectorAll(".page-back-link").forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                goBack();

            }
        );

    });

    // Make these reachable from outer-scope code too
    // (e.g. closeSellerPanel calling goHome()).

    window.goHome = goHome;
    window.syncPageFromHash = syncPageFromHash;

    window.addEventListener("popstate", syncPageFromHash);
    window.addEventListener("hashchange", syncPageFromHash);

    syncPageFromHash();


});

/* =========================================
   SIGN UP MODAL
========================================= */

const signUpModal =
    document.getElementById("signUpModal");

const openSignUp =
    document.getElementById("openSignUp");

const closeSignUp =
    document.getElementById("closeSignUp");

const backToSignIn =
    document.getElementById("backToSignIn");


/* OPEN SIGN UP */

if (openSignUp) {

    openSignUp.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            if (signInModal) {
                signInModal.classList.remove("open");
            }

            if (signUpModal) {
                signUpModal.classList.add("open");
            }

            // Reset header visibility in case a previous
            // OTP flow hid it.

            const authIconEl =
                document.querySelector("#signUpModal .auth-icon");

            if (authIconEl) {
                authIconEl.style.display = "";
            }

            const titleEl =
                document.getElementById("accountModalTitle");

            if (titleEl) {
                titleEl.style.display = "";
            }

            const subtitleEl =
                document.getElementById("accountModalSubtitle");

            if (subtitleEl) {
                subtitleEl.style.display = "";
            }

        }
    );

}


/* CLOSE SIGN UP */

if (closeSignUp) {

    closeSignUp.addEventListener(
        "click",
        function() {

            if (signUpModal) {
                signUpModal.classList.remove("open");
            }

            if (typeof stopOtpTimers === "function") {
                stopOtpTimers();
            }

        }
    );

}


/* BACK TO SIGN IN */

if (backToSignIn) {

    backToSignIn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            if (signUpModal) {
                signUpModal.classList.remove("open");
            }

            if (signInModal) {
                signInModal.classList.add("open");
            }

            if (typeof stopOtpTimers === "function") {
                stopOtpTimers();
            }

        }
    );

}

/* =========================================
   SIGNUP MODAL SCROLLBAR
========================================= */

const signupModalContent =
    document.querySelector("#signUpModal .auth-modal");

let signupScrollbarTimer;

if (signupModalContent) {

    signupModalContent.addEventListener(
        "scroll",
        function () {

            // Show scrollbar while scrolling
            signupModalContent.classList.add(
                "is-scrolling"
            );

            // Reset the timer
            clearTimeout(
                signupScrollbarTimer
            );

            // Hide scrollbar after scrolling stops
            signupScrollbarTimer = setTimeout(
                function () {

                    signupModalContent.classList.remove(
                        "is-scrolling"
                    );

                },
                700
            );

        }
    );

}

// ========================================
// STUDENT EMAIL OTP VERIFICATION
// ========================================

let currentStudentId = null;
let currentStudentEmail = null;


// ========================================
// OTP ELEMENTS
// ========================================

const otpScreen =
    document.getElementById("otpVerificationScreen");

const otpDigits =
    document.querySelectorAll(".otp-digit");

const otpInput =
    document.getElementById("otpInput");

const verifyOtpButton =
    document.getElementById("verifyOtpButton");

const resendOtpButton =
    document.getElementById("resendOtpButton");

const otpStatusMessage =
    document.getElementById("otpStatusMessage");

const otpExpiryTime =
    document.getElementById("otpExpiryTime");

const otpExpiryCountdown =
    document.getElementById("otpExpiryCountdown");

const otpResendCooldown =
    document.getElementById("otpResendCooldown");

const otpResendCooldownTime =
    document.getElementById("otpResendCooldownTime");


// ========================================
// COUNTDOWN TIMER STATE
// ========================================

let otpExpiryInterval = null;
let otpResendInterval = null;


// ========================================
// START THE 10-MINUTE EXPIRY COUNTDOWN
// ========================================

function startOtpExpiryCountdown() {

    clearInterval(otpExpiryInterval);

    let secondsLeft = 10 * 60;

    function render() {

        const minutes =
            Math.floor(secondsLeft / 60);

        const seconds =
            secondsLeft % 60;

        if (otpExpiryTime) {

            otpExpiryTime.textContent =
                String(minutes).padStart(2, "0") +
                ":" +
                String(seconds).padStart(2, "0");

        }

        if (otpExpiryCountdown) {

            otpExpiryCountdown.classList.toggle(
                "otp-expiry-urgent",
                secondsLeft <= 60
            );

        }

    }

    render();

    otpExpiryInterval = setInterval(
        function () {

            secondsLeft = secondsLeft - 1;

            if (secondsLeft <= 0) {

                clearInterval(otpExpiryInterval);

                secondsLeft = 0;

                if (otpExpiryTime) {
                    otpExpiryTime.textContent = "00:00";
                }

                if (otpStatusMessage) {

                    otpStatusMessage.textContent =
                        "This code has expired. Please resend a new one.";

                }

            }

            render();

        },
        1000
    );

}


// ========================================
// START THE 30-SECOND RESEND COOLDOWN
// ========================================

function startOtpResendCooldown() {

    clearInterval(otpResendInterval);

    let secondsLeft = 30;

    if (resendOtpButton) {
        resendOtpButton.style.display = "none";
    }

    if (otpResendCooldown) {
        otpResendCooldown.style.display = "inline";
    }

    function render() {

        if (otpResendCooldownTime) {

            otpResendCooldownTime.textContent =
                secondsLeft;

        }

    }

    render();

    otpResendInterval = setInterval(
        function () {

            secondsLeft = secondsLeft - 1;

            if (secondsLeft <= 0) {

                clearInterval(otpResendInterval);

                if (resendOtpButton) {
                    resendOtpButton.style.display = "inline";
                }

                if (otpResendCooldown) {
                    otpResendCooldown.style.display = "none";
                }

                return;

            }

            render();

        },
        1000
    );

}


// ========================================
// STOP BOTH TIMERS
// ========================================

function stopOtpTimers() {

    clearInterval(otpExpiryInterval);
    clearInterval(otpResendInterval);

}


// ========================================
// SHOW OTP VERIFICATION SCREEN
// ========================================

function showOtpVerificationScreen(studentId, email) {

    currentStudentId = studentId;
    currentStudentEmail = email;


    // ========================================
    // HIDE SIGNUP FORM
    // ========================================

    const signupForm =
        document.getElementById("signupForm");

    if (signupForm) {

        signupForm.style.display = "none";

    }


    // ========================================
    // SHOW OTP SCREEN
    // ========================================

    if (otpScreen) {

        otpScreen.style.display = "block";

    }


    // ========================================
    // HIDE THE PERSISTENT SIGNUP HEADER
    // (icon + subtitle) — the OTP screen has
    // its own header, so showing both stacked
    // on top of each other wastes space,
    // especially on mobile.
    // ========================================

    const authIcon =
        document.querySelector("#signUpModal .auth-icon");

    if (authIcon) {
        authIcon.style.display = "none";
    }

    const accountModalSubtitleEl =
        document.getElementById("accountModalSubtitle");

    if (accountModalSubtitleEl) {
        accountModalSubtitleEl.style.display = "none";
    }

    const accountModalTitleEl =
        document.getElementById("accountModalTitle");

    if (accountModalTitleEl) {
        accountModalTitleEl.style.display = "none";
    }


    // ========================================
    // UPDATE EMAIL MESSAGE
    // ========================================

    const otpMessage =
        document.getElementById(
            "otpVerificationMessage"
        );

    if (otpMessage) {

        otpMessage.innerHTML = `
            We sent a 6-digit code to
            <span class="otp-email-chip">${email}</span>.
            Enter it below to activate your account.
        `;

    }


    // ========================================
    // CLEAR OTP BOXES
    // ========================================

    otpDigits.forEach(function (input) {

        input.value = "";

    });


    if (otpInput) {

        otpInput.value = "";

    }


    // ========================================
    // CLEAR STATUS
    // ========================================

    if (otpStatusMessage) {

        otpStatusMessage.textContent = "";

    }


    // ========================================
    // FOCUS FIRST BOX
    // ========================================

    if (otpDigits.length > 0) {

        otpDigits[0].focus();

    }


    // ========================================
    // START COUNTDOWNS
    // ========================================

    startOtpExpiryCountdown();

    startOtpResendCooldown();

}


// ========================================
// UPDATE COMBINED OTP
// ========================================

function updateCombinedOtp() {

    let combinedOtp = "";

    otpDigits.forEach(function (input) {

        combinedOtp += input.value;

    });


    if (otpInput) {

        otpInput.value = combinedOtp;

    }


    return combinedOtp;

}


// ========================================
// OTP BOX INPUT HANDLING
// ========================================

otpDigits.forEach(function (input, index) {


    // ========================================
    // INPUT
    // ========================================

    input.addEventListener(
        "input",
        function () {

            // Numbers only
            this.value =
                this.value.replace(/\D/g, "");


            // Keep only one digit
            if (this.value.length > 1) {

                this.value =
                    this.value.slice(-1);

            }


            // Update hidden OTP
            updateCombinedOtp();


            // Move to next box
            if (
                this.value &&
                index < otpDigits.length - 1
            ) {

                otpDigits[index + 1].focus();

            }

        }
    );


    // ========================================
    // KEYBOARD HANDLING
    // ========================================

    input.addEventListener(
        "keydown",
        function (event) {


            // Backspace
            if (
                event.key === "Backspace" &&
                !this.value &&
                index > 0
            ) {

                otpDigits[index - 1].focus();

            }


            // Left arrow
            if (
                event.key === "ArrowLeft" &&
                index > 0
            ) {

                otpDigits[index - 1].focus();

            }


            // Right arrow
            if (
                event.key === "ArrowRight" &&
                index < otpDigits.length - 1
            ) {

                otpDigits[index + 1].focus();

            }

        }
    );


    // ========================================
    // PASTE COMPLETE OTP
    // ========================================

    input.addEventListener(
        "paste",
        function (event) {

            event.preventDefault();

            const pastedText =
                event.clipboardData
                    .getData("text")
                    .replace(/\D/g, "")
                    .slice(0, 6);


            if (!pastedText) {

                return;

            }


            pastedText
                .split("")
                .forEach(function (digit, digitIndex) {

                    if (
                        otpDigits[digitIndex]
                    ) {

                        otpDigits[digitIndex].value =
                            digit;

                    }

                });


            updateCombinedOtp();


            const focusIndex =
                Math.min(
                    pastedText.length,
                    otpDigits.length - 1
                );

            if (otpDigits[focusIndex]) {

                otpDigits[focusIndex].focus();

            }

        }
    );

});


// ========================================
// VERIFY OTP
// ========================================

if (verifyOtpButton) {

    verifyOtpButton.addEventListener(
        "click",
        async function () {


            // ========================================
            // COMBINE OTP
            // ========================================

            const otp =
                updateCombinedOtp();


            // ========================================
            // CLEAR PREVIOUS STATUS
            // ========================================

            if (otpStatusMessage) {

                otpStatusMessage.textContent = "";

            }


            // ========================================
            // VALIDATE OTP
            // ========================================

            if (!/^\d{6}$/.test(otp)) {

                if (otpStatusMessage) {

                    otpStatusMessage.textContent =
                        "Please enter the complete 6-digit verification code.";

                }

                return;

            }


            // ========================================
            // CHECK STUDENT ID
            // ========================================

            if (!currentStudentId) {

                if (otpStatusMessage) {

                    otpStatusMessage.textContent =
                        "Your verification session has expired. Please restart registration.";

                }

                return;

            }


            // ========================================
            // DISABLE VERIFY BUTTON
            // ========================================

            verifyOtpButton.disabled = true;

            verifyOtpButton.innerHTML = `
                <span class="otp-button-icon">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </span>

                <span class="otp-button-text">
                    Verifying...
                </span>

                <span class="otp-button-arrow">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                </span>
            `;


            try {


                // ========================================
                // SEND OTP TO BACKEND
                // ========================================

                const response =
                    await fetch(
                        API_URL + "/api/students/verify-otp",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                studentId:
                                    currentStudentId,

                                otp:
                                    otp

                            })

                        }
                    );


                // ========================================
                // READ RESPONSE
                // ========================================

                const data =
                    await response.json();


                // ========================================
                // INVALID OTP
                // ========================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    if (otpStatusMessage) {

                        otpStatusMessage.textContent =
                            data.message ||
                            "Invalid or expired verification code.";

                    }


                    verifyOtpButton.disabled =
                        false;


                    verifyOtpButton.innerHTML = `
                        <span class="otp-button-icon">
                            <i class="fa-solid fa-shield-halved"></i>
                        </span>

                        <span class="otp-button-text">
                            Verify Account
                        </span>

                        <span class="otp-button-arrow">
                            <i class="fa-solid fa-arrow-right"></i>
                        </span>
                    `;


                    return;

                }


                // ========================================
                // SUCCESS
                // ========================================

                console.log(
                    "Student email verified successfully:",
                    data.student
                );


                if (otpStatusMessage) {

                    otpStatusMessage.textContent =
                        "Email verified successfully!";

                }


                // ========================================
                // HIDE OTP SCREEN
                // ========================================

                if (otpScreen) {

                    otpScreen.style.display =
                        "none";

                }

                stopOtpTimers();


                // ========================================
                // UPDATE MODAL TITLE
                // ========================================

                const accountModalTitle =
                    document.getElementById(
                        "accountModalTitle"
                    );

                if (accountModalTitle) {

                    accountModalTitle.textContent =
                        "Account Created Successfully! 🎉";

                }


                // ========================================
                // HIDE MODAL SUBTITLE
                // ========================================

                const accountModalSubtitle =
                    document.getElementById(
                        "accountModalSubtitle"
                    );

                if (accountModalSubtitle) {

                    accountModalSubtitle.style.display =
                        "none";

                }


                // ========================================
                // SHOW SUCCESS SCREEN
                // ========================================

                const successScreen =
                    document.getElementById(
                        "accountCreatedSuccessScreen"
                    );

                if (successScreen) {

                    successScreen.style.display =
                        "block";

                }


                // ========================================
                // RESET OTP
                // ========================================

                otpDigits.forEach(
                    function (input) {

                        input.value = "";

                    }
                );


                if (otpInput) {

                    otpInput.value = "";

                }


            } catch (error) {

                console.error(
                    "OTP verification error:",
                    error
                );


                if (otpStatusMessage) {

                    otpStatusMessage.textContent =
                        "Unable to connect to Kurios Stores server. Please try again.";

                }


                verifyOtpButton.disabled =
                    false;


                verifyOtpButton.innerHTML = `
                    <span class="otp-button-icon">
                        <i class="fa-solid fa-shield-halved"></i>
                    </span>

                    <span class="otp-button-text">
                        Verify Account
                    </span>

                    <span class="otp-button-arrow">
                        <i class="fa-solid fa-arrow-right"></i>
                    </span>
                `;

            }

        }
    );

}


// ========================================
// RESEND OTP
// ========================================

if (resendOtpButton) {

    resendOtpButton.addEventListener(
        "click",
        async function () {


            // ========================================
            // CHECK SESSION
            // ========================================

            if (
                !currentStudentId ||
                !currentStudentEmail
            ) {

                if (otpStatusMessage) {

                    otpStatusMessage.textContent =
                        "Unable to resend OTP. Please restart registration.";

                }

                return;

            }


            // ========================================
            // DISABLE RESEND BUTTON
            // ========================================

            resendOtpButton.disabled =
                true;

            resendOtpButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span>Sending...</span>
            `;


            try {


                // ========================================
                // SEND RESEND REQUEST
                // ========================================

                const response =
                    await fetch(
                        API_URL + "/api/students/resend-otp",
                        {

                            method: "POST",

                            headers: {

                                "Content-Type":
                                    "application/json"

                            },

                            body: JSON.stringify({

                                studentId:
                                    currentStudentId,

                                email:
                                    currentStudentEmail

                            })

                        }
                    );


                // ========================================
                // READ RESPONSE
                // ========================================

                const data =
                    await response.json();


                // ========================================
                // HANDLE ERROR
                // ========================================

                if (
                    !response.ok ||
                    !data.success
                ) {

                    if (otpStatusMessage) {

                        otpStatusMessage.textContent =
                            data.message ||
                            "Unable to resend verification code.";

                    }

                    return;

                }


                // ========================================
                // RESEND SUCCESS
                // ========================================

                if (otpStatusMessage) {

                    otpStatusMessage.textContent =
                        "A new verification code has been sent to your email.";

                }


                // ========================================
                // RESTART COUNTDOWNS
                // ========================================

                startOtpExpiryCountdown();

                startOtpResendCooldown();


                // ========================================
                // CLEAR OTP BOXES
                // ========================================

                otpDigits.forEach(
                    function (input) {

                        input.value = "";

                    }
                );


                if (otpInput) {

                    otpInput.value = "";

                }


                // ========================================
                // FOCUS FIRST BOX
                // ========================================

                if (otpDigits.length > 0) {

                    otpDigits[0].focus();

                }


            } catch (error) {

                console.error(
                    "Resend OTP error:",
                    error
                );


                if (otpStatusMessage) {

                    otpStatusMessage.textContent =
                        "Unable to connect to Kurios Stores server.";

                }

            } finally {


                // ========================================
                // RESTORE RESEND BUTTON
                // ========================================

                resendOtpButton.disabled =
                    false;

                resendOtpButton.innerHTML = `
                    <i class="fa-solid fa-rotate"></i>

                    <span>
                        Resend OTP
                    </span>
                `;

            }

        }
    );

}


// ========================================
// SUCCESS SCREEN → LOGIN
// ========================================

const successLoginLink =
    document.getElementById(
        "successLoginLink"
    );

if (successLoginLink) {

    successLoginLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();


            // ========================================
            // HIDE SUCCESS SCREEN
            // ========================================

            const successScreen =
                document.getElementById(
                    "accountCreatedSuccessScreen"
                );

            if (successScreen) {

                successScreen.style.display =
                    "none";

            }


            // ========================================
            // SHOW SIGN IN FORM
            // ========================================

            const signinForm =
                document.getElementById(
                    "signinForm"
                );

            if (signinForm) {

                signinForm.style.display =
                    "block";

            }


            // ========================================
            // UPDATE MODAL TITLE
            // ========================================

            const accountModalTitle =
                document.getElementById(
                    "accountModalTitle"
                );

            if (accountModalTitle) {

                accountModalTitle.textContent =
                    "Welcome Back";

            }


            // ========================================
            // SHOW SIGN IN SUBTITLE
            // ========================================

            const accountModalSubtitle =
                document.getElementById(
                    "accountModalSubtitle"
                );

            if (accountModalSubtitle) {

                accountModalSubtitle.style.display =
                    "block";

                accountModalSubtitle.textContent =
                    "Sign in to your Kurios Stores account.";

            }

        }
    );

}

// =========================================================
// PASSCODE ENTRY (SIGNUP, SIGNIN, RESET) + RESET FLOW
// =========================================================

// ========================================
// GENERIC DIGIT-BOX GROUP WIRING
// (auto-advance, backspace, arrows, paste)
// ========================================

function wireDigitGroup(digitInputs, hiddenInput, onChange) {

    const inputs = Array.prototype.slice.call(digitInputs);

    function updateCombined() {

        let combined = "";

        inputs.forEach(function (input) {
            combined += input.value;
        });

        if (hiddenInput) {
            hiddenInput.value = combined;
        }

        if (typeof onChange === "function") {
            onChange(combined);
        }

        return combined;

    }

    inputs.forEach(function (input, index) {

        input.addEventListener(
            "input",
            function () {

                this.value =
                    this.value.replace(/\D/g, "");

                if (this.value.length > 1) {
                    this.value = this.value.slice(-1);
                }

                updateCombined();

                if (
                    this.value &&
                    index < inputs.length - 1
                ) {
                    inputs[index + 1].focus();
                }

            }
        );

        input.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Backspace" &&
                    !this.value &&
                    index > 0
                ) {
                    inputs[index - 1].focus();
                }

                if (
                    event.key === "ArrowLeft" &&
                    index > 0
                ) {
                    inputs[index - 1].focus();
                }

                if (
                    event.key === "ArrowRight" &&
                    index < inputs.length - 1
                ) {
                    inputs[index + 1].focus();
                }

            }
        );

        input.addEventListener(
            "paste",
            function (event) {

                event.preventDefault();

                const pastedText =
                    event.clipboardData
                        .getData("text")
                        .replace(/\D/g, "")
                        .slice(0, inputs.length);

                if (!pastedText) {
                    return;
                }

                pastedText
                    .split("")
                    .forEach(function (digit, digitIndex) {

                        if (inputs[digitIndex]) {
                            inputs[digitIndex].value = digit;
                        }

                    });

                updateCombined();

                const focusIndex =
                    Math.min(
                        pastedText.length,
                        inputs.length - 1
                    );

                inputs[focusIndex].focus();

            }
        );

    });

    return {

        updateCombined: updateCombined,

        clear: function () {

            inputs.forEach(function (input) {
                input.value = "";
            });

            if (hiddenInput) {
                hiddenInput.value = "";
            }

        },

        focusFirst: function () {

            if (inputs.length > 0) {
                inputs[0].focus();
            }

        }

    };

}


// ========================================
// SIGNUP PASSCODE + CONFIRM MISMATCH CHECK
// ========================================

const passcodeMismatchMessage =
    document.getElementById("passcodeMismatchMessage");

function checkSignupPasscodeMatch() {

    const a =
        document.getElementById("signupPasscode").value;

    const b =
        document.getElementById("signupConfirmPasscode").value;

    if (!passcodeMismatchMessage) {
        return;
    }

    if (a.length === 6 && b.length === 6 && a !== b) {

        passcodeMismatchMessage.style.display = "block";

    } else {

        passcodeMismatchMessage.style.display = "none";

    }

}

const signupPasscodeGroup =
    wireDigitGroup(
        document.querySelectorAll("#signupPasscodeBoxes .passcode-digit"),
        document.getElementById("signupPasscode"),
        checkSignupPasscodeMatch
    );

const signupConfirmPasscodeGroup =
    wireDigitGroup(
        document.querySelectorAll("#signupConfirmPasscodeBoxes .passcode-digit"),
        document.getElementById("signupConfirmPasscode"),
        checkSignupPasscodeMatch
    );


// ========================================
// SIGNIN PASSCODE
// ========================================

const signinPasscodeGroup =
    wireDigitGroup(
        document.querySelectorAll("#signinPasscodeBoxes .passcode-digit"),
        document.getElementById("signinPasscode")
    );


// ========================================
// RESET FLOW — NEW PASSCODE MISMATCH CHECK
// ========================================

const newPasscodeMismatchMessage =
    document.getElementById("newPasscodeMismatchMessage");

function checkNewPasscodeMatch() {

    const a =
        document.getElementById("newPasscodeInput").value;

    const b =
        document.getElementById("confirmNewPasscodeInput").value;

    if (!newPasscodeMismatchMessage) {
        return;
    }

    if (a.length === 6 && b.length === 6 && a !== b) {

        newPasscodeMismatchMessage.style.display = "block";

    } else {

        newPasscodeMismatchMessage.style.display = "none";

    }

}

const resetOtpGroup =
    wireDigitGroup(
        document.querySelectorAll("#resetOtpBoxes .reset-otp-digit"),
        document.getElementById("resetOtpInput")
    );

const newPasscodeGroup =
    wireDigitGroup(
        document.querySelectorAll("#newPasscodeBoxes .passcode-digit"),
        document.getElementById("newPasscodeInput"),
        checkNewPasscodeMatch
    );

const confirmNewPasscodeGroup =
    wireDigitGroup(
        document.querySelectorAll("#confirmNewPasscodeBoxes .passcode-digit"),
        document.getElementById("confirmNewPasscodeInput"),
        checkNewPasscodeMatch
    );


// ========================================
// RESET PASSCODE — SCREEN ELEMENTS
// ========================================

const resetPasscodeEmailScreen =
    document.getElementById("resetPasscodeEmailScreen");

const resetPasscodeConfirmScreen =
    document.getElementById("resetPasscodeConfirmScreen");

const resetPasscodeEmailStatus =
    document.getElementById("resetPasscodeEmailStatus");

const resetPasscodeConfirmStatus =
    document.getElementById("resetPasscodeConfirmStatus");

const sendPasscodeResetButton =
    document.getElementById("sendPasscodeResetButton");

const confirmPasscodeResetButton =
    document.getElementById("confirmPasscodeResetButton");

const resendResetOtpButton =
    document.getElementById("resendResetOtpButton");

const resetResendCooldown =
    document.getElementById("resetResendCooldown");

const resetResendCooldownTime =
    document.getElementById("resetResendCooldownTime");

const backToSignInFromReset =
    document.getElementById("backToSignInFromReset");

const forgotPasswordLink =
    document.getElementById("forgotPassword");

let currentResetStudentId = null;
let currentResetEmail = null;
let resetResendInterval = null;


function startResetResendCooldown() {

    clearInterval(resetResendInterval);

    let secondsLeft = 30;

    if (resendResetOtpButton) {
        resendResetOtpButton.style.display = "none";
    }

    if (resetResendCooldown) {
        resetResendCooldown.style.display = "inline";
    }

    function render() {

        if (resetResendCooldownTime) {
            resetResendCooldownTime.textContent = secondsLeft;
        }

    }

    render();

    resetResendInterval = setInterval(
        function () {

            secondsLeft = secondsLeft - 1;

            if (secondsLeft <= 0) {

                clearInterval(resetResendInterval);

                if (resendResetOtpButton) {
                    resendResetOtpButton.style.display = "inline";
                }

                if (resetResendCooldown) {
                    resetResendCooldown.style.display = "none";
                }

                return;

            }

            render();

        },
        1000
    );

}


// ========================================
// SIGN IN — EMAIL / PHONE TABS
// ========================================

const signinTabEmail =
    document.getElementById("signinTabEmail");

const signinTabPhone =
    document.getElementById("signinTabPhone");

const signinEmailPanel =
    document.getElementById("signinEmailPanel");

const signinPhonePanel =
    document.getElementById("signinPhonePanel");

const signinTabsIndicator =
    document.getElementById("signinTabsIndicator");

let signinActiveTab = "email";

function setSigninTab(tab) {

    signinActiveTab = tab;

    const isEmail = tab === "email";

    if (signinTabEmail) {
        signinTabEmail.classList.toggle("active", isEmail);
    }

    if (signinTabPhone) {
        signinTabPhone.classList.toggle("active", !isEmail);
    }

    if (signinEmailPanel) {
        signinEmailPanel.style.display = isEmail ? "block" : "none";
    }

    if (signinPhonePanel) {
        signinPhonePanel.style.display = isEmail ? "none" : "block";
    }

    if (signinTabsIndicator) {
        signinTabsIndicator.classList.toggle("tab-phone", !isEmail);
    }

    const identifierStatus =
        document.getElementById("signinIdentifierStatus");

    if (identifierStatus) {
        identifierStatus.textContent = "";
    }

}

if (signinTabEmail) {

    signinTabEmail.addEventListener(
        "click",
        function () {
            setSigninTab("email");
        }
    );

}

if (signinTabPhone) {

    signinTabPhone.addEventListener(
        "click",
        function () {
            setSigninTab("phone");
        }
    );

}


// ========================================
// SIGN IN — EMAIL/PHONE STEP "NEXT" BUTTON
// ========================================

const signinNextButton =
    document.getElementById("signinNextButton");

if (signinNextButton) {

    signinNextButton.addEventListener(
        "click",
        function () {

            const identifierStatus =
                document.getElementById("signinIdentifierStatus");

            let identifier = "";
            let displayValue = "";

            if (signinActiveTab === "email") {

                const emailField =
                    document.getElementById("signinEmail");

                identifier =
                    emailField ? emailField.value.trim() : "";

                displayValue = identifier;

                if (!identifier) {

                    if (identifierStatus) {
                        identifierStatus.textContent =
                            "Please enter your email address.";
                    }

                    if (emailField) {
                        emailField.focus();
                    }

                    return;

                }

            } else {

                const phoneField =
                    document.getElementById("signinPhone");

                const rawDigits =
                    phoneField ?
                        phoneField.value.replace(/\D/g, "") :
                        "";

                if (!rawDigits) {

                    if (identifierStatus) {
                        identifierStatus.textContent =
                            "Please enter your phone number.";
                    }

                    if (phoneField) {
                        phoneField.focus();
                    }

                    return;

                }

                // Strip a leading 0 (local format) before
                // attaching the country code.

                const localDigits =
                    rawDigits.replace(/^0+/, "");

                identifier =
                    "+234" + localDigits;

                displayValue =
                    "+234 " + localDigits;

            }

            const identifierValueField =
                document.getElementById("signinIdentifierValue");

            if (identifierValueField) {
                identifierValueField.value = identifier;
            }

            const emailStep =
                document.getElementById("signinEmailStep");

            const passcodeStep =
                document.getElementById("signinPasscodeStep");

            const adminPasswordStep =
                document.getElementById("signinAdminPasswordStep");


            // ========================================
            // NOT AN EMAIL/PHONE SHAPE — TREAT AS AN
            // ADMIN USERNAME INSTEAD
            // ========================================

            if (
                signinActiveTab === "email" &&
                !identifier.includes("@")
            ) {

                const adminUsernameChip =
                    document.getElementById("signinAdminUsernameChip");

                if (adminUsernameChip) {
                    adminUsernameChip.textContent = identifier;
                }

                if (emailStep) {
                    emailStep.style.display = "none";
                }

                if (passcodeStep) {
                    passcodeStep.style.display = "none";
                }

                if (adminPasswordStep) {
                    adminPasswordStep.style.display = "block";
                }

                const adminPasswordField =
                    document.getElementById("signinAdminPassword");

                if (adminPasswordField) {

                    adminPasswordField.value = "";
                    adminPasswordField.focus();

                }

                return;

            }

            const emailChip =
                document.getElementById("signinEmailChip");

            if (emailChip) {
                emailChip.textContent = displayValue;
            }

            if (emailStep) {
                emailStep.style.display = "none";
            }

            if (passcodeStep) {
                passcodeStep.style.display = "block";
            }

            signinPasscodeGroup.clear();
            signinPasscodeGroup.focusFirst();

        }
    );

}


// ========================================
// SIGN IN — "USE A DIFFERENT EMAIL"
// ========================================

const signinChangeEmail =
    document.getElementById("signinChangeEmail");

if (signinChangeEmail) {

    signinChangeEmail.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            const emailStep =
                document.getElementById("signinEmailStep");

            const passcodeStep =
                document.getElementById("signinPasscodeStep");

            if (passcodeStep) {
                passcodeStep.style.display = "none";
            }

            if (emailStep) {
                emailStep.style.display = "block";
            }

            signinPasscodeGroup.clear();

        }
    );

}


// ========================================
// ADMIN PASSWORD STEP — "USE A DIFFERENT EMAIL"
// ========================================

const signinAdminChangeEmail =
    document.getElementById("signinAdminChangeEmail");

if (signinAdminChangeEmail) {

    signinAdminChangeEmail.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            const emailStep =
                document.getElementById("signinEmailStep");

            const adminPasswordStep =
                document.getElementById("signinAdminPasswordStep");

            const adminStatus =
                document.getElementById("signinAdminStatus");

            if (adminPasswordStep) {
                adminPasswordStep.style.display = "none";
            }

            if (adminStatus) {
                adminStatus.textContent = "";
            }

            if (emailStep) {
                emailStep.style.display = "block";
            }

        }
    );

}


// ========================================
// ADMIN SIGN IN SUBMIT
// ========================================

const signinAdminSubmit =
    document.getElementById("signinAdminSubmit");

if (signinAdminSubmit) {

    signinAdminSubmit.addEventListener(
        "click",
        async function () {

            const usernameChip =
                document.getElementById("signinAdminUsernameChip");

            const username =
                usernameChip ? usernameChip.textContent.trim() : "";

            const passwordField =
                document.getElementById("signinAdminPassword");

            const password =
                passwordField ? passwordField.value : "";

            const adminStatus =
                document.getElementById("signinAdminStatus");

            if (!username || !password) {

                if (adminStatus) {

                    adminStatus.textContent =
                        "Please enter the admin password.";

                }

                return;

            }

            signinAdminSubmit.disabled = true;
            signinAdminSubmit.textContent = "Signing in...";

            if (adminStatus) {
                adminStatus.textContent = "";
            }

            try {

                const response =
                    await fetch(
                        API_URL + "/api/admin/login",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                username: username,
                                password: password
                            })
                        }
                    );

                const data = await response.json();

                if (!data.success) {

                    if (adminStatus) {

                        adminStatus.textContent =
                            data.message ||
                            "Invalid username or password.";

                    }

                    return;

                }

                // Store the admin session and hand off to
                // the admin dashboard — same origin, so the
                // token carries over via sessionStorage.

                sessionStorage.setItem(
                    "kuriosAdminToken",
                    data.token
                );

                window.location.href =
                    "/admin-sellers.html";

            } catch (error) {

                console.error(
                    "Admin login error:",
                    error
                );

                if (adminStatus) {

                    adminStatus.textContent =
                        "Unable to connect to Kurios Stores server.";

                }

            } finally {

                signinAdminSubmit.disabled = false;
                signinAdminSubmit.textContent = "Sign In as Admin";

            }

        }
    );

}


// ========================================
// OPEN RESET FLOW FROM SIGN IN
// ========================================

if (forgotPasswordLink) {

    forgotPasswordLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            const signinForm =
                document.getElementById("signinForm");

            if (signinForm) {
                signinForm.style.display = "none";
            }

            if (resetPasscodeConfirmScreen) {
                resetPasscodeConfirmScreen.style.display = "none";
            }

            if (resetPasscodeEmailScreen) {
                resetPasscodeEmailScreen.style.display = "block";
            }

            if (resetPasscodeEmailStatus) {
                resetPasscodeEmailStatus.textContent = "";
            }

        }
    );

}


// ========================================
// BACK TO SIGN IN FROM RESET
// ========================================

if (backToSignInFromReset) {

    backToSignInFromReset.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            clearInterval(resetResendInterval);

            const signinForm =
                document.getElementById("signinForm");

            if (resetPasscodeEmailScreen) {
                resetPasscodeEmailScreen.style.display = "none";
            }

            if (resetPasscodeConfirmScreen) {
                resetPasscodeConfirmScreen.style.display = "none";
            }

            if (signinForm) {
                signinForm.style.display = "block";
            }

        }
    );

}


// ========================================
// SEND PASSCODE RESET CODE
// ========================================

if (sendPasscodeResetButton) {

    sendPasscodeResetButton.addEventListener(
        "click",
        async function () {

            const email =
                document.getElementById("resetPasscodeEmail").value.trim();

            if (!email) {

                if (resetPasscodeEmailStatus) {

                    resetPasscodeEmailStatus.textContent =
                        "Please enter your email address.";

                }

                return;

            }

            sendPasscodeResetButton.disabled = true;

            sendPasscodeResetButton.innerHTML =
                `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

            try {

                const response =
                    await fetch(
                        API_URL + "/api/students/request-passcode-reset",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ email: email })
                        }
                    );

                const data = await response.json();

                if (!response.ok || !data.success) {

                    if (resetPasscodeEmailStatus) {

                        resetPasscodeEmailStatus.textContent =
                            data.message ||
                            "Unable to send a reset code.";

                    }

                    return;

                }

                currentResetStudentId = data.studentId;
                currentResetEmail = data.email;

                const resetPasscodeConfirmMessage =
                    document.getElementById("resetPasscodeConfirmMessage");

                if (resetPasscodeConfirmMessage) {

                    resetPasscodeConfirmMessage.innerHTML =
                        `Enter the code sent to
                        <span class="otp-email-chip">${data.email}</span>,
                        then choose a new 6-digit passcode.`;

                }

                resetOtpGroup.clear();
                newPasscodeGroup.clear();
                confirmNewPasscodeGroup.clear();

                if (newPasscodeMismatchMessage) {
                    newPasscodeMismatchMessage.style.display = "none";
                }

                if (resetPasscodeConfirmStatus) {
                    resetPasscodeConfirmStatus.textContent = "";
                }

                if (resetPasscodeEmailScreen) {
                    resetPasscodeEmailScreen.style.display = "none";
                }

                if (resetPasscodeConfirmScreen) {
                    resetPasscodeConfirmScreen.style.display = "block";
                }

                resetOtpGroup.focusFirst();

                startResetResendCooldown();

            } catch (error) {

                console.error(
                    "Passcode reset request error:",
                    error.message
                );

                if (resetPasscodeEmailStatus) {

                    resetPasscodeEmailStatus.textContent =
                        "Unable to connect to Kurios Stores server.";

                }

            } finally {

                sendPasscodeResetButton.disabled = false;
                sendPasscodeResetButton.textContent = "Send Reset Code";

            }

        }
    );

}


// ========================================
// RESEND RESET OTP
// ========================================

if (resendResetOtpButton) {

    resendResetOtpButton.addEventListener(
        "click",
        async function () {

            if (!currentResetEmail) {
                return;
            }

            resendResetOtpButton.disabled = true;

            try {

                const response =
                    await fetch(
                        API_URL + "/api/students/request-passcode-reset",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ email: currentResetEmail })
                        }
                    );

                const data = await response.json();

                if (resetPasscodeConfirmStatus) {

                    resetPasscodeConfirmStatus.textContent =
                        data.success ?
                            "A new code has been sent to your email." :
                            (data.message || "Unable to resend code.");

                }

                if (data.success) {
                    startResetResendCooldown();
                }

            } catch (error) {

                console.error(
                    "Resend reset OTP error:",
                    error.message
                );

                if (resetPasscodeConfirmStatus) {

                    resetPasscodeConfirmStatus.textContent =
                        "Unable to connect to Kurios Stores server.";

                }

            } finally {

                resendResetOtpButton.disabled = false;

            }

        }
    );

}


// ========================================
// CONFIRM PASSCODE RESET
// ========================================

if (confirmPasscodeResetButton) {

    confirmPasscodeResetButton.addEventListener(
        "click",
        async function () {

            const otp =
                document.getElementById("resetOtpInput").value;

            const newPasscode =
                document.getElementById("newPasscodeInput").value;

            const confirmNewPasscode =
                document.getElementById("confirmNewPasscodeInput").value;

            if (
                otp.length !== 6 ||
                newPasscode.length !== 6 ||
                confirmNewPasscode.length !== 6
            ) {

                if (resetPasscodeConfirmStatus) {

                    resetPasscodeConfirmStatus.textContent =
                        "Please fill in the code and your new passcode.";

                }

                return;

            }

            if (newPasscode !== confirmNewPasscode) {

                if (newPasscodeMismatchMessage) {
                    newPasscodeMismatchMessage.style.display = "block";
                }

                return;

            }

            confirmPasscodeResetButton.disabled = true;

            confirmPasscodeResetButton.innerHTML =
                `<span class="otp-button-text">Setting passcode...</span>`;

            try {

                const response =
                    await fetch(
                        API_URL + "/api/students/reset-passcode",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                studentId: currentResetStudentId,
                                otp: otp,
                                newPasscode: newPasscode,
                                confirmNewPasscode: confirmNewPasscode
                            })
                        }
                    );

                const data = await response.json();

                if (!response.ok || !data.success) {

                    if (resetPasscodeConfirmStatus) {

                        resetPasscodeConfirmStatus.textContent =
                            data.message ||
                            "Unable to reset your passcode.";

                    }

                    return;

                }

                clearInterval(resetResendInterval);

                if (resetPasscodeConfirmScreen) {
                    resetPasscodeConfirmScreen.style.display = "none";
                }

                const signinForm =
                    document.getElementById("signinForm");

                if (signinForm) {

                    signinForm.style.display = "block";

                    const signinEmailField =
                        document.getElementById("signinEmail");

                    if (signinEmailField && currentResetEmail) {
                        signinEmailField.value = currentResetEmail;
                    }

                    signinPasscodeGroup.clear();

                }

                let resetToast =
                    document.getElementById("kuriosToast");

                if (!resetToast) {

                    resetToast =
                        document.createElement("div");

                    resetToast.id = "kuriosToast";
                    resetToast.className = "kurios-toast";

                    document.body.appendChild(resetToast);

                }

                resetToast.textContent =
                    "Your passcode has been reset. Please sign in with your new passcode.";

                resetToast.classList.add("show");

                setTimeout(
                    function () {
                        resetToast.classList.remove("show");
                    },
                    3000
                );

            } catch (error) {

                console.error(
                    "Confirm passcode reset error:",
                    error.message
                );

                if (resetPasscodeConfirmStatus) {

                    resetPasscodeConfirmStatus.textContent =
                        "Unable to connect to Kurios Stores server.";

                }

            } finally {

                confirmPasscodeResetButton.disabled = false;

                confirmPasscodeResetButton.innerHTML =
                    `<span class="otp-button-text">Set new passcode</span>
                     <span class="otp-button-arrow"><i class="fa-solid fa-arrow-right"></i></span>`;

            }

        }
    );

}


// =========================================================
// BECOME A SELLER — APPLICATION FLOW
// =========================================================

const sellerPage =
    document.getElementById("sellerPage");

const mainContent =
    document.getElementById("mainContent");

const sellerBackLink =
    document.getElementById("sellerBackLink");

const closeSeller =
    document.getElementById("closeSeller");

const accountBecomeSeller =
    document.getElementById("accountBecomeSeller");

const sellerLoadingState =
    document.getElementById("sellerLoadingState");

const sellerPendingState =
    document.getElementById("sellerPendingState");

const sellerApprovedState =
    document.getElementById("sellerApprovedState");

const sellerSuspendedState =
    document.getElementById("sellerSuspendedState");

const sellerApplyForm =
    document.getElementById("sellerApplyForm");

const sellerApplyStatus =
    document.getElementById("sellerApplyStatus");

const sellerApplySubmit =
    document.getElementById("sellerApplySubmit");


function hideAllSellerStates() {

    [
        sellerLoadingState,
        sellerPendingState,
        sellerApprovedState,
        sellerSuspendedState,
        sellerApplyForm
    ].forEach(function (el) {

        if (el) {
            el.style.display = "none";
        }

    });

    const sellerPageEl =
        document.getElementById("sellerPage");

    if (sellerPageEl) {
        sellerPageEl.classList.remove("seller-dashboard-active");
    }

}


function closeSellerPanel() {

    if (typeof window.goBack === "function") {

        window.goBack();
        return;

    }

    if (window.location.hash === "#sell") {

        history.pushState(
            null,
            "",
            window.location.pathname + window.location.search
        );

    }

    if (sellerPage) {
        sellerPage.style.display = "none";
    }

    if (mainContent) {
        mainContent.style.display = "block";
    }

}


function getStoredStudent() {

    const storedStudent =
        localStorage.getItem("kuriosLoggedInStudent") ||
        sessionStorage.getItem("kuriosLoggedInStudent");

    if (!storedStudent) {
        return null;
    }

    try {
        return JSON.parse(storedStudent);
    } catch (error) {
        return null;
    }

}

function openSignInModalStandalone() {

    const signInModalEl =
        document.getElementById("signInModal");

    if (signInModalEl) {
        signInModalEl.classList.add("open");
    }

    const emailStepEl =
        document.getElementById("signinEmailStep");

    const passcodeStepEl =
        document.getElementById("signinPasscodeStep");

    const adminPasswordStepEl =
        document.getElementById("signinAdminPasswordStep");

    if (emailStepEl) {
        emailStepEl.style.display = "block";
    }

    if (passcodeStepEl) {
        passcodeStepEl.style.display = "none";
    }

    if (adminPasswordStepEl) {
        adminPasswordStepEl.style.display = "none";
    }

}


async function openSellerPanel() {

    if (typeof setAccountMenuContext === "function") {
        setAccountMenuContext(false);
    }

    const student =
        getStoredStudent();

    const accountMenu =
        document.getElementById("studentAccountMenu");

    if (accountMenu) {
        accountMenu.classList.remove("open");
    }

    if (!student) {

        // Not logged in — don't show the seller page,
        // just prompt sign-in and clear the #sell hash
        // so the URL doesn't claim to be on that page.

        if (window.location.hash === "#sell") {
            history.replaceState(null, "", window.location.pathname + window.location.search);
        }

        openSignInModalStandalone();

        return;

    }

    if (sellerPage) {
        sellerPage.style.display = "block";
    }

    if (mainContent) {
        mainContent.style.display = "none";
    }

    window.scrollTo({ top: 0 });


    // ========================================
    // RESUME AN OPAY PAYMENT IF WE'RE RETURNING
    // FROM THE OPAY CHECKOUT PAGE
    // ========================================

    const pendingOpayRef =
        localStorage.getItem("kuriosPendingOpaySellerRef");

    if (pendingOpayRef) {

        localStorage.removeItem("kuriosPendingOpaySellerRef");

        await verifySellerApplicationPayment(pendingOpayRef);

        return;

    }

    hideAllSellerStates();

    if (sellerLoadingState) {
        sellerLoadingState.style.display = "block";
    }

    // Prefill contact fields from the student's
    // own profile, in case they end up on the form.

    const phoneField =
        document.getElementById("sellerContactPhone");

    const whatsappField =
        document.getElementById("sellerContactWhatsapp");

    if (phoneField) {
        phoneField.value = student.phone || "";
    }

    if (whatsappField) {

        whatsappField.value =
            student.whatsapp_number ||
            student.whatsappNumber ||
            "";

    }

    try {

        const response =
            await fetch(
                API_URL + "/api/sellers/me?studentId=" + student.id
            );

        const data = await response.json();

        hideAllSellerStates();

        if (!data.success) {

            if (sellerApplyStatus) {

                sellerApplyStatus.textContent =
                    data.message || "Could not check your seller status.";

            }

            if (sellerApplyForm) {
                sellerApplyForm.style.display = "block";
            }

            return;

        }

        const seller = data.seller;

        if (!seller || seller.status === "rejected") {

            const rejectedNote =
                document.getElementById("sellerRejectedNote");

            const reasonWrap =
                document.getElementById("sellerRejectionReasonWrap");

            const reasonText =
                document.getElementById("sellerRejectionReason");

            if (seller && seller.status === "rejected") {

                if (rejectedNote) {
                    rejectedNote.style.display = "block";
                }

                if (seller.rejection_reason && reasonWrap && reasonText) {

                    reasonText.textContent =
                        seller.rejection_reason;

                    reasonWrap.style.display = "inline";

                } else if (reasonWrap) {

                    reasonWrap.style.display = "none";

                }

            } else if (rejectedNote) {

                rejectedNote.style.display = "none";

            }

            if (sellerApplyForm) {
                sellerApplyForm.style.display = "block";
            }

            return;

        }

        if (seller.status === "pending") {

            const nameEl =
                document.getElementById("sellerPendingStoreName");

            if (nameEl) {
                nameEl.textContent = seller.store_name;
            }

            if (sellerPendingState) {
                sellerPendingState.style.display = "block";
            }

            return;

        }

        if (seller.status === "approved") {

            const nameEl =
                document.getElementById("sellerApprovedStoreName");

            if (nameEl) {
                nameEl.textContent = seller.store_name;
            }

            if (sellerApprovedState) {
                sellerApprovedState.style.display = "block";
            }

            window.__kuriosCurrentSeller = seller;

            if (typeof setAccountMenuContext === "function") {
                setAccountMenuContext(true);
            }

            const studentDisplayName =
                [student.first_name, student.last_name].filter(Boolean).join(" ").trim() ||
                seller.store_name ||
                "Seller";

            const firstNameOnly =
                studentDisplayName.split(" ")[0] || "Seller";

            const setDashText = function (id, text) {
                const el = document.getElementById(id);
                if (el) el.textContent = text;
            };

            setDashText("sellerDashboardStoreName", seller.store_name || "Your Store");
            setDashText("sellerDashboardWelcomeName", firstNameOnly);
            setDashText("sellerDashboardTopName", firstNameOnly);

            const dashAvatarMarkup =
                seller.store_image ?
                    `<img src="${API_URL + seller.store_image}" alt="Store logo">` :
                    `<i class="fa-solid fa-store"></i>`;

            ["sellerDashboardAvatar", "sellerDashboardTopAvatar"].forEach(function (id) {

                const el = document.getElementById(id);

                if (el) {
                    el.innerHTML = dashAvatarMarkup;
                }

            });

            const logoPreview =
                document.getElementById("storeLogoPreview");

            if (logoPreview) {

                logoPreview.innerHTML =
                    seller.store_image ?
                        `<img src="${API_URL + seller.store_image}" alt="Store logo">` :
                        `<i class="fa-solid fa-store"></i>`;

            }

            if (typeof loadSellerProducts === "function") {
                loadSellerProducts(student.id);
            }

            if (typeof loadSellerSales === "function") {
                loadSellerSales(student.id);
            }

            if (typeof loadSellerDashboardStats === "function") {
                loadSellerDashboardStats(student.id);
            }

            const sellerPageEl =
                document.getElementById("sellerPage");

            if (sellerPageEl) {
                sellerPageEl.classList.add("seller-dashboard-active");
            }

            return;

        }

        if (seller.status === "suspended") {

            const nameEl =
                document.getElementById("sellerSuspendedStoreName");

            if (nameEl) {
                nameEl.textContent = seller.store_name;
            }

            if (sellerSuspendedState) {
                sellerSuspendedState.style.display = "block";
            }

            return;

        }

        // Fallback — unexpected status, show the form.

        if (sellerApplyForm) {
            sellerApplyForm.style.display = "block";
        }

    } catch (error) {

        console.error(
            "Seller status check error:",
            error
        );

        hideAllSellerStates();

        if (sellerApplyStatus) {

            sellerApplyStatus.textContent =
                "Unable to connect to Kurios Stores server.";

        }

        if (sellerApplyForm) {
            sellerApplyForm.style.display = "block";
        }

    }

}


if (accountBecomeSeller) {

    accountBecomeSeller.addEventListener(
        "click",
        function () {

            if (typeof switchDashboardWithReload === "function") {

                if (__kuriosInSellerDashboard) {

                    switchDashboardWithReload(null);

                } else {

                    switchDashboardWithReload("sell");

                }

            } else {

                window.location.hash = "sell";

            }

        }
    );

}

if (closeSeller) {

    closeSeller.addEventListener(
        "click",
        closeSellerPanel
    );

}

if (sellerBackLink) {

    sellerBackLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            closeSellerPanel();

        }
    );

}


// ========================================
// SELLER PAGE — BROWSER BACK/FORWARD
// AND DIRECT-LINK (#sell) SUPPORT
// (handled centrally by the unified router
// inside DOMContentLoaded — see syncPageFromHash)
// ========================================


// ========================================
// SELLER TYPE CARD PICKER
// ========================================

const sellerTypeGrid =
    document.getElementById("sellerTypeGrid");

if (sellerTypeGrid) {

    const sellerTypeCards =
        sellerTypeGrid.querySelectorAll(".seller-type-card");

    const sellerTypeSelect =
        document.getElementById("sellerType");

    sellerTypeCards.forEach(function (card) {

        card.addEventListener(
            "click",
            function () {

                sellerTypeCards.forEach(function (c) {
                    c.classList.remove("active");
                });

                card.classList.add("active");

                if (sellerTypeSelect) {
                    sellerTypeSelect.value = card.dataset.value;
                }

            }
        );

    });

}


// ========================================
// SUBMIT SELLER APPLICATION
// (pay ₦1,500 application fee, then submit)
// ========================================

let currentSellerPaymentReference = null;

if (sellerApplyForm) {

    sellerApplyForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const student =
                getStoredStudent();

            if (!student) {
                return;
            }

            const storeName =
                document.getElementById("sellerStoreName").value.trim();

            if (!storeName) {

                if (sellerApplyStatus) {

                    sellerApplyStatus.textContent =
                        "Please enter your store or business name.";

                }

                return;

            }

            const payload = {

                studentId: student.id,

                sellerType:
                    document.getElementById("sellerType").value,

                storeName: storeName,

                storeDescription:
                    document.getElementById("sellerStoreDescription").value.trim(),

                businessCategory:
                    document.getElementById("sellerBusinessCategory").value,

                location:
                    document.getElementById("sellerLocation").value.trim(),

                contactPhone:
                    document.getElementById("sellerContactPhone").value.trim(),

                contactWhatsapp:
                    document.getElementById("sellerContactWhatsapp").value.trim()

            };

            if (sellerApplySubmit) {

                sellerApplySubmit.disabled = true;
                sellerApplySubmit.textContent = "Starting...";

            }

            try {

                const response =
                    await fetch(
                        API_URL + "/api/sellers/apply",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(payload)
                        }
                    );

                const data = await response.json();

                if (!data.success) {

                    if (sellerApplyStatus) {

                        sellerApplyStatus.textContent =
                            data.message ||
                            "Could not start your application.";

                    }

                    return;

                }

                currentSellerPaymentReference =
                    data.paymentReference;

                sellerApplyForm.style.display = "none";

                const choiceState =
                    document.getElementById("sellerPaymentChoiceState");

                if (choiceState) {
                    choiceState.style.display = "block";
                }

                if (typeof checkAndShowWalletButton === "function") {
                    checkAndShowWalletButton("payWithWalletButton", "payWithWalletBalanceLabel", data.amount);
                }

            } catch (error) {

                console.error(
                    "Seller application submit error:",
                    error
                );

                if (sellerApplyStatus) {

                    sellerApplyStatus.textContent =
                        "Unable to connect to Kurios Stores server.";

                }

            } finally {

                if (sellerApplySubmit) {

                    sellerApplySubmit.disabled = false;
                    sellerApplySubmit.textContent = "Continue to Payment";

                }

            }

        }
    );

}


// ========================================
// PAY WITH MONNIFY
// ========================================

const payWithMonnifyButton =
    document.getElementById("payWithMonnifyButton");

if (payWithMonnifyButton) {

    payWithMonnifyButton.addEventListener(
        "click",
        async function () {

            const choiceStatus =
                document.getElementById("sellerPaymentChoiceStatus");

            if (!currentSellerPaymentReference) {
                return;
            }

            payWithMonnifyButton.disabled = true;

            if (choiceStatus) {
                choiceStatus.textContent = "";
            }

            try {

                const response =
                    await fetch(
                        API_URL + "/api/sellers/apply/pay/monnify",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                paymentReference: currentSellerPaymentReference
                            })
                        }
                    );

                const data = await response.json();

                if (!data.success) {

                    if (choiceStatus) {

                        choiceStatus.textContent =
                            data.message || "Could not start Monnify checkout.";

                    }

                    return;

                }

                if (typeof MonnifySDK === "undefined") {

                    if (choiceStatus) {

                        choiceStatus.textContent =
                            "Payment could not load. Please refresh and try again.";

                    }

                    return;

                }

                MonnifySDK.initialize({

                    amount: data.amount,

                    currency: "NGN",

                    reference: data.paymentReference,

                    customerFullName: data.customerName,

                    customerEmail: data.customerEmail,

                    apiKey: data.apiKey,

                    contractCode: data.contractCode,

                    paymentDescription:
                        "Kurios Stores seller application fee",

                    onComplete: async function () {

                        await verifySellerApplicationPayment(
                            data.paymentReference
                        );

                    },

                    onClose: function () {

                        if (choiceStatus) {

                            choiceStatus.textContent =
                                "Payment was not completed. You can try again.";

                        }

                    }

                });

            } catch (error) {

                console.error(
                    "Monnify checkout error:",
                    error
                );

                if (choiceStatus) {

                    choiceStatus.textContent =
                        "Unable to connect to Kurios Stores server.";

                }

            } finally {

                payWithMonnifyButton.disabled = false;

            }

        }
    );

}


// ========================================
// PAY WITH OPAY
// ========================================

const payWithOpayButton =
    document.getElementById("payWithOpayButton");

if (payWithOpayButton) {

    payWithOpayButton.addEventListener(
        "click",
        async function () {

            const choiceStatus =
                document.getElementById("sellerPaymentChoiceStatus");

            if (!currentSellerPaymentReference) {
                return;
            }

            payWithOpayButton.disabled = true;

            if (choiceStatus) {
                choiceStatus.textContent = "Redirecting to OPay...";
            }

            try {

                const returnUrl =
                    window.location.origin + "/#sell";

                const response =
                    await fetch(
                        API_URL + "/api/sellers/apply/pay/opay",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                paymentReference: currentSellerPaymentReference,
                                returnUrl: returnUrl
                            })
                        }
                    );

                const data = await response.json();

                if (!data.success || !data.cashierUrl) {

                    if (choiceStatus) {

                        choiceStatus.textContent =
                            data.message || "Could not start OPay checkout.";

                    }

                    payWithOpayButton.disabled = false;

                    return;

                }

                // Remember which application this was, so we
                // can verify it automatically once OPay sends
                // the student back to this page.

                localStorage.setItem(
                    "kuriosPendingOpaySellerRef",
                    currentSellerPaymentReference
                );

                window.location.href = data.cashierUrl;

            } catch (error) {

                console.error(
                    "OPay checkout error:",
                    error
                );

                if (choiceStatus) {

                    choiceStatus.textContent =
                        "Unable to connect to Kurios Stores server.";

                }

                payWithOpayButton.disabled = false;

            }

        }
    );

}


// ========================================
// PAY WITH PAYSTACK
// ========================================

const payWithPaystackButton =
    document.getElementById("payWithPaystackButton");

if (payWithPaystackButton) {

    payWithPaystackButton.addEventListener(
        "click",
        async function () {

            const choiceStatus =
                document.getElementById("sellerPaymentChoiceStatus");

            if (!currentSellerPaymentReference) {
                return;
            }

            payWithPaystackButton.disabled = true;

            if (choiceStatus) {
                choiceStatus.textContent = "Redirecting to Paystack...";
            }

            try {

                const returnUrl =
                    window.location.origin + "/#sell";

                const response =
                    await fetch(
                        API_URL + "/api/sellers/apply/pay/paystack",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                paymentReference: currentSellerPaymentReference,
                                returnUrl: returnUrl
                            })
                        }
                    );

                const data = await response.json();

                if (!data.success || !data.authorizationUrl) {

                    if (choiceStatus) {

                        choiceStatus.textContent =
                            data.message || "Could not start Paystack checkout.";

                    }

                    payWithPaystackButton.disabled = false;

                    return;

                }

                // Reuse the same pending-ref key as OPay — the
                // resume-on-return check is already gateway-agnostic.

                localStorage.setItem(
                    "kuriosPendingOpaySellerRef",
                    currentSellerPaymentReference
                );

                window.location.href = data.authorizationUrl;

            } catch (error) {

                console.error(
                    "Paystack checkout error:",
                    error
                );

                if (choiceStatus) {

                    choiceStatus.textContent =
                        "Unable to connect to Kurios Stores server.";

                }

                payWithPaystackButton.disabled = false;

            }

        }
    );

}


// ========================================
// CONFIRM THE SELLER APPLICATION PAYMENT
// (never trust the widget's onComplete alone)
// ========================================

async function verifySellerApplicationPayment(paymentReference) {

    if (sellerApplyStatus) {

        sellerApplyStatus.textContent =
            "Confirming your payment...";

    }

    try {

        const data =
            await verifyPaymentWithRetry(
                "/api/sellers/apply/verify-payment",
                { paymentReference: paymentReference }
            );

        if (!data.success) {

            if (sellerApplyStatus) {

                sellerApplyStatus.textContent =
                    data.message ||
                    "We couldn't confirm your payment yet. If you completed payment, please try again shortly.";

            }

            return;

        }

        hideAllSellerStates();

        const nameEl =
            document.getElementById("sellerPendingStoreName");

        if (nameEl && data.seller) {
            nameEl.textContent = data.seller.store_name;
        }

        if (sellerPendingState) {
            sellerPendingState.style.display = "block";
        }

    } catch (error) {

        console.error(
            "Seller payment verify error:",
            error
        );

        if (sellerApplyStatus) {

            sellerApplyStatus.textContent =
                "Unable to reach Kurios Stores server to confirm payment.";

        }

    }

}


// =========================================================
// SELLER STOREFRONT (public product listing)
// =========================================================

const storefrontPage =
    document.getElementById("storefrontPage");

const storefrontBackLink =
    document.getElementById("storefrontBackLink");

const STOREFRONT_CATEGORY_ICONS = {
    "Fashion": "fa-shirt",
    "Electronics": "fa-plug",
    "Beauty": "fa-spray-can-sparkles",
    "Food": "fa-utensils",
    "Books": "fa-book",
    "School Materials": "fa-pen",
    "Phones": "fa-mobile-screen",
    "Accessories": "fa-gem",
    "Health": "fa-heart-pulse",
    "Home": "fa-house",
    "Services": "fa-screwdriver-wrench",
    "Others": "fa-box"
};

function closeStorefrontPage() {

    if (typeof window.goBack === "function") {

        window.goBack();
        return;

    }

    if (
        window.location.hash &&
        window.location.hash.indexOf("#store-") === 0
    ) {

        history.pushState(
            null,
            "",
            window.location.pathname + window.location.search
        );

    }

    if (storefrontPage) {
        storefrontPage.style.display = "none";
    }

    const mainEl =
        document.getElementById("mainContent");

    if (mainEl) {
        mainEl.style.display = "block";
    }

}

if (storefrontBackLink) {

    storefrontBackLink.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            closeStorefrontPage();

        }
    );

}

async function openStorefront(sellerId) {

    const mainEl =
        document.getElementById("mainContent");

    const sellerPageEl =
        document.getElementById("sellerPage");

    if (sellerPageEl) {
        sellerPageEl.style.display = "none";
    }

    if (mainEl) {
        mainEl.style.display = "none";
    }

    if (storefrontPage) {
        storefrontPage.style.display = "block";
    }

    window.scrollTo({ top: 0 });

    const loadingEl =
        document.getElementById("storefrontLoading");

    const contentEl =
        document.getElementById("storefrontContent");

    const notFoundEl =
        document.getElementById("storefrontNotFound");

    if (loadingEl) loadingEl.style.display = "block";
    if (contentEl) contentEl.style.display = "none";
    if (notFoundEl) notFoundEl.style.display = "none";

    try {

        const response =
            await fetch(API_URL + "/api/store/" + sellerId);

        const data = await response.json();

        if (loadingEl) loadingEl.style.display = "none";

        if (!data.success) {

            if (notFoundEl) notFoundEl.style.display = "block";

            return;

        }

        if (contentEl) contentEl.style.display = "block";

        const nameEl = document.getElementById("storefrontName");
        const metaEl = document.getElementById("storefrontMeta");
        const descEl = document.getElementById("storefrontDescription");

        if (nameEl) nameEl.textContent = data.store.store_name;

        const iconEl =
            document.querySelector("#storefrontContent .storefront-icon");

        if (iconEl) {

            iconEl.innerHTML =
                data.store.store_image ?
                    `<img src="${API_URL + data.store.store_image}" alt="${data.store.store_name} logo">` :
                    `<i class="fa-solid fa-store"></i>`;

        }

        if (metaEl) {

            metaEl.textContent =
                [
                    data.store.business_category,
                    data.store.location
                ]
                    .filter(Boolean)
                    .join(" · ") || "Kurios Stores seller";

        }

        if (descEl) {

            descEl.textContent =
                data.store.store_description || "";

        }

        renderStorefrontProducts(data.products);

    } catch (error) {

        console.error(
            "Load storefront error:",
            error
        );

        if (loadingEl) loadingEl.style.display = "none";
        if (notFoundEl) notFoundEl.style.display = "block";

    }

}

function renderStorefrontProducts(products) {

    const grid =
        document.getElementById("storefrontProductGrid");

    const emptyEl =
        document.getElementById("storefrontEmpty");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    if (!products || products.length === 0) {

        if (emptyEl) emptyEl.style.display = "block";

        return;

    }

    if (emptyEl) emptyEl.style.display = "none";

    products.forEach(function (product) {

        const category =
            product.category || "General";

        const icon =
            STOREFRONT_CATEGORY_ICONS[category] || "fa-box";

        const imageMarkup =
            product.image_url ?
                `<img src="${API_URL + product.image_url}" alt="${product.name}">` :
                `<i class="fa-solid ${icon}"></i>`;

        const card = document.createElement("article");
        card.className = "product-card";

        const ratingMarkup =
            product.review_count > 0 ?
                `<span class="product-rating">
                    <i class="fa-solid fa-star"></i>
                    ${Number(product.avg_rating).toFixed(1)}
                    <span class="product-rating-count">(${product.review_count})</span>
                </span>` :
                "";

        card.innerHTML = `
            <div class="product-image">
                ${imageMarkup}
            </div>
            <div class="product-info">
                <span class="product-category">${category}</span>
                <h3>${product.name}</h3>
                ${ratingMarkup}
                <p>${product.description ? product.description : "&nbsp;"}</p>
                <div class="product-bottom">
                    <strong>₦${Number(product.price).toLocaleString()}</strong>
                </div>
            </div>
        `;

        grid.appendChild(card);

    });

}


// ========================================
// HASH ROUTING — INCLUDE #store-<id>
// (handled centrally by the unified router
// inside DOMContentLoaded — see syncPageFromHash)
// ========================================


// =========================================================
// SELLER PRODUCT MANAGEMENT (approved sellers only)
// =========================================================

const SELLER_CATEGORY_ICONS = {
    "Fashion": "fa-shirt",
    "Electronics": "fa-plug",
    "Beauty": "fa-spray-can-sparkles",
    "Food": "fa-utensils",
    "Books": "fa-book",
    "School Materials": "fa-pen",
    "Phones": "fa-mobile-screen",
    "Accessories": "fa-gem",
    "Health": "fa-heart-pulse",
    "Home": "fa-house",
    "Services": "fa-screwdriver-wrench",
    "Others": "fa-box"
};

let currentSellerStudentId = null;

async function loadSellerProducts(studentId) {

    currentSellerStudentId = studentId;

    const loadingEl = document.getElementById("sellerProductsLoading");
    const emptyEl = document.getElementById("sellerProductsEmpty");
    const listEl = document.getElementById("sellerProductList");

    if (loadingEl) loadingEl.style.display = "block";
    if (emptyEl) emptyEl.style.display = "none";
    if (listEl) listEl.innerHTML = "";

    try {

        const response =
            await fetch(
                API_URL + "/api/sellers/products?studentId=" + studentId
            );

        const data = await response.json();

        if (loadingEl) loadingEl.style.display = "none";

        if (!data.success) {
            return;
        }

        if (data.products.length === 0) {

            if (emptyEl) emptyEl.style.display = "block";

            return;

        }

        renderSellerProductList(data.products);

    } catch (error) {

        console.error(
            "Load seller products error:",
            error
        );

        if (loadingEl) loadingEl.style.display = "none";

    }

}

function renderSellerProductList(products) {

    const listEl = document.getElementById("sellerProductList");

    if (!listEl) return;

    listEl.innerHTML = "";

    products.forEach(function (product) {

        const category =
            product.category || "General";

        const icon =
            SELLER_CATEGORY_ICONS[category] || "fa-box";

        const thumbMarkup =
            product.image_url ?
                `<img src="${API_URL + product.image_url}" alt="${product.name}">` :
                `<i class="fa-solid ${icon}"></i>`;

        const card = document.createElement("div");
        card.className = "seller-product-card";

        card.innerHTML = `
            <div class="seller-product-thumb">${thumbMarkup}</div>
            <div class="seller-product-info">
                <h4>
                    ${product.name}
                    ${!product.is_active ? '<span class="seller-product-inactive-tag">Hidden</span>' : ""}
                </h4>
                <p>₦${Number(product.price).toLocaleString()} · Stock: ${product.stock_quantity}</p>
            </div>
            <div class="seller-product-actions">
                <button type="button" class="toggle-active-btn" title="${product.is_active ? "Hide" : "Show"}">
                    <i class="fa-solid ${product.is_active ? "fa-eye" : "fa-eye-slash"}"></i>
                </button>
                <button type="button" class="edit-product-btn" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="delete-product-btn" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        card.querySelector(".toggle-active-btn").addEventListener(
            "click",
            function () {
                toggleProductActive(product);
            }
        );

        card.querySelector(".edit-product-btn").addEventListener(
            "click",
            function () {
                openProductForm(product);
            }
        );

        card.querySelector(".delete-product-btn").addEventListener(
            "click",
            function () {
                deleteProduct(product);
            }
        );

        listEl.appendChild(card);

    });

}


// ========================================
// ADD / EDIT PRODUCT FORM
// ========================================

function openProductForm(product) {

    const formWrap = document.getElementById("sellerProductFormWrap");
    const formTitle = document.getElementById("productFormTitle");
    const editingIdField = document.getElementById("editingProductId");
    const nameField = document.getElementById("productName");
    const descField = document.getElementById("productDescription");
    const priceField = document.getElementById("productPrice");
    const stockField = document.getElementById("productStock");
    const categoryField = document.getElementById("productCategory");
    const imageField = document.getElementById("productImageInput");
    const statusEl = document.getElementById("productFormStatus");

    if (statusEl) statusEl.textContent = "";
    if (imageField) imageField.value = "";

    const discountPriceField = document.getElementById("productDiscountPrice");
    const discountStartField = document.getElementById("productDiscountStart");
    const discountEndField = document.getElementById("productDiscountEnd");

    function toDatetimeLocalValue(isoString) {

        if (!isoString) return "";

        const date = new Date(isoString);

        if (isNaN(date.getTime())) return "";

        const pad = function (n) { return String(n).padStart(2, "0"); };

        return date.getFullYear() + "-" + pad(date.getMonth() + 1) + "-" + pad(date.getDate()) +
            "T" + pad(date.getHours()) + ":" + pad(date.getMinutes());

    }

    if (product) {

        if (formTitle) formTitle.textContent = "Edit product";
        if (editingIdField) editingIdField.value = product.id;
        if (nameField) nameField.value = product.name || "";
        if (descField) descField.value = product.description || "";
        if (priceField) priceField.value = product.price || "";
        if (stockField) stockField.value = product.stock_quantity || 0;
        if (categoryField) categoryField.value = product.category || "";
        if (discountPriceField) discountPriceField.value = product.discount_price || "";
        if (discountStartField) discountStartField.value = toDatetimeLocalValue(product.discount_starts_at);
        if (discountEndField) discountEndField.value = toDatetimeLocalValue(product.discount_ends_at);

    } else {

        if (formTitle) formTitle.textContent = "Add a product";
        if (editingIdField) editingIdField.value = "";
        if (nameField) nameField.value = "";
        if (descField) descField.value = "";
        if (priceField) priceField.value = "";
        if (stockField) stockField.value = "";
        if (categoryField) categoryField.value = "";
        if (discountPriceField) discountPriceField.value = "";
        if (discountStartField) discountStartField.value = "";
        if (discountEndField) discountEndField.value = "";

    }

    if (formWrap) formWrap.style.display = "block";

    const listEl = document.getElementById("sellerProductList");
    if (listEl) listEl.style.display = "none";

    const addBtn = document.getElementById("addProductButton");
    if (addBtn) addBtn.style.display = "none";

}

function closeProductForm() {

    const formWrap = document.getElementById("sellerProductFormWrap");
    if (formWrap) formWrap.style.display = "none";

    const listEl = document.getElementById("sellerProductList");
    if (listEl) listEl.style.display = "block";

    const addBtn = document.getElementById("addProductButton");
    if (addBtn) addBtn.style.display = "inline-flex";

}

const addProductButton = document.getElementById("addProductButton");

if (addProductButton) {

    addProductButton.addEventListener(
        "click",
        function () {
            openProductForm(null);
        }
    );

}

const cancelProductForm = document.getElementById("cancelProductForm");

if (cancelProductForm) {

    cancelProductForm.addEventListener(
        "click",
        closeProductForm
    );

}

const saveProductButton = document.getElementById("saveProductButton");

if (saveProductButton) {

    saveProductButton.addEventListener(
        "click",
        async function () {

            const statusEl = document.getElementById("productFormStatus");

            const editingId =
                document.getElementById("editingProductId").value;

            const name =
                document.getElementById("productName").value.trim();

            const price =
                document.getElementById("productPrice").value;

            if (!name || !price) {

                if (statusEl) {
                    statusEl.textContent = "Please enter a product name and price.";
                }

                return;

            }

            const formData = new FormData();

            formData.append("studentId", currentSellerStudentId);
            formData.append("name", name);
            formData.append(
                "description",
                document.getElementById("productDescription").value.trim()
            );
            formData.append("price", price);
            formData.append(
                "category",
                document.getElementById("productCategory").value
            );
            formData.append(
                "stockQuantity",
                document.getElementById("productStock").value || "0"
            );

            const discountPrice =
                document.getElementById("productDiscountPrice").value;

            formData.append("discountPrice", discountPrice || "");

            const discountStart =
                document.getElementById("productDiscountStart").value;

            formData.append(
                "discountStartsAt",
                discountStart ? new Date(discountStart).toISOString() : ""
            );

            const discountEnd =
                document.getElementById("productDiscountEnd").value;

            formData.append(
                "discountEndsAt",
                discountEnd ? new Date(discountEnd).toISOString() : ""
            );

            const imageInput = document.getElementById("productImageInput");

            if (imageInput && imageInput.files[0]) {
                formData.append("image", imageInput.files[0]);
            }

            saveProductButton.disabled = true;
            saveProductButton.textContent = "Saving...";

            try {

                const url =
                    editingId ?
                        API_URL + "/api/sellers/products/" + editingId + "/update" :
                        API_URL + "/api/sellers/products";

                const response = await fetch(url, {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (!data.success) {

                    if (statusEl) {
                        statusEl.textContent = data.message || "Could not save product.";
                    }

                    return;

                }

                closeProductForm();

                loadSellerProducts(currentSellerStudentId);

            } catch (error) {

                console.error(
                    "Save product error:",
                    error
                );

                if (statusEl) {
                    statusEl.textContent = "Unable to connect to Kurios Stores server.";
                }

            } finally {

                saveProductButton.disabled = false;
                saveProductButton.textContent = "Save Product";

            }

        }
    );

}


// ========================================
// TOGGLE ACTIVE / DELETE
// ========================================

async function toggleProductActive(product) {

    const formData = new FormData();

    formData.append("studentId", currentSellerStudentId);
    formData.append("isActive", (!product.is_active).toString());

    try {

        const response = await fetch(
            API_URL + "/api/sellers/products/" + product.id + "/update",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (data.success) {
            loadSellerProducts(currentSellerStudentId);
        }

    } catch (error) {

        console.error(
            "Toggle product active error:",
            error
        );

    }

}

async function deleteProduct(product) {

    if (!confirm("Delete \"" + product.name + "\"? This can't be undone.")) {
        return;
    }

    try {

        const response = await fetch(
            API_URL + "/api/sellers/products/" + product.id + "/delete",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    studentId: currentSellerStudentId
                })
            }
        );

        const data = await response.json();

        if (data.success) {
            loadSellerProducts(currentSellerStudentId);
        }

    } catch (error) {

        console.error(
            "Delete product error:",
            error
        );

    }

}


// =========================================================
// STORE LOGO UPLOAD
// =========================================================

const storeLogoInput =
    document.getElementById("storeLogoInput");

if (storeLogoInput) {

    storeLogoInput.addEventListener(
        "change",
        async function () {

            const file =
                storeLogoInput.files[0];

            if (!file) {
                return;
            }

            const statusEl =
                document.getElementById("storeLogoStatus");

            const previewEl =
                document.getElementById("storeLogoPreview");

            if (statusEl) {
                statusEl.textContent = "Uploading...";
            }

            const formData = new FormData();

            formData.append("studentId", currentSellerStudentId);
            formData.append("logo", file);

            try {

                const response =
                    await fetch(
                        API_URL + "/api/sellers/logo",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                const data = await response.json();

                if (!data.success) {

                    if (statusEl) {

                        statusEl.textContent =
                            data.message || "Could not update your logo.";

                    }

                    return;

                }

                if (statusEl) {
                    statusEl.textContent = "Logo updated.";
                }

                if (previewEl && data.seller && data.seller.store_image) {

                    previewEl.innerHTML =
                        `<img src="${API_URL + data.seller.store_image}" alt="Store logo">`;

                }

            } catch (error) {

                console.error(
                    "Store logo upload error:",
                    error
                );

                if (statusEl) {

                    statusEl.textContent =
                        "Unable to connect to Kurios Stores server.";

                }

            } finally {

                storeLogoInput.value = "";

            }

        }
    );

}


// =========================================================
// CSV PRODUCT IMPORT
// =========================================================

let csvImportFile = null;

function parseCsvHeaderLine(line) {

    // Simple quoted-field-aware split for a
    // single header line (good enough for
    // detecting column names).

    const fields = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {

        const char = line[i];

        if (inQuotes) {

            if (char === '"') {

                if (line[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    inQuotes = false;
                }

            } else {

                field += char;

            }

        } else {

            if (char === '"') {
                inQuotes = true;
            } else if (char === ",") {
                fields.push(field);
                field = "";
            } else {
                field += char;
            }

        }

    }

    fields.push(field);

    return fields.map(function (f) {
        return f.trim();
    });

}

function detectCsvLocations(headers) {

    const locations = new Set();

    headers.forEach(function (header) {

        const match =
            header.match(/^Fixed Sell Price \[(.+)\]$/);

        if (match) {
            locations.add(match[1]);
        }

    });

    return Array.from(locations);

}

const importCsvButton =
    document.getElementById("importCsvButton");

const csvImportPanel =
    document.getElementById("csvImportPanel");

const csvFileInput =
    document.getElementById("csvFileInput");

const csvLocationGroup =
    document.getElementById("csvLocationGroup");

const csvLocationSelect =
    document.getElementById("csvLocationSelect");

const confirmCsvImport =
    document.getElementById("confirmCsvImport");

const cancelCsvImport =
    document.getElementById("cancelCsvImport");


// ========================================
// DOWNLOAD A SAMPLE CSV
// ========================================

const downloadSampleCsv =
    document.getElementById("downloadSampleCsv");

if (downloadSampleCsv) {

    downloadSampleCsv.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            const headers =
                ["Item Name", "Category", "Fixed Sell Price", "Stock", "SKU"];

            const sampleRows = [
                ["Bottled Water 50cl", "Drinks", "300", "50", "KUR-001"],
                ["Instant Noodles", "Food", "450", "30", "KUR-002"],
                ["A4 Notebook", "Stationary", "500", "20", "KUR-003"]
            ];

            function csvEscape(value) {

                if (value.includes(",") || value.includes('"')) {

                    return '"' + value.replace(/"/g, '""') + '"';

                }

                return value;

            }

            const lines = [headers.map(csvEscape).join(",")];

            sampleRows.forEach(function (row) {
                lines.push(row.map(csvEscape).join(","));
            });

            const csvContent = lines.join("\r\n");

            const blob =
                new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

            const url =
                URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = url;
            link.download = "kurios-stores-product-import-sample.csv";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url);

        }
    );

}

if (importCsvButton) {

    importCsvButton.addEventListener(
        "click",
        function () {

            csvImportFile = null;

            if (csvFileInput) csvFileInput.value = "";

            if (csvLocationGroup) csvLocationGroup.style.display = "none";

            if (confirmCsvImport) confirmCsvImport.disabled = true;

            const statusEl = document.getElementById("csvImportStatus");

            if (statusEl) statusEl.textContent = "";

            if (csvImportPanel) csvImportPanel.style.display = "block";

            const listEl = document.getElementById("sellerProductList");
            if (listEl) listEl.style.display = "none";

            if (importCsvButton) importCsvButton.style.display = "none";

            const addBtn = document.getElementById("addProductButton");
            if (addBtn) addBtn.style.display = "none";

        }
    );

}

function closeCsvImportPanel() {

    if (csvImportPanel) csvImportPanel.style.display = "none";

    const listEl = document.getElementById("sellerProductList");
    if (listEl) listEl.style.display = "block";

    if (importCsvButton) importCsvButton.style.display = "inline-flex";

    const addBtn = document.getElementById("addProductButton");
    if (addBtn) addBtn.style.display = "inline-flex";

}

if (cancelCsvImport) {

    cancelCsvImport.addEventListener(
        "click",
        closeCsvImportPanel
    );

}

if (csvFileInput) {

    csvFileInput.addEventListener(
        "change",
        function () {

            const file = csvFileInput.files[0];

            const statusEl = document.getElementById("csvImportStatus");

            if (!file) {
                return;
            }

            csvImportFile = file;

            if (statusEl) statusEl.textContent = "";

            // Read just enough of the file to get
            // the header line, to detect locations.

            const reader = new FileReader();

            reader.onload = function (event) {

                const text = event.target.result;

                const firstLine =
                    text.split(/\r\n|\n|\r/)[0] || "";

                const headers =
                    parseCsvHeaderLine(firstLine);

                const locations =
                    detectCsvLocations(headers);

                if (locations.length > 0) {

                    if (csvLocationSelect) {

                        csvLocationSelect.innerHTML =
                            locations.map(function (loc) {
                                return `<option value="${loc}">${loc}</option>`;
                            }).join("") +
                            `<option value="">Don't use a location (general columns)</option>`;

                    }

                    if (csvLocationGroup) csvLocationGroup.style.display = "block";

                } else {

                    if (csvLocationGroup) csvLocationGroup.style.display = "none";

                }

                if (confirmCsvImport) confirmCsvImport.disabled = false;

            };

            // Only need the first ~64kb to reliably
            // capture the header line.

            reader.readAsText(file.slice(0, 65536));

        }
    );

}

if (confirmCsvImport) {

    confirmCsvImport.addEventListener(
        "click",
        async function () {

            if (!csvImportFile) {
                return;
            }

            const statusEl =
                document.getElementById("csvImportStatus");

            const location =
                csvLocationSelect ? csvLocationSelect.value : "";

            confirmCsvImport.disabled = true;
            confirmCsvImport.textContent = "Importing...";

            if (statusEl) {
                statusEl.textContent = "Importing your products — this can take a moment for large files...";
            }

            const formData = new FormData();

            formData.append("studentId", currentSellerStudentId);
            formData.append("file", csvImportFile);

            if (location) {
                formData.append("location", location);
            }

            try {

                const response =
                    await fetch(
                        API_URL + "/api/sellers/products/import",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                const data = await response.json();

                if (!data.success) {

                    if (statusEl) {

                        statusEl.textContent =
                            data.message || "Could not import that file.";

                    }

                    return;

                }

                if (statusEl) {
                    statusEl.textContent = data.message;
                }

                loadSellerProducts(currentSellerStudentId);

                setTimeout(closeCsvImportPanel, 2000);

            } catch (error) {

                console.error(
                    "CSV import error:",
                    error
                );

                if (statusEl) {

                    statusEl.textContent =
                        "Unable to connect to Kurios Stores server.";

                }

            } finally {

                confirmCsvImport.disabled = false;
                confirmCsvImport.textContent = "Import";

            }

        }
    );

}


// =========================================================
// PASSCODE REVEAL/HIDE TOGGLES
// =========================================================

document.querySelectorAll(".passcode-reveal-btn").forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const targetId =
                button.dataset.target;

            const container =
                document.getElementById(targetId);

            if (!container) {
                return;
            }

            const digits =
                container.querySelectorAll(".passcode-digit");

            const icon =
                button.querySelector("i");

            const isCurrentlyHidden =
                digits.length > 0 && digits[0].type === "password";

            digits.forEach(function (digit) {
                digit.type = isCurrentlyHidden ? "text" : "password";
            });

            if (icon) {

                icon.classList.toggle("fa-eye", !isCurrentlyHidden);
                icon.classList.toggle("fa-eye-slash", isCurrentlyHidden);

            }

            button.setAttribute(
                "aria-label",
                isCurrentlyHidden ? "Hide passcode" : "Show passcode"
            );

        }
    );

});

document.querySelectorAll(".password-toggle-btn").forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const targetId =
                button.dataset.target;

            const input =
                document.getElementById(targetId);

            if (!input) {
                return;
            }

            const icon =
                button.querySelector("i");

            if (input.type === "password") {

                input.type = "text";

                if (icon) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                }

                button.setAttribute("aria-label", "Hide password");

            } else {

                input.type = "password";

                if (icon) {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }

                button.setAttribute("aria-label", "Show password");

            }

        }
    );

});


// =========================================================
// STUDENT DASHBOARD — RECENT ORDERS + RECOMMENDATIONS
// =========================================================

async function loadDashboardRecentOrders(studentId) {

    const listEl =
        document.getElementById("dashboardRecentOrders");

    const emptyEl =
        document.getElementById("dashboardOrdersEmpty");

    if (!listEl) {
        return;
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/orders?studentId=" + studentId
            );

        const data = await response.json();

        if (!data.success) {
            return;
        }

        const recentOrders =
            data.orders.slice(0, 3);

        listEl.innerHTML = "";

        if (recentOrders.length === 0) {

            if (emptyEl) emptyEl.style.display = "block";

            return;

        }

        if (emptyEl) emptyEl.style.display = "none";

        recentOrders.forEach(function (order) {

            let items = [];

            try {
                items =
                    typeof order.items === "string" ?
                        JSON.parse(order.items) :
                        order.items;
            } catch (error) {
                items = [];
            }

            const itemSummary =
                items.length > 0 ?
                    items.length + " item" + (items.length === 1 ? "" : "s") +
                        (items[0].name ? " · " + items[0].name + (items.length > 1 ? " + more" : "") : "") :
                    "Order";

            const orderDate =
                new Date(order.created_at).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric" }
                );

            const row =
                document.createElement("div");

            row.className = "dashboard-order-row";

            row.innerHTML = `
                <div class="dashboard-order-row-info">
                    <strong>${itemSummary}</strong>
                    <span>${orderDate}</span>
                </div>
                <div class="dashboard-order-row-right">
                    <strong>₦${Number(order.amount).toLocaleString()}</strong>
                    <span class="dashboard-order-status ${order.status}">${order.status}</span>
                </div>
            `;

            row.style.cursor = "pointer";

            row.addEventListener(
                "click",
                function () {
                    window.location.hash = "orders";
                }
            );

            listEl.appendChild(row);

        });

    } catch (error) {

        console.error(
            "Load dashboard orders error:",
            error
        );

    }

}


function renderDashboardRecommendations(products) {

    const grid =
        document.getElementById("dashboardRecommendations");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    products.forEach(function (product) {

        const category =
            product.category || "General";

        const icon =
            STOREFRONT_CATEGORY_ICONS[category] || "fa-box";

        const imageMarkup =
            product.image_url ?
                `<img src="${API_URL + product.image_url}" alt="${product.name}">` :
                `<i class="fa-solid ${icon}"></i>`;

        const card =
            document.createElement("article");

        card.className = "product-card";
        card.style.cursor = "pointer";

        card.innerHTML = `
            <div class="product-image">
                ${imageMarkup}
            </div>
            <div class="product-info">
                <span class="product-category">${category}</span>
                <h3>${product.name}</h3>
                <div class="product-bottom">
                    <strong>₦${Number(product.price).toLocaleString()}</strong>
                </div>
            </div>
        `;

        card.addEventListener(
            "click",
            function () {
                window.location.hash = "shop";
            }
        );

        grid.appendChild(card);

    });

}


// ========================================
// DASHBOARD STAT CARD SHORTCUTS
// ========================================

const dashboardWalletCard =
    document.getElementById("dashboardWalletCard");

if (dashboardWalletCard) {

    dashboardWalletCard.addEventListener(
        "click",
        function () {
            window.location.hash = "wallet";
        }
    );

}

const dashboardWishlistCard =
    document.getElementById("dashboardWishlistCard");

if (dashboardWishlistCard) {

    dashboardWishlistCard.addEventListener(
        "click",
        function () {
            window.location.hash = "wishlist";
        }
    );

}

const dashboardRewardsCard =
    document.getElementById("dashboardRewardsCard");

if (dashboardRewardsCard) {

    dashboardRewardsCard.addEventListener(
        "click",
        function () {
            window.location.hash = "rewards";
        }
    );

}

const dashboardViewAllOrders =
    document.getElementById("dashboardViewAllOrders");

if (dashboardViewAllOrders) {

    dashboardViewAllOrders.addEventListener(
        "click",
        function () {
            window.location.hash = "orders";
        }
    );

}


// =========================================================
// SELLER SALES
// =========================================================

async function loadSellerSales(studentId) {

    const loadingEl =
        document.getElementById("sellerSalesLoading");

    const emptyEl =
        document.getElementById("sellerSalesEmpty");

    const listEl =
        document.getElementById("sellerSalesList");

    const summaryEl =
        document.getElementById("sellerSalesSummary");

    if (!listEl) {
        return;
    }

    if (loadingEl) loadingEl.style.display = "block";
    if (emptyEl) emptyEl.style.display = "none";
    if (summaryEl) summaryEl.style.display = "none";
    listEl.innerHTML = "";

    try {

        const response =
            await fetch(
                API_URL + "/api/sellers/orders?studentId=" + studentId
            );

        const data = await response.json();

        if (loadingEl) loadingEl.style.display = "none";

        if (!data.success) {
            return;
        }

        if (data.orders.length === 0) {

            if (emptyEl) emptyEl.style.display = "block";

            return;

        }

        if (summaryEl) {

            summaryEl.style.display = "flex";

            const revenueEl =
                document.getElementById("sellerTotalRevenue");

            if (revenueEl) {

                revenueEl.textContent =
                    "₦" + Number(data.totalRevenue).toLocaleString();

            }

        }

        data.orders.forEach(function (order) {

            const itemsSummary =
                order.items.map(function (item) {
                    return item.quantity + "× " + item.name;
                }).join(", ");

            const orderDate =
                new Date(order.createdAt).toLocaleDateString(
                    undefined,
                    { month: "short", day: "numeric", year: "numeric" }
                );

            const card =
                document.createElement("div");

            card.className = "seller-sale-card";

            card.innerHTML = `
                <div class="seller-sale-card-top">
                    <div>
                        <strong>${order.buyerName}</strong>
                        <span>${orderDate} · ${order.buyerEmail || order.buyerPhone || ""}</span>
                    </div>
                    <div class="seller-sale-amount">
                        ₦${Number(order.subtotal).toLocaleString()}
                    </div>
                </div>
                <div class="seller-sale-items">
                    ${itemsSummary}
                </div>
            `;

            listEl.appendChild(card);

        });

    } catch (error) {

        console.error(
            "Load seller sales error:",
            error
        );

        if (loadingEl) loadingEl.style.display = "none";

    }

}


// =========================================================
// WALLET PAGE
// =========================================================

async function loadWalletPage() {

    const student =
        getStoredStudent();

    const loadingEl =
        document.getElementById("walletLoading");

    const notSellerEl =
        document.getElementById("walletNotSellerState");

    const sellerStateEl =
        document.getElementById("walletSellerState");

    if (loadingEl) loadingEl.style.display = "block";
    if (notSellerEl) notSellerEl.style.display = "none";
    if (sellerStateEl) sellerStateEl.style.display = "none";

    if (!student) {
        if (loadingEl) loadingEl.style.display = "none";
        return;
    }

    if (typeof loadStudentWalletSection === "function") {
        loadStudentWalletSection(student.id);
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/sellers/wallet?studentId=" + student.id
            );

        const data = await response.json();

        if (loadingEl) loadingEl.style.display = "none";

        if (!data.success) {

            if (notSellerEl) notSellerEl.style.display = "block";

            return;

        }

        if (sellerStateEl) sellerStateEl.style.display = "block";

        if (typeof loadPayoutHistory === "function") {
            loadPayoutHistory(student.id);
        }

        const balanceEl =
            document.getElementById("walletBalance");

        if (balanceEl) {

            balanceEl.textContent =
                "₦" + Number(data.balance).toLocaleString();

        }

        const listEl =
            document.getElementById("walletTransactionList");

        const emptyEl =
            document.getElementById("walletTransactionsEmpty");

        if (listEl) {

            listEl.innerHTML = "";

            if (data.transactions.length === 0) {

                if (emptyEl) emptyEl.style.display = "block";

            } else {

                if (emptyEl) emptyEl.style.display = "none";

                data.transactions.forEach(function (tx) {

                    const txDate =
                        new Date(tx.created_at).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric", year: "numeric" }
                        );

                    const row =
                        document.createElement("div");

                    row.className = "wallet-transaction-row";

                    row.innerHTML = `
                        <div class="wallet-transaction-info">
                            <strong>${tx.description || (tx.type === "credit" ? "Wallet credit" : "Wallet debit")}</strong>
                            <span>${txDate}</span>
                        </div>
                        <div class="wallet-transaction-amount ${tx.type}">
                            ${tx.type === "credit" ? "+" : "-"}₦${Number(tx.amount).toLocaleString()}
                        </div>
                    `;

                    listEl.appendChild(row);

                });

            }

        }

    } catch (error) {

        console.error(
            "Load wallet error:",
            error
        );

        if (loadingEl) loadingEl.style.display = "none";

    }

}


// ========================================
// DASHBOARD WALLET STAT CARD
// ========================================

async function loadDashboardWalletBalance(studentId) {

    const balanceEl =
        document.getElementById("dashboardWalletBalance");

    if (!balanceEl) {
        return;
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/students/wallet?studentId=" + studentId
            );

        const data = await response.json();

        if (data.success) {

            balanceEl.textContent =
                Number(data.balance).toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                );

        }

        // If not a seller (403), the card just
        // keeps showing 0.00 — that's accurate.

    } catch (error) {

        console.error(
            "Load dashboard wallet balance error:",
            error
        );

    }

}


// =========================================================
// SELLER DASHBOARD — TAB SWITCHING + NAV ACTIONS
// =========================================================

function switchSellerDashTab(targetTab) {

    document.querySelectorAll("[data-seller-tab]").forEach(function (btn) {
        btn.classList.remove("active");
    });

    document.querySelectorAll('[data-seller-tab="' + targetTab + '"]').forEach(function (btn) {
        btn.classList.add("active");
    });

    document.querySelectorAll(".seller-dash-tab").forEach(function (tab) {
        tab.style.display = "none";
    });

    const targetEl =
        document.getElementById(
            "sellerTab" +
            targetTab.charAt(0).toUpperCase() +
            targetTab.slice(1)
        );

    if (targetEl) {
        targetEl.style.display = "block";
    }

}

document.addEventListener("click", function (event) {

    const tabTrigger =
        event.target.closest("[data-seller-tab]");

    if (tabTrigger) {

        event.preventDefault();
        switchSellerDashTab(tabTrigger.dataset.sellerTab);
        return;

    }

    const actionTrigger =
        event.target.closest("[data-seller-action]");

    if (!actionTrigger) {
        return;
    }

    const action =
        actionTrigger.dataset.sellerAction;

    if (action === "wallet") {

        window.location.hash = "wallet";

    } else if (action === "messages") {

        window.location.hash = "chat";

    } else if (action === "store") {

        const seller = window.__kuriosCurrentSeller;

        if (seller && seller.id) {
            window.location.hash = "store-" + seller.id;
        }

    } else if (action === "switch-to-student") {

        if (typeof switchDashboardWithReload === "function") {

            switchDashboardWithReload(null);

        } else if (typeof goHome === "function") {

            goHome();

        }

    } else if (action === "marketing" || action === "discounts") {

        showMessage(
            "This seller tool isn't built yet — coming in a future update."
        );

    } else if (action === "notifications" || action === "profile") {

        // These duplicate features already available
        // elsewhere on the site (the header's own
        // notification bell / account menu) — no
        // separate handling needed here.

    }

});

document.addEventListener("click", function (event) {

    const addProductShortcut =
        event.target.closest("#sellerDashboardAddProduct");

    if (!addProductShortcut) {
        return;
    }

    switchSellerDashTab("products");

    setTimeout(
        function () {

            const existingButton =
                document.getElementById("addProductButton");

            if (existingButton) {
                existingButton.click();
            }

        },
        0
    );

});

const ksSellerSidebarToggle =
    document.getElementById("ksSellerSidebarToggle");

if (ksSellerSidebarToggle) {

    ksSellerSidebarToggle.addEventListener(
        "click",
        function () {

            const app =
                document.querySelector(".ks-seller-app");

            if (app) {
                app.classList.toggle("sidebar-open");
            }

        }
    );

}


// =========================================================
// SELLER DASHBOARD STATS (Overview tab)
// =========================================================

async function loadSellerDashboardStats(studentId) {

    const loadingEl =
        document.getElementById("sellerStatsLoading");

    const contentEl =
        document.getElementById("sellerStatsContent");

    if (!loadingEl || !contentEl) {
        return;
    }

    loadingEl.style.display = "block";
    contentEl.style.display = "none";

    try {

        const response =
            await fetch(
                API_URL + "/api/sellers/dashboard-stats?studentId=" + studentId
            );

        const data = await response.json();

        loadingEl.style.display = "none";

        if (!data.success) {
            return;
        }

        contentEl.style.display = "block";


        // ------------------------------------
        // STAT CARDS
        // ------------------------------------

        const setText = function (id, text) {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setText("statTotalSales", "₦" + Number(data.totalSales).toLocaleString());
        setText("statOrderCount", data.orderCount);
        setText("statProductCount", data.productCount);
        setText("statCustomerCount", data.uniqueCustomers);
        setText("statWalletBalance", "₦" + Number(data.walletBalance).toLocaleString());

        setText(
            "statStoreRating",
            data.storeReviewCount > 0 ?
                data.storeRating.toFixed(1) + " ★ (" + data.storeReviewCount + ")" :
                "No ratings yet"
        );


        // ------------------------------------
        // SALES CHART — real SVG line chart
        // ------------------------------------

        const chartEl =
            document.getElementById("sellerSalesChart");

        if (chartEl) {

            const days =
                Array.isArray(data.salesByDay) ? data.salesByDay : [];

            if (days.length === 0) {

                chartEl.innerHTML =
                    '<div class="seller-chart-empty">No sales data yet.</div>';

            } else {

                const width = 620;
                const height = 160;
                const pad = { left: 42, right: 12, top: 12, bottom: 26 };
                const innerW = width - pad.left - pad.right;
                const innerH = height - pad.top - pad.bottom;

                const maxValue =
                    Math.max(1, ...days.map(function (d) { return Number(d.total) || 0; }));

                const points =
                    days.map(function (d, i) {

                        const x =
                            pad.left + (days.length === 1 ? innerW / 2 : (i * innerW) / (days.length - 1));

                        const y =
                            pad.top + innerH - ((Number(d.total) || 0) / maxValue) * innerH;

                        return { x: x, y: y, label: d.label, value: Number(d.total) || 0 };

                    });

                const polyline =
                    points.map(function (p) { return p.x + "," + p.y; }).join(" ");

                const area =
                    pad.left + "," + (pad.top + innerH) + " " +
                    polyline + " " +
                    points[points.length - 1].x + "," + (pad.top + innerH);

                const gridLines =
                    [0, 0.25, 0.5, 0.75, 1].map(function (r) {

                        const y = pad.top + innerH - r * innerH;
                        const value = Math.round(maxValue * r);
                        const label = value >= 1000 ? Math.round(value / 1000) + "K" : value;

                        return `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" stroke="#f0f0f2" stroke-width="1"/>` +
                            `<text x="${pad.left - 8}" y="${y + 3}" text-anchor="end" fill="#9ca3af" font-size="10">₦${label}</text>`;

                    }).join("");

                const dayLabels =
                    points.map(function (p) {
                        return `<text x="${p.x}" y="${height - 6}" text-anchor="middle" fill="#9ca3af" font-size="10">${p.label}</text>`;
                    }).join("");

                const dots =
                    points.map(function (p) {
                        return `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#6d28d9" stroke="#fff" stroke-width="2"><title>₦${p.value.toLocaleString()}</title></circle>`;
                    }).join("");

                chartEl.innerHTML =
                    `<svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img">` +
                    gridLines +
                    `<polygon points="${area}" fill="rgba(109,40,217,0.08)"/>` +
                    `<polyline points="${polyline}" fill="none" stroke="#6d28d9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>` +
                    dots +
                    dayLabels +
                    `</svg>`;

            }

        }


        // ------------------------------------
        // ORDER STATUS — real donut chart
        // ------------------------------------

        const statusColors = {
            paid: "#15803d",
            pending: "#b45309",
            failed: "#dc2626"
        };

        const statusEntries =
            Object.entries(data.statusBreakdown || {});

        const totalStatuses =
            Math.max(1, statusEntries.reduce(function (sum, entry) { return sum + Number(entry[1] || 0); }, 0));

        const donutEl =
            document.getElementById("sellerOrderDonut");

        const statusEl =
            document.getElementById("sellerStatusBreakdown");

        let cursor = 0;

        const stops =
            statusEntries.map(function (entry) {

                const status = entry[0];
                const value = Number(entry[1] || 0);

                const startDeg = (cursor * 360) / totalStatuses;
                cursor += value;
                const endDeg = (cursor * 360) / totalStatuses;

                return (statusColors[status] || "#9ca3af") + " " + startDeg + "deg " + endDeg + "deg";

            });

        if (donutEl) {

            donutEl.style.background =
                stops.length > 0 ?
                    "conic-gradient(" + stops.join(",") + ")" :
                    "conic-gradient(#e5e7eb 0deg 360deg)";

        }

        const donutTotalEl =
            document.getElementById("sellerDonutTotal");

        if (donutTotalEl) {

            donutTotalEl.textContent =
                statusEntries.reduce(function (sum, entry) { return sum + Number(entry[1] || 0); }, 0);

        }

        if (statusEl) {

            statusEl.innerHTML =
                statusEntries.map(function (entry) {

                    const status = entry[0];
                    const count = Number(entry[1] || 0);
                    const pct = ((count / totalStatuses) * 100).toFixed(0);

                    return `
                        <div class="seller-status-row">
                            <span class="seller-status-dot" style="background:${statusColors[status] || "#9ca3af"};"></span>
                            <span class="seller-status-row-label">${status}</span>
                            <span class="seller-status-row-count">${count} (${pct}%)</span>
                        </div>
                    `;

                }).join("");

        }


        // ------------------------------------
        // TOP SELLING PRODUCTS — with thumbnail + price
        // ------------------------------------

        const topProductsEl =
            document.getElementById("sellerTopProducts");

        const topProductsEmptyEl =
            document.getElementById("sellerTopProductsEmpty");

        if (topProductsEl) {

            const topProducts =
                Array.isArray(data.topProducts) ? data.topProducts : [];

            if (topProducts.length === 0) {

                topProductsEl.innerHTML = "";

                if (topProductsEmptyEl) topProductsEmptyEl.style.display = "block";

            } else {

                if (topProductsEmptyEl) topProductsEmptyEl.style.display = "none";

                topProductsEl.innerHTML =
                    topProducts.map(function (product) {

                        const thumbMarkup =
                            product.image_url ?
                                `<img src="${API_URL + product.image_url}" alt="${product.name}">` :
                                `<i class="fa-solid fa-box"></i>`;

                        return `
                            <div class="seller-top-product-row seller-top-product-row-with-thumb">
                                <div class="seller-top-product-thumb">${thumbMarkup}</div>
                                <div class="seller-top-product-details">
                                    <strong>${product.name}</strong>
                                    <span>₦${Number(product.price || 0).toLocaleString()}</span>
                                </div>
                                <span class="seller-top-product-qty">${product.quantitySold} sold</span>
                            </div>
                        `;

                    }).join("");

            }

        }


        // ------------------------------------
        // RECENT ORDERS TABLE — now with product
        // ------------------------------------

        const recentOrdersEl =
            document.getElementById("sellerRecentOrdersTable");

        const recentOrdersEmptyEl =
            document.getElementById("sellerRecentOrdersEmpty");

        if (recentOrdersEl) {

            const recentOrders =
                Array.isArray(data.recentOrders) ? data.recentOrders : [];

            if (recentOrders.length === 0) {

                recentOrdersEl.innerHTML = "";

                if (recentOrdersEmptyEl) recentOrdersEmptyEl.style.display = "block";

            } else {

                if (recentOrdersEmptyEl) recentOrdersEmptyEl.style.display = "none";

                const rows =
                    recentOrders.map(function (order) {

                        const firstItem =
                            Array.isArray(order.items) && order.items[0] ?
                                order.items[0].name :
                                "Product";

                        const orderDate =
                            new Date(order.createdAt).toLocaleDateString(
                                undefined,
                                { month: "short", day: "numeric" }
                            );

                        return `
                            <tr>
                                <td>#${order.orderId}</td>
                                <td>${order.buyerName}</td>
                                <td>${firstItem}</td>
                                <td>₦${Number(order.subtotal).toLocaleString()}</td>
                                <td><span class="seller-order-status-pill ${order.status}">${order.status}</span></td>
                                <td>${orderDate}</td>
                            </tr>
                        `;

                    }).join("");

                recentOrdersEl.innerHTML = `
                    <table class="seller-orders-table">
                        <thead>
                            <tr>
                                <th>Order</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows}
                        </tbody>
                    </table>
                `;

            }

        }

    } catch (error) {

        console.error(
            "Load seller dashboard stats error:",
            error
        );

        loadingEl.style.display = "none";

    }

}


// =========================================================
// REVIEW PROMPTS (on My Orders page)
// =========================================================

async function loadReviewablePrompts(studentId) {

    const container =
        document.getElementById("reviewablePrompts");

    if (!container) {
        return;
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/students/reviewable-products?studentId=" + studentId
            );

        const data = await response.json();

        if (!data.success || data.products.length === 0) {

            container.style.display = "none";
            container.innerHTML = "";

            return;

        }

        container.style.display = "block";

        container.innerHTML =
            `<div class="form-section-label">Rate what you bought</div>` +
            data.products.map(function (product) {

                const thumbMarkup =
                    product.image_url ?
                        `<img src="${API_URL + product.image_url}" alt="${product.name}">` :
                        `<i class="fa-solid fa-box"></i>`;

                return `
                    <div class="review-prompt-card" data-product-id="${product.id}">
                        <div class="review-prompt-thumb">${thumbMarkup}</div>
                        <div class="review-prompt-info">
                            <strong>${product.name}</strong>
                        </div>
                        <div class="review-star-picker" data-product-id="${product.id}">
                            <i class="fa-solid fa-star" data-star="1"></i>
                            <i class="fa-solid fa-star" data-star="2"></i>
                            <i class="fa-solid fa-star" data-star="3"></i>
                            <i class="fa-solid fa-star" data-star="4"></i>
                            <i class="fa-solid fa-star" data-star="5"></i>
                        </div>
                    </div>
                `;

            }).join("");

        container.querySelectorAll(".review-star-picker").forEach(function (picker) {

            const stars =
                picker.querySelectorAll("i");

            stars.forEach(function (star) {

                star.addEventListener(
                    "click",
                    async function () {

                        const rating =
                            parseInt(star.dataset.star, 10);

                        const productId =
                            picker.dataset.productId;

                        stars.forEach(function (s) {
                            s.classList.toggle(
                                "active",
                                parseInt(s.dataset.star, 10) <= rating
                            );
                        });

                        const student =
                            getStoredStudent();

                        if (!student) {
                            return;
                        }

                        try {

                            await fetch(
                                API_URL + "/api/products/" + productId + "/reviews",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify({
                                        studentId: student.id,
                                        rating: rating
                                    })
                                }
                            );

                            const card =
                                picker.closest(".review-prompt-card");

                            if (card) {

                                setTimeout(function () {

                                    card.style.opacity = "0.5";
                                    picker.style.pointerEvents = "none";

                                }, 300);

                            }

                        } catch (error) {

                            console.error(
                                "Submit review error:",
                                error
                            );

                        }

                    }
                );

            });

        });

    } catch (error) {

        console.error(
            "Load reviewable prompts error:",
            error
        );

    }

}


// =========================================================
// STUDENT / SELLER DUAL DASHBOARD
// =========================================================

let __kuriosApprovedSellerCache = null;
let __kuriosInSellerDashboard = false;

function switchDashboardWithReload(hash) {

    if (hash) {

        window.location.hash = hash;

    } else if (window.location.hash) {

        history.replaceState(
            null,
            "",
            window.location.pathname + window.location.search
        );

    }

    window.location.reload();

}

function setAccountMenuContext(inSellerDashboard) {

    __kuriosInSellerDashboard = inSellerDashboard;

    const labelEl =
        document.getElementById("accountBecomeSellerLabel");

    if (!labelEl) {
        return;
    }

    if (inSellerDashboard) {

        labelEl.textContent = "Switch to Student";

    } else {

        labelEl.textContent =
            __kuriosApprovedSellerCache ? "Switch to Seller" : "Sell on Kurios";

    }

}

async function updateSellerMenuLabel(studentId) {

    const labelEl =
        document.getElementById("accountBecomeSellerLabel");

    if (!labelEl) {
        return null;
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/sellers/me?studentId=" + studentId
            );

        const data = await response.json();

        const isApprovedSeller =
            data.success &&
            data.seller &&
            data.seller.status === "approved";

        __kuriosApprovedSellerCache = isApprovedSeller;

        setAccountMenuContext(__kuriosInSellerDashboard);

        return isApprovedSeller;

    } catch (error) {

        console.error(
            "Check seller status for menu error:",
            error
        );

        return null;

    }

}


// ========================================
// DASHBOARD CHOICE MODAL
// (shown once, right after a fresh login,
// only if the student is an approved seller —
// not shown again on ordinary page reloads)
// ========================================

const DASHBOARD_CHOICE_TIMEOUT_MS = 60 * 1000;
const DASHBOARD_CHOICE_STORAGE_KEY = "kuriosDashboardChoicePendingSince";

let __kuriosDashboardChoiceTimer = null;

function clearDashboardChoicePending() {

    localStorage.removeItem(DASHBOARD_CHOICE_STORAGE_KEY);
    sessionStorage.removeItem(DASHBOARD_CHOICE_STORAGE_KEY);

    if (__kuriosDashboardChoiceTimer) {

        clearTimeout(__kuriosDashboardChoiceTimer);
        __kuriosDashboardChoiceTimer = null;

    }

}

function autoLogoutFromPendingChoice() {

    clearDashboardChoicePending();

    localStorage.removeItem("kuriosLoggedInStudent");
    sessionStorage.removeItem("kuriosLoggedInStudent");

    const message =
        "You were signed out after not choosing a dashboard in time. Please sign in again.";

    if (typeof showMessage === "function") {

        showMessage(message);

    } else {

        alert(message);

    }

    setTimeout(
        function () {
            window.location.reload();
        },
        1200
    );

}

function startDashboardChoiceTimer(pendingSince) {

    if (__kuriosDashboardChoiceTimer) {
        clearTimeout(__kuriosDashboardChoiceTimer);
    }

    const elapsed =
        Date.now() - pendingSince;

    const remaining =
        DASHBOARD_CHOICE_TIMEOUT_MS - elapsed;

    if (remaining <= 0) {

        autoLogoutFromPendingChoice();
        return;

    }

    __kuriosDashboardChoiceTimer =
        setTimeout(
            autoLogoutFromPendingChoice,
            remaining
        );

}

function showDashboardChoiceModal(student) {

    const modal =
        document.getElementById("dashboardChoiceModal");

    if (!modal) {
        return;
    }

    const greetingEl =
        document.getElementById("dashboardChoiceGreeting");

    if (greetingEl) {

        const firstName =
            (student.first_name || "").trim();

        greetingEl.textContent =
            "Welcome back" + (firstName ? ", " + firstName : "") + "!";

    }

    modal.classList.add("open");


    // Remember that a decision is pending, with WHEN it
    // started — so a page refresh can resume the same
    // countdown instead of silently dropping into the
    // student dashboard or restarting the clock.

    const alreadyPendingSince =
        parseInt(
            localStorage.getItem(DASHBOARD_CHOICE_STORAGE_KEY) ||
            sessionStorage.getItem(DASHBOARD_CHOICE_STORAGE_KEY) ||
            "0",
            10
        );

    const pendingSince =
        alreadyPendingSince || Date.now();

    if (!alreadyPendingSince) {

        localStorage.setItem(
            DASHBOARD_CHOICE_STORAGE_KEY,
            String(pendingSince)
        );

    }

    startDashboardChoiceTimer(pendingSince);

}

function closeDashboardChoiceModal() {

    const modal =
        document.getElementById("dashboardChoiceModal");

    if (modal) {
        modal.classList.remove("open");
    }

    clearDashboardChoicePending();

}


// ========================================
// RESUME A PENDING DECISION AFTER REFRESH
// (runs on every page load — if a choice
// was left unmade, re-show the splash +
// modal and resume the countdown instead
// of letting the dashboard render)
// ========================================

(function resumePendingDashboardChoice() {

    const pendingSinceRaw =
        localStorage.getItem(DASHBOARD_CHOICE_STORAGE_KEY) ||
        sessionStorage.getItem(DASHBOARD_CHOICE_STORAGE_KEY);

    if (!pendingSinceRaw) {
        return;
    }

    const student =
        typeof getStoredStudent === "function" ?
            getStoredStudent() :
            null;

    if (!student) {

        // No session to resume — clear the stale flag.

        clearDashboardChoicePending();
        return;

    }

    const pendingSince =
        parseInt(pendingSinceRaw, 10);

    const elapsed =
        Date.now() - pendingSince;

    if (elapsed >= DASHBOARD_CHOICE_TIMEOUT_MS) {

        autoLogoutFromPendingChoice();
        return;

    }

    const splashEl =
        document.getElementById("postLoginSplash");

    if (splashEl) {
        splashEl.style.display = "flex";
    }

    const mainEl =
        document.getElementById("mainContent");

    if (mainEl) {
        mainEl.style.display = "none";
    }

    showDashboardChoiceModal(student);

})();


const dashboardChoiceStudent =
    document.getElementById("dashboardChoiceStudent");

if (dashboardChoiceStudent) {

    dashboardChoiceStudent.addEventListener(
        "click",
        function () {

            // Hide the choice cards but leave the splash
            // showing underneath for a beat before we go.

            closeDashboardChoiceModal();

            setTimeout(
                function () {

                    if (typeof switchDashboardWithReload === "function") {

                        switchDashboardWithReload(null);

                    } else if (typeof goHome === "function") {

                        goHome();

                    }

                },
                5000
            );

        }
    );

}

const dashboardChoiceSeller =
    document.getElementById("dashboardChoiceSeller");

if (dashboardChoiceSeller) {

    dashboardChoiceSeller.addEventListener(
        "click",
        function () {

            closeDashboardChoiceModal();

            setTimeout(
                function () {

                    if (typeof switchDashboardWithReload === "function") {

                        switchDashboardWithReload("sell");

                    } else {

                        window.location.hash = "sell";

                    }

                },
                5000
            );

        }
    );

}


// =========================================================
// CONTACT SELLER ABOUT A PRODUCT
// =========================================================

async function contactSupport() {

    const student =
        getStoredStudent();

    if (!student) {

        if (typeof openSignInModalStandalone === "function") {
            openSignInModalStandalone();
        }

        return;

    }

    try {

        const response =
            await fetch(
                API_URL + "/api/chat/contact-support",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        studentId: student.id
                    })
                }
            );

        const data = await response.json();

        if (!data.success) {

            alert(data.message || "Could not start a chat with support.");
            return;

        }

        window.__kuriosPendingChatOpen = {
            conversationId: data.conversationId,
            sellerStudentId: data.supportStudentId,
            storeName: data.supportName,
            productName: "__SUPPORT__"
        };

        window.location.hash = "chat";

    } catch (error) {

        console.error(
            "Contact support error:",
            error
        );

        alert("Unable to connect to Kurios Stores server.");

    }

}

const chatContactSupportBtn =
    document.getElementById("chatContactSupportBtn");

if (chatContactSupportBtn) {

    chatContactSupportBtn.addEventListener(
        "click",
        contactSupport
    );

}

async function contactSellerAboutProduct(productId) {

    const student =
        getStoredStudent();

    if (!student) {

        if (typeof openSignInModalStandalone === "function") {
            openSignInModalStandalone();
        }

        return;

    }

    try {

        const response =
            await fetch(
                API_URL + "/api/chat/contact-seller",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        studentId: student.id,
                        productId: productId
                    })
                }
            );

        const data = await response.json();

        if (!data.success) {

            alert(data.message || "Could not start a chat with this seller.");
            return;

        }

        window.__kuriosPendingChatOpen = {
            conversationId: data.conversationId,
            sellerStudentId: data.sellerStudentId,
            storeName: data.storeName,
            productName: data.productName
        };

        window.location.hash = "chat";

    } catch (error) {

        console.error(
            "Contact seller error:",
            error
        );

        alert("Unable to connect to Kurios Stores server.");

    }

}


// =========================================================
// CHAT — "COMING SOON" ELEMENTS
// (every feature shown in the reference design that
// isn't actually built yet — clearly tagged, not faked)
// =========================================================

document.addEventListener("click", function (event) {

    const soonTrigger =
        event.target.closest('[data-chat-action="soon"], [data-chat-sidebar-action="soon"], .chat-filter-pill.soon');

    if (!soonTrigger) {
        return;
    }

    if (typeof showMessage === "function") {

        showMessage("This feature isn't built yet — coming soon.");

    } else {

        alert("This feature isn't built yet — coming soon.");

    }

});


// ========================================
// CHAT APP SIDEBAR — REAL NAV DESTINATIONS
// ========================================

document.addEventListener("click", function (event) {

    const navItem =
        event.target.closest("[data-chat-sidebar-action]");

    if (!navItem) {
        return;
    }

    const action =
        navItem.dataset.chatSidebarAction;

    if (action === "notifications") {

        const notificationButton =
            document.getElementById("notificationButton");

        if (notificationButton) {
            notificationButton.click();
        }

    } else if (action === "orders") {

        window.location.hash = "orders";

    } else if (action === "errands") {

        window.location.hash = "errands";

    } else if (action === "favorites") {

        window.location.hash = "wishlist";

    } else if (action === "rewards") {

        window.location.hash = "rewards";

    } else if (action === "wallet") {

        window.location.hash = "wallet";

    } else if (action === "profile" || action === "settings") {

        window.location.hash = "profile";

    } else if (action === "support") {

        if (typeof switchToKChatView === "function") {
            switchToKChatView();
        }

        const supportFilterPill =
            document.querySelector('.chat-filter-pill[data-chat-filter="SUPPORT"]');

        if (supportFilterPill) {
            supportFilterPill.click();
        }

    }

});

const appSidebarNewChat =
    document.getElementById("appSidebarNewChat");

if (appSidebarNewChat) {

    appSidebarNewChat.addEventListener(
        "click",
        function () {

            const realButton =
                document.getElementById("newChatButton");

            if (realButton) {
                realButton.click();
            }

        }
    );

}


// ========================================
// CHAT FILTER PILLS (real filtering for
// All / Students / Sellers — the rest are
// tagged Coming Soon above)
// ========================================

let __kuriosChatFilter = "all";

document.addEventListener("click", function (event) {

    const pill =
        event.target.closest(".chat-filter-pill:not(.soon)");

    if (!pill) {
        return;
    }

    document.querySelectorAll(".chat-filter-pill").forEach(function (p) {
        p.classList.remove("active");
    });

    pill.classList.add("active");

    __kuriosChatFilter =
        pill.dataset.chatFilter;

    if (typeof window.renderChatContactList === "function") {
        window.renderChatContactList();
    }

});


// =========================================================
// VIEW PROFILE BUTTON — reveals the real profile panel
// =========================================================

const chatViewProfileBtn =
    document.getElementById("chatViewProfileBtn");

if (chatViewProfileBtn) {

    chatViewProfileBtn.addEventListener(
        "click",
        function () {

            const panel =
                document.getElementById("chatProfilePanel");

            if (!panel || panel.style.display === "none") {
                return;
            }

            panel.scrollIntoView({ behavior: "smooth", block: "nearest" });

            panel.style.outline = "2px solid #6d28d9";

            setTimeout(
                function () {
                    panel.style.outline = "none";
                },
                900
            );

        }
    );

}


// =========================================================
// HEADER CHAT ICON
// =========================================================

const chatIconButton =
    document.getElementById("chatIconButton");

if (chatIconButton) {

    chatIconButton.addEventListener(
        "click",
        function () {
            window.location.hash = "chat";
        }
    );

}


// =========================================================
// ACCOUNT MENU NAV LINKS (Dashboard/Shop/Categories/Rewards)
// — close the dropdown once clicked, matching every other
// item in this menu
// =========================================================

document.querySelectorAll(".account-menu-nav-link").forEach(function (link) {

    link.addEventListener(
        "click",
        function () {

            const menu =
                document.getElementById("studentAccountMenu");

            if (menu) {
                menu.classList.remove("open");
            }

        }
    );

});


// =========================================================
// CHAT — KEEP THE MESSAGE INPUT VISIBLE WHEN THE
// MOBILE KEYBOARD OPENS
// (CSS dvh handles most modern browsers, but not every
// device supports it — this uses the VisualViewport API
// as a more broadly-compatible safety net, directly
// setting the real visible height whenever it changes)
// =========================================================

if (window.visualViewport) {

    function syncChatHeightToVisualViewport() {

        const chatPreview =
            document.getElementById("chatPreviewApp");

        if (!chatPreview) {
            return;
        }

        const chatPageVisible =
            document.getElementById("chatPage") &&
            getComputedStyle(document.getElementById("chatPage")).display !== "none";

        if (!chatPageVisible) {
            return;
        }

        chatPreview.style.height =
            window.visualViewport.height + "px";

    }

    window.visualViewport.addEventListener(
        "resize",
        syncChatHeightToVisualViewport
    );

    window.visualViewport.addEventListener(
        "scroll",
        syncChatHeightToVisualViewport
    );

}


// =========================================================
// CHAT — EMOJI PICKER
// =========================================================

const KURIOS_EMOJI_LIST = [
    "😀", "😂", "😊", "😍", "🥰", "😘", "😎", "🤔",
    "😅", "😭", "😢", "😡", "🥺", "😴", "🤗", "🙄",
    "👍", "👎", "👏", "🙏", "💪", "🤝", "✌️", "🤞",
    "❤️", "🔥", "💯", "🎉", "✅", "❌", "⭐", "😴"
];

const chatEmojiButton =
    document.getElementById("chatEmojiButton");

const chatEmojiPicker =
    document.getElementById("chatEmojiPicker");

if (chatEmojiPicker) {

    chatEmojiPicker.innerHTML =
        KURIOS_EMOJI_LIST.map(function (emoji) {
            return `<button type="button">${emoji}</button>`;
        }).join("");

    let __kuriosEmojiPickerReactionTarget = null;

    chatEmojiPicker.addEventListener(
        "click",
        function (event) {

            const btn =
                event.target.closest("button");

            if (!btn) {
                return;
            }

            if (__kuriosEmojiPickerReactionTarget) {

                toggleMessageReaction(__kuriosEmojiPickerReactionTarget, btn.textContent);
                __kuriosEmojiPickerReactionTarget = null;
                chatEmojiPicker.style.display = "none";
                return;

            }

            const input =
                document.getElementById("messageInput");

            if (input) {

                input.value += btn.textContent;
                input.focus();

            }

        }
    );

    window.openFullEmojiPickerForReaction = function (messageId) {

        __kuriosEmojiPickerReactionTarget = messageId;
        chatEmojiPicker.style.display = "grid";

        // Position it near the message rather than the
        // message input, since it's being used for a
        // reaction here, not typing.

        chatEmojiPicker.style.position = "fixed";
        chatEmojiPicker.style.bottom = "";
        chatEmojiPicker.style.right = "";
        chatEmojiPicker.style.top = "50%";
        chatEmojiPicker.style.left = "50%";
        chatEmojiPicker.style.transform = "translate(-50%, -50%)";

    };

}

if (chatEmojiButton && chatEmojiPicker) {

    chatEmojiButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            // Reset any reaction-mode positioning back to
            // its normal spot above the message input.

            chatEmojiPicker.style.position = "";
            chatEmojiPicker.style.top = "";
            chatEmojiPicker.style.left = "";
            chatEmojiPicker.style.transform = "";
            chatEmojiPicker.style.bottom = "74px";
            chatEmojiPicker.style.right = "16px";

            chatEmojiPicker.style.display =
                chatEmojiPicker.style.display === "none" ? "grid" : "none";

        }
    );

    document.addEventListener(
        "click",
        function (event) {

            if (
                chatEmojiPicker.style.display !== "none" &&
                !chatEmojiPicker.contains(event.target) &&
                event.target !== chatEmojiButton
            ) {

                chatEmojiPicker.style.display = "none";

            }

        }
    );

}


// =========================================================
// CHAT — FILE ATTACHMENTS
// =========================================================

async function sendChatAttachment(file, messageType) {

    const student =
        typeof getLoggedInStudent === "function" ?
            getLoggedInStudent() :
            null;

    if (!student) {
        return;
    }

    if (!window.activeChatPartnerId) {

        console.error(
            "sendChatAttachment: no active conversation (window.activeChatPartnerId is not set)."
        );

        if (typeof showMessage === "function") {
            showMessage("Open a conversation before sending that.", "error");
        }

        return;

    }

    const formData =
        new FormData();

    formData.append("file", file);
    formData.append("senderId", student.id);
    formData.append("recipientId", window.activeChatPartnerId);

    if (window.activeConversationId) {
        formData.append("conversationId", window.activeConversationId);
    }

    if (messageType) {
        formData.append("messageType", messageType);
    }

    console.log(
        "sendChatAttachment: uploading",
        file.name, file.size + " bytes", file.type,
        "to conversation with", window.activeChatPartnerId
    );

    try {

        const response =
            await fetch(
                API_URL + "/api/chat/messages/attachment",
                {
                    method: "POST",
                    body: formData
                }
            );

        console.log("sendChatAttachment: server responded with status", response.status);

        const data = await response.json();

        if (!data.success) {

            console.error("sendChatAttachment: server rejected the upload —", data.message);

            if (typeof showMessage === "function") {
                showMessage(data.message || "Could not send that attachment.", "error");
            }

            return;

        }

        console.log("sendChatAttachment: upload succeeded, message id", data.message && data.message.id);

        if (typeof window.loadThread === "function") {

            window.loadThread(
                window.activeChatPartnerId,
                student.id,
                window.activeConversationId
            );

        }

        if (typeof loadConversations === "function") {
            loadConversations();
        }

    } catch (error) {

        console.error("Send attachment error:", error);

        if (typeof showMessage === "function") {
            showMessage("Unable to connect to Kurios Stores server.", "error");
        }

    }

}

const chatAttachButton =
    document.getElementById("chatAttachButton");

const chatFileInput =
    document.getElementById("chatFileInput");

if (chatAttachButton && chatFileInput) {

    chatAttachButton.addEventListener(
        "click",
        function () {
            chatFileInput.click();
        }
    );

    chatFileInput.addEventListener(
        "change",
        function () {

            const file =
                chatFileInput.files[0];

            if (!file) {
                return;
            }

            if (file.size > 10 * 1024 * 1024) {

                if (typeof showMessage === "function") {
                    showMessage("That file is too large — 10MB max.", "error");
                }

                chatFileInput.value = "";
                return;

            }

            sendChatAttachment(file);

            chatFileInput.value = "";

        }
    );

}


// =========================================================
// CHAT — VOICE NOTES
// =========================================================

let __kuriosMediaRecorder = null;
let __kuriosRecordedChunks = [];
let __kuriosRecordingStartedAt = 0;
let __kuriosRecordingTimerInterval = null;
let __kuriosRecordingStream = null;

function formatRecordingTime(ms) {

    const totalSeconds =
        Math.floor(ms / 1000);

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;

    return minutes + ":" + String(seconds).padStart(2, "0");

}

function stopVoiceRecordingTracks() {

    if (__kuriosRecordingStream) {

        __kuriosRecordingStream.getTracks().forEach(function (track) {
            track.stop();
        });

        __kuriosRecordingStream = null;

    }

    if (__kuriosRecordingTimerInterval) {
        clearInterval(__kuriosRecordingTimerInterval);
        __kuriosRecordingTimerInterval = null;
    }

}

function hideRecordingBar() {

    const bar =
        document.getElementById("chatRecordingBar");

    if (bar) {
        bar.style.display = "none";
    }

    const form =
        document.getElementById("messageForm");

    if (form) {
        form.style.display = "flex";
    }

}

async function startVoiceRecording() {

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {

        if (typeof showMessage === "function") {
            showMessage("Voice recording isn't supported on this browser.", "error");
        }

        return;

    }

    try {

        const stream =
            await navigator.mediaDevices.getUserMedia({ audio: true });

        __kuriosRecordingStream = stream;

        __kuriosRecordedChunks = [];

        const recorder =
            new MediaRecorder(stream);

        __kuriosMediaRecorder = recorder;

        recorder.ondataavailable = function (event) {

            if (event.data && event.data.size > 0) {
                __kuriosRecordedChunks.push(event.data);
            }

        };

        recorder.start();

        __kuriosRecordingStartedAt = Date.now();

        const bar =
            document.getElementById("chatRecordingBar");

        const form =
            document.getElementById("messageForm");

        const timerEl =
            document.getElementById("chatRecordingTimer");

        if (bar) bar.style.display = "flex";
        if (form) form.style.display = "none";

        __kuriosRecordingTimerInterval = setInterval(
            function () {

                if (timerEl) {

                    timerEl.textContent =
                        formatRecordingTime(Date.now() - __kuriosRecordingStartedAt);

                }

            },
            250
        );

    } catch (error) {

        console.error("Start recording error:", error);

        if (typeof showMessage === "function") {
            showMessage("Couldn't access your microphone. Check your browser permissions.", "error");
        }

    }

}

function cancelVoiceRecording() {

    if (__kuriosMediaRecorder && __kuriosMediaRecorder.state !== "inactive") {

        __kuriosMediaRecorder.onstop = null;
        __kuriosMediaRecorder.stop();

    }

    stopVoiceRecordingTracks();
    hideRecordingBar();

    __kuriosMediaRecorder = null;
    __kuriosRecordedChunks = [];

}

function sendVoiceRecording() {

    console.log("sendVoiceRecording called. Recorder state:", __kuriosMediaRecorder ? __kuriosMediaRecorder.state : "no recorder");

    if (!__kuriosMediaRecorder || __kuriosMediaRecorder.state === "inactive") {

        console.error("sendVoiceRecording: no active recorder to stop.");

        if (typeof showMessage === "function") {
            showMessage("No active recording to send.", "error");
        }

        hideRecordingBar();
        return;

    }

    __kuriosMediaRecorder.onstop = function () {

        console.log("Recorder stopped. Chunks collected:", __kuriosRecordedChunks.length);

        const mimeType =
            __kuriosMediaRecorder.mimeType || "audio/webm";

        const blob =
            new Blob(__kuriosRecordedChunks, { type: mimeType });

        console.log("Voice note blob size (bytes):", blob.size, "mimeType:", mimeType);

        stopVoiceRecordingTracks();
        hideRecordingBar();

        __kuriosMediaRecorder = null;
        __kuriosRecordedChunks = [];

        if (blob.size === 0) {

            console.error("Voice note blob is empty — nothing was recorded (tap and hold longer before sending).");

            if (typeof showMessage === "function") {
                showMessage("That recording was too short — try holding it a bit longer.", "error");
            }

            return;

        }

        const extension =
            mimeType.indexOf("ogg") !== -1 ? "ogg" : "webm";

        const file =
            new File([blob], "voice-note." + extension, { type: mimeType });

        if (typeof sendChatAttachment === "function") {

            sendChatAttachment(file, "VOICE").then(function () {
                console.log("Voice note upload finished.");
            });

        } else {

            console.error("sendChatAttachment is not defined — cannot send voice note.");

        }

    };

    __kuriosMediaRecorder.stop();

}

const chatVoiceButton =
    document.getElementById("chatVoiceButton");

if (chatVoiceButton) {

    chatVoiceButton.addEventListener(
        "click",
        function () {

            if (
                __kuriosMediaRecorder &&
                __kuriosMediaRecorder.state === "recording"
            ) {

                // Already recording — tapping the mic again
                // stops and sends, the same way tapping it
                // once starts. No need to hunt for the
                // separate send button in the bar below.

                sendVoiceRecording();

            } else {

                startVoiceRecording();

            }

        }
    );

}

const chatCancelRecording =
    document.getElementById("chatCancelRecording");

if (chatCancelRecording) {

    chatCancelRecording.addEventListener(
        "click",
        cancelVoiceRecording
    );

}

const chatSendRecording =
    document.getElementById("chatSendRecording");

if (chatSendRecording) {

    chatSendRecording.addEventListener(
        "click",
        sendVoiceRecording
    );

}


// =========================================================
// CHAT — MESSAGE REACTIONS
// =========================================================

const KURIOS_QUICK_REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

async function toggleMessageReaction(messageId, emoji) {

    const student =
        typeof getLoggedInStudent === "function" ? getLoggedInStudent() : null;

    if (!student) {
        return;
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/chat/messages/" + messageId + "/react",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: student.id, emoji: emoji })
                }
            );

        const data = await response.json();

        if (data.success && window.activeChatPartnerId) {

            if (typeof window.loadThread === "function") {

                window.loadThread(
                    window.activeChatPartnerId,
                    student.id,
                    window.activeConversationId
                );

            }

        }

    } catch (error) {

        console.error("React to message error:", error);

    }

}

function closeReactionPopover() {

    const existing =
        document.getElementById("chatReactionPopover");

    if (existing) {
        existing.remove();
    }

}

function openReactionPopover(triggerEl, messageId) {

    closeReactionPopover();

    const popover =
        document.createElement("div");

    popover.id = "chatReactionPopover";
    popover.className = "chat-reaction-popover";

    popover.innerHTML =
        KURIOS_QUICK_REACTIONS.map(function (emoji) {
            return `<button type="button" data-emoji="${emoji}">${emoji}</button>`;
        }).join("") +
        `<button type="button" class="chat-reaction-more" data-more="1"><i class="fa-solid fa-plus"></i></button>`;

    popover.addEventListener("click", function (event) {

        const moreBtn =
            event.target.closest(".chat-reaction-more");

        if (moreBtn) {

            closeReactionPopover();
            openFullEmojiPickerForReaction(messageId);
            return;

        }

        const btn = event.target.closest("button");

        if (btn) {

            toggleMessageReaction(messageId, btn.dataset.emoji);
            closeReactionPopover();

        }

    });

    triggerEl.closest(".message").appendChild(popover);

    setTimeout(function () {

        document.addEventListener("click", function onceHandler(e) {

            if (!popover.contains(e.target)) {
                closeReactionPopover();
                document.removeEventListener("click", onceHandler);
            }

        });

    }, 0);

}

const messagesContainer =
    document.getElementById("messages");

if (messagesContainer) {

    messagesContainer.addEventListener("click", function (event) {

        const reactTrigger =
            event.target.closest(".message-react-trigger");

        if (reactTrigger) {

            const messageEl =
                reactTrigger.closest(".message");

            openReactionPopover(reactTrigger, messageEl.dataset.messageId);
            return;

        }

        const reactionPill =
            event.target.closest(".message-reaction-pill");

        if (reactionPill) {

            const messageEl =
                reactionPill.closest(".message");

            toggleMessageReaction(messageEl.dataset.messageId, reactionPill.dataset.reactionEmoji);
            return;

        }

        const editTrigger =
            event.target.closest(".message-edit-trigger");

        if (editTrigger) {

            const messageEl =
                editTrigger.closest(".message");

            beginEditingMessage(messageEl);
            return;

        }

    });

}


// =========================================================
// CHAT — EDIT A MESSAGE
// =========================================================

function beginEditingMessage(messageEl) {

    const bubble =
        messageEl.querySelector(".message-bubble");

    if (!bubble) {
        return;
    }

    const currentText =
        decodeURIComponent(bubble.dataset.bubbleText || "");

    const messageId =
        messageEl.dataset.messageId;

    bubble.innerHTML = `
        <textarea class="message-edit-textarea">${currentText}</textarea>
        <div class="message-edit-actions">
            <button type="button" class="message-edit-cancel">Cancel</button>
            <button type="button" class="message-edit-save">Save</button>
        </div>
    `;

    const textarea =
        bubble.querySelector(".message-edit-textarea");

    if (textarea) {

        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);

    }

    const cancelBtn =
        bubble.querySelector(".message-edit-cancel");

    const saveBtn =
        bubble.querySelector(".message-edit-save");

    if (cancelBtn) {

        cancelBtn.addEventListener("click", function () {

            bubble.dataset.bubbleText = encodeURIComponent(currentText);
            bubble.innerHTML = escapeChatTextGlobal(currentText);

        });

    }

    if (saveBtn) {

        saveBtn.addEventListener("click", function () {
            saveEditedMessage(messageId, textarea.value, bubble, currentText);
        });

    }

}

function escapeChatTextGlobal(text) {

    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;

}

async function saveEditedMessage(messageId, newText, bubble, fallbackText) {

    const student =
        typeof getLoggedInStudent === "function" ? getLoggedInStudent() : null;

    if (!student || !newText.trim()) {
        return;
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/chat/messages/" + messageId,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: student.id, body: newText.trim() })
                }
            );

        const data = await response.json();

        if (!data.success) {

            if (typeof showMessage === "function") {
                showMessage(data.message || "Could not edit this message.", "error");
            }

            bubble.dataset.bubbleText = encodeURIComponent(fallbackText);
            bubble.innerHTML = escapeChatTextGlobal(fallbackText);
            return;

        }

        if (window.activeChatPartnerId && typeof window.loadThread === "function") {

            window.loadThread(
                window.activeChatPartnerId,
                student.id,
                window.activeConversationId
            );

        }

    } catch (error) {

        console.error("Edit message error:", error);

        bubble.dataset.bubbleText = encodeURIComponent(fallbackText);
        bubble.innerHTML = escapeChatTextGlobal(fallbackText);

    }

}

// Live-update when the OTHER person's message you're
// viewing gets edited by them.

document.addEventListener("DOMContentLoaded", function () {

    if (window.__kuriosChatSocket) {

        window.__kuriosChatSocket.on("message_edited", function () {

            const student =
                typeof getLoggedInStudent === "function" ? getLoggedInStudent() : null;

            if (student && window.activeChatPartnerId && typeof window.loadThread === "function") {

                window.loadThread(
                    window.activeChatPartnerId,
                    student.id,
                    window.activeConversationId
                );

            }

        });

    }

});


// =========================================================
// CHAT — NOTIFICATION SOUND
// (a short synthesized two-tone chime — no external
// audio file needed, works the instant the page loads)
// =========================================================

let __kuriosAudioContext = null;

function playChatNotificationSound() {

    try {

        if (!__kuriosAudioContext) {

            const AudioContextClass =
                window.AudioContext || window.webkitAudioContext;

            if (!AudioContextClass) {
                return;
            }

            __kuriosAudioContext = new AudioContextClass();

        }

        const ctx = __kuriosAudioContext;

        if (ctx.state === "suspended") {
            ctx.resume();
        }

        const now =
            ctx.currentTime;

        [880, 1175].forEach(function (frequency, index) {

            const oscillator =
                ctx.createOscillator();

            const gain =
                ctx.createGain();

            oscillator.type = "sine";
            oscillator.frequency.value = frequency;

            const startTime =
                now + index * 0.11;

            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.18, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

            oscillator.connect(gain);
            gain.connect(ctx.destination);

            oscillator.start(startTime);
            oscillator.stop(startTime + 0.25);

        });

    } catch (error) {

        console.error("Play notification sound error:", error);

    }

}

// Browsers block audio until the user has interacted
// with the page at least once — this unlocks it on the
// first click/tap so the very first notification sound
// isn't silently swallowed.

document.addEventListener(
    "click",
    function unlockAudioOnce() {

        if (__kuriosAudioContext && __kuriosAudioContext.state === "suspended") {
            __kuriosAudioContext.resume();
        }

    },
    { once: false }
);


// =========================================================
// MY ORDERS — ACTION BUTTONS (Edit / Checkout / Retry /
// Delete / Print Receipt)
// =========================================================

let __kuriosOrdersCheckoutRef = null;
let __kuriosEditingOrder = null;
let __kuriosEditingItems = [];

const ordersPanelBodyEl =
    document.getElementById("ordersPanelBody");

if (ordersPanelBodyEl) {

    ordersPanelBodyEl.addEventListener("click", function (event) {

        const btn =
            event.target.closest("[data-order-action]");

        if (!btn) {
            return;
        }

        const action =
            btn.dataset.orderAction;

        const orderCard =
            btn.closest(".order-card");

        const orderData =
            orderCard ?
                JSON.parse(orderCard.dataset.orderJson.replace(/&apos;/g, "'")) :
                null;

        if (action === "delete") {
            deleteOrder(btn.dataset.orderId);
        } else if (action === "checkout") {
            openOrderCheckoutModal(btn.dataset.orderRef, orderData ? orderData.amount : null);
        } else if (action === "edit") {
            openEditOrderModal(orderData);
        } else if (action === "print") {
            openReceiptModal(orderData);
        } else if (action === "message-seller") {
            messageSellerAboutOrder(btn.dataset.orderId);
        }

    });

}


// ========================================
// DELETE (failed orders only)
// ========================================

async function deleteOrder(orderId) {

    if (!confirm("Delete this order? This can't be undone.")) {
        return;
    }

    const student =
        getStoredStudent();

    if (!student) {
        return;
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/orders/" + orderId,
                {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: student.id })
                }
            );

        const data = await response.json();

        if (!data.success) {
            alert(data.message || "Could not delete this order.");
            return;
        }

        if (typeof loadOrdersIntoPanel === "function") {
            loadOrdersIntoPanel(student.id);
        }

    } catch (error) {

        console.error("Delete order error:", error);
        alert("Unable to connect to Kurios Stores server.");

    }

}


// ========================================
// CHECKOUT / RETRY PAYMENT MODAL
// ========================================

function openOrderCheckoutModal(paymentReference, amount) {

    __kuriosOrdersCheckoutRef = paymentReference;

    const modal =
        document.getElementById("orderCheckoutModal");

    const statusEl =
        document.getElementById("orderCheckoutStatus");

    if (statusEl) statusEl.textContent = "";

    if (modal) {
        modal.classList.add("open");
    }

    if (amount && typeof checkAndShowWalletButton === "function") {
        checkAndShowWalletButton("orderCheckoutWalletBtn", "orderCheckoutWalletBalanceLabel", amount);
    }

}

function closeOrderCheckoutModal() {

    const modal =
        document.getElementById("orderCheckoutModal");

    if (modal) {
        modal.classList.remove("open");
    }

    __kuriosOrdersCheckoutRef = null;

}

const orderCheckoutCancelBtn =
    document.getElementById("orderCheckoutCancelBtn");

if (orderCheckoutCancelBtn) {
    orderCheckoutCancelBtn.addEventListener("click", closeOrderCheckoutModal);
}

async function payPendingOrderWith(gateway) {

    const statusEl =
        document.getElementById("orderCheckoutStatus");

    if (!__kuriosOrdersCheckoutRef) {
        return;
    }

    const student =
        getStoredStudent();

    if (!student) {
        return;
    }

    if (statusEl) statusEl.textContent = "Redirecting to " + gateway + "...";

    const returnUrl =
        window.location.origin + "/#orders";

    try {

        const response =
            await fetch(
                API_URL + "/api/orders/pay/" + gateway,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        paymentReference: __kuriosOrdersCheckoutRef,
                        returnUrl: returnUrl,
                        customerName:
                            `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                        customerEmail: student.email
                    })
                }
            );

        const data = await response.json();

        const redirectUrl =
            data.cashierUrl || data.authorizationUrl;

        if (!data.success || (gateway !== "monnify" && !redirectUrl)) {

            if (statusEl) {
                statusEl.textContent =
                    data.message || ("Could not start " + gateway + " checkout.");
            }

            return;

        }

        if (gateway === "monnify") {

            if (typeof MonnifySDK === "undefined") {

                if (statusEl) {
                    statusEl.textContent =
                        "Payment could not load. Please refresh and try again.";
                }

                return;

            }

            if (!data.apiKey || !data.contractCode) {

                if (statusEl) {
                    statusEl.textContent =
                        "Monnify is not fully configured yet. Try OPay or Paystack instead.";
                }

                return;

            }

            closeOrderCheckoutModal();

            MonnifySDK.initialize({

                amount: data.amount,
                currency: "NGN",
                reference: __kuriosOrdersCheckoutRef,
                customerFullName:
                    `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                customerEmail: student.email,
                apiKey: data.apiKey,
                contractCode: data.contractCode,
                paymentDescription: "Kurios Stores order",

                onComplete: async function () {

                    if (typeof verifyOrderPayment === "function") {
                        await verifyOrderPayment(__kuriosOrdersCheckoutRef);
                    }

                    if (typeof loadOrdersIntoPanel === "function") {
                        loadOrdersIntoPanel(student.id);
                    }

                },

                onClose: function () {}

            });

            return;

        }

        localStorage.setItem(
            "kuriosPendingOpayOrderRef",
            __kuriosOrdersCheckoutRef
        );

        window.location.href = redirectUrl;

    } catch (error) {

        console.error("Order checkout error:", error);

        if (statusEl) {
            statusEl.textContent = "Unable to connect to Kurios Stores server.";
        }

    }

}

const orderCheckoutMonnifyBtn =
    document.getElementById("orderCheckoutMonnifyBtn");

if (orderCheckoutMonnifyBtn) {

    orderCheckoutMonnifyBtn.addEventListener("click", function () {
        payPendingOrderWith("monnify");
    });

}

const orderCheckoutOpayBtn =
    document.getElementById("orderCheckoutOpayBtn");

if (orderCheckoutOpayBtn) {

    orderCheckoutOpayBtn.addEventListener("click", function () {
        payPendingOrderWith("opay");
    });

}

const orderCheckoutPaystackBtn =
    document.getElementById("orderCheckoutPaystackBtn");

if (orderCheckoutPaystackBtn) {

    orderCheckoutPaystackBtn.addEventListener("click", function () {
        payPendingOrderWith("paystack");
    });

}


// =========================================================
// EDIT ORDER MODAL
// =========================================================

function openEditOrderModal(order) {

    if (!order || order.status !== "pending") {
        return;
    }

    __kuriosEditingOrder = order;
    __kuriosEditingItems = JSON.parse(JSON.stringify(order.items));

    renderEditOrderItems();

    const statusEl =
        document.getElementById("editOrderStatus");

    if (statusEl) statusEl.textContent = "";

    const modal =
        document.getElementById("editOrderModal");

    if (modal) {
        modal.classList.add("open");
    }

}

function closeEditOrderModal() {

    const modal =
        document.getElementById("editOrderModal");

    if (modal) {
        modal.classList.remove("open");
    }

    __kuriosEditingOrder = null;
    __kuriosEditingItems = [];

}

function renderEditOrderItems() {

    const list =
        document.getElementById("editOrderItemsList");

    if (!list) return;

    if (__kuriosEditingItems.length === 0) {

        list.innerHTML = `<p style="text-align:center; color:#9ca3af; font-size:12px; padding:20px 0;">All items removed — add something to your cart to place a new order instead.</p>`;

    } else {

        list.innerHTML =
            __kuriosEditingItems.map(function (item, index) {

                return `
                    <div class="edit-order-item-row">
                        <div class="edit-order-item-info">
                            <strong>${item.name}</strong>
                            <span>${typeof formatMoney === "function" ? formatMoney(item.price) : "₦" + item.price} each</span>
                        </div>
                        <div class="edit-order-qty-controls">
                            <button type="button" data-qty-action="decrease" data-index="${index}">−</button>
                            <span>${item.quantity}</span>
                            <button type="button" data-qty-action="increase" data-index="${index}">+</button>
                            <button type="button" class="edit-order-remove-btn" data-qty-action="remove" data-index="${index}"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                `;

            }).join("");

    }

    const newTotal =
        __kuriosEditingItems.reduce(function (sum, item) {
            return sum + (item.price * item.quantity);
        }, 0);

    const totalEl =
        document.getElementById("editOrderNewTotal");

    if (totalEl) {

        totalEl.textContent =
            typeof formatMoney === "function" ? formatMoney(newTotal) : "₦" + newTotal;

    }

}

const editOrderItemsListEl =
    document.getElementById("editOrderItemsList");

if (editOrderItemsListEl) {

    editOrderItemsListEl.addEventListener("click", function (event) {

        const btn =
            event.target.closest("[data-qty-action]");

        if (!btn) return;

        const index =
            parseInt(btn.dataset.index, 10);

        const action =
            btn.dataset.qtyAction;

        if (action === "increase") {

            __kuriosEditingItems[index].quantity += 1;

        } else if (action === "decrease") {

            if (__kuriosEditingItems[index].quantity > 1) {
                __kuriosEditingItems[index].quantity -= 1;
            }

        } else if (action === "remove") {

            __kuriosEditingItems.splice(index, 1);

        }

        renderEditOrderItems();

    });

}

const editOrderCancelBtn =
    document.getElementById("editOrderCancelBtn");

if (editOrderCancelBtn) {
    editOrderCancelBtn.addEventListener("click", closeEditOrderModal);
}

const editOrderSaveBtn =
    document.getElementById("editOrderSaveBtn");

if (editOrderSaveBtn) {

    editOrderSaveBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("editOrderStatus");

        if (!__kuriosEditingOrder) return;

        if (__kuriosEditingItems.length === 0) {

            if (statusEl) {
                statusEl.textContent = "Your order needs at least one item.";
            }

            return;

        }

        const student =
            getStoredStudent();

        if (!student) return;

        editOrderSaveBtn.disabled = true;

        if (statusEl) statusEl.textContent = "Saving changes...";

        try {

            const response =
                await fetch(
                    API_URL + "/api/orders/" + __kuriosEditingOrder.id,
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentId: student.id,
                            items: __kuriosEditingItems.map(function (item) {
                                return { id: item.id, quantity: item.quantity };
                            })
                        })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) {
                    statusEl.textContent = data.message || "Could not update this order.";
                }

                editOrderSaveBtn.disabled = false;
                return;

            }

            closeEditOrderModal();

            if (typeof loadOrdersIntoPanel === "function") {
                loadOrdersIntoPanel(student.id);
            }

        } catch (error) {

            console.error("Edit order save error:", error);

            if (statusEl) {
                statusEl.textContent = "Unable to connect to Kurios Stores server.";
            }

        } finally {

            editOrderSaveBtn.disabled = false;

        }

    });

}


// =========================================================
// PRINT RECEIPT
// =========================================================

function openReceiptModal(order) {

    if (!order) return;

    const student =
        getStoredStudent();

    document.getElementById("receiptOrderId").textContent =
        order.payment_reference;

    document.getElementById("receiptDate").textContent =
        typeof formatOrderDate === "function" ? formatOrderDate(order.created_at) : order.created_at;

    const statusPill =
        document.getElementById("receiptPaymentStatus");

    if (statusPill) {

        statusPill.textContent =
            order.status.charAt(0).toUpperCase() + order.status.slice(1);

        statusPill.style.background =
            order.status === "paid" ? "#15803d" :
            (order.status === "failed" ? "#dc2626" : "#b45309");

    }

    document.getElementById("receiptCustomerName").textContent =
        student ? `${student.first_name || ""} ${student.last_name || ""}`.trim() : "—";

    document.getElementById("receiptCustomerPhone").textContent =
        student && student.phone ? student.phone : "—";

    document.getElementById("receiptCustomerEmail").textContent =
        student && student.email ? student.email : "—";

    const itemsBody =
        document.getElementById("receiptItemsBody");

    if (itemsBody) {

        itemsBody.innerHTML =
            order.items.map(function (item) {

                return `
                    <tr>
                        <td>${item.name}</td>
                        <td>${item.quantity}</td>
                        <td>${typeof formatMoney === "function" ? formatMoney(item.price) : "₦" + item.price}</td>
                        <td>${typeof formatMoney === "function" ? formatMoney(item.price * item.quantity) : "₦" + (item.price * item.quantity)}</td>
                    </tr>
                `;

            }).join("");

    }

    document.getElementById("receiptGateway").textContent =
        order.payment_gateway ?
            (order.payment_gateway.charAt(0).toUpperCase() + order.payment_gateway.slice(1)) :
            "—";

    document.getElementById("receiptTransactionId").textContent =
        order.transaction_reference || order.payment_reference;

    document.getElementById("receiptTotal").textContent =
        typeof formatMoney === "function" ? formatMoney(order.amount) : "₦" + order.amount;

    const modal =
        document.getElementById("receiptModal");

    if (modal) {
        modal.classList.add("open");
    }

}

const receiptCloseBtn =
    document.getElementById("receiptCloseBtn");

if (receiptCloseBtn) {

    receiptCloseBtn.addEventListener("click", function () {

        const modal =
            document.getElementById("receiptModal");

        if (modal) modal.classList.remove("open");

    });

}

const receiptPrintBtn =
    document.getElementById("receiptPrintBtn");

if (receiptPrintBtn) {

    receiptPrintBtn.addEventListener("click", function () {
        window.print();
    });

}


// =========================================================
// STUDENT'S OWN WALLET (top-up + balance)
// =========================================================

let __kuriosTopUpReference = null;
let __kuriosTopUpAmount = 0;

async function loadStudentWalletSection(studentId) {

    const balanceEl =
        document.getElementById("studentWalletBalance");

    const txnEl =
        document.getElementById("studentWalletTransactions");

    if (!balanceEl) return;

    try {

        const response =
            await fetch(API_URL + "/api/students/wallet?studentId=" + studentId);

        const data = await response.json();

        if (!data.success) return;

        balanceEl.textContent =
            typeof formatMoney === "function" ? formatMoney(data.balance) : "₦" + data.balance;

        if (txnEl) {

            const paidTopups =
                (data.topups || []).filter(function (t) { return t.status === "paid"; });

            if (paidTopups.length === 0) {

                txnEl.innerHTML = `<p style="text-align:center; color:#9ca3af; font-size:12px; padding:10px 0;">No top-ups yet.</p>`;

            } else {

                txnEl.innerHTML =
                    paidTopups.slice(0, 10).map(function (t) {

                        return `
                            <div class="wallet-transaction-row">
                                <span>Wallet top-up</span>
                                <strong style="color:#059669;">+${typeof formatMoney === "function" ? formatMoney(t.amount) : "₦" + t.amount}</strong>
                            </div>
                        `;

                    }).join("");

            }

        }

    } catch (error) {

        console.error("Load student wallet error:", error);

    }

}

function resetTopUpModal() {

    document.getElementById("topUpAmountStep").style.display = "block";
    document.getElementById("topUpGatewayStep").style.display = "none";
    document.getElementById("topUpAmountInput").value = "";

    const statusEl = document.getElementById("topUpAmountStatus");
    if (statusEl) statusEl.textContent = "";

}

const openTopUpButton =
    document.getElementById("openTopUpButton");

if (openTopUpButton) {

    openTopUpButton.addEventListener("click", function () {

        resetTopUpModal();

        const modal = document.getElementById("topUpModal");
        if (modal) modal.classList.add("open");

    });

}

const topUpCancelBtn =
    document.getElementById("topUpCancelBtn");

if (topUpCancelBtn) {

    topUpCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("topUpModal");
        if (modal) modal.classList.remove("open");

    });

}

const topUpContinueBtn =
    document.getElementById("topUpContinueBtn");

if (topUpContinueBtn) {

    topUpContinueBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("topUpAmountStatus");

        const amountInput =
            document.getElementById("topUpAmountInput");

        const amount =
            Number(amountInput.value);

        if (!amount || amount < 100) {

            if (statusEl) statusEl.textContent = "Please enter at least ₦100.";
            return;

        }

        const student =
            getStoredStudent();

        if (!student) return;

        topUpContinueBtn.disabled = true;

        if (statusEl) statusEl.textContent = "";

        try {

            const response =
                await fetch(
                    API_URL + "/api/wallet/topup/initiate",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id, amount: amount })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "Could not start top-up.";
                topUpContinueBtn.disabled = false;
                return;

            }

            __kuriosTopUpReference = data.paymentReference;
            __kuriosTopUpAmount = data.amount;

            document.getElementById("topUpAmountStep").style.display = "none";
            document.getElementById("topUpGatewayStep").style.display = "block";

        } catch (error) {

            console.error("Top-up initiate error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            topUpContinueBtn.disabled = false;

        }

    });

}

async function payTopUpWith(gateway) {

    const statusEl =
        document.getElementById("topUpGatewayStatus");

    if (!__kuriosTopUpReference) return;

    const student =
        getStoredStudent();

    if (!student) return;

    if (statusEl) statusEl.textContent = "Redirecting to " + gateway + "...";

    const returnUrl =
        window.location.origin + "/#wallet";

    try {

        if (gateway === "monnify") {

            const response =
                await fetch(
                    API_URL + "/api/wallet/topup/pay/monnify",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paymentReference: __kuriosTopUpReference })
                    }
                );

            const data = await response.json();

            if (!data.success || typeof MonnifySDK === "undefined" || !data.apiKey) {

                if (statusEl) {
                    statusEl.textContent =
                        (!data.success && data.message) ||
                        "Monnify is not fully configured yet. Try OPay or Paystack instead.";
                }

                return;

            }

            const modal = document.getElementById("topUpModal");
            if (modal) modal.classList.remove("open");

            MonnifySDK.initialize({

                amount: data.amount,
                currency: "NGN",
                reference: __kuriosTopUpReference,
                customerFullName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                customerEmail: student.email,
                apiKey: data.apiKey,
                contractCode: data.contractCode,
                paymentDescription: "Kurios Stores wallet top-up",

                onComplete: async function () {

                    const verifyResult =
                        await verifyPaymentWithRetry(
                            "/api/wallet/topup/verify",
                            { paymentReference: __kuriosTopUpReference }
                        );

                    if (typeof showMessage === "function") {

                        showMessage(
                            verifyResult.success ?
                                "Wallet top-up confirmed." :
                                verifyResult.message
                        );

                    }

                    loadStudentWalletSection(student.id);

                },

                onClose: function () {}

            });

            return;

        }

        const endpoint =
            gateway === "opay" ? "/api/wallet/topup/pay/opay" : "/api/wallet/topup/pay/paystack";

        const response =
            await fetch(
                API_URL + endpoint,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        paymentReference: __kuriosTopUpReference,
                        returnUrl: returnUrl,
                        customerName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                        customerEmail: student.email
                    })
                }
            );

        const data = await response.json();

        const redirectUrl =
            data.cashierUrl || data.authorizationUrl;

        if (!data.success || !redirectUrl) {

            if (statusEl) {
                statusEl.textContent = data.message || ("Could not start " + gateway + " checkout.");
            }

            return;

        }

        localStorage.setItem("kuriosPendingTopUpRef", __kuriosTopUpReference);

        window.location.href = redirectUrl;

    } catch (error) {

        console.error("Top-up payment error:", error);

        if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

    }

}

["topUpMonnifyBtn", "topUpOpayBtn", "topUpPaystackBtn"].forEach(function (id) {

    const btn = document.getElementById(id);

    if (btn) {

        btn.addEventListener("click", function () {

            const gateway =
                id === "topUpMonnifyBtn" ? "monnify" :
                (id === "topUpOpayBtn" ? "opay" : "paystack");

            payTopUpWith(gateway);

        });

    }

});

// Resume a top-up verification if we're returning
// from OPay/Paystack's hosted checkout page.

document.addEventListener("DOMContentLoaded", function () {

    const pendingTopUpRef =
        localStorage.getItem("kuriosPendingTopUpRef");

    if (pendingTopUpRef) {

        localStorage.removeItem("kuriosPendingTopUpRef");

        verifyPaymentWithRetry(
            "/api/wallet/topup/verify",
            { paymentReference: pendingTopUpRef }
        ).then(function (data) {

            if (typeof showMessage === "function") {

                showMessage(
                    data.success ?
                        "Wallet top-up confirmed." :
                        data.message
                );

            }

            const student = getStoredStudent();

            if (student && typeof loadStudentWalletSection === "function") {
                loadStudentWalletSection(student.id);
            }

        }).catch(function (error) {
            console.error("Resume top-up verify error:", error);
        });

    }

});


// =========================================================
// PAY WITH WALLET (cart checkout)
// =========================================================

async function checkWalletBalanceForCheckout(studentId, orderAmount) {

    const walletBtn =
        document.getElementById("payOrderWithWalletButton");

    if (!walletBtn) return;

    try {

        const response =
            await fetch(API_URL + "/api/students/wallet?studentId=" + studentId);

        const data = await response.json();

        if (data.success && data.balance >= orderAmount) {

            walletBtn.style.display = "flex";

            const labelEl =
                document.getElementById("payOrderWalletBalanceLabel");

            if (labelEl) {
                labelEl.textContent =
                    typeof formatMoney === "function" ? formatMoney(data.balance) : "₦" + data.balance;
            }

        } else {

            walletBtn.style.display = "none";

        }

    } catch (error) {

        console.error("Check wallet balance error:", error);

    }

}

const payOrderWithWalletButton =
    document.getElementById("payOrderWithWalletButton");

if (payOrderWithWalletButton) {

    payOrderWithWalletButton.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("orderPaymentStatus");

        if (!currentOrderPaymentReference) return;

        const student =
            getStoredStudent();

        if (!student) return;

        payOrderWithWalletButton.disabled = true;

        if (statusEl) statusEl.textContent = "Paying from your wallet...";

        try {

            const response =
                await fetch(
                    API_URL + "/api/orders/pay/wallet",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            paymentReference: currentOrderPaymentReference,
                            studentId: student.id
                        })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "Payment failed.";
                payOrderWithWalletButton.disabled = false;
                return;

            }

            if (statusEl) statusEl.textContent = "Payment successful!";

            if (typeof window.clearKuriosCartAfterPayment === "function") {
                window.clearKuriosCartAfterPayment();
            }

            setTimeout(function () {

                if (typeof closeCartPanel === "function") closeCartPanel();
                window.location.hash = "orders";

            }, 1200);

        } catch (error) {

            console.error("Pay with wallet error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";
            payOrderWithWalletButton.disabled = false;

        }

    });

}


// =========================================================
// SUPPORT POOL (KSupport staff only)
// =========================================================

function initSupportPoolNav() {

    const student =
        getStoredStudent();

    const navItem =
        document.getElementById("chatNavSupportPool");

    if (!student || !navItem) return;

    if (student.is_support) {

        navItem.style.display = "flex";
        refreshSupportPoolBadge(student.id);

        setInterval(function () {
            refreshSupportPoolBadge(student.id);
        }, 20000);

    }

}

async function refreshSupportPoolBadge(studentId) {

    try {

        const response =
            await fetch(API_URL + "/api/support/pool?studentId=" + studentId);

        const data = await response.json();

        const badge =
            document.getElementById("supportPoolBadge");

        if (badge && data.success) {

            if (data.pool.length > 0) {

                badge.textContent = data.pool.length;
                badge.style.display = "inline-block";

            } else {

                badge.style.display = "none";

            }

        }

    } catch (error) {

        console.error("Refresh support pool badge error:", error);

    }

}

async function loadSupportPool() {

    const student =
        getStoredStudent();

    if (!student) return;

    const listEl =
        document.getElementById("supportPoolList");

    const emptyEl =
        document.getElementById("supportPoolEmpty");

    try {

        const response =
            await fetch(API_URL + "/api/support/pool?studentId=" + student.id);

        const data = await response.json();

        if (!data.success || !listEl) return;

        if (data.pool.length === 0) {

            listEl.innerHTML = "";
            if (emptyEl) emptyEl.style.display = "block";
            return;

        }

        if (emptyEl) emptyEl.style.display = "none";

        const statusMeta = {
            open: { label: "Unclaimed", color: "#dc2626", bg: "#fee2e2" },
            claimed: { label: "In Progress", color: "#b45309", bg: "#fef3c7" },
            resolved: { label: "Resolved", color: "#15803d", bg: "#dcfce7" },
            closed: { label: "Closed", color: "#6b7280", bg: "#f3f4f6" }
        };

        listEl.innerHTML =
            data.pool.map(function (item) {

                const fullName =
                    `${item.first_name || ""} ${item.last_name || ""}`.trim() || "Kurios Student";

                const preview =
                    item.last_message ? item.last_message.slice(0, 60) : "New support request";

                const meta =
                    statusMeta[item.support_status] || statusMeta.open;

                const claimedByLine =
                    item.claimed_by_id ?
                        `<span class="support-pool-claimed-by">Picked up by ${item.claimed_by_first_name || "a staffer"} ${item.claimed_by_last_name || ""}</span>` :
                        "";

                const isMine =
                    String(item.claimed_by_id) === String(student.id);

                const actionButton =
                    item.support_status === "open" ?
                        `<button type="button" class="support-pool-claim-btn" data-claim-id="${item.conversation_id}" data-claim-name="${fullName}" data-claim-student-id="${item.student_id}">Pick Up</button>` :
                        (item.support_status === "claimed" && isMine ?
                            `<button type="button" class="support-pool-claim-btn continue" data-continue-id="${item.conversation_id}" data-claim-name="${fullName}" data-claim-student-id="${item.student_id}">Continue</button>` :
                            ((item.support_status === "closed" || item.support_status === "resolved") ?
                                `<button type="button" class="support-pool-claim-btn reopen" data-reopen-id="${item.conversation_id}" data-claim-name="${fullName}" data-claim-student-id="${item.student_id}">Reopen</button>` :
                                ""));

                return `
                    <div class="support-pool-card">
                        <div class="support-pool-card-info">
                            <div class="support-pool-card-top">
                                <strong>${fullName}</strong>
                                <span class="support-pool-ticket-badge" style="background:${meta.bg}; color:${meta.color};">${meta.label}</span>
                            </div>
                            <span class="support-pool-ticket-number">Ticket ${item.ticket_number || "—"}</span>
                            <span>${preview}</span>
                            ${claimedByLine}
                        </div>
                        ${actionButton}
                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error("Load support pool error:", error);

    }

}

function switchToKChatView() {

    document.getElementById("chatSidebar")?.classList.remove("hidden-by-pool");

    const poolPanel = document.getElementById("supportPoolPanel");
    if (poolPanel) poolPanel.style.display = "none";

    document.querySelectorAll(".chat-sidebar, .chat-window").forEach(function (el) {
        el.style.display = "";
    });

    document.getElementById("chatNavKChat")?.classList.add("active");
    document.getElementById("chatNavSupportPool")?.classList.remove("active");

}

function switchToSupportPoolView() {

    document.querySelectorAll(".chat-sidebar, .chat-window").forEach(function (el) {
        el.style.display = "none";
    });

    const poolPanel = document.getElementById("supportPoolPanel");
    if (poolPanel) poolPanel.style.display = "block";

    document.getElementById("chatNavKChat")?.classList.remove("active");
    document.getElementById("chatNavSupportPool")?.classList.add("active");

    loadSupportPool();

}

const chatNavKChat =
    document.getElementById("chatNavKChat");

if (chatNavKChat) {
    chatNavKChat.addEventListener("click", switchToKChatView);
}

const chatNavSupportPool =
    document.getElementById("chatNavSupportPool");

if (chatNavSupportPool) {
    chatNavSupportPool.addEventListener("click", switchToSupportPoolView);
}

const supportPoolListEl =
    document.getElementById("supportPoolList");

if (supportPoolListEl) {

    supportPoolListEl.addEventListener("click", async function (event) {

        const claimBtn =
            event.target.closest("[data-claim-id]");

        const reopenBtn =
            event.target.closest("[data-reopen-id]");

        const continueBtn =
            event.target.closest("[data-continue-id]");

        if (continueBtn) {

            switchToKChatView();

            if (typeof loadConversations === "function") {
                loadConversations();
            }

            if (typeof openChatWith === "function") {

                openChatWith(
                    parseInt(continueBtn.dataset.claimStudentId, 10),
                    continueBtn.dataset.claimName,
                    parseInt(continueBtn.dataset.continueId, 10),
                    "__SUPPORT__"
                );

            }

            return;

        }

        const btn = claimBtn || reopenBtn;

        if (!btn) return;

        const isReopen = !!reopenBtn;

        const student =
            getStoredStudent();

        if (!student) return;

        const targetId =
            isReopen ? btn.dataset.reopenId : btn.dataset.claimId;

        const endpoint =
            isReopen ?
                "/api/support/" + targetId + "/reopen" :
                "/api/support/pool/" + targetId + "/claim";

        btn.disabled = true;
        btn.textContent = isReopen ? "Reopening..." : "Picking up...";

        try {

            const response =
                await fetch(
                    API_URL + endpoint,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                alert(data.message || "Could not update this ticket.");
                btn.disabled = false;
                btn.textContent = isReopen ? "Reopen" : "Pick Up";
                loadSupportPool();
                return;

            }

            switchToKChatView();

            if (typeof loadConversations === "function") {
                loadConversations();
            }

            if (typeof openChatWith === "function") {

                openChatWith(
                    parseInt(btn.dataset.claimStudentId, 10),
                    btn.dataset.claimName,
                    data.conversationId,
                    "__SUPPORT__"
                );

            }

            refreshSupportPoolBadge(student.id);

        } catch (error) {

            console.error("Ticket pool action error:", error);
            alert("Unable to connect to Kurios Stores server.");
            btn.disabled = false;
            btn.textContent = isReopen ? "Reopen" : "Pick Up";

        }

    });

}

async function handleTicketAction(action, confirmMessage) {

    if (!window.activeConversationId) return;

    if (!confirm(confirmMessage)) {
        return;
    }

    const student =
        getStoredStudent();

    if (!student) return;

    try {

        const response =
            await fetch(
                API_URL + "/api/support/" + window.activeConversationId + "/" + action,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: student.id })
                }
            );

        const data = await response.json();

        if (!data.success) {

            alert(data.message || "Could not update this ticket.");
            return;

        }

        if (action === "close") {

            const resolveBtn = document.getElementById("resolveTicketBtn");
            const closeBtn = document.getElementById("closeTicketBtn");
            const transferBtn = document.getElementById("transferTicketBtn");

            if (resolveBtn) resolveBtn.style.display = "none";
            if (closeBtn) closeBtn.style.display = "none";
            if (transferBtn) transferBtn.style.display = "none";

        }

        if (action === "transfer") {

            // The staffer is no longer a participant once
            // transferred — the open chat window is no
            // longer theirs to view, so send them back to
            // the pool instead of leaving them on it.

            switchToSupportPoolView();

        }

        if (typeof loadConversations === "function") {
            loadConversations();
        }

    } catch (error) {

        console.error("Ticket action error:", error);
        alert("Unable to connect to Kurios Stores server.");

    }

}

const resolveTicketBtn =
    document.getElementById("resolveTicketBtn");

if (resolveTicketBtn) {

    resolveTicketBtn.addEventListener("click", function () {

        handleTicketAction(
            "resolve",
            "Mark this ticket as resolved? The student will be notified."
        );

    });

}

const closeTicketBtn =
    document.getElementById("closeTicketBtn");

if (closeTicketBtn) {

    closeTicketBtn.addEventListener("click", function () {

        handleTicketAction(
            "close",
            "Close this ticket? The student can always start a new request later."
        );

    });

}

const transferTicketBtn =
    document.getElementById("transferTicketBtn");

if (transferTicketBtn) {

    transferTicketBtn.addEventListener("click", function () {

        handleTicketAction(
            "transfer",
            "Transfer this ticket back to the support pool for another staffer to pick up?"
        );

    });

}

document.addEventListener("DOMContentLoaded", function () {
    initSupportPoolNav();
});


// =========================================================
// SELLER PAYOUTS
// =========================================================

async function loadPayoutHistory(studentId) {

    const listEl =
        document.getElementById("payoutHistoryList");

    const emptyEl =
        document.getElementById("payoutHistoryEmpty");

    if (!listEl) return;

    try {

        const response =
            await fetch(API_URL + "/api/sellers/payouts?studentId=" + studentId);

        const data = await response.json();

        if (!data.success) return;

        if (data.payouts.length === 0) {

            listEl.innerHTML = "";
            if (emptyEl) emptyEl.style.display = "block";
            return;

        }

        if (emptyEl) emptyEl.style.display = "none";

        listEl.innerHTML =
            data.payouts.map(function (p) {

                const amountLabel =
                    typeof formatMoney === "function" ? formatMoney(p.amount) : "₦" + p.amount;

                const dateLabel =
                    new Date(p.requested_at).toLocaleDateString(
                        [],
                        { day: "numeric", month: "short", year: "numeric" }
                    );

                return `
                    <div class="payout-row">
                        <div class="payout-row-info">
                            <strong>${amountLabel}</strong>
                            <span>${p.bank_name} •••• ${(p.bank_account_number || "").slice(-4)} — ${dateLabel}</span>
                        </div>
                        <span class="payout-status-pill ${p.status}">${p.status}</span>
                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error("Load payout history error:", error);

    }

}

function openPayoutModal() {

    const statusEl =
        document.getElementById("payoutStatus");

    if (statusEl) statusEl.textContent = "";

    ["payoutAmountInput", "payoutBankNameInput", "payoutAccountNumberInput", "payoutAccountNameInput"].forEach(function (id) {

        const el = document.getElementById(id);
        if (el) el.value = "";

    });

    const modal =
        document.getElementById("payoutModal");

    if (modal) modal.classList.add("open");

}

function closePayoutModal() {

    const modal =
        document.getElementById("payoutModal");

    if (modal) modal.classList.remove("open");

}

const openPayoutButton =
    document.getElementById("openPayoutButton");

if (openPayoutButton) {
    openPayoutButton.addEventListener("click", openPayoutModal);
}

const payoutCancelBtn =
    document.getElementById("payoutCancelBtn");

if (payoutCancelBtn) {
    payoutCancelBtn.addEventListener("click", closePayoutModal);
}

const payoutSubmitBtn =
    document.getElementById("payoutSubmitBtn");

if (payoutSubmitBtn) {

    payoutSubmitBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("payoutStatus");

        const amount =
            Number(document.getElementById("payoutAmountInput").value);

        const bankName =
            document.getElementById("payoutBankNameInput").value.trim();

        const accountNumber =
            document.getElementById("payoutAccountNumberInput").value.trim();

        const accountName =
            document.getElementById("payoutAccountNameInput").value.trim();

        if (!amount || amount < 100) {
            if (statusEl) statusEl.textContent = "Please enter at least ₦100.";
            return;
        }

        if (!bankName || !accountNumber || !accountName) {
            if (statusEl) statusEl.textContent = "Please fill in all your bank details.";
            return;
        }

        const student =
            getStoredStudent();

        if (!student) return;

        payoutSubmitBtn.disabled = true;

        if (statusEl) statusEl.textContent = "";

        try {

            const response =
                await fetch(
                    API_URL + "/api/sellers/payout/request",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentId: student.id,
                            amount: amount,
                            bankName: bankName,
                            bankAccountNumber: accountNumber,
                            bankAccountName: accountName
                        })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "Could not submit your request.";
                payoutSubmitBtn.disabled = false;
                return;

            }

            closePayoutModal();

            if (typeof loadWalletPage === "function") {
                loadWalletPage();
            }

        } catch (error) {

            console.error("Submit payout error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            payoutSubmitBtn.disabled = false;

        }

    });

}


// =========================================================
// WISHLIST
// =========================================================

async function toggleWishlist(productId, buttonEl) {

    const student =
        typeof getLoggedInStudent === "function" ? getLoggedInStudent() : null;

    if (!student) {

        if (typeof openSignInModalStandalone === "function") {
            openSignInModalStandalone();
        }

        return;

    }

    if (buttonEl) {
        buttonEl.disabled = true;
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/wishlist/toggle",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: student.id, productId: productId })
                }
            );

        const data = await response.json();

        if (!data.success) {

            if (typeof showMessage === "function") {
                showMessage(data.message || "Could not update your wishlist.", "error");
            }

            return;

        }

        if (!window.__kuriosWishlistIds) {
            window.__kuriosWishlistIds = new Set();
        }

        if (data.inWishlist) {
            window.__kuriosWishlistIds.add(productId);
        } else {
            window.__kuriosWishlistIds.delete(productId);
        }

        if (buttonEl) {

            const icon = buttonEl.querySelector("i");

            if (data.inWishlist) {

                buttonEl.classList.add("active");
                if (icon) icon.className = "fa-solid fa-heart";

            } else {

                buttonEl.classList.remove("active");
                if (icon) icon.className = "fa-regular fa-heart";

            }

        }

        if (typeof showMessage === "function") {

            showMessage(
                data.inWishlist ? "Saved to your wishlist." : "Removed from your wishlist."
            );

        }

        if (window.location.hash === "#wishlist" && typeof loadWishlistPage === "function") {
            loadWishlistPage();
        }

    } catch (error) {

        console.error("Toggle wishlist error:", error);

        if (typeof showMessage === "function") {
            showMessage("Unable to connect to Kurios Stores server.", "error");
        }

    } finally {

        if (buttonEl) {
            buttonEl.disabled = false;
        }

    }

}

async function loadWishlistPage() {

    const student =
        typeof getLoggedInStudent === "function" ? getLoggedInStudent() : null;

    const panel =
        document.getElementById("wishlistPagePanel");

    if (!panel) return;

    if (!student) {

        panel.innerHTML = `
            <div class="coming-soon-panel">
                <i class="fa-regular fa-heart"></i>
                <h2>Sign in to see your wishlist</h2>
                <p>Save products you love and find them here anytime.</p>
            </div>
        `;

        return;

    }

    panel.innerHTML = `<p class="reset-passcode-intro">Loading your wishlist...</p>`;

    try {

        const response =
            await fetch(API_URL + "/api/wishlist?studentId=" + student.id);

        const data = await response.json();

        if (!data.success || data.items.length === 0) {

            panel.innerHTML = `
                <div class="coming-soon-panel">
                    <i class="fa-regular fa-heart"></i>
                    <h2>Your wishlist is empty</h2>
                    <p>Tap the heart on any product to save it for later.</p>
                </div>
            `;

            return;

        }

        panel.innerHTML = `<div class="wishlist-grid" id="wishlistGrid"></div>`;

        const grid =
            document.getElementById("wishlistGrid");

        data.items.forEach(function (product) {

            const card = document.createElement("article");
            card.className = "product-card";

            const imageMarkup =
                product.image_url ?
                    `<img src="${API_URL + product.image_url}" alt="${product.name}">` :
                    `<i class="fa-solid fa-box"></i>`;

            const soldByMarkup =
                product.seller_id ?
                    `<span class="product-sold-by">Sold by ${product.seller_store_name || "a Kurios seller"}</span>` :
                    `<p>Available at Kurios Stores.</p>`;

            card.innerHTML = `
                <div class="product-image">${imageMarkup}</div>
                <div class="product-info">
                    <span class="product-category">${product.category || "General"}</span>
                    <h3>${product.name}</h3>
                    ${soldByMarkup}
                    <div class="product-bottom">
                        <strong>${typeof formatMoney === "function" ? formatMoney(product.price) : "₦" + product.price}</strong>
                        <div style="display:flex; gap:6px;">
                            <button class="wishlist-toggle-btn active" data-product-id="${product.id}" title="Remove from wishlist">
                                <i class="fa-solid fa-heart"></i>
                            </button>
                            <button class="add-to-cart" data-product-id="${product.id}">
                                <i class="fa-solid fa-plus"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            `;

            const removeBtn =
                card.querySelector(".wishlist-toggle-btn");

            removeBtn.addEventListener("click", function () {
                toggleWishlist(product.id, removeBtn);
            });

            const addBtn =
                card.querySelector(".add-to-cart");

            addBtn.addEventListener("click", function () {

                if (typeof addToCart === "function") {
                    addToCart(product);
                }

            });

            grid.appendChild(card);

        });

    } catch (error) {

        console.error("Load wishlist page error:", error);

        panel.innerHTML = `<p class="reset-passcode-intro">Could not load your wishlist. Please try again.</p>`;

    }

}

async function loadDashboardWishlistCount(studentId) {

    const countEl =
        document.getElementById("dashboardWishlistCount");

    if (!countEl) return;

    try {

        const response =
            await fetch(API_URL + "/api/wishlist/ids?studentId=" + studentId);

        const data = await response.json();

        if (data.success) {
            countEl.textContent = data.productIds.length;
        }

    } catch (error) {

        console.error("Load dashboard wishlist count error:", error);

    }

}


// =========================================================
// BLOCK / REPORT
// =========================================================

const blockStudentBtn =
    document.getElementById("blockStudentBtn");

if (blockStudentBtn) {

    blockStudentBtn.addEventListener("click", async function () {

        if (!window.activeChatPartnerId) return;

        if (!confirm("Block this student? They won't be able to message you, and you won't be able to message them.")) {
            return;
        }

        const student =
            getStoredStudent();

        if (!student) return;

        try {

            const response =
                await fetch(
                    API_URL + "/api/students/block",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentId: student.id,
                            blockedId: window.activeChatPartnerId
                        })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (typeof showMessage === "function") {
                    showMessage(data.message || "Could not block this student.", "error");
                }

                return;

            }

            if (typeof showMessage === "function") {
                showMessage("Student blocked.");
            }

            if (typeof goBack === "function") {
                goBack();
            }

            if (typeof loadConversations === "function") {
                loadConversations();
            }

        } catch (error) {

            console.error("Block student error:", error);

            if (typeof showMessage === "function") {
                showMessage("Unable to connect to Kurios Stores server.", "error");
            }

        }

    });

}

let __kuriosReportTargetId = null;

const reportStudentBtn =
    document.getElementById("reportStudentBtn");

if (reportStudentBtn) {

    reportStudentBtn.addEventListener("click", function () {

        if (!window.activeChatPartnerId) return;

        __kuriosReportTargetId = window.activeChatPartnerId;

        document.getElementById("reportReasonSelect").value = "";
        document.getElementById("reportDetailsInput").value = "";

        const statusEl =
            document.getElementById("reportStatus");

        if (statusEl) statusEl.textContent = "";

        const modal =
            document.getElementById("reportStudentModal");

        if (modal) modal.classList.add("open");

    });

}

const reportCancelBtn =
    document.getElementById("reportCancelBtn");

if (reportCancelBtn) {

    reportCancelBtn.addEventListener("click", function () {

        const modal =
            document.getElementById("reportStudentModal");

        if (modal) modal.classList.remove("open");

        __kuriosReportTargetId = null;

    });

}

const reportSubmitBtn =
    document.getElementById("reportSubmitBtn");

if (reportSubmitBtn) {

    reportSubmitBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("reportStatus");

        const reason =
            document.getElementById("reportReasonSelect").value;

        const details =
            document.getElementById("reportDetailsInput").value.trim();

        if (!reason) {

            if (statusEl) statusEl.textContent = "Please select a reason.";
            return;

        }

        if (!__kuriosReportTargetId) return;

        const student =
            getStoredStudent();

        if (!student) return;

        reportSubmitBtn.disabled = true;

        if (statusEl) statusEl.textContent = "";

        try {

            const response =
                await fetch(
                    API_URL + "/api/students/report",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentId: student.id,
                            reportedId: __kuriosReportTargetId,
                            reason: reason,
                            details: details
                        })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "Could not submit your report.";
                reportSubmitBtn.disabled = false;
                return;

            }

            const modal =
                document.getElementById("reportStudentModal");

            if (modal) modal.classList.remove("open");

            __kuriosReportTargetId = null;

            if (typeof showMessage === "function") {
                showMessage("Report submitted. Thank you for letting us know.");
            }

        } catch (error) {

            console.error("Submit report error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            reportSubmitBtn.disabled = false;

        }

    });

}


// =========================================================
// ERRANDS
// =========================================================

let __kuriosErrandModeOn = false;
let __kuriosErrandPaymentReference = null;

async function loadErrandsPage() {

    const student =
        getStoredStudent();

    if (!student) return;

    try {

        const response =
            await fetch(API_URL + "/api/students/errand-mode?studentId=" + student.id);

        const data = await response.json();

        if (data.success) {

            updateErrandModeUI(data.available);

            if (data.available && typeof startErrandLocationPing === "function") {
                startErrandLocationPing();
            }

            const registerBanner =
                document.getElementById("errandAgentRegisterBanner");

            const modeCard =
                document.getElementById("errandModeCard");

            if (registerBanner) {
                registerBanner.style.display = data.isRegistered ? "none" : "flex";
            }

            if (modeCard) {
                modeCard.style.display = data.isRegistered ? "flex" : "none";
            }

        }

    } catch (error) {

        console.error("Load errand mode status error:", error);

    }

    try {

        const craftResponse =
            await fetch(API_URL + "/api/craft-providers/status?studentId=" + student.id);

        const craftData = await craftResponse.json();

        const craftBanner =
            document.getElementById("craftRegisterBanner");

        const dashboardSection =
            document.getElementById("craftDashboardSection");

        if (craftBanner && craftData.success) {

            craftBanner.style.display = craftData.isRegistered ? "none" : "flex";

        }

        if (dashboardSection) {

            dashboardSection.style.display = craftData.success && craftData.isRegistered ? "block" : "none";

            if (craftData.success && craftData.isRegistered) {
                loadCraftDashboard();
                loadMyCraftJobs();
            }

        }

    } catch (error) {

        console.error("Load craft provider status error:", error);

    }

    loadMyErrands();
    loadMyErrandTasks();
    loadMyCraftRequests();

}

function updateErrandModeUI(isOn) {

    __kuriosErrandModeOn = isOn;

    const dot = document.getElementById("errandModeStatusDot");
    const text = document.getElementById("errandModeStatusText");
    const sub = document.getElementById("errandModeStatusSub");
    const btn = document.getElementById("errandModeToggleBtn");
    const poolSection = document.getElementById("errandPoolSection");
    const durationChoice = document.getElementById("errandDurationChoice");

    if (dot) dot.classList.toggle("active", isOn);

    if (text) {
        text.textContent = isOn ? "You're available" : "You're unavailable";
    }

    if (sub) {

        sub.textContent = isOn ?
            "You can see and accept available errands." :
            "Turn on Errand Mode to see and accept errands.";

    }

    if (btn) {

        btn.textContent = isOn ? "Go Unavailable" : "Go Available";
        btn.classList.toggle("on", isOn);

    }

    if (poolSection) {
        poolSection.style.display = isOn ? "block" : "none";
    }

    if (durationChoice && isOn) {
        durationChoice.style.display = "none";
    }

}

const errandModeToggleBtn =
    document.getElementById("errandModeToggleBtn");

if (errandModeToggleBtn) {

    errandModeToggleBtn.addEventListener("click", async function () {

        if (__kuriosErrandModeOn) {

            await setErrandMode(false, null);
            return;

        }

        const durationChoice =
            document.getElementById("errandDurationChoice");

        if (durationChoice) {

            durationChoice.style.display =
                durationChoice.style.display === "none" ? "block" : "none";

        }

    });

}

document.querySelectorAll(".errand-duration-btn").forEach(function (btn) {

    btn.addEventListener("click", function () {

        const minutes =
            btn.dataset.minutes;

        setErrandMode(true, minutes || null);

    });

});

function getCurrentGeolocation() {

    return new Promise(function (resolve) {

        if (!navigator.geolocation) {
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            function (position) {

                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });

            },
            function () {
                resolve(null);
            },
            { timeout: 8000, maximumAge: 60000 }
        );

    });

}

let __kuriosLocationPingInterval = null;

function startErrandLocationPing() {

    stopErrandLocationPing();

    __kuriosLocationPingInterval = setInterval(async function () {

        const student =
            getStoredStudent();

        if (!student) return;

        const position =
            await getCurrentGeolocation();

        if (!position) return;

        fetch(
            API_URL + "/api/students/location",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: student.id,
                    lat: position.lat,
                    lng: position.lng
                })
            }
        ).catch(function (error) {
            console.error("Location ping error:", error);
        });

    }, 30000);

}

function stopErrandLocationPing() {

    if (__kuriosLocationPingInterval) {
        clearInterval(__kuriosLocationPingInterval);
        __kuriosLocationPingInterval = null;
    }

}

async function setErrandMode(available, durationMinutes) {

    const student =
        getStoredStudent();

    if (!student) return;

    try {

        const position =
            available ? await getCurrentGeolocation() : null;

        const response =
            await fetch(
                API_URL + "/api/students/errand-mode",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        studentId: student.id,
                        available: available,
                        durationMinutes: durationMinutes,
                        lat: position ? position.lat : null,
                        lng: position ? position.lng : null
                    })
                }
            );

        const data = await response.json();

        if (!data.success) {

            if (typeof showMessage === "function") {
                showMessage(data.message || "Could not update Errand Mode.", "error");
            }

            return;

        }

        updateErrandModeUI(available);

        if (available) {

            loadErrandPool();
            startErrandLocationPing();

        } else {

            stopErrandLocationPing();

        }

    } catch (error) {

        console.error("Set errand mode error:", error);

        if (typeof showMessage === "function") {
            showMessage("Unable to connect to Kurios Stores server.", "error");
        }

    }

}

async function loadErrandPool(sort) {

    const student =
        getStoredStudent();

    if (!student) return;

    const listEl = document.getElementById("errandPoolList");
    const emptyEl = document.getElementById("errandPoolEmpty");

    if (!listEl) return;

    try {

        const sortParam =
            sort === "fee" ? "&sort=fee" : "";

        const response =
            await fetch(API_URL + "/api/errands/pool?studentId=" + student.id + sortParam);

        const data = await response.json();

        if (!data.success || data.errands.length === 0) {

            listEl.innerHTML = "";
            if (emptyEl) emptyEl.style.display = "block";
            return;

        }

        if (emptyEl) emptyEl.style.display = "none";

        listEl.innerHTML =
            data.errands.map(function (errand) {

                const distanceMarkup =
                    errand.distance_km !== undefined && errand.distance_km !== null ?
                        `<span class="errand-distance-pill"><i class="fa-solid fa-location-crosshairs"></i> ${errand.distance_km.toFixed(1)} km away</span>` :
                        "";

                return `
                    <div class="errand-card">
                        <div class="errand-card-top">
                            <div>
                                <h4>${escapeChatTextGlobal(errand.title)}</h4>
                                <span>${errand.errand_code}</span>
                            </div>
                            <div class="errand-card-fee">${typeof formatMoney === "function" ? formatMoney(errand.errand_fee) : "₦" + errand.errand_fee}</div>
                        </div>
                        <div class="errand-card-route">
                            <div><i class="fa-solid fa-location-dot"></i> ${escapeChatTextGlobal(errand.pickup_location)}</div>
                            <div><i class="fa-solid fa-flag-checkered"></i> ${escapeChatTextGlobal(errand.destination)}</div>
                        </div>
                        ${distanceMarkup}
                        <button type="button" class="errand-accept-btn" data-errand-id="${errand.id}">Accept Errand</button>
                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error("Load errand pool error:", error);

    }

}

const errandPoolListEl =
    document.getElementById("errandPoolList");

if (errandPoolListEl) {

    errandPoolListEl.addEventListener("click", async function (event) {

        const btn =
            event.target.closest("[data-errand-id]");

        if (!btn) return;

        const student =
            getStoredStudent();

        if (!student) return;

        btn.disabled = true;
        btn.textContent = "Accepting...";

        try {

            const response =
                await fetch(
                    API_URL + "/api/errands/" + btn.dataset.errandId + "/accept",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (typeof showMessage === "function") {
                    showMessage(data.message || "Could not accept this errand.", "error");
                }

                loadErrandPool();
                return;

            }

            if (typeof showMessage === "function") {
                showMessage("Errand accepted! Opening chat with the requester.");
            }

            loadErrandPool();
            loadMyErrands();

            if (data.errand.conversation_id && typeof openChatWith === "function") {

                window.location.hash = "chat";

                setTimeout(function () {

                    openChatWith(
                        data.errand.student_id,
                        "Errand requester",
                        data.errand.conversation_id,
                        null
                    );

                }, 400);

            }

        } catch (error) {

            console.error("Accept errand error:", error);

            if (typeof showMessage === "function") {
                showMessage("Unable to connect to Kurios Stores server.", "error");
            }

            btn.disabled = false;
            btn.textContent = "Accept Errand";

        }

    });

}

async function loadMyErrands() {

    const student =
        getStoredStudent();

    if (!student) return;

    const listEl = document.getElementById("myErrandsList");
    const emptyEl = document.getElementById("myErrandsEmpty");

    if (!listEl) return;

    try {

        const response =
            await fetch(API_URL + "/api/errands/my?studentId=" + student.id);

        const data = await response.json();

        if (!data.success || data.errands.length === 0) {

            listEl.innerHTML = "";
            if (emptyEl) emptyEl.style.display = "block";
            return;

        }

        if (emptyEl) emptyEl.style.display = "none";

        listEl.innerHTML =
            data.errands.map(function (errand) {

                const otpMarkup =
                    errand.agent_id && !["completed", "cancelled", "failed"].includes(errand.status) ?
                        `<div class="errand-otp-display">
                            <span>Delivery code — give this to your agent</span>
                            <strong>${errand.delivery_otp}</strong>
                        </div>` :
                        "";

                const payItemCostMarkup =
                    errand.item_cost_status === "awaiting_payment" ?
                        `<button type="button" class="errand-accept-btn" data-pay-item-cost-id="${errand.id}" data-pay-item-cost-amount="${errand.item_cost}">
                            Pay Item Cost (₦${Number(errand.item_cost).toLocaleString()})
                        </button>` :
                        "";

                const cancellableStatuses =
                    ["pending", "available", "accepted", "in_progress", "picked_up"];

                const cancelMarkup =
                    cancellableStatuses.includes(errand.status) ?
                        `<button type="button" class="errand-accept-btn secondary" data-cancel-errand-id="${errand.id}">Cancel Errand</button>` :
                        "";

                const rateMarkup =
                    errand.status === "completed" && !errand.rating ?
                        `<button type="button" class="errand-accept-btn" data-rate-errand-id="${errand.id}">Rate Your Agent</button>` :
                        "";

                const trackMarkup =
                    ["in_progress", "picked_up", "on_way", "arrived"].includes(errand.status) ?
                        `<button type="button" class="errand-accept-btn secondary" data-track-errand-id="${errand.id}"><i class="fa-solid fa-location-crosshairs"></i> Track Agent</button>` :
                        "";

                return `
                    <div class="errand-card">
                        <div class="errand-card-top">
                            <div>
                                <h4>${escapeChatTextGlobal(errand.title)}</h4>
                                <span>${errand.errand_code}</span>
                            </div>
                            <span class="errand-status-pill ${errand.status}">${errand.status.replace(/_/g, " ")}</span>
                        </div>
                        <div class="errand-card-route">
                            <div><i class="fa-solid fa-location-dot"></i> ${escapeChatTextGlobal(errand.pickup_location)}</div>
                            <div><i class="fa-solid fa-flag-checkered"></i> ${escapeChatTextGlobal(errand.destination)}</div>
                        </div>
                        ${otpMarkup}
                        ${payItemCostMarkup}
                        ${trackMarkup}
                        ${rateMarkup}
                        ${cancelMarkup}
                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error("Load my errands error:", error);

    }

}

const openErrandRequestButton =
    document.getElementById("openErrandRequestButton");

if (openErrandRequestButton) {

    openErrandRequestButton.addEventListener("click", function () {

        document.getElementById("errandRequestStep").style.display = "block";
        document.getElementById("errandPaymentStep").style.display = "none";

        ["errandTitleInput", "errandPickupInput", "errandDestinationInput", "errandDescriptionInput", "errandItemCostInput", "errandFeeInput"].forEach(function (id) {

            const el = document.getElementById(id);
            if (el) el.value = "";

        });

        const statusEl = document.getElementById("errandRequestStatus");
        if (statusEl) statusEl.textContent = "";

        const modal = document.getElementById("errandRequestModal");
        if (modal) modal.classList.add("open");

    });

}

const errandRequestCancelBtn =
    document.getElementById("errandRequestCancelBtn");

if (errandRequestCancelBtn) {

    errandRequestCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("errandRequestModal");
        if (modal) modal.classList.remove("open");

        __kuriosErrandPaymentReference = null;

    });

}

const errandRequestContinueBtn =
    document.getElementById("errandRequestContinueBtn");

if (errandRequestContinueBtn) {

    errandRequestContinueBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("errandRequestStatus");

        const title =
            document.getElementById("errandTitleInput").value.trim();

        const pickup =
            document.getElementById("errandPickupInput").value.trim();

        const destination =
            document.getElementById("errandDestinationInput").value.trim();

        const description =
            document.getElementById("errandDescriptionInput").value.trim();

        const itemCost =
            document.getElementById("errandItemCostInput").value;

        const errandFee =
            document.getElementById("errandFeeInput").value;

        if (!title || !pickup || !destination || !errandFee) {

            if (statusEl) statusEl.textContent = "Please fill in all required fields.";
            return;

        }

        if (Number(errandFee) < 100) {

            if (statusEl) statusEl.textContent = "Errand fee must be at least ₦100.";
            return;

        }

        const student =
            getStoredStudent();

        if (!student) return;

        errandRequestContinueBtn.disabled = true;

        if (statusEl) statusEl.textContent = "";

        try {

            const response =
                await fetch(
                    API_URL + "/api/errands/create",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentId: student.id,
                            title: title,
                            pickupLocation: pickup,
                            destination: destination,
                            description: description,
                            itemCost: itemCost || 0,
                            errandFee: errandFee
                        })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "Could not create your errand request.";
                errandRequestContinueBtn.disabled = false;
                return;

            }

            __kuriosErrandPaymentReference = data.errand.payment_reference;

            document.getElementById("errandRequestStep").style.display = "none";
            document.getElementById("errandPaymentStep").style.display = "block";

            checkAndShowWalletButton("errandPayWalletBtn", "errandPayWalletBalanceLabel", data.errand.errand_fee);

        } catch (error) {

            console.error("Create errand error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            errandRequestContinueBtn.disabled = false;

        }

    });

}

async function payErrandWith(gateway) {

    const statusEl =
        document.getElementById("errandPaymentStatus");

    if (!__kuriosErrandPaymentReference) return;

    const student =
        getStoredStudent();

    if (!student) return;

    if (statusEl) statusEl.textContent = "Redirecting to " + gateway + "...";

    const returnUrl =
        window.location.origin + "/#errands";

    try {

        if (gateway === "monnify") {

            const response =
                await fetch(
                    API_URL + "/api/errands/pay/monnify",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paymentReference: __kuriosErrandPaymentReference })
                    }
                );

            const data = await response.json();

            if (!data.success || typeof MonnifySDK === "undefined" || !data.apiKey) {

                if (statusEl) {

                    statusEl.textContent =
                        (!data.success && data.message) ||
                        "Monnify is not fully configured yet. Try OPay or Paystack instead.";

                }

                return;

            }

            const modal = document.getElementById("errandRequestModal");
            if (modal) modal.classList.remove("open");

            MonnifySDK.initialize({

                amount: data.amount,
                currency: "NGN",
                reference: __kuriosErrandPaymentReference,
                customerFullName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                customerEmail: student.email,
                apiKey: data.apiKey,
                contractCode: data.contractCode,
                paymentDescription: "Kurios Stores errand",

                onComplete: async function () {

                    const verifyResult =
                        await verifyPaymentWithRetry(
                            "/api/errands/verify",
                            { paymentReference: __kuriosErrandPaymentReference }
                        );

                    if (typeof showMessage === "function") {

                        showMessage(
                            verifyResult.success ?
                                "Payment confirmed — your errand is now available to agents." :
                                verifyResult.message
                        );

                    }

                    loadMyErrands();

                },

                onClose: function () {}

            });

            return;

        }

        const endpoint =
            gateway === "opay" ? "/api/errands/pay/opay" : "/api/errands/pay/paystack";

        const response =
            await fetch(
                API_URL + endpoint,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        paymentReference: __kuriosErrandPaymentReference,
                        returnUrl: returnUrl,
                        customerName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                        customerEmail: student.email
                    })
                }
            );

        const data = await response.json();

        const redirectUrl =
            data.cashierUrl || data.authorizationUrl;

        if (!data.success || !redirectUrl) {

            if (statusEl) statusEl.textContent = data.message || ("Could not start " + gateway + " checkout.");
            return;

        }

        localStorage.setItem("kuriosPendingErrandRef", __kuriosErrandPaymentReference);

        window.location.href = redirectUrl;

    } catch (error) {

        console.error("Errand payment error:", error);

        if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

    }

}

["errandPayMonnifyBtn", "errandPayOpayBtn", "errandPayPaystackBtn"].forEach(function (id) {

    const btn = document.getElementById(id);

    if (btn) {

        btn.addEventListener("click", function () {

            const gateway =
                id === "errandPayMonnifyBtn" ? "monnify" :
                (id === "errandPayOpayBtn" ? "opay" : "paystack");

            payErrandWith(gateway);

        });

    }

});

// Resume errand payment verification if returning from
// OPay/Paystack's hosted checkout page.

document.addEventListener("DOMContentLoaded", function () {

    const pendingErrandRef =
        localStorage.getItem("kuriosPendingErrandRef");

    if (pendingErrandRef) {

        localStorage.removeItem("kuriosPendingErrandRef");

        verifyPaymentWithRetry(
            "/api/errands/verify",
            { paymentReference: pendingErrandRef }
        ).then(function (data) {

            if (typeof showMessage === "function") {

                showMessage(
                    data.success ?
                        "Payment confirmed — your errand is now available to agents." :
                        data.message
                );

            }

            if (typeof loadMyErrands === "function") {
                loadMyErrands();
            }

        }).catch(function (error) {
            console.error("Resume errand verify error:", error);
        });

    }

});


// =========================================================
// ERRANDS — MY ACTIVE TASKS (as agent) + EXECUTION FLOW
// =========================================================

const ERRAND_TASK_ACTION_LABEL = {
    accepted: { action: "start", label: "Start Errand" },
    in_progress: { action: "picked-up", label: "Mark Picked Up" },
    picked_up: { action: "on-way", label: "Mark On the Way" },
    on_way: { action: "arrived", label: "Mark Arrived" }
};

let __kuriosActiveErrandId = null;

async function loadMyErrandTasks() {

    const student =
        getStoredStudent();

    if (!student) return;

    const sectionEl = document.getElementById("myErrandTasksSection");
    const listEl = document.getElementById("myErrandTasksList");

    if (!listEl) return;

    try {

        const response =
            await fetch(API_URL + "/api/errands/my-tasks?studentId=" + student.id);

        const data = await response.json();

        if (!data.success || data.errands.length === 0) {

            if (sectionEl) sectionEl.style.display = "none";
            listEl.innerHTML = "";
            return;

        }

        if (sectionEl) sectionEl.style.display = "block";

        listEl.innerHTML =
            data.errands.map(function (errand) {

                const feeLabel =
                    typeof formatMoney === "function" ? formatMoney(errand.errand_fee) : "₦" + errand.errand_fee;

                const nextAction =
                    ERRAND_TASK_ACTION_LABEL[errand.status];

                const itemCostButton =
                    errand.item_cost_status === "none" ?
                        `<button type="button" class="errand-accept-btn secondary" data-report-cost-id="${errand.id}">Report Item Cost</button>` :
                        (errand.item_cost_status === "awaiting_payment" ?
                            `<p class="errand-waiting-note">Waiting on student to pay ₦${Number(errand.item_cost).toLocaleString()} item cost.</p>` :
                            "");

                const actionButton =
                    errand.status === "arrived" ?
                        `<button type="button" class="errand-accept-btn" data-confirm-delivery-id="${errand.id}">Confirm Delivery (Enter Code)</button>` :
                        (nextAction ?
                            `<button type="button" class="errand-accept-btn" data-transition-id="${errand.id}" data-transition-action="${nextAction.action}">${nextAction.label}</button>` :
                            "");

                const backOutButton =
                    ["accepted", "in_progress", "picked_up"].includes(errand.status) ?
                        `<button type="button" class="errand-accept-btn secondary" data-agent-cancel-id="${errand.id}">Back Out</button>` :
                        "";

                return `
                    <div class="errand-card">
                        <div class="errand-card-top">
                            <div>
                                <h4>${escapeChatTextGlobal(errand.title)}</h4>
                                <span>${errand.errand_code}</span>
                            </div>
                            <span class="errand-status-pill ${errand.status}">${errand.status.replace(/_/g, " ")}</span>
                        </div>
                        <div class="errand-card-route">
                            <div><i class="fa-solid fa-location-dot"></i> ${escapeChatTextGlobal(errand.pickup_location)}</div>
                            <div><i class="fa-solid fa-flag-checkered"></i> ${escapeChatTextGlobal(errand.destination)}</div>
                        </div>
                        <div class="errand-card-fee" style="margin-bottom:10px;">Your earnings: ${feeLabel}</div>
                        ${itemCostButton}
                        ${actionButton}
                        ${backOutButton}
                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error("Load my errand tasks error:", error);

    }

}

const myErrandTasksListEl =
    document.getElementById("myErrandTasksList");

if (myErrandTasksListEl) {

    myErrandTasksListEl.addEventListener("click", function (event) {

        const transitionBtn = event.target.closest("[data-transition-id]");
        const reportCostBtn = event.target.closest("[data-report-cost-id]");
        const confirmBtn = event.target.closest("[data-confirm-delivery-id]");
        const backOutBtn = event.target.closest("[data-agent-cancel-id]");

        if (transitionBtn) {
            runErrandTransition(transitionBtn.dataset.transitionId, transitionBtn.dataset.transitionAction, transitionBtn);
            return;
        }

        if (reportCostBtn) {
            openErrandItemCostModal(reportCostBtn.dataset.reportCostId);
            return;
        }

        if (confirmBtn) {
            openErrandOtpModal(confirmBtn.dataset.confirmDeliveryId);
            return;
        }

        if (backOutBtn) {
            agentCancelErrand(backOutBtn.dataset.agentCancelId);
            return;
        }

    });

}

async function runErrandTransition(errandId, action, btn) {

    const student =
        getStoredStudent();

    if (!student) return;

    if (btn) {
        btn.disabled = true;
        btn.textContent = "Updating...";
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/errands/" + errandId + "/" + action,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: student.id })
                }
            );

        const data = await response.json();

        if (!data.success) {

            if (typeof showMessage === "function") {
                showMessage(data.message || "Could not update this errand.", "error");
            }

        }

        loadMyErrandTasks();

    } catch (error) {

        console.error("Errand transition error:", error);

        if (typeof showMessage === "function") {
            showMessage("Unable to connect to Kurios Stores server.", "error");
        }

    }

}


// ---- Report item cost (agent) ----

function openErrandItemCostModal(errandId) {

    __kuriosActiveErrandId = errandId;

    document.getElementById("errandItemCostReportInput").value = "";

    const statusEl = document.getElementById("errandItemCostStatus");
    if (statusEl) statusEl.textContent = "";

    const modal = document.getElementById("errandItemCostModal");
    if (modal) modal.classList.add("open");

}

const errandItemCostCancelBtn =
    document.getElementById("errandItemCostCancelBtn");

if (errandItemCostCancelBtn) {

    errandItemCostCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("errandItemCostModal");
        if (modal) modal.classList.remove("open");

        __kuriosActiveErrandId = null;

    });

}

const errandItemCostSubmitBtn =
    document.getElementById("errandItemCostSubmitBtn");

if (errandItemCostSubmitBtn) {

    errandItemCostSubmitBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("errandItemCostStatus");

        const cost =
            document.getElementById("errandItemCostReportInput").value;

        if (!cost || Number(cost) <= 0) {

            if (statusEl) statusEl.textContent = "Please enter a valid amount.";
            return;

        }

        const student =
            getStoredStudent();

        if (!student || !__kuriosActiveErrandId) return;

        errandItemCostSubmitBtn.disabled = true;

        try {

            const response =
                await fetch(
                    API_URL + "/api/errands/" + __kuriosActiveErrandId + "/report-item-cost",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id, itemCost: cost })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "Could not report item cost.";
                errandItemCostSubmitBtn.disabled = false;
                return;

            }

            const modal = document.getElementById("errandItemCostModal");
            if (modal) modal.classList.remove("open");

            __kuriosActiveErrandId = null;

            if (typeof showMessage === "function") {
                showMessage("Item cost sent to the student.");
            }

            loadMyErrandTasks();

        } catch (error) {

            console.error("Report item cost error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            errandItemCostSubmitBtn.disabled = false;

        }

    });

}


// ---- Confirm delivery (agent enters OTP) ----

function openErrandOtpModal(errandId) {

    __kuriosActiveErrandId = errandId;

    document.getElementById("errandOtpInput").value = "";

    const statusEl = document.getElementById("errandOtpStatus");
    if (statusEl) statusEl.textContent = "";

    const modal = document.getElementById("errandOtpModal");
    if (modal) modal.classList.add("open");

}

const errandOtpCancelBtn =
    document.getElementById("errandOtpCancelBtn");

if (errandOtpCancelBtn) {

    errandOtpCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("errandOtpModal");
        if (modal) modal.classList.remove("open");

        __kuriosActiveErrandId = null;

    });

}

const errandOtpSubmitBtn =
    document.getElementById("errandOtpSubmitBtn");

if (errandOtpSubmitBtn) {

    errandOtpSubmitBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("errandOtpStatus");

        const otp =
            document.getElementById("errandOtpInput").value.trim();

        if (!otp || otp.length !== 4) {

            if (statusEl) statusEl.textContent = "Please enter the 4-digit code.";
            return;

        }

        const student =
            getStoredStudent();

        if (!student || !__kuriosActiveErrandId) return;

        errandOtpSubmitBtn.disabled = true;

        try {

            const response =
                await fetch(
                    API_URL + "/api/errands/" + __kuriosActiveErrandId + "/confirm-delivery",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id, otp: otp })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "That code doesn't match.";
                errandOtpSubmitBtn.disabled = false;
                return;

            }

            const modal = document.getElementById("errandOtpModal");
            if (modal) modal.classList.remove("open");

            __kuriosActiveErrandId = null;

            if (typeof showMessage === "function") {

                showMessage(
                    "Delivery confirmed! ₦" + Number(data.released).toLocaleString() + " has been added to your wallet."
                );

            }

            loadMyErrandTasks();

        } catch (error) {

            console.error("Confirm delivery error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            errandOtpSubmitBtn.disabled = false;

        }

    });

}


// =========================================================
// ERRANDS — PAY ITEM COST (student)
// =========================================================

let __kuriosPayItemCostErrandId = null;

const myErrandsListEl =
    document.getElementById("myErrandsList");

if (myErrandsListEl) {

    myErrandsListEl.addEventListener("click", function (event) {

        const payBtn =
            event.target.closest("[data-pay-item-cost-id]");

        if (payBtn) {

            __kuriosPayItemCostErrandId = payBtn.dataset.payItemCostId;

            const amountEl =
                document.getElementById("errandPayItemCostAmount");

            if (amountEl) {

                amountEl.textContent =
                    typeof formatMoney === "function" ?
                        formatMoney(payBtn.dataset.payItemCostAmount) :
                        "₦" + payBtn.dataset.payItemCostAmount;

            }

            const statusEl = document.getElementById("errandPayItemCostStatus");
            if (statusEl) statusEl.textContent = "";

            const modal = document.getElementById("errandPayItemCostModal");
            if (modal) modal.classList.add("open");

            checkAndShowWalletButton("errandPayItemWalletBtn", "errandPayItemWalletBalanceLabel", payBtn.dataset.payItemCostAmount);

            return;

        }

        const cancelBtn =
            event.target.closest("[data-cancel-errand-id]");

        if (cancelBtn) {
            cancelErrandRequest(cancelBtn.dataset.cancelErrandId);
            return;
        }

        const rateBtn =
            event.target.closest("[data-rate-errand-id]");

        if (rateBtn) {
            openRatingModal(rateBtn.dataset.rateErrandId, "errand");
            return;
        }

        const trackBtn =
            event.target.closest("[data-track-errand-id]");

        if (trackBtn) {
            openErrandTrackingModal(trackBtn.dataset.trackErrandId);
            return;
        }

    });

}

const errandPayItemCancelBtn =
    document.getElementById("errandPayItemCancelBtn");

if (errandPayItemCancelBtn) {

    errandPayItemCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("errandPayItemCostModal");
        if (modal) modal.classList.remove("open");

        __kuriosPayItemCostErrandId = null;

    });

}

async function payErrandItemCostWith(gateway) {

    const statusEl =
        document.getElementById("errandPayItemCostStatus");

    if (!__kuriosPayItemCostErrandId) return;

    const student =
        getStoredStudent();

    if (!student) return;

    if (statusEl) statusEl.textContent = "Redirecting to " + gateway + "...";

    const returnUrl =
        window.location.origin + "/#errands";

    try {

        if (gateway === "monnify") {

            const response =
                await fetch(
                    API_URL + "/api/errands/" + __kuriosPayItemCostErrandId + "/pay-item-cost/monnify",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({})
                    }
                );

            const data = await response.json();

            if (!data.success || typeof MonnifySDK === "undefined" || !data.apiKey) {

                if (statusEl) {

                    statusEl.textContent =
                        (!data.success && data.message) ||
                        "Monnify is not fully configured yet. Try OPay or Paystack instead.";

                }

                return;

            }

            const modal = document.getElementById("errandPayItemCostModal");
            if (modal) modal.classList.remove("open");

            MonnifySDK.initialize({

                amount: data.amount,
                currency: "NGN",
                reference: data.paymentReference,
                customerFullName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                customerEmail: student.email,
                apiKey: data.apiKey,
                contractCode: data.contractCode,
                paymentDescription: "Kurios Stores errand item cost",

                onComplete: async function () {

                    const verifyResult =
                        await verifyPaymentWithRetry(
                            "/api/errands/item-cost/verify",
                            { paymentReference: data.paymentReference }
                        );

                    if (typeof showMessage === "function") {

                        showMessage(
                            verifyResult.success ?
                                "Item cost payment confirmed." :
                                verifyResult.message
                        );

                    }

                    loadMyErrands();

                },

                onClose: function () {}

            });

            return;

        }

        const endpoint =
            "/api/errands/" + __kuriosPayItemCostErrandId + "/pay-item-cost/" + gateway;

        const response =
            await fetch(
                API_URL + endpoint,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        returnUrl: returnUrl,
                        customerName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                        customerEmail: student.email
                    })
                }
            );

        const data = await response.json();

        const redirectUrl =
            data.cashierUrl || data.authorizationUrl;

        if (!data.success || !redirectUrl) {

            if (statusEl) statusEl.textContent = data.message || ("Could not start " + gateway + " checkout.");
            return;

        }

        localStorage.setItem("kuriosPendingErrandItemCostRef", data.paymentReference || "");

        window.location.href = redirectUrl;

    } catch (error) {

        console.error("Errand item cost payment error:", error);

        if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

    }

}

["errandPayItemMonnifyBtn", "errandPayItemOpayBtn", "errandPayItemPaystackBtn"].forEach(function (id) {

    const btn = document.getElementById(id);

    if (btn) {

        btn.addEventListener("click", function () {

            const gateway =
                id === "errandPayItemMonnifyBtn" ? "monnify" :
                (id === "errandPayItemOpayBtn" ? "opay" : "paystack");

            payErrandItemCostWith(gateway);

        });

    }

});

document.addEventListener("DOMContentLoaded", function () {

    const pendingItemCostRef =
        localStorage.getItem("kuriosPendingErrandItemCostRef");

    if (pendingItemCostRef) {

        localStorage.removeItem("kuriosPendingErrandItemCostRef");

        verifyPaymentWithRetry(
            "/api/errands/item-cost/verify",
            { paymentReference: pendingItemCostRef }
        ).then(function (data) {

            if (typeof showMessage === "function") {

                showMessage(
                    data.success ?
                        "Item cost payment confirmed." :
                        data.message
                );

            }

            if (typeof loadMyErrands === "function") {
                loadMyErrands();
            }

        }).catch(function (error) {
            console.error("Resume errand item cost verify error:", error);
        });

    }

});


// =========================================================
// ERRAND AGENT REGISTRATION
// =========================================================

let __kuriosErrandAgentPaymentReference = null;

const openErrandAgentRegisterButton =
    document.getElementById("openErrandAgentRegisterButton");

if (openErrandAgentRegisterButton) {

    openErrandAgentRegisterButton.addEventListener("click", function () {

        document.getElementById("errandAgentPhoneStep").style.display = "block";
        document.getElementById("errandAgentOtpStep").style.display = "none";
        document.getElementById("errandAgentPayStep").style.display = "none";

        document.getElementById("errandAgentPhoneInput").value = "";
        document.getElementById("errandAgentAreaInput").value = "";
        document.getElementById("errandAgentOtpInput").value = "";

        const modal = document.getElementById("errandAgentRegisterModal");
        if (modal) modal.classList.add("open");

    });

}

const errandAgentRegisterCancelBtn =
    document.getElementById("errandAgentRegisterCancelBtn");

if (errandAgentRegisterCancelBtn) {

    errandAgentRegisterCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("errandAgentRegisterModal");
        if (modal) modal.classList.remove("open");

    });

}

let __kuriosErrandAgentPhone = null;
let __kuriosErrandAgentArea = null;

const errandAgentSendCodeBtn =
    document.getElementById("errandAgentSendCodeBtn");

if (errandAgentSendCodeBtn) {

    errandAgentSendCodeBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("errandAgentPhoneStatus");

        const phone =
            document.getElementById("errandAgentPhoneInput").value.trim();

        if (!phone || phone.replace(/\D/g, "").length < 10) {

            if (statusEl) statusEl.textContent = "Please enter a valid phone number.";
            return;

        }

        const student =
            getStoredStudent();

        if (!student) return;

        __kuriosErrandAgentPhone = phone;
        __kuriosErrandAgentArea = document.getElementById("errandAgentAreaInput").value.trim();

        errandAgentSendCodeBtn.disabled = true;

        try {

            const response =
                await fetch(
                    API_URL + "/api/students/phone-verify/send",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id, phone: phone })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "Could not send a verification code.";
                errandAgentSendCodeBtn.disabled = false;
                return;

            }

            document.getElementById("errandAgentPhoneStep").style.display = "none";
            document.getElementById("errandAgentOtpStep").style.display = "block";

        } catch (error) {

            console.error("Send phone verification error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            errandAgentSendCodeBtn.disabled = false;

        }

    });

}

const errandAgentVerifyCodeBtn =
    document.getElementById("errandAgentVerifyCodeBtn");

if (errandAgentVerifyCodeBtn) {

    errandAgentVerifyCodeBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("errandAgentOtpStatus");

        const code =
            document.getElementById("errandAgentOtpInput").value.trim();

        if (!code || code.length !== 6) {

            if (statusEl) statusEl.textContent = "Please enter the 6-digit code.";
            return;

        }

        const student =
            getStoredStudent();

        if (!student) return;

        errandAgentVerifyCodeBtn.disabled = true;

        try {

            const verifyResponse =
                await fetch(
                    API_URL + "/api/students/phone-verify/confirm",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id, code: code })
                    }
                );

            const verifyData = await verifyResponse.json();

            if (!verifyData.success) {

                if (statusEl) statusEl.textContent = verifyData.message || "That code is invalid.";
                errandAgentVerifyCodeBtn.disabled = false;
                return;

            }

            const registerResponse =
                await fetch(
                    API_URL + "/api/errand-agent/register",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentId: student.id,
                            phone: __kuriosErrandAgentPhone,
                            serviceArea: __kuriosErrandAgentArea
                        })
                    }
                );

            const registerData = await registerResponse.json();

            if (!registerData.success) {

                if (statusEl) statusEl.textContent = registerData.message || "Could not start registration.";
                errandAgentVerifyCodeBtn.disabled = false;
                return;

            }

            __kuriosErrandAgentPaymentReference = registerData.paymentReference;

            document.getElementById("errandAgentOtpStep").style.display = "none";
            document.getElementById("errandAgentPayStep").style.display = "block";

            checkAndShowWalletButton("errandAgentPayWalletBtn", "errandAgentPayWalletBalanceLabel", 500);

        } catch (error) {

            console.error("Verify phone / start registration error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            errandAgentVerifyCodeBtn.disabled = false;

        }

    });

}

async function payErrandAgentRegistrationWith(gateway) {

    const statusEl =
        document.getElementById("errandAgentPayStatus");

    if (!__kuriosErrandAgentPaymentReference) return;

    const student =
        getStoredStudent();

    if (!student) return;

    if (statusEl) statusEl.textContent = "Redirecting to " + gateway + "...";

    const returnUrl =
        window.location.origin + "/#errands";

    try {

        if (gateway === "monnify") {

            const response =
                await fetch(
                    API_URL + "/api/errand-agent/pay/monnify",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paymentReference: __kuriosErrandAgentPaymentReference })
                    }
                );

            const data = await response.json();

            if (!data.success || typeof MonnifySDK === "undefined" || !data.apiKey) {

                if (statusEl) {

                    statusEl.textContent =
                        (!data.success && data.message) ||
                        "Monnify is not fully configured yet. Try OPay or Paystack instead.";

                }

                return;

            }

            const modal = document.getElementById("errandAgentRegisterModal");
            if (modal) modal.classList.remove("open");

            MonnifySDK.initialize({

                amount: data.amount,
                currency: "NGN",
                reference: __kuriosErrandAgentPaymentReference,
                customerFullName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                customerEmail: student.email,
                apiKey: data.apiKey,
                contractCode: data.contractCode,
                paymentDescription: "Kurios Stores Errand Agent registration",

                onComplete: async function () {

                    const verifyResult =
                        await verifyPaymentWithRetry(
                            "/api/errand-agent/verify",
                            { paymentReference: __kuriosErrandAgentPaymentReference }
                        );

                    if (typeof showMessage === "function") {

                        showMessage(
                            verifyResult.success ?
                                "You're now a registered Errand Agent!" :
                                verifyResult.message
                        );

                    }

                    loadErrandsPage();

                },

                onClose: function () {}

            });

            return;

        }

        const endpoint =
            gateway === "opay" ? "/api/errand-agent/pay/opay" : "/api/errand-agent/pay/paystack";

        const response =
            await fetch(
                API_URL + endpoint,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        paymentReference: __kuriosErrandAgentPaymentReference,
                        returnUrl: returnUrl,
                        customerName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                        customerEmail: student.email
                    })
                }
            );

        const data = await response.json();

        const redirectUrl =
            data.cashierUrl || data.authorizationUrl;

        if (!data.success || !redirectUrl) {

            if (statusEl) statusEl.textContent = data.message || ("Could not start " + gateway + " checkout.");
            return;

        }

        localStorage.setItem("kuriosPendingErrandAgentRef", __kuriosErrandAgentPaymentReference);

        window.location.href = redirectUrl;

    } catch (error) {

        console.error("Errand agent registration payment error:", error);

        if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

    }

}

["errandAgentPayMonnifyBtn", "errandAgentPayOpayBtn", "errandAgentPayPaystackBtn"].forEach(function (id) {

    const btn = document.getElementById(id);

    if (btn) {

        btn.addEventListener("click", function () {

            const gateway =
                id === "errandAgentPayMonnifyBtn" ? "monnify" :
                (id === "errandAgentPayOpayBtn" ? "opay" : "paystack");

            payErrandAgentRegistrationWith(gateway);

        });

    }

});


// =========================================================
// CRAFT PROVIDER REGISTRATION
// =========================================================

let __kuriosCraftPaymentReference = null;

const openCraftRegisterButton =
    document.getElementById("openCraftRegisterButton");

if (openCraftRegisterButton) {

    openCraftRegisterButton.addEventListener("click", function () {

        document.getElementById("craftRegisterStep").style.display = "block";
        document.getElementById("craftPayStep").style.display = "none";

        document.querySelectorAll("#craftRegisterModal .craft-skill-checkbox input").forEach(function (cb) {
            cb.checked = false;
        });

        document.getElementById("craftBioInput").value = "";

        const statusEl = document.getElementById("craftRegisterStatus");
        if (statusEl) statusEl.textContent = "";

        const modal = document.getElementById("craftRegisterModal");
        if (modal) modal.classList.add("open");

    });

}

const craftRegisterCancelBtn =
    document.getElementById("craftRegisterCancelBtn");

if (craftRegisterCancelBtn) {

    craftRegisterCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("craftRegisterModal");
        if (modal) modal.classList.remove("open");

    });

}

const craftRegisterContinueBtn =
    document.getElementById("craftRegisterContinueBtn");

if (craftRegisterContinueBtn) {

    craftRegisterContinueBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("craftRegisterStatus");

        const selectedSkills =
            Array.from(document.querySelectorAll("#craftRegisterModal .craft-skill-checkbox input:checked"))
                .map(function (cb) { return cb.value; });

        if (selectedSkills.length === 0) {

            if (statusEl) statusEl.textContent = "Please select at least one skill.";
            return;

        }

        const bio =
            document.getElementById("craftBioInput").value.trim();

        const student =
            getStoredStudent();

        if (!student) return;

        craftRegisterContinueBtn.disabled = true;

        try {

            const response =
                await fetch(
                    API_URL + "/api/craft-providers/register",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentId: student.id,
                            skills: selectedSkills,
                            bio: bio
                        })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "Could not start registration.";
                craftRegisterContinueBtn.disabled = false;
                return;

            }

            __kuriosCraftPaymentReference = data.paymentReference;

            document.getElementById("craftRegisterStep").style.display = "none";
            document.getElementById("craftPayStep").style.display = "block";

            checkAndShowWalletButton("craftPayWalletBtn", "craftPayWalletBalanceLabel", 2000);

        } catch (error) {

            console.error("Craft provider registration error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            craftRegisterContinueBtn.disabled = false;

        }

    });

}

async function payCraftRegistrationWith(gateway) {

    const statusEl =
        document.getElementById("craftPayStatus");

    if (!__kuriosCraftPaymentReference) return;

    const student =
        getStoredStudent();

    if (!student) return;

    if (statusEl) statusEl.textContent = "Redirecting to " + gateway + "...";

    const returnUrl =
        window.location.origin + "/#errands";

    try {

        if (gateway === "monnify") {

            const response =
                await fetch(
                    API_URL + "/api/craft-providers/pay/monnify",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ paymentReference: __kuriosCraftPaymentReference })
                    }
                );

            const data = await response.json();

            if (!data.success || typeof MonnifySDK === "undefined" || !data.apiKey) {

                if (statusEl) {

                    statusEl.textContent =
                        (!data.success && data.message) ||
                        "Monnify is not fully configured yet. Try OPay or Paystack instead.";

                }

                return;

            }

            const modal = document.getElementById("craftRegisterModal");
            if (modal) modal.classList.remove("open");

            MonnifySDK.initialize({

                amount: data.amount,
                currency: "NGN",
                reference: __kuriosCraftPaymentReference,
                customerFullName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                customerEmail: student.email,
                apiKey: data.apiKey,
                contractCode: data.contractCode,
                paymentDescription: "Kurios Stores Craft Errand registration",

                onComplete: async function () {

                    const verifyResult =
                        await verifyPaymentWithRetry(
                            "/api/craft-providers/verify",
                            { paymentReference: __kuriosCraftPaymentReference }
                        );

                    if (typeof showMessage === "function") {

                        showMessage(
                            verifyResult.success ?
                                "You're now a registered Craft provider!" :
                                verifyResult.message
                        );

                    }

                    loadErrandsPage();

                },

                onClose: function () {}

            });

            return;

        }

        const endpoint =
            gateway === "opay" ? "/api/craft-providers/pay/opay" : "/api/craft-providers/pay/paystack";

        const response =
            await fetch(
                API_URL + endpoint,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        paymentReference: __kuriosCraftPaymentReference,
                        returnUrl: returnUrl,
                        customerName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                        customerEmail: student.email
                    })
                }
            );

        const data = await response.json();

        const redirectUrl =
            data.cashierUrl || data.authorizationUrl;

        if (!data.success || !redirectUrl) {

            if (statusEl) statusEl.textContent = data.message || ("Could not start " + gateway + " checkout.");
            return;

        }

        localStorage.setItem("kuriosPendingCraftRef", __kuriosCraftPaymentReference);

        window.location.href = redirectUrl;

    } catch (error) {

        console.error("Craft provider registration payment error:", error);

        if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

    }

}

["craftPayMonnifyBtn", "craftPayOpayBtn", "craftPayPaystackBtn"].forEach(function (id) {

    const btn = document.getElementById(id);

    if (btn) {

        btn.addEventListener("click", function () {

            const gateway =
                id === "craftPayMonnifyBtn" ? "monnify" :
                (id === "craftPayOpayBtn" ? "opay" : "paystack");

            payCraftRegistrationWith(gateway);

        });

    }

});

// Resume verification for both flows if returning from
// OPay/Paystack's hosted checkout page.

document.addEventListener("DOMContentLoaded", function () {

    const pendingErrandAgentRef =
        localStorage.getItem("kuriosPendingErrandAgentRef");

    if (pendingErrandAgentRef) {

        localStorage.removeItem("kuriosPendingErrandAgentRef");

        verifyPaymentWithRetry(
            "/api/errand-agent/verify",
            { paymentReference: pendingErrandAgentRef }
        ).then(function (data) {

            if (typeof showMessage === "function") {

                showMessage(
                    data.success ?
                        "You're now a registered Errand Agent!" :
                        data.message
                );

            }

            if (typeof loadErrandsPage === "function") {
                loadErrandsPage();
            }

        }).catch(function (error) {
            console.error("Resume errand agent verify error:", error);
        });

    }

    const pendingCraftRef =
        localStorage.getItem("kuriosPendingCraftRef");

    if (pendingCraftRef) {

        localStorage.removeItem("kuriosPendingCraftRef");

        verifyPaymentWithRetry(
            "/api/craft-providers/verify",
            { paymentReference: pendingCraftRef }
        ).then(function (data) {

            if (typeof showMessage === "function") {

                showMessage(
                    data.success ?
                        "You're now a registered Craft provider!" :
                        data.message
                );

            }

            if (typeof loadErrandsPage === "function") {
                loadErrandsPage();
            }

        }).catch(function (error) {
            console.error("Resume craft provider verify error:", error);
        });

    }

});


// =========================================================
// CRAFT ERRANDS — REQUEST A SERVICE (student)
// =========================================================

const openCraftRequestButton =
    document.getElementById("openCraftRequestButton");

if (openCraftRequestButton) {

    openCraftRequestButton.addEventListener("click", function () {

        document.getElementById("craftRequestSkillSelect").value = "";
        document.getElementById("craftRequestLocationInput").value = "";
        document.getElementById("craftRequestDescriptionInput").value = "";
        document.getElementById("craftRequestPriceInput").value = "";

        const statusEl = document.getElementById("craftRequestStatus");
        if (statusEl) statusEl.textContent = "";

        const modal = document.getElementById("craftRequestModal");
        if (modal) modal.classList.add("open");

    });

}

const craftRequestCancelBtn =
    document.getElementById("craftRequestCancelBtn");

if (craftRequestCancelBtn) {

    craftRequestCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("craftRequestModal");
        if (modal) modal.classList.remove("open");

    });

}

const craftRequestSubmitBtn =
    document.getElementById("craftRequestSubmitBtn");

if (craftRequestSubmitBtn) {

    craftRequestSubmitBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("craftRequestStatus");

        const skill =
            document.getElementById("craftRequestSkillSelect").value;

        const location =
            document.getElementById("craftRequestLocationInput").value.trim();

        const description =
            document.getElementById("craftRequestDescriptionInput").value.trim();

        const proposedPrice =
            document.getElementById("craftRequestPriceInput").value;

        if (!skill || !location || !proposedPrice) {

            if (statusEl) statusEl.textContent = "Please fill in the skill, location, and your proposed price.";
            return;

        }

        if (Number(proposedPrice) < 100) {

            if (statusEl) statusEl.textContent = "Proposed price must be at least ₦100.";
            return;

        }

        const student =
            getStoredStudent();

        if (!student) return;

        craftRequestSubmitBtn.disabled = true;

        try {

            const response =
                await fetch(
                    API_URL + "/api/craft-requests/create",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentId: student.id,
                            skill: skill,
                            location: location,
                            description: description,
                            proposedPrice: proposedPrice
                        })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "Could not create your request.";
                craftRequestSubmitBtn.disabled = false;
                return;

            }

            const modal = document.getElementById("craftRequestModal");
            if (modal) modal.classList.remove("open");

            if (typeof showMessage === "function") {
                showMessage("Your craft request has been sent out to providers.");
            }

            loadMyCraftRequests();

        } catch (error) {

            console.error("Create craft request error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            craftRequestSubmitBtn.disabled = false;

        }

    });

}


// =========================================================
// CRAFT ERRANDS — PROVIDER DASHBOARD
// =========================================================

async function loadCraftDashboard(sort) {

    const student =
        getStoredStudent();

    if (!student) return;

    const listEl = document.getElementById("craftDashboardList");
    const emptyEl = document.getElementById("craftDashboardEmpty");

    if (!listEl) return;

    try {

        const sortParam =
            sort === "fee" ? "&sort=fee" : "";

        const response =
            await fetch(API_URL + "/api/craft-requests/dashboard?studentId=" + student.id + sortParam);

        const data = await response.json();

        if (!data.success || data.requests.length === 0) {

            listEl.innerHTML = "";
            if (emptyEl) emptyEl.style.display = "block";
            return;

        }

        if (emptyEl) emptyEl.style.display = "none";

        listEl.innerHTML =
            data.requests.map(function (request) {

                const priceLabel =
                    typeof formatMoney === "function" ? formatMoney(request.proposed_price) : "₦" + request.proposed_price;

                const myOfferNote =
                    request.my_offer_status === "pending" ?
                        `<p class="errand-waiting-note">You offered ₦${Number(request.my_offer_price).toLocaleString()} — waiting on the student.</p>` :
                        "";

                return `
                    <div class="errand-card">
                        <div class="errand-card-top">
                            <div>
                                <h4>${escapeChatTextGlobal(request.skill)}</h4>
                                <span>${request.request_code}</span>
                            </div>
                            <div class="errand-card-fee">${priceLabel}</div>
                        </div>
                        <div class="errand-card-route">
                            <div><i class="fa-solid fa-location-dot"></i> ${escapeChatTextGlobal(request.location)}</div>
                            ${request.description ? `<div><i class="fa-solid fa-note-sticky"></i> ${escapeChatTextGlobal(request.description)}</div>` : ""}
                        </div>
                        ${myOfferNote}
                        <div style="display:flex; gap:8px;">
                            <button type="button" class="errand-accept-btn" data-craft-accept-id="${request.id}" data-craft-accept-price="${request.proposed_price}">Accept ₦${Number(request.proposed_price).toLocaleString()}</button>
                            <button type="button" class="errand-accept-btn secondary" data-craft-counter-id="${request.id}" data-craft-counter-price="${request.proposed_price}">Counter</button>
                        </div>
                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error("Load craft dashboard error:", error);

    }

}

const craftDashboardListEl =
    document.getElementById("craftDashboardList");

if (craftDashboardListEl) {

    craftDashboardListEl.addEventListener("click", function (event) {

        const acceptBtn = event.target.closest("[data-craft-accept-id]");
        const counterBtn = event.target.closest("[data-craft-counter-id]");

        if (acceptBtn) {

            submitCraftOffer(acceptBtn.dataset.craftAcceptId, acceptBtn.dataset.craftAcceptPrice, acceptBtn);
            return;

        }

        if (counterBtn) {

            openCraftOfferModal(counterBtn.dataset.craftCounterId, counterBtn.dataset.craftCounterPrice);
            return;

        }

    });

}

async function submitCraftOffer(requestId, price, btn) {

    const student =
        getStoredStudent();

    if (!student) return;

    if (btn) {
        btn.disabled = true;
        btn.textContent = "Submitting...";
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/craft-requests/" + requestId + "/offer",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: student.id, offeredPrice: price })
                }
            );

        const data = await response.json();

        if (!data.success) {

            if (typeof showMessage === "function") {
                showMessage(data.message || "Could not submit your offer.", "error");
            }

            loadCraftDashboard();
            return;

        }

        if (data.assigned) {

            if (typeof showMessage === "function") {
                showMessage("You've been assigned this job! Opening chat with the student.");
            }

            window.location.hash = "chat";

            setTimeout(function () {

                if (typeof openChatWith === "function") {

                    openChatWith(
                        data.request.student_id,
                        "Craft Errand requester",
                        data.request.conversation_id,
                        null
                    );

                }

            }, 400);

        } else {

            if (typeof showMessage === "function") {
                showMessage(data.message || "Offer submitted.");
            }

        }

        loadCraftDashboard();
        loadMyCraftJobs();

    } catch (error) {

        console.error("Submit craft offer error:", error);

        if (typeof showMessage === "function") {
            showMessage("Unable to connect to Kurios Stores server.", "error");
        }

    }

}

let __kuriosCraftOfferRequestId = null;

function openCraftOfferModal(requestId, proposedPrice) {

    __kuriosCraftOfferRequestId = requestId;

    document.getElementById("craftOfferProposedPrice").textContent =
        "Student proposed ₦" + Number(proposedPrice).toLocaleString();

    document.getElementById("craftOfferPriceInput").value = "";

    const statusEl = document.getElementById("craftOfferStatus");
    if (statusEl) statusEl.textContent = "";

    const modal = document.getElementById("craftOfferModal");
    if (modal) modal.classList.add("open");

}

const craftOfferCancelBtn =
    document.getElementById("craftOfferCancelBtn");

if (craftOfferCancelBtn) {

    craftOfferCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("craftOfferModal");
        if (modal) modal.classList.remove("open");

        __kuriosCraftOfferRequestId = null;

    });

}

const craftOfferSubmitBtn =
    document.getElementById("craftOfferSubmitBtn");

if (craftOfferSubmitBtn) {

    craftOfferSubmitBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("craftOfferStatus");

        const price =
            document.getElementById("craftOfferPriceInput").value;

        if (!price || Number(price) < 100) {

            if (statusEl) statusEl.textContent = "Please enter a valid price.";
            return;

        }

        if (!__kuriosCraftOfferRequestId) return;

        craftOfferSubmitBtn.disabled = true;

        const modal = document.getElementById("craftOfferModal");
        if (modal) modal.classList.remove("open");

        await submitCraftOffer(__kuriosCraftOfferRequestId, price, null);

        __kuriosCraftOfferRequestId = null;
        craftOfferSubmitBtn.disabled = false;

    });

}


// =========================================================
// CRAFT ERRANDS — MY REQUESTS (student)
// =========================================================

async function loadMyCraftRequests() {

    const student =
        getStoredStudent();

    if (!student) return;

    const listEl = document.getElementById("myCraftRequestsList");
    const emptyEl = document.getElementById("myCraftRequestsEmpty");

    if (!listEl) return;

    try {

        const response =
            await fetch(API_URL + "/api/craft-requests/my?studentId=" + student.id);

        const data = await response.json();

        if (!data.success || data.requests.length === 0) {

            listEl.innerHTML = "";
            if (emptyEl) emptyEl.style.display = "block";
            return;

        }

        if (emptyEl) emptyEl.style.display = "none";

        listEl.innerHTML =
            data.requests.map(function (request) {

                const priceLabel =
                    typeof formatMoney === "function" ?
                        formatMoney(request.agreed_price || request.proposed_price) :
                        "₦" + (request.agreed_price || request.proposed_price);

                const offersButton =
                    request.status === "open" && request.pending_offer_count > 0 ?
                        `<button type="button" class="errand-accept-btn" data-view-offers-id="${request.id}">
                            View ${request.pending_offer_count} Offer${request.pending_offer_count > 1 ? "s" : ""}
                        </button>` :
                        "";

                const payButton =
                    request.status === "assigned" && request.payment_status !== "paid" ?
                        `<button type="button" class="errand-accept-btn" data-craft-pay-id="${request.id}" data-craft-pay-amount="${request.agreed_price}">
                            Pay ${priceLabel}
                        </button>` :
                        "";

                const otpMarkup =
                    request.assigned_provider_id && ["assigned", "in_progress"].includes(request.status) ?
                        `<div class="errand-otp-display">
                            <span>Completion code — give this to your provider</span>
                            <strong>${request.delivery_otp}</strong>
                        </div>` :
                        "";

                const cancellableCraftStatuses =
                    ["open", "assigned"];

                const cancelMarkup =
                    cancellableCraftStatuses.includes(request.status) ?
                        `<button type="button" class="errand-accept-btn secondary" data-cancel-craft-id="${request.id}">Cancel Request</button>` :
                        "";

                const rateMarkup =
                    request.status === "completed" && !request.rating ?
                        `<button type="button" class="errand-accept-btn" data-rate-craft-id="${request.id}">Rate Your Provider</button>` :
                        "";

                return `
                    <div class="errand-card">
                        <div class="errand-card-top">
                            <div>
                                <h4>${escapeChatTextGlobal(request.skill)}</h4>
                                <span>${request.request_code}</span>
                            </div>
                            <span class="errand-status-pill ${request.status}">${request.status.replace(/_/g, " ")}</span>
                        </div>
                        <div class="errand-card-route">
                            <div><i class="fa-solid fa-location-dot"></i> ${escapeChatTextGlobal(request.location)}</div>
                        </div>
                        <div class="errand-card-fee" style="margin-bottom:10px;">${priceLabel}</div>
                        ${otpMarkup}
                        ${offersButton}
                        ${payButton}
                        ${rateMarkup}
                        ${cancelMarkup}
                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error("Load my craft requests error:", error);

    }

}

const myCraftRequestsListEl =
    document.getElementById("myCraftRequestsList");

if (myCraftRequestsListEl) {

    myCraftRequestsListEl.addEventListener("click", function (event) {

        const offersBtn =
            event.target.closest("[data-view-offers-id]");

        if (offersBtn) {
            openCraftOffersModal(offersBtn.dataset.viewOffersId);
            return;
        }

        const payBtn =
            event.target.closest("[data-craft-pay-id]");

        if (payBtn) {
            openCraftPayModal(payBtn.dataset.craftPayId, payBtn.dataset.craftPayAmount);
            return;
        }

        const cancelBtn =
            event.target.closest("[data-cancel-craft-id]");

        if (cancelBtn) {
            cancelCraftRequest(cancelBtn.dataset.cancelCraftId);
            return;
        }

        const rateBtn =
            event.target.closest("[data-rate-craft-id]");

        if (rateBtn) {
            openRatingModal(rateBtn.dataset.rateCraftId, "craft");
            return;
        }

    });

}

let __kuriosCraftOffersRequestId = null;

async function openCraftOffersModal(requestId) {

    __kuriosCraftOffersRequestId = requestId;

    const listEl = document.getElementById("craftOffersList");
    const statusEl = document.getElementById("craftOffersStatus");

    if (listEl) listEl.innerHTML = "Loading...";
    if (statusEl) statusEl.textContent = "";

    const modal = document.getElementById("craftOffersModal");
    if (modal) modal.classList.add("open");

    const student =
        getStoredStudent();

    if (!student) return;

    try {

        const response =
            await fetch(API_URL + "/api/craft-requests/" + requestId + "/offers?studentId=" + student.id);

        const data = await response.json();

        if (!data.success || data.offers.length === 0) {

            if (listEl) listEl.innerHTML = `<p class="reset-passcode-intro">No offers yet.</p>`;
            return;

        }

        if (listEl) {

            listEl.innerHTML =
                data.offers.map(function (offer) {

                    const fullName =
                        `${offer.first_name || ""} ${offer.last_name || ""}`.trim();

                    return `
                        <div class="craft-offer-row">
                            <div class="craft-offer-row-info">
                                <strong>${escapeChatTextGlobal(fullName)}</strong>
                                <span>₦${Number(offer.offered_price).toLocaleString()}</span>
                            </div>
                            <button type="button" class="craft-offer-approve-btn" data-approve-offer-id="${offer.id}">Approve</button>
                        </div>
                    `;

                }).join("");

        }

    } catch (error) {

        console.error("Load craft offers error:", error);

        if (listEl) listEl.innerHTML = `<p class="reset-passcode-intro">Could not load offers.</p>`;

    }

}

const craftOffersCloseBtn =
    document.getElementById("craftOffersCloseBtn");

if (craftOffersCloseBtn) {

    craftOffersCloseBtn.addEventListener("click", function () {

        const modal = document.getElementById("craftOffersModal");
        if (modal) modal.classList.remove("open");

        __kuriosCraftOffersRequestId = null;

    });

}

const craftOffersListEl =
    document.getElementById("craftOffersList");

if (craftOffersListEl) {

    craftOffersListEl.addEventListener("click", async function (event) {

        const btn =
            event.target.closest("[data-approve-offer-id]");

        if (!btn) return;

        const student =
            getStoredStudent();

        if (!student || !__kuriosCraftOffersRequestId) return;

        btn.disabled = true;
        btn.textContent = "Approving...";

        try {

            const response =
                await fetch(
                    API_URL + "/api/craft-requests/" + __kuriosCraftOffersRequestId + "/offers/" + btn.dataset.approveOfferId + "/approve",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (typeof showMessage === "function") {
                    showMessage(data.message || "Could not approve this offer.", "error");
                }

                btn.disabled = false;
                btn.textContent = "Approve";
                return;

            }

            const modal = document.getElementById("craftOffersModal");
            if (modal) modal.classList.remove("open");

            __kuriosCraftOffersRequestId = null;

            if (typeof showMessage === "function") {
                showMessage("Offer approved! Pay below to let your provider start.");
            }

            loadMyCraftRequests();

        } catch (error) {

            console.error("Approve craft offer error:", error);

            if (typeof showMessage === "function") {
                showMessage("Unable to connect to Kurios Stores server.", "error");
            }

            btn.disabled = false;
            btn.textContent = "Approve";

        }

    });

}


// =========================================================
// MESSAGE SELLER ABOUT AN ORDER
// (an order can technically span more than one seller,
// since checkout doesn't restrict the cart to one store —
// this handles that honestly rather than guessing)
// =========================================================

async function messageSellerAboutOrder(orderId) {

    const student =
        getStoredStudent();

    if (!student) return;

    try {

        const sellersResponse =
            await fetch(API_URL + "/api/orders/" + orderId + "/sellers?studentId=" + student.id);

        const sellersData = await sellersResponse.json();

        if (!sellersData.success || sellersData.sellers.length === 0) {

            if (typeof showMessage === "function") {
                showMessage("There's no individual seller to message for this order.", "error");
            }

            return;

        }

        if (sellersData.sellers.length > 1) {

            if (typeof showMessage === "function") {

                showMessage(
                    "This order has items from " + sellersData.sellers.length + " different sellers — opening a chat with " + sellersData.sellers[0].store_name + " first."
                );

            }

        }

        const seller =
            sellersData.sellers[0];

        const conversationResponse =
            await fetch(
                API_URL + "/api/chat/contact-seller-about-order",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        studentId: student.id,
                        orderId: orderId,
                        sellerStudentId: seller.seller_student_id
                    })
                }
            );

        const conversationData = await conversationResponse.json();

        if (!conversationData.success) {

            if (typeof showMessage === "function") {
                showMessage(conversationData.message || "Could not start a conversation about this order.", "error");
            }

            return;

        }

        window.location.hash = "chat";

        setTimeout(function () {

            if (typeof openChatWith === "function") {

                openChatWith(
                    seller.seller_student_id,
                    seller.store_name || "Seller",
                    conversationData.conversationId,
                    "Order #" + orderId
                );

            }

        }, 400);

    } catch (error) {

        console.error("Message seller about order error:", error);

        if (typeof showMessage === "function") {
            showMessage("Unable to connect to Kurios Stores server.", "error");
        }

    }

}


// =========================================================
// CRAFT ERRANDS — MY JOBS (as the assigned provider)
// =========================================================

let __kuriosCraftCompleteRequestId = null;

async function loadMyCraftJobs() {

    const student =
        getStoredStudent();

    if (!student) return;

    const listEl = document.getElementById("myCraftJobsList");
    const emptyEl = document.getElementById("myCraftJobsEmpty");

    if (!listEl) return;

    try {

        const response =
            await fetch(API_URL + "/api/craft-requests/my-jobs?studentId=" + student.id);

        const data = await response.json();

        if (!data.success || data.requests.length === 0) {

            listEl.innerHTML = "";
            if (emptyEl) emptyEl.style.display = "block";
            return;

        }

        if (emptyEl) emptyEl.style.display = "none";

        listEl.innerHTML =
            data.requests.map(function (request) {

                const priceLabel =
                    typeof formatMoney === "function" ? formatMoney(request.agreed_price) : "₦" + request.agreed_price;

                let actionMarkup = "";

                if (request.status === "assigned" && request.payment_status !== "paid") {

                    actionMarkup = `<p class="errand-waiting-note">Waiting on the student to pay before you can start.</p>`;

                } else if (request.status === "assigned" && request.payment_status === "paid") {

                    actionMarkup = `<button type="button" class="errand-accept-btn" data-craft-start-id="${request.id}">Start Service</button>`;

                } else if (request.status === "in_progress") {

                    actionMarkup = `<button type="button" class="errand-accept-btn" data-craft-complete-id="${request.id}">Confirm Completion (Enter Code)</button>`;

                }

                return `
                    <div class="errand-card">
                        <div class="errand-card-top">
                            <div>
                                <h4>${escapeChatTextGlobal(request.skill)}</h4>
                                <span>${request.request_code}</span>
                            </div>
                            <span class="errand-status-pill ${request.status}">${request.status.replace(/_/g, " ")}</span>
                        </div>
                        <div class="errand-card-route">
                            <div><i class="fa-solid fa-location-dot"></i> ${escapeChatTextGlobal(request.location)}</div>
                        </div>
                        <div class="errand-card-fee" style="margin-bottom:10px;">${priceLabel}</div>
                        ${actionMarkup}
                    </div>
                `;

            }).join("");

    } catch (error) {

        console.error("Load my craft jobs error:", error);

    }

}

const myCraftJobsListEl =
    document.getElementById("myCraftJobsList");

if (myCraftJobsListEl) {

    myCraftJobsListEl.addEventListener("click", function (event) {

        const startBtn = event.target.closest("[data-craft-start-id]");
        const completeBtn = event.target.closest("[data-craft-complete-id]");

        if (startBtn) {
            startCraftService(startBtn.dataset.craftStartId, startBtn);
            return;
        }

        if (completeBtn) {
            openCraftCompleteModal(completeBtn.dataset.craftCompleteId);
            return;
        }

    });

}

async function startCraftService(requestId, btn) {

    const student =
        getStoredStudent();

    if (!student) return;

    if (btn) {
        btn.disabled = true;
        btn.textContent = "Starting...";
    }

    try {

        const response =
            await fetch(
                API_URL + "/api/craft-requests/" + requestId + "/start",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: student.id })
                }
            );

        const data = await response.json();

        if (!data.success) {

            if (typeof showMessage === "function") {
                showMessage(data.message || "Could not start this service.", "error");
            }

        }

        loadMyCraftJobs();

    } catch (error) {

        console.error("Start craft service error:", error);

        if (typeof showMessage === "function") {
            showMessage("Unable to connect to Kurios Stores server.", "error");
        }

    }

}

function openCraftCompleteModal(requestId) {

    __kuriosCraftCompleteRequestId = requestId;

    document.getElementById("craftCompleteOtpInput").value = "";

    const statusEl = document.getElementById("craftCompleteStatus");
    if (statusEl) statusEl.textContent = "";

    const modal = document.getElementById("craftCompleteModal");
    if (modal) modal.classList.add("open");

}

const craftCompleteCancelBtn =
    document.getElementById("craftCompleteCancelBtn");

if (craftCompleteCancelBtn) {

    craftCompleteCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("craftCompleteModal");
        if (modal) modal.classList.remove("open");

        __kuriosCraftCompleteRequestId = null;

    });

}

const craftCompleteSubmitBtn =
    document.getElementById("craftCompleteSubmitBtn");

if (craftCompleteSubmitBtn) {

    craftCompleteSubmitBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("craftCompleteStatus");

        const otp =
            document.getElementById("craftCompleteOtpInput").value.trim();

        if (!otp || otp.length !== 4) {

            if (statusEl) statusEl.textContent = "Please enter the 4-digit code.";
            return;

        }

        const student =
            getStoredStudent();

        if (!student || !__kuriosCraftCompleteRequestId) return;

        craftCompleteSubmitBtn.disabled = true;

        try {

            const response =
                await fetch(
                    API_URL + "/api/craft-requests/" + __kuriosCraftCompleteRequestId + "/confirm-completion",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id, otp: otp })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "That code doesn't match.";
                craftCompleteSubmitBtn.disabled = false;
                return;

            }

            const modal = document.getElementById("craftCompleteModal");
            if (modal) modal.classList.remove("open");

            __kuriosCraftCompleteRequestId = null;

            if (typeof showMessage === "function") {

                showMessage(
                    "Job completed! ₦" + Number(data.released).toLocaleString() + " has been added to your wallet."
                );

            }

            loadMyCraftJobs();

        } catch (error) {

            console.error("Confirm craft completion error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            craftCompleteSubmitBtn.disabled = false;

        }

    });

}


// =========================================================
// CRAFT ERRANDS — PAY (student)
// =========================================================

let __kuriosCraftPayRequestId = null;

function openCraftPayModal(requestId, amount) {

    __kuriosCraftPayRequestId = requestId;

    const amountEl =
        document.getElementById("craftPayAmount");

    if (amountEl) {

        amountEl.textContent =
            typeof formatMoney === "function" ? formatMoney(amount) : "₦" + amount;

    }

    const statusEl = document.getElementById("craftPayModalStatus");
    if (statusEl) statusEl.textContent = "";

    const modal = document.getElementById("craftPayModal");
    if (modal) modal.classList.add("open");

    checkAndShowWalletButton("craftPayModalWalletBtn", "craftPayModalWalletBalanceLabel", amount);

}

const craftPayModalCancelBtn =
    document.getElementById("craftPayModalCancelBtn");

if (craftPayModalCancelBtn) {

    craftPayModalCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("craftPayModal");
        if (modal) modal.classList.remove("open");

        __kuriosCraftPayRequestId = null;

    });

}

const craftPayModalCheckNowBtn =
    document.getElementById("craftPayModalCheckNowBtn");

if (craftPayModalCheckNowBtn) {

    craftPayModalCheckNowBtn.addEventListener("click", async function () {

        if (!__kuriosCraftPayRequestId) return;

        const statusEl =
            document.getElementById("craftPayModalStatus");

        craftPayModalCheckNowBtn.disabled = true;
        craftPayModalCheckNowBtn.textContent = "Checking...";

        if (statusEl) statusEl.textContent = "Checking your payment status...";

        try {

            const response =
                await fetch(
                    API_URL + "/api/craft-requests/" + __kuriosCraftPayRequestId + "/check-payment",
                    { method: "POST" }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "We couldn't confirm a payment yet.";

            } else {

                const modal = document.getElementById("craftPayModal");
                if (modal) modal.classList.remove("open");

                if (typeof showMessage === "function") {
                    showMessage("Payment confirmed! Your provider can now start.");
                }

                __kuriosCraftPayRequestId = null;

                if (typeof loadMyCraftRequests === "function") {
                    loadMyCraftRequests();
                }

            }

        } catch (error) {

            console.error("Check craft payment error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            craftPayModalCheckNowBtn.disabled = false;
            craftPayModalCheckNowBtn.innerHTML = '<i class="fa-solid fa-rotate"></i> I\'ve Paid — Check Now';

        }

    });

}

async function payCraftRequestWith(gateway) {

    const statusEl =
        document.getElementById("craftPayModalStatus");

    if (!__kuriosCraftPayRequestId) return;

    const student =
        getStoredStudent();

    if (!student) return;

    if (statusEl) statusEl.textContent = "Redirecting to " + gateway + "...";

    const returnUrl =
        window.location.origin + "/#errands";

    try {

        if (gateway === "monnify") {

            const response =
                await fetch(
                    API_URL + "/api/craft-requests/" + __kuriosCraftPayRequestId + "/pay/monnify",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ studentId: student.id })
                    }
                );

            const data = await response.json();

            if (!data.success || typeof MonnifySDK === "undefined" || !data.apiKey) {

                if (statusEl) {

                    statusEl.textContent =
                        (!data.success && data.message) ||
                        "Monnify is not fully configured yet. Try OPay or Paystack instead.";

                }

                return;

            }

            const modal = document.getElementById("craftPayModal");
            if (modal) modal.classList.remove("open");

            MonnifySDK.initialize({

                amount: data.amount,
                currency: "NGN",
                reference: data.paymentReference,
                customerFullName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                customerEmail: student.email,
                apiKey: data.apiKey,
                contractCode: data.contractCode,
                paymentDescription: "Kurios Stores Craft Errand payment",

                onComplete: async function () {

                    const verifyResult =
                        await verifyPaymentWithRetry(
                            "/api/craft-requests/verify",
                            { paymentReference: data.paymentReference }
                        );

                    if (typeof showMessage === "function") {

                        showMessage(
                            verifyResult.success ?
                                "Payment confirmed! Your provider can now start." :
                                verifyResult.message
                        );

                    }

                    loadMyCraftRequests();

                },

                onClose: function () {}

            });

            return;

        }

        const endpoint =
            "/api/craft-requests/" + __kuriosCraftPayRequestId + "/pay/" + gateway;

        const response =
            await fetch(
                API_URL + endpoint,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        studentId: student.id,
                        returnUrl: returnUrl,
                        customerName: `${student.first_name || ""} ${student.last_name || ""}`.trim(),
                        customerEmail: student.email
                    })
                }
            );

        const data = await response.json();

        const redirectUrl =
            data.cashierUrl || data.authorizationUrl;

        if (!data.success || !redirectUrl) {

            if (statusEl) statusEl.textContent = data.message || ("Could not start " + gateway + " checkout.");
            return;

        }

        localStorage.setItem("kuriosPendingCraftRequestRef", data.paymentReference || "");

        window.location.href = redirectUrl;

    } catch (error) {

        console.error("Craft request payment error:", error);

        if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

    }

}

["craftPayModalMonnifyBtn", "craftPayModalOpayBtn", "craftPayModalPaystackBtn"].forEach(function (id) {

    const btn = document.getElementById(id);

    if (btn) {

        btn.addEventListener("click", function () {

            const gateway =
                id === "craftPayModalMonnifyBtn" ? "monnify" :
                (id === "craftPayModalOpayBtn" ? "opay" : "paystack");

            payCraftRequestWith(gateway);

        });

    }

});

// Resume verification if returning from OPay/Paystack's
// hosted checkout page.

document.addEventListener("DOMContentLoaded", function () {

    const pendingCraftRequestRef =
        localStorage.getItem("kuriosPendingCraftRequestRef");

    if (pendingCraftRequestRef) {

        localStorage.removeItem("kuriosPendingCraftRequestRef");

        verifyPaymentWithRetry(
            "/api/craft-requests/verify",
            { paymentReference: pendingCraftRequestRef }
        ).then(function (data) {

            if (typeof showMessage === "function") {

                showMessage(
                    data.success ?
                        "Payment confirmed! Your provider can now start." :
                        data.message
                );

            }

            if (typeof loadMyCraftRequests === "function") {
                loadMyCraftRequests();
            }

        }).catch(function (error) {
            console.error("Resume craft request verify error:", error);
        });

    }

});


// =========================================================
// ERRAND CANCELLATION (student-side)
// =========================================================

async function cancelErrandRequest(errandId) {

    if (!confirm("Cancel this errand? Any amount already paid will be refunded to your wallet.")) {
        return;
    }

    const student =
        getStoredStudent();

    if (!student) return;

    try {

        const response =
            await fetch(
                API_URL + "/api/errands/" + errandId + "/cancel",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: student.id })
                }
            );

        const data = await response.json();

        if (!data.success) {

            if (typeof showMessage === "function") {
                showMessage(data.message || "Could not cancel this errand.", "error");
            }

            return;

        }

        if (typeof showMessage === "function") {

            showMessage(
                data.refunded > 0 ?
                    "Errand cancelled — ₦" + Number(data.refunded).toLocaleString() + " refunded to your wallet." :
                    "Errand cancelled."
            );

        }

        loadMyErrands();

    } catch (error) {

        console.error("Cancel errand error:", error);

        if (typeof showMessage === "function") {
            showMessage("Unable to connect to Kurios Stores server.", "error");
        }

    }

}


// =========================================================
// AGENT "BACK OUT" (regular errand tasks)
// =========================================================

async function agentCancelErrand(errandId) {

    if (!confirm("Back out of this errand? It'll go back to the pool for another agent, and this counts against your reliability record.")) {
        return;
    }

    const student =
        getStoredStudent();

    if (!student) return;

    try {

        const response =
            await fetch(
                API_URL + "/api/errands/" + errandId + "/agent-cancel",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: student.id })
                }
            );

        const data = await response.json();

        if (!data.success) {

            if (typeof showMessage === "function") {
                showMessage(data.message || "Could not back out of this errand.", "error");
            }

            return;

        }

        if (typeof showMessage === "function") {
            showMessage("You've backed out — this errand is back in the pool.");
        }

        loadMyErrandTasks();

    } catch (error) {

        console.error("Agent cancel errand error:", error);

        if (typeof showMessage === "function") {
            showMessage("Unable to connect to Kurios Stores server.", "error");
        }

    }

}


// =========================================================
// CRAFT REQUEST CANCELLATION (student-side)
// =========================================================

async function cancelCraftRequest(requestId) {

    if (!confirm("Cancel this request? Any amount already paid will be refunded to your wallet.")) {
        return;
    }

    const student =
        getStoredStudent();

    if (!student) return;

    try {

        const response =
            await fetch(
                API_URL + "/api/craft-requests/" + requestId + "/cancel",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ studentId: student.id })
                }
            );

        const data = await response.json();

        if (!data.success) {

            if (typeof showMessage === "function") {
                showMessage(data.message || "Could not cancel this request.", "error");
            }

            return;

        }

        if (typeof showMessage === "function") {

            showMessage(
                data.refunded > 0 ?
                    "Request cancelled — ₦" + Number(data.refunded).toLocaleString() + " refunded to your wallet." :
                    "Request cancelled."
            );

        }

        loadMyCraftRequests();

    } catch (error) {

        console.error("Cancel craft request error:", error);

        if (typeof showMessage === "function") {
            showMessage("Unable to connect to Kurios Stores server.", "error");
        }

    }

}


// =========================================================
// SHARED RATING MODAL (errand + craft)
// =========================================================

let __kuriosRatingRequestId = null;
let __kuriosRatingType = null;
let __kuriosRatingValue = 0;

function openRatingModal(requestId, type) {

    __kuriosRatingRequestId = requestId;
    __kuriosRatingType = type;
    __kuriosRatingValue = 0;

    const titleEl =
        document.getElementById("errandRatingModalTitle");

    if (titleEl) {
        titleEl.textContent = type === "craft" ? "Rate Your Provider" : "Rate Your Agent";
    }

    document.getElementById("errandRatingComment").value = "";

    document.querySelectorAll("#errandRatingStars .rating-star-btn").forEach(function (btn) {
        btn.classList.remove("selected");
    });

    const statusEl = document.getElementById("errandRatingStatus");
    if (statusEl) statusEl.textContent = "";

    const modal = document.getElementById("errandRatingModal");
    if (modal) modal.classList.add("open");

}

document.querySelectorAll("#errandRatingStars .rating-star-btn").forEach(function (btn) {

    btn.addEventListener("click", function () {

        __kuriosRatingValue =
            parseInt(btn.dataset.ratingValue, 10);

        document.querySelectorAll("#errandRatingStars .rating-star-btn").forEach(function (b) {

            b.classList.toggle(
                "selected",
                parseInt(b.dataset.ratingValue, 10) <= __kuriosRatingValue
            );

        });

    });

});

const errandRatingCancelBtn =
    document.getElementById("errandRatingCancelBtn");

if (errandRatingCancelBtn) {

    errandRatingCancelBtn.addEventListener("click", function () {

        const modal = document.getElementById("errandRatingModal");
        if (modal) modal.classList.remove("open");

        __kuriosRatingRequestId = null;
        __kuriosRatingType = null;

    });

}

const errandRatingSubmitBtn =
    document.getElementById("errandRatingSubmitBtn");

if (errandRatingSubmitBtn) {

    errandRatingSubmitBtn.addEventListener("click", async function () {

        const statusEl =
            document.getElementById("errandRatingStatus");

        if (!__kuriosRatingValue) {

            if (statusEl) statusEl.textContent = "Please select a star rating.";
            return;

        }

        const student =
            getStoredStudent();

        if (!student || !__kuriosRatingRequestId || !__kuriosRatingType) return;

        const comment =
            document.getElementById("errandRatingComment").value.trim();

        const endpoint =
            __kuriosRatingType === "craft" ?
                "/api/craft-requests/" + __kuriosRatingRequestId + "/rate" :
                "/api/errands/" + __kuriosRatingRequestId + "/rate";

        errandRatingSubmitBtn.disabled = true;

        try {

            const response =
                await fetch(
                    API_URL + endpoint,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentId: student.id,
                            rating: __kuriosRatingValue,
                            comment: comment
                        })
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "Could not submit your rating.";
                errandRatingSubmitBtn.disabled = false;
                return;

            }

            const modal = document.getElementById("errandRatingModal");
            if (modal) modal.classList.remove("open");

            const ratedType = __kuriosRatingType;

            __kuriosRatingRequestId = null;
            __kuriosRatingType = null;

            if (typeof showMessage === "function") {
                showMessage("Thanks for your rating!");
            }

            if (ratedType === "craft" && typeof loadMyCraftRequests === "function") {
                loadMyCraftRequests();
            } else if (typeof loadMyErrands === "function") {
                loadMyErrands();
            }

        } catch (error) {

            console.error("Submit rating error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

        } finally {

            errandRatingSubmitBtn.disabled = false;

        }

    });

}


// =========================================================
// POOL SORT CONTROLS (errand pool + craft dashboard)
// =========================================================

document.querySelectorAll("[data-pool-sort]").forEach(function (pill) {

    pill.addEventListener("click", async function () {

        document.querySelectorAll("[data-pool-sort]").forEach(function (p) {
            p.classList.remove("active");
        });

        pill.classList.add("active");

        if (pill.dataset.poolSort === "near") {

            const student = getStoredStudent();
            const position = await getCurrentGeolocation();

            if (student && position) {

                await fetch(
                    API_URL + "/api/students/location",
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            studentId: student.id,
                            lat: position.lat,
                            lng: position.lng
                        })
                    }
                ).catch(function (error) {
                    console.error("Location update before sort error:", error);
                });

            }

        }

        loadErrandPool(pill.dataset.poolSort);

    });

});

document.querySelectorAll("[data-craft-sort]").forEach(function (pill) {

    pill.addEventListener("click", function () {

        document.querySelectorAll("[data-craft-sort]").forEach(function (p) {
            p.classList.remove("active");
        });

        pill.classList.add("active");

        loadCraftDashboard(pill.dataset.craftSort);

    });

});


// =========================================================
// LIVE GPS TRACKING (student watches their agent's
// live position on a real map — Leaflet + OpenStreetMap,
// no API key needed)
// =========================================================

let __kuriosTrackingMap = null;
let __kuriosTrackingMarker = null;
let __kuriosTrackingDestMarker = null;
let __kuriosTrackingInterval = null;
let __kuriosTrackingErrandId = null;

function openErrandTrackingModal(errandId) {

    __kuriosTrackingErrandId = errandId;

    const statusEl =
        document.getElementById("errandTrackingStatus");

    if (statusEl) statusEl.textContent = "Loading your agent's location...";

    const modal = document.getElementById("errandTrackingModal");
    if (modal) modal.classList.add("open");

    // Leaflet needs the map container to actually be
    // visible before it can size itself correctly, so
    // initialize on the next tick after the modal opens.

    setTimeout(function () {

        initErrandTrackingMap();
        fetchAgentLocation();

        stopErrandTracking();

        __kuriosTrackingInterval = setInterval(fetchAgentLocation, 10000);

    }, 100);

}

function initErrandTrackingMap() {

    const mapEl =
        document.getElementById("errandTrackingMap");

    if (!mapEl || typeof L === "undefined") return;

    if (__kuriosTrackingMap) {

        __kuriosTrackingMap.remove();
        __kuriosTrackingMap = null;
        __kuriosTrackingMarker = null;
        __kuriosTrackingDestMarker = null;

    }

    __kuriosTrackingMap =
        L.map("errandTrackingMap").setView([0, 0], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19
    }).addTo(__kuriosTrackingMap);

}

async function fetchAgentLocation() {

    const student =
        getStoredStudent();

    const statusEl =
        document.getElementById("errandTrackingStatus");

    if (!student || !__kuriosTrackingErrandId) return;

    try {

        const response =
            await fetch(
                API_URL + "/api/errands/" + __kuriosTrackingErrandId + "/agent-location?studentId=" + student.id
            );

        const data = await response.json();

        if (!data.success) {

            if (statusEl) statusEl.textContent = data.message || "Could not load your agent's location.";
            return;

        }

        if (data.lat === null || data.lng === null) {

            if (statusEl) statusEl.textContent = "Your agent hasn't shared their location yet.";
            return;

        }

        if (statusEl) {

            const updatedSecondsAgo =
                data.updatedAt ? Math.round((Date.now() - new Date(data.updatedAt).getTime()) / 1000) : null;

            statusEl.textContent =
                updatedSecondsAgo !== null ?
                    "Updated " + (updatedSecondsAgo < 60 ? updatedSecondsAgo + "s" : Math.round(updatedSecondsAgo / 60) + "m") + " ago" :
                    "Live";

        }

        if (!__kuriosTrackingMap) return;

        const agentLatLng =
            [Number(data.lat), Number(data.lng)];

        if (!__kuriosTrackingMarker) {

            const agentIcon =
                L.divIcon({ className: "leaflet-marker-agent", iconSize: [16, 16] });

            __kuriosTrackingMarker =
                L.marker(agentLatLng, { icon: agentIcon }).addTo(__kuriosTrackingMap);

            __kuriosTrackingMap.setView(agentLatLng, 15);

        } else {

            __kuriosTrackingMarker.setLatLng(agentLatLng);

        }

        if (data.destinationLat && data.destinationLng && !__kuriosTrackingDestMarker) {

            const destIcon =
                L.divIcon({
                    className: "leaflet-marker-destination",
                    html: '<i class="fa-solid fa-flag-checkered"></i>',
                    iconSize: [22, 22]
                });

            __kuriosTrackingDestMarker =
                L.marker([Number(data.destinationLat), Number(data.destinationLng)], { icon: destIcon })
                    .addTo(__kuriosTrackingMap);

        }

    } catch (error) {

        console.error("Fetch agent location error:", error);

        if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";

    }

}

function stopErrandTracking() {

    if (__kuriosTrackingInterval) {
        clearInterval(__kuriosTrackingInterval);
        __kuriosTrackingInterval = null;
    }

}

const errandTrackingCloseBtn =
    document.getElementById("errandTrackingCloseBtn");

if (errandTrackingCloseBtn) {

    errandTrackingCloseBtn.addEventListener("click", function () {

        const modal = document.getElementById("errandTrackingModal");
        if (modal) modal.classList.remove("open");

        stopErrandTracking();

        __kuriosTrackingErrandId = null;

    });

}


// =========================================================
// CART — DELIVERY METHOD SELECTOR
// =========================================================

document.querySelectorAll('input[name="deliveryMethod"]').forEach(function (radio) {

    radio.addEventListener("change", function () {

        document.querySelectorAll(".delivery-method-option").forEach(function (label) {
            label.classList.remove("active");
        });

        radio.closest(".delivery-method-option").classList.add("active");

        const locationGroup =
            document.getElementById("cartDeliveryLocationGroup");

        if (locationGroup) {
            locationGroup.style.display = radio.value === "errand" ? "block" : "none";
        }

    });

});


// =========================================================
// SHOP SEARCH + FILTERS
// =========================================================

function getCurrentShopFilters() {

    const search =
        document.getElementById("shopSearchInput");

    const category =
        document.getElementById("shopCategorySelect");

    const minPrice =
        document.getElementById("shopMinPriceInput");

    const maxPrice =
        document.getElementById("shopMaxPriceInput");

    const sort =
        document.getElementById("shopSortSelect");

    return {
        search: search ? search.value.trim() : "",
        category: category ? category.value : "",
        minPrice: minPrice ? minPrice.value : "",
        maxPrice: maxPrice ? maxPrice.value : "",
        sort: sort ? sort.value : "newest"
    };

}

let __kuriosShopSearchDebounce = null;

const shopSearchInput =
    document.getElementById("shopSearchInput");

if (shopSearchInput) {

    shopSearchInput.addEventListener("input", function () {

        if (__kuriosShopSearchDebounce) {
            clearTimeout(__kuriosShopSearchDebounce);
        }

        __kuriosShopSearchDebounce = setTimeout(function () {

            if (typeof loadProducts === "function") {
                loadProducts(getCurrentShopFilters());
            }

        }, 400);

    });

}

const shopFilterToggleBtn =
    document.getElementById("shopFilterToggleBtn");

if (shopFilterToggleBtn) {

    shopFilterToggleBtn.addEventListener("click", function () {

        const panel =
            document.getElementById("shopFiltersPanel");

        if (!panel) return;

        const isOpen =
            panel.style.display === "block";

        panel.style.display = isOpen ? "none" : "block";
        shopFilterToggleBtn.classList.toggle("active", !isOpen);

    });

}

const shopApplyFiltersBtn =
    document.getElementById("shopApplyFiltersBtn");

if (shopApplyFiltersBtn) {

    shopApplyFiltersBtn.addEventListener("click", function () {

        if (typeof loadProducts === "function") {
            loadProducts(getCurrentShopFilters());
        }

    });

}

const shopClearFiltersBtn =
    document.getElementById("shopClearFiltersBtn");

if (shopClearFiltersBtn) {

    shopClearFiltersBtn.addEventListener("click", function () {

        const categorySelect = document.getElementById("shopCategorySelect");
        const minPriceInput = document.getElementById("shopMinPriceInput");
        const maxPriceInput = document.getElementById("shopMaxPriceInput");
        const sortSelect = document.getElementById("shopSortSelect");
        const searchInput = document.getElementById("shopSearchInput");

        if (categorySelect) categorySelect.value = "";
        if (minPriceInput) minPriceInput.value = "";
        if (maxPriceInput) maxPriceInput.value = "";
        if (sortSelect) sortSelect.value = "newest";
        if (searchInput) searchInput.value = "";

        if (typeof loadProducts === "function") {
            loadProducts();
        }

    });

}

const shopSortSelectEl =
    document.getElementById("shopSortSelect");

if (shopSortSelectEl) {

    shopSortSelectEl.addEventListener("change", function () {

        if (typeof loadProducts === "function") {
            loadProducts(getCurrentShopFilters());
        }

    });

}


// =========================================================
// SHARED PAYMENT VERIFICATION WITH RETRY
// (Monnify's onComplete can fire slightly before the
// transaction is queryable as PAID on their side — a single
// verify attempt right then can fail even though the money
// genuinely went through. Retries a few times with a short
// delay before giving up honestly, rather than either
// failing permanently on the first miss or — the actual bug
// this replaces — claiming success without checking at all.)
// =========================================================

function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

async function verifyPaymentWithRetry(endpoint, body, attempts) {

    const maxAttempts =
        attempts || 4;

    for (let i = 0; i < maxAttempts; i++) {

        try {

            const response =
                await fetch(
                    API_URL + endpoint,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(body)
                    }
                );

            const data =
                await response.json();

            if (data.success) {
                return data;
            }

        } catch (error) {

            console.error("Verify payment attempt error:", error);

        }

        if (i < maxAttempts - 1) {
            await wait(2000);
        }

    }

    return {
        success: false,
        message: "We couldn't confirm this payment yet. Please check back in a moment, or contact support if this continues."
    };

}


// =========================================================
// GENERIC WALLET-PAY HELPERS
// (shared across every payment flow that offers Wallet as
// a 4th option — Errand fee, Item cost, Errand Agent and
// Craft Provider registration, Craft job payment, Seller
// Application fee, and Order Retry)
// =========================================================

async function checkAndShowWalletButton(btnId, balanceLabelId, amount) {

    const student =
        getStoredStudent();

    if (!student) return;

    const btn =
        document.getElementById(btnId);

    if (!btn) return;

    try {

        const response =
            await fetch(API_URL + "/api/students/wallet?studentId=" + student.id);

        const data = await response.json();

        if (data.success && Number(data.balance) >= Number(amount)) {

            btn.style.display = "flex";

            const label =
                document.getElementById(balanceLabelId);

            if (label) {

                label.textContent =
                    typeof formatMoney === "function" ? formatMoney(data.balance) : "₦" + data.balance;

            }

        } else {

            btn.style.display = "none";

        }

    } catch (error) {

        console.error("Check wallet balance error:", error);

    }

}

function wireWalletPayButton(btnId, statusElId, endpoint, getPayload, onSuccess) {

    const btn =
        document.getElementById(btnId);

    if (!btn) return;

    btn.addEventListener("click", async function () {

        const student =
            getStoredStudent();

        if (!student) return;

        const statusEl =
            statusElId ? document.getElementById(statusElId) : null;

        const resolvedEndpoint =
            typeof endpoint === "function" ? endpoint() : endpoint;

        if (!resolvedEndpoint) return;

        btn.disabled = true;

        if (statusEl) statusEl.textContent = "Paying from your wallet...";

        try {

            const response =
                await fetch(
                    API_URL + resolvedEndpoint,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(getPayload(student))
                    }
                );

            const data = await response.json();

            if (!data.success) {

                if (statusEl) statusEl.textContent = data.message || "Payment failed.";
                btn.disabled = false;
                return;

            }

            onSuccess(data);

        } catch (error) {

            console.error("Wallet pay error:", error);

            if (statusEl) statusEl.textContent = "Unable to connect to Kurios Stores server.";
            btn.disabled = false;

        }

    });

}


// =========================================================
// WIRE ALL 7 WALLET-PAY CLICK HANDLERS
// =========================================================

// 1. Errand fee

wireWalletPayButton(
    "errandPayWalletBtn",
    "errandPaymentStatus",
    "/api/errands/pay/wallet",
    function (student) {
        return { paymentReference: __kuriosErrandPaymentReference, studentId: student.id };
    },
    function (data) {

        const modal = document.getElementById("errandRequestModal");
        if (modal) modal.classList.remove("open");

        if (typeof showMessage === "function") {
            showMessage("Paid from wallet — your errand is now available to agents.");
        }

        if (typeof loadMyErrands === "function") loadMyErrands();

    }
);

// 2. Errand item cost

wireWalletPayButton(
    "errandPayItemWalletBtn",
    "errandPayItemCostStatus",
    function () {
        return __kuriosPayItemCostErrandId ?
            "/api/errands/" + __kuriosPayItemCostErrandId + "/pay-item-cost-wallet" :
            null;
    },
    function (student) {
        return { studentId: student.id };
    },
    function (data) {

        const modal = document.getElementById("errandPayItemCostModal");
        if (modal) modal.classList.remove("open");

        if (typeof showMessage === "function") {
            showMessage("Item cost paid from wallet.");
        }

        if (typeof loadMyErrands === "function") loadMyErrands();

    }
);

// 3. Errand Agent registration

wireWalletPayButton(
    "errandAgentPayWalletBtn",
    "errandAgentPayStatus",
    "/api/errand-agent/pay-wallet",
    function (student) {
        return { studentId: student.id };
    },
    function (data) {

        const modal = document.getElementById("errandAgentRegisterModal");
        if (modal) modal.classList.remove("open");

        if (typeof showMessage === "function") {
            showMessage("You're now a registered Errand Agent!");
        }

        if (typeof loadErrandsPage === "function") loadErrandsPage();

    }
);

// 4. Craft Provider registration

wireWalletPayButton(
    "craftPayWalletBtn",
    "craftPayStatus",
    "/api/craft-providers/pay-wallet",
    function (student) {
        return { studentId: student.id };
    },
    function (data) {

        const modal = document.getElementById("craftRegisterModal");
        if (modal) modal.classList.remove("open");

        if (typeof showMessage === "function") {
            showMessage("You're now a registered Craft provider!");
        }

        if (typeof loadErrandsPage === "function") loadErrandsPage();

    }
);

// 5. Craft job payment

wireWalletPayButton(
    "craftPayModalWalletBtn",
    "craftPayModalStatus",
    function () {
        return __kuriosCraftPayRequestId ?
            "/api/craft-requests/" + __kuriosCraftPayRequestId + "/pay-wallet" :
            null;
    },
    function (student) {
        return { studentId: student.id };
    },
    function (data) {

        const modal = document.getElementById("craftPayModal");
        if (modal) modal.classList.remove("open");

        if (typeof showMessage === "function") {
            showMessage("Paid from wallet — your provider can now start.");
        }

        if (typeof loadMyCraftRequests === "function") loadMyCraftRequests();

    }
);

// 6. Seller Application fee

wireWalletPayButton(
    "payWithWalletButton",
    "sellerPaymentChoiceStatus",
    "/api/sellers/apply/pay-wallet",
    function (student) {
        return { studentId: student.id };
    },
    function (data) {

        if (typeof hideAllSellerStates === "function") hideAllSellerStates();

        const nameEl = document.getElementById("sellerPendingStoreName");
        if (nameEl && data.seller) nameEl.textContent = data.seller.store_name;

        const sellerPendingStateEl = document.getElementById("sellerPendingState");
        if (sellerPendingStateEl) sellerPendingStateEl.style.display = "block";

    }
);

// 7. Order Retry

wireWalletPayButton(
    "orderCheckoutWalletBtn",
    "orderCheckoutStatus",
    "/api/orders/pay/wallet",
    function (student) {
        return { paymentReference: __kuriosOrdersCheckoutRef, studentId: student.id };
    },
    function (data) {

        if (typeof closeOrderCheckoutModal === "function") closeOrderCheckoutModal();

        if (typeof showMessage === "function") {
            showMessage("Paid from wallet!");
        }

        const student = getStoredStudent();

        if (student && typeof loadOrdersIntoPanel === "function") {
            loadOrdersIntoPanel(student.id);
        }

    }
);
