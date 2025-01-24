
const menuContainer = document.getElementById("menuContainer");
const userInfoDiv = document.getElementById("userName");
const restaurantInfoDiv = document.getElementById("restaurantName");
const submitOrderButton = document.getElementById("submitOrder");
const totalDisplay = document.getElementById("total-price");

const api = {
  async getUserById(userId) {
    return {
      name: "ido",
      mail: "idoHagever@gmail.com",
      address: "ido's house",
    };
  },
  async getRestaurantById(restaurantId) {
    return {
      name: "Bella Italia",
      type: "Italian",
      address: {
        street: "123 Pasta St.",
        city: "Rome",
        state: "Lazio",
        zipCode: "00100",
      },
      phone: "+39 06 1234567",
      email: "contact@bellaitalia.com",
      website: "https://www.bellaitalia.com",
      openingHours: {
        monday: { open: "10:00", close: "22:00" },
        tuesday: { open: "10:00", close: "22:00" },
        wednesday: { open: "10:00", close: "22:00" },
        thursday: { open: "10:00", close: "22:00" },
        friday: { open: "10:00", close: "23:00" },
        saturday: { open: "10:00", close: "23:00" },
        sunday: { open: "10:00", close: "22:00" },
      },
      menu: [
        {
          _id: "605c72efc7e2d4d1b58fbdf3",
          name: "Foo Pasta Dishes",
          items: [
            {
              name: "Spaghetti Carbonara",
              description: "Classic Italian pasta with eggs, cheese, pancetta, and pepper.",
              price: 12.5,
              imageUrl: "https://example.com/spaghetti-carbonara.jpg",
              availability: true,
              _id:"1"
            },
            {
              name: "Fettuccine Alfredo",
              description: "Creamy fettuccine pasta with butter and parmesan.",
              price: 13.0,
              imageUrl: "https://example.com/fettuccine-alfredo.jpg",
              availability: true,
              _id:"2"
            },
          ],
          restaurant: "605c72efc7e2d4d1b58fbd1a",
        },
        {
          _id: "605c72efc7e2d4d1b58fbdf4",
          name: "Pizzas",
          items: [
            {
              name: "Margherita Pizza",
              description: "Classic pizza with tomato, mozzarella, and basil.",
              price: 10.0,
              imageUrl: "https://example.com/margherita-pizza.jpg",
              availability: true,
              _id:"3"
            },
            {
              name: "Pepperoni Pizza",
              description: "Pizza topped with spicy pepperoni and cheese.",
              price: 12.0,
              imageUrl: "https://example.com/pepperoni-pizza.jpg",
              availability: true,
              _id:"4"
            },
          ],
          restaurant: "605c72efc7e2d4d1b58fbd1a",
        },
        {
          _id: "605c72efc7e2d4d1b58fbdf5",
          name: "Desserts",
          items: [
            {
              name: "Tiramisu",
              description: "A classic Italian dessert made with coffee-soaked ladyfingers and mascarpone.",
              price: 6.5,
              imageUrl: "https://example.com/tiramisu.jpg",
              availability: true,
              _id:"5"
            },
            {
              name: "Gelato",
              description: "Italian ice cream available in various flavors.",
              price: 5.0,
              imageUrl: "https://example.com/gelato.jpg",
              availability: true,
              _id:"6"
            },
          ],
          restaurant: "605c72efc7e2d4d1b58fbd1a",
        },
      ],
    };
  },
};

async function fetchData() {
  try {
    const [userResponse, restaurantResponse] = await Promise.all([
      api.getUserById("123"),
      api.getRestaurantById("145"),
    ]);

    if (!userResponse || !restaurantResponse) {
      throw new Error("Failed to fetch user or restaurant data");
    }

    userInfoDiv.textContent = userResponse.name;
    restaurantInfoDiv.textContent = restaurantResponse.name;

    renderMenu(restaurantResponse.menu);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    userInfoDiv.textContent =
      "Could not load user information. Please try again.";
    restaurantInfoDiv.textContent =
      "Could not load restaurant details. Please try again.";
  }
}

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
      menuItemDiv.dataset.itemId = item._id;

      menuItemDiv.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p>Price: $${item.price.toFixed(2)}</p>
        <div class="quantity-control">
          <button class="quantity-decrease" data-id="${item._id}">-</button>
          <span class="quantity-display" id="quantity-${item._id}">0</span>
          <button class="quantity-increase" data-id="${item._id}">+</button>
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

  updateTotal();
}

function updateQuantity(button, change) {
  const itemId = button.dataset.id;
  const quantityDisplay = document.getElementById(`quantity-${itemId}`);
  let quantity = parseInt(quantityDisplay.textContent, 10);
  quantity = Math.max(0, quantity + change);  // Ensure quantity doesn't go below 0
  quantityDisplay.textContent = quantity;

  updateTotal();
}

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

  const order = {
    userId: "123",
    restaurantId: "145",
    menuItems: selectedItems,
    totalPrice: total,
  };

  try {
    const response = await fetch("ORDER_SERVICE_URL", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!response.ok) throw new Error("Failed to create order");

    const result = await response.json();
    alert(`Order created successfully: ${result.orderId}`);
  } catch (error) {
    alert(`Failed to create order: ${error.message}`);
  }
});

fetchData();
