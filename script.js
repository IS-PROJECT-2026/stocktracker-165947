/*
 * StockTracker Inventory Data
 */
const defaultProducts = [
    {
        id: 1,
        name: "Laptop",
        category: "Electronics",
        quantity: 15
    },

    {
        id: 2,
        name: "Wireless Mouse",
        category: "Electronics",
        quantity: 4
    },

    {
        id: 3,
        name: "Office Chair",
        category: "Furniture",
        quantity: 23
    },

    {
        id: 4,
        name: "Keyboard",
        category: "Electronics",
        quantity: 0
    },

    {
        id: 5,
        name: "Notebook",
        category: "Stationery",
        quantity: 30
    }
];

let products =
    JSON.parse(localStorage.getItem("stockTrackerProducts"))
    || defaultProducts;

/*
 * Determine stock status
 */

function getStockStatus(quantity) {

    if (quantity === 0) {
        return {
            text: "Out of Stock",
            className: "out"
        };
    }

    if (quantity <= 5) {
        return {
            text: "Low Stock",
            className: "low"
        };
    }

    return {
        text: "In Stock",
        className: "good"
    };
}


/*
 * Display inventory
 */

function displayProducts(productList = products) {

    const table = document.getElementById("inventoryTable");

    if (!table) {
        return;
    }

    table.innerHTML = "";

    productList.forEach(function(product) {

        const status = getStockStatus(product.quantity);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.name}</td>

            <td>${product.category}</td>

            <td>${product.quantity}</td>

            <td>
                <span class="status ${status.className}">
                    ${status.text}
                </span>
            </td>

            <td>
                <button
                    class="action-button"
                    onclick="editProduct(${product.id})"
                >
                    Edit
                </button>

                <button
                    class="action-button delete-button"
                    onclick="deleteProduct(${product.id})"
                >
                    Delete
                </button>
            </td>
        `;

        table.appendChild(row);

    });
}

/*
 * Edit product
 */

function editProduct(id) {

    const product = products.find(function(product) {
        return product.id === id;
    });

    if (!product) {
        return;
    }

    document.getElementById("productName").value =
        product.name;

    document.getElementById("productCategory").value =
        product.category;

    document.getElementById("productQuantity").value =
        product.quantity;

    modal.classList.add("show");

    productForm.dataset.editingId = id;

    productForm.querySelector("button[type='submit']").textContent = "Update Product";
}

/*
 * Delete product
 */

function deleteProduct(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
        return;
    }

    products = products.filter(function(product) {
        return product.id !== id;
    });

    localStorage.setItem(
        "stockTrackerProducts",
        JSON.stringify(products)
    );

    displayProducts(products);
    displayStatistics();
}


/*
 * Search products
 */

const searchInput = document.getElementById("searchInput");

if (searchInput) {

    searchInput.addEventListener("input", function() {

        const searchTerm =
            searchInput.value.toLowerCase();

        const filteredProducts = products.filter(
            function(product) {

                return product.name
                    .toLowerCase()
                    .includes(searchTerm);

            }
        );

        displayProducts(filteredProducts);

    });

}


/*
 * Category filtering
 */

const categoryFilter =
    document.getElementById("categoryFilter");

if (categoryFilter) {

    categoryFilter.addEventListener("change", function() {

        const category =
            categoryFilter.value;

        if (category === "all") {

            displayProducts(products);

            return;
        }

        const filteredProducts =
            products.filter(function(product) {

                return product.category === category;

            });

        displayProducts(filteredProducts);

    });

}


/*
 * Add Product Modal
 */

const modal =
    document.getElementById("productModal");

const openAddProduct =
    document.getElementById("openAddProduct");

const closeModal =
    document.getElementById("closeModal");


if (openAddProduct) {

    openAddProduct.addEventListener(
        "click",
        function() {

            modal.classList.add("show");

        }
    );

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        function() {

            modal.classList.remove("show");

        }
    );

}


/*
 * Add Product
 */

const productForm =
    document.getElementById("productForm");


if (productForm) {

    productForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();

            const name =
                document.getElementById("productName").value;

            const category =
                document.getElementById("productCategory").value;

            const quantity =
                Number(
                    document.getElementById("productQuantity").value
                );

            const editingId = productForm.dataset.editingId;

            if (editingId) {
                products = products.map(function(product) {
                    if (product.id === Number(editingId)) {
                        return {
                            id: product.id,
                            name: name,
                            category: category,
                            quantity: quantity
                        };
                    }
                        return product;
                });
                delete productForm.dataset.editingId;

            } else {
                const newProduct = {
                    id: Date.now(),
                    name: name,
                    category: category,
                    quantity: quantity
                };
                products.push(newProduct);
            }

            localStorage.setItem(
                "stockTrackerProducts",
                JSON.stringify(products)
            );

            displayProducts(products);
            displayStatistics();
            productForm.reset();

            delete productForm.dataset.editingId;
            productForm.querySelector("button[type='submit']").textContent = "Add Product";
            modal.classList.remove("show");

        }
    );

}

/*
 * Display inventory statistics
 */

function displayStatistics() {

    const totalProductsElement =
        document.getElementById("totalProducts");

    const totalUnitsElement =
        document.getElementById("totalUnits");

    const lowStockElement =
        document.getElementById("lowStock");

    const outOfStockElement =
        document.getElementById("outOfStock");

    if (!totalProductsElement) {
        return;
    }

    const totalProducts = products.length;

    const totalUnits = products.reduce(
        function(total, product) {
            return total + product.quantity;
        },
        0
    );

    const lowStock = products.filter(
        function(product) {
            return product.quantity > 0 &&
                   product.quantity <= 5;
        }
    ).length;

    const outOfStock = products.filter(
        function(product) {
            return product.quantity === 0;
        }
    ).length;

    totalProductsElement.textContent = totalProducts;

    totalUnitsElement.textContent = totalUnits;

    lowStockElement.textContent = lowStock;

    outOfStockElement.textContent = outOfStock;
}


/*
 * Load inventory when inventory page opens
 */

displayProducts();

displayStatistics();


console.log(
    "StockTracker inventory system loaded successfully."
);