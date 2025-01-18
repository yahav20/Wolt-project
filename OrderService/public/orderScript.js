const userId = "exampleUserId"; // Replace with actual user ID from session or context
const restaurantId = "exampleRestaurantId"; // Replace with actual restaurant ID
const menuContainer = document.getElementById("menuContainer");
const userInfoDiv = document.getElementById("userInfo");
const restaurantInfoDiv = document.getElementById("restaurantInfo");
const submitOrderButton = document.getElementById("submitOrder");

const restaurantApi = require("../api/restaurant");
const userApi = require("../api/user");

const USER_SERVICE = process.env.USERS_SERVICE + "/users";
const RESTAURANT_SERVICE = process.env.RESTAURANT_SERVICE + "/api/restaurants";
const ORDER_SERVICE = process.env.ORDERS_SERVICE + "/api/orders";

async function fetchData() {
  try {
    userInfoDiv.textContent = "Loading user information...";
    restaurantInfoDiv.textContent = "Loading restaurant details...";

    const [userResponse, restaurantResponse] = await Promise.all([
      await userApi.getUserById(userId),
      await restaurantApi.getRestaurantById(restaurantId),
    ]);

    if (!userResponse || !restaurantResponse) {
      throw new Error("Failed to fetch user or restaurant data");
    }

    const user = userResponse.json();
    const restaurant = restaurantResponse.json();

    userInfoDiv.textContent = `User: ${user.name}, Address: ${user.address}`;
    restaurantInfoDiv.textContent = `Restaurant: ${restaurant.name}, Location: ${restaurant.location}`;
    restaurantNameHeader.textContent = restaurant.name; // Update restaurant name in header

    renderMenu(restaurant.menu); // Assuming the API returns a `menu` field
  } catch (error) {
    console.error("Error fetching data:", error.message);
    userInfoDiv.textContent =
      "Could not load user information. Please try again.";
    restaurantInfoDiv.textContent =
      "Could not load restaurant details. Please try again.";
  }
}

function renderMenu(menuCategories) {
    console.log('Rendering menu categories:', menuCategories);
    menuContainer.innerHTML = "";
    
    menuCategories.forEach(category => {
      // Create category header
      const categoryHeader = document.createElement('h2');
      categoryHeader.textContent = category.name;
      categoryHeader.className = 'menu-category';
      menuContainer.appendChild(categoryHeader);
  
      // Create items container
      const itemsContainer = document.createElement('div');
      itemsContainer.className = 'menu-items-container';
  
      category.items.forEach(item => {
        const menuItemDiv = document.createElement("div");
        menuItemDiv.className = "menu-item";
  
        menuItemDiv.innerHTML = `
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p>Price: $${item.price.toFixed(2)}</p>
          <label for="menu-item-${item._id || Math.random()}">
            <input type="checkbox" id="menu-item-${item._id || Math.random()}" 
                   data-id="${item._id || Math.random()}" 
                   data-name="${item.name}" 
                   data-price="${item.price}">
            Select
          </label>
          <input type="number" min="1" value="1" 
                 data-quantity-id="${item._id || Math.random()}" 
                 aria-label="Quantity for ${item.name}">
        `;
  
        itemsContainer.appendChild(menuItemDiv);
      });
  
      menuContainer.appendChild(itemsContainer);
    });
  }


submitOrderButton.addEventListener("click", async () => {
  const selectedItems = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map((checkbox) => {
    const id = checkbox.dataset.id;
    const name = checkbox.dataset.name;
    const price = parseFloat(checkbox.dataset.price);
    const quantityInput = document.querySelector(
      `input[data-quantity-id="${id}"]`
    );
    const quantity = parseInt(quantityInput.value, 10);

    if (isNaN(quantity) || quantity <= 0) {
      alert(`Please enter a valid quantity for ${name}.`);
      throw new Error("Invalid quantity input");
    }

    return { itemId: id, name, price, quantity };
  });

  if (selectedItems.length === 0) {
    alert("Please select at least one item.");
    return;
  }

  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = {
    restaurantId,
    userId,
    menuItems: selectedItems, // This matches the backend API's expected payload
  };

  submitOrderButton.disabled = true;
  submitOrderButton.textContent = "Submitting...";

  try {
    const response = await fetch(ORDER_SERVICE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!response.ok) throw new Error("Failed to create order");

    const result = await response.json();
    alert(`Order created successfully: ${result.orderId}`);
  } catch (error) {
    alert(`Failed to create order: ${error.message}`);
  } finally {
    submitOrderButton.disabled = false;
    submitOrderButton.textContent = "Submit Order";
  }
});
fetchData();
