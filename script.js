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

                price: Number(product.price),

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


    async function loadProducts() {


        /*
            Tell the browser:

            "Go to my backend and
             ask for the products."
        */

        try {


            const response =
                await fetch(
                    API_URL + "/api/products"
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

            productCard.innerHTML = `

                <div class="product-image">

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


                        <strong>

                            ${formatMoney(product.price)}

                        </strong>


                        <button

                            class="add-to-cart"

                            data-product-id="${product.id}"

                        >

                            <i class="fa-solid fa-plus"></i>

                            Add

                        </button>


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
       10. PRODUCT FILTERS
       ===================================================== */


    const filterButtons =
        document.querySelectorAll(
            ".filter-button"
        );



    filterButtons.forEach(
        function (button) {


            button.addEventListener(
                "click",
                function () {


                    /*
                        Remove active state
                        from all buttons.
                    */

                    filterButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );



                    /*
                        Activate clicked button.
                    */

                    button.classList.add(
                        "active"
                    );



                    const selectedCategory =
                        button.dataset.filter;



                    const productCards =
                        document.querySelectorAll(
                            ".product-card"
                        );



                    productCards.forEach(
                        function (card) {


                            if (
                                selectedCategory ===
                                "all"
                            ) {

                                card.style.display =
                                    "";

                                return;

                            }



                            if (
                                card.dataset.category ===
                                selectedCategory
                            ) {

                                card.style.display =
                                    "";

                            }

                            else {

                                card.style.display =
                                    "none";

                            }

                        }
                    );

                }
            );

        }
    );



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


                    /*
                        Find matching shop filter.
                    */

                    const filter =
                        document.querySelector(
                            `.filter-button[data-filter="${category}"]`
                        );


                    if (filter) {

                        filter.click();

                    }


                    /*
                        Scroll to shop.
                    */

                    const shop =
                        document.getElementById(
                            "shop"
                        );


                    if (shop) {

                        shop.scrollIntoView({
                            behavior: "smooth"
                        });

                    }

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

    const loggedOutHero =
        document.getElementById("loggedOutHero");

    const loggedInHero =
        document.getElementById("loggedInHero");


    if (loggedOutHero) {

        loggedOutHero.style.display =
            "block";

    }


    if (loggedInHero) {

        loggedInHero.style.display =
            "none";

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

    if (typeof goHome === "function") {
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

    return `
        <div class="order-card">

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

    if (typeof goHome === "function") {
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

updateLoginState();

                if (typeof showDashboardChoiceModal === "function") {

                    fetch(
                        API_URL + "/api/sellers/me?studentId=" + data.student.id
                    )
                        .then(function (response) { return response.json(); })
                        .then(function (sellerData) {

                            if (
                                sellerData.success &&
                                sellerData.seller &&
                                sellerData.seller.status === "approved"
                            ) {

                                // Keep the splash up — the choice
                                // modal renders on top of it.

                                showDashboardChoiceModal(data.student);

                            } else if (postLoginSplash) {

                                postLoginSplash.style.display = "none";

                            }

                        })
                        .catch(function (error) {

                            console.error(
                                "Post-login seller check error:",
                                error
                            );

                            if (postLoginSplash) {
                                postLoginSplash.style.display = "none";
                            }

                        });

                } else if (postLoginSplash) {

                    postLoginSplash.style.display = "none";

                }





                // ========================================
                // CLOSE SIGN-IN MODAL
                // ========================================

                const signInModal =
                    document.getElementById(
                        "signInModal"
                    );

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

                            phone: phone,

                            whatsappNumber:
                                whatsappNumber,

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


    const chatSearch =
        document.getElementById(
            "chatSearch"
        );


    let activeChatPartnerId = null;
    let chatPollInterval = null;
    let conversationsPollInterval = null;
    let cachedConversations = [];


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

        if (cachedConversations.length === 0) {

            if (chatContactsEmpty) {
                chatContactsEmpty.style.display = "block";
            }

            return;

        }

        if (chatContactsEmpty) {
            chatContactsEmpty.style.display = "none";
        }

        cachedConversations.forEach(function (conversation) {

            const fullName =
                ((conversation.first_name || "") + " " + (conversation.last_name || "")).trim();

            const button =
                document.createElement("button");

            button.className = "chat-contact";

            if (conversation.id === activeChatPartnerId) {
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

            button.innerHTML = `
                <div class="chat-avatar">${avatarMarkup}</div>
                <div class="chat-contact-info">
                    <strong>${fullName || "Kurios Student"}</strong>
                    <span>${conversation.last_message ? conversation.last_message.slice(0, 32) : ""}</span>
                </div>
                ${unreadBadge}
            `;

            button.addEventListener(
                "click",
                function () {
                    openChatWith(conversation.id, fullName);
                }
            );

            chatContactList.appendChild(button);

        });

    }


    async function loadConversations() {

        const student =
            getLoggedInStudent();

        if (!student) {
            return;
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

            const time =
                new Date(message.created_at).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                );

            messageElement.innerHTML = `
                <div class="message-bubble">${escapeChatText(message.body)}</div>
                <span>${isSent ? "You" : "Them"} • ${time}</span>
            `;

            messages.appendChild(messageElement);

        });

        messages.scrollTop = messages.scrollHeight;

    }


    function escapeChatText(text) {

        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;

    }


    async function loadThread(partnerId, myId) {

        try {

            const response =
                await fetch(
                    API_URL + "/api/chat/messages?studentId=" + myId + "&withId=" + partnerId
                );

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


    function openChatWith(partnerId, partnerName) {

        const student =
            getLoggedInStudent();

        if (!student) {
            return;
        }

        activeChatPartnerId = partnerId;

        if (activeChatName) {
            activeChatName.textContent = partnerName || "Kurios Student";
        }

        if (activeChatStatus) {
            activeChatStatus.textContent = "Kurios Stores student";
        }

        if (activeChatAvatar) {
            activeChatAvatar.innerHTML = `<i class="fa-solid fa-user"></i>`;
        }

        renderChatContactList();

        loadThread(partnerId, student.id);

        clearInterval(chatPollInterval);

        chatPollInterval = setInterval(
            function () {
                loadThread(partnerId, student.id);
            },
            20000
        );

    }


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

                if (!activeChatPartnerId) {

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
                                    body: text
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

                    loadThread(activeChatPartnerId, student.id);

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

                    openChatWith(data.student.id, fullName);

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

            // Refresh the sidebar either way, so
            // unread badges/previews stay current.

            loadConversations();

            // If this message belongs to the thread
            // that's currently open, refresh it too.

            if (
                activeChatPartnerId &&
                String(incomingMessage.sender_id) === String(activeChatPartnerId)
            ) {

                loadThread(activeChatPartnerId, currentStudent.id);

            }

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
                                    customerEmail: student.email
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


    function showMessage(message) {


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



        toast.textContent =
            message;


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



    /* =====================================================
       23. SMOOTH SCROLLING
       ===================================================== */


    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(
        function (link) {


            link.addEventListener(
                "click",
                function (event) {


                    const targetId =
                        link.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    /*
                        Don't interfere with
                        modal links.
                    */

                    if (
                        targetId ===
                        "#signin"
                    ) {

                        event.preventDefault();

                        openSignInModal();

                        return;

                    }



                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (target) {

                        event.preventDefault();


                        target.scrollIntoView({

                            behavior: "smooth",

                            block: "start"

                        });

                    }

                }
            );

        }
    );



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

            if (data.success) {

                notifications = data.notifications;

                renderNotifications();

            }

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

        ["sellerPage", "storefrontPage", "wishlistPage", "walletPage", "chatPage"]
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

    function syncPageFromHash() {

        const hash = window.location.hash;

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
            return;

        }

        if (hash === "#wallet") {

            showSimplePage("walletPage");

            if (typeof loadWalletPage === "function") {
                loadWalletPage();
            }

            return;

        }

        if (hash === "#chat") {

            showSimplePage("chatPage");

            if (typeof loadConversations === "function") {
                loadConversations();
            }

            return;

        }

        // No matching hash — show the homepage.
        // (This also covers plain section anchors like
        // #shop, #categories, #rewards — the browser's
        // native scroll-to-anchor can silently fail if
        // that section was hidden at the moment the hash
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

    // Generic "Back to Kurios Stores" links on the
    // simple coming-soon pages (Wishlist, Wallet).

    document.querySelectorAll(".page-back-link").forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                goHome();

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
// CONFIRM THE SELLER APPLICATION PAYMENT
// (never trust the widget's onComplete alone)
// ========================================

async function verifySellerApplicationPayment(paymentReference) {

    if (sellerApplyStatus) {

        sellerApplyStatus.textContent =
            "Confirming your payment...";

    }

    try {

        const response =
            await fetch(
                API_URL + "/api/sellers/apply/verify-payment",
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

        const data = await response.json();

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

    if (product) {

        if (formTitle) formTitle.textContent = "Edit product";
        if (editingIdField) editingIdField.value = product.id;
        if (nameField) nameField.value = product.name || "";
        if (descField) descField.value = product.description || "";
        if (priceField) priceField.value = product.price || "";
        if (stockField) stockField.value = product.stock_quantity || 0;
        if (categoryField) categoryField.value = product.category || "";

    } else {

        if (formTitle) formTitle.textContent = "Add a product";
        if (editingIdField) editingIdField.value = "";
        if (nameField) nameField.value = "";
        if (descField) descField.value = "";
        if (priceField) priceField.value = "";
        if (stockField) stockField.value = "";
        if (categoryField) categoryField.value = "";

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
                API_URL + "/api/sellers/wallet?studentId=" + studentId
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

            closeDashboardChoiceModal();

            if (typeof switchDashboardWithReload === "function") {

                switchDashboardWithReload(null);

            } else if (typeof goHome === "function") {

                goHome();

            }

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

            if (typeof switchDashboardWithReload === "function") {

                switchDashboardWithReload("sell");

            } else {

                window.location.hash = "sell";

            }

        }
    );

}
