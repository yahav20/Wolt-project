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
      const response = await fetch("RESTAURANT_SERVICE_URL/restaurants"); // Replace with your service URL
      if (!response.ok) {
        throw new Error("Failed to fetch restaurants");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in fetchRestaurants:", error.message);
      throw error;
    }
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
      restaurantDiv.textContent = restaurant.name;
      restaurantContainer.appendChild(restaurantDiv);
    });
  }
  