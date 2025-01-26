// Get references to DOM elements
const menuContainer = document.getElementById("menuContainer");
const userInfoDiv = document.getElementById("userName");
const restaurantInfoDiv = document.getElementById("restaurantName");
const submitOrderButton = document.getElementById("submitOrder");
const totalDisplay = document.getElementById("total-price");

// Hardcoded user ID for demonstration purposes
const userId = "679353daf196121bb81b84a7";
const params = new URLSearchParams(window.location.search);
const restaurantId = params.get("restaurantId");

// API object containing methods to fetch user and restaurant data
const api = {
  async getUserById(userId) {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const response = await fetch(`http://localhost:4000/api/users/test`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    return await response.json();
  },

  async getRestaurantById(restaurantId) {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const response = await fetch(`http://localhost:4000/api/restaurants/${restaurantId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch restaurant data");
    }

    return await response.json();
  },
};


// Function to fetch user and restaurant data and update the UI
async function fetchData() {
  try {
    const [userResponse, restaurantResponse] = await Promise.all([
      api.getUserById(userId),
      api.getRestaurantById(restaurantId),
    ]);

    if (!userResponse || !restaurantResponse) {
      throw new Error("Failed to fetch user or restaurant data");
    }

    // Update UI with fetched data
    userInfoDiv.textContent = userResponse.name;
    restaurantInfoDiv.textContent = restaurantResponse.name;

    // Render the restaurant menu
    renderMenu(restaurantResponse.menu);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    userInfoDiv.textContent =
      "Could not load user information. Please try again.";
    restaurantInfoDiv.textContent =
      "Could not load restaurant details. Please try again.";
  }
}

// Function to render the restaurant menu
function renderMenu(menuCategories) {
  menuContainer.innerHTML = "";
  menuCategories.forEach((category) => {
    const categoryHeader = document.createElement("h2");
    categoryHeader.textContent = category.name;
    categoryHeader.className = "menu-category";
    menuContainer.appendChild(categoryHeader);

    const itemsContainer = document.createElement("div");
    itemsContainer.className = "menu-items-container";

    category.items.forEach((item) => {
      const menuItemDiv = document.createElement("div");
      menuItemDiv.className = "menu-item";
      menuItemDiv.dataset.itemId = item.name;

      menuItemDiv.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p>Price: $${item.price.toFixed(2)}</p>
        <div class="quantity-control">
          <button class="quantity-decrease" data-id="${item.name}">-</button>
          <span class="quantity-display" id="quantity-${item.name}">0</span>
          <button class="quantity-increase" data-id="${item.name}">+</button>
        </div>`;

      itemsContainer.appendChild(menuItemDiv);
    });

    menuContainer.appendChild(itemsContainer);
  });

  // Add event listeners for quantity buttons
  document.querySelectorAll(".quantity-decrease").forEach((btn) =>
    btn.addEventListener("click", (e) => updateQuantity(e.target, -1))
  );
  document.querySelectorAll(".quantity-increase").forEach((btn) =>
    btn.addEventListener("click", (e) => updateQuantity(e.target, 1))
  );

  // Update the total price display
  updateTotal();
}

// Function to update the quantity of a menu item
function updateQuantity(button, change) {
  const itemId = button.dataset.id;
  const quantityDisplay = document.getElementById(`quantity-${itemId}`);
  let quantity = parseInt(quantityDisplay.textContent, 10);
  quantity = Math.max(0, quantity + change);  // Ensure quantity doesn't go below 0
  quantityDisplay.textContent = quantity;

  // Update the total price display
  updateTotal();
}

// Function to update the total price display
function updateTotal() {
  let total = 0;
  // Loop through each menu item and calculate the total
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach((menuItemDiv) => {
    const itemId = menuItemDiv.dataset.itemId;
    const price = parseFloat(menuItemDiv.querySelector("p:nth-of-type(2)").textContent.split(": $")[1]);
    const quantity = parseInt(document.getElementById(`quantity-${itemId}`).textContent, 10);
    total += price * quantity;
  });

  totalDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

// Event listener for the submit order button
submitOrderButton.addEventListener("click", async () => {
  const selectedItems = Array.from(document.querySelectorAll(".menu-item")).map((itemDiv) => {
    const itemId = itemDiv.dataset.itemId;
    const name = itemDiv.querySelector("h3").textContent;
    const price = parseFloat(itemDiv.querySelector("p:nth-of-type(2)").textContent.split(": $")[1]);
    const quantity = parseInt(document.getElementById(`quantity-${itemId}`).textContent, 10);

    if (quantity <= 0) {
      return null;
    }

    return { itemId, name, price, quantity };
  }).filter(item => item !== null);

  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  //create order object
  const order = {
    userId: userId,
    restaurantId: restaurantId,
    menuItems: selectedItems,
    totalPrice: total,
  };

  try {
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    console.log(token);
    const response = await fetch("/api/orders/", {
      method: "POST",
      headers: { "Content-Type": "application/json" , Authorization: `Bearer ${token}`},
      body: JSON.stringify(order),
       // Include the token in the Authorization header

    });

    if (!response.ok) throw new Error("Failed to create order");

    const result = await response.json();
    alert(`Order created successfully: ${result.orderId}`);
    window.location.href = "track.html";
  } catch (error) {
    alert(`Failed to create order: ${error.message}`);
  }
});

// Fetch data when the script is loaded
fetchData();
