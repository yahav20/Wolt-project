// restaurantScript.js

document.addEventListener("DOMContentLoaded", async () => {
    const restaurantContainer = document.getElementById("restaurantContainer");
  
    try {
      const restaurants = await fetchRestaurants();
      renderRestaurants(restaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error.message);
      restaurantContainer.textContent = "Failed to load restaurants. Please try again later.";
    }
  });
  
  async function fetchRestaurants() {
    try {
      const response = await fetch("http://localhost:3000/api/restaurants/");
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched data:", data);
      return data;
    } catch (error) {
      console.error("Error in fetchRestaurants:", error.message);
      throw error;
    }
  }
  
  function isOpenNow(openingHours) {
    const now = new Date();
    const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
    const todayHours = openingHours[currentDay];
  
    if (todayHours && todayHours.open && todayHours.close) {
      if (currentTime >= todayHours.open && currentTime < todayHours.close) {
        return { isOpen: true, closesAt: todayHours.close };
      } else {
        return { isOpen: false, closesAt: null };
      }
    }
    return { isOpen: false, closesAt: null };
  }
  
  function renderRestaurants(restaurants) {
    const restaurantContainer = document.getElementById("restaurantContainer");
    restaurantContainer.innerHTML = "";
  
    if (restaurants.length === 0) {
      restaurantContainer.textContent = "No restaurants available.";
      return;
    }
  
    restaurants.forEach((restaurant) => {
        const restaurantDiv = document.createElement("div");
        restaurantDiv.className = "restaurant-item";
    
        const { isOpen, closesAt } = isOpenNow(restaurant.openingHours);
    
        // Add detailed content to the restaurant item
        restaurantDiv.innerHTML = `
          <div class="restaurant-card">
            <h2>${restaurant.name}</h2>
            <p><strong>Type:</strong> ${restaurant.type}</p>
            <p><strong>Address:</strong> ${restaurant.address.street}, ${restaurant.address.city}, ${restaurant.address.state}, ${restaurant.address.zipCode}</p>
            <p><strong>Phone:</strong> ${restaurant.phone}</p>
            <p><strong>Status:</strong> ${isOpen ? `Open now, closes at ${closesAt}` : "Closed now"}</p>
            <button class="order-button">Order Now</button>
          </div>
        `;
    
        restaurantContainer.appendChild(restaurantDiv);
      });
    }
    