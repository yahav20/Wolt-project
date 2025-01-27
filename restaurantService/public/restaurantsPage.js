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
      const response = await fetch("http://localhost:3002/api/restaurants/");
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
  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + 1);
  const nextDayName = nextDay.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

  if (todayHours && todayHours.open && todayHours.close) {
    // Check if the closing time is past midnight
    if (todayHours.close < todayHours.open) {
      // Handle overnight hours
      if (
        (currentTime >= todayHours.open && currentTime <= "23:59") || // Before midnight
        (currentTime >= "00:00" && currentTime < todayHours.close) // After midnight
      ) {
        return { isOpen: true, closesAt: todayHours.close };
      }
    } else {
      // Regular opening and closing times
      if (currentTime >= todayHours.open && currentTime < todayHours.close) {
        return { isOpen: true, closesAt: todayHours.close };
      }
    }
  }

  // Handle cases where the current time is after midnight but the restaurant closes late
  const previousDayHours = openingHours[nextDayName];
  if (
    previousDayHours &&
    previousDayHours.open &&
    previousDayHours.close < previousDayHours.open // Overnight hours for the previous day
  ) {
    if (currentTime >= "00:00" && currentTime < previousDayHours.close) {
      return { isOpen: true, closesAt: previousDayHours.close };
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
    