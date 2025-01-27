// restaurantScript.js

document.addEventListener("DOMContentLoaded", async () => {
    const restaurantContainer = document.getElementById("restaurantContainer");
    const searchInput = document.getElementById("searchInput");
  
    try {
      const restaurants = await fetchRestaurants();
      
      // Store restaurants globally for filtering
      window.allRestaurants = restaurants;
      
      // Initial render
      renderRestaurants(restaurants);

      // Add search event listener
      searchInput.addEventListener("input", handleSearch);

      // Add clear search functionality
      const clearSearch = document.getElementById("clearSearch");

      searchInput.addEventListener("input", (e) => {
          clearSearch.style.display = e.target.value ? "block" : "none";
      });

      clearSearch.addEventListener("click", () => {
          searchInput.value = "";
          clearSearch.style.display = "none";
          renderRestaurants(window.allRestaurants);
      });
    } catch (error) {
      console.error("Error fetching restaurants:", error.message);
      restaurantContainer.textContent = "Failed to load restaurants. Please try again later.";
    }
});

async function fetchRestaurants() {
    try {
        // Get the token from localStorage
        const token = localStorage.getItem("token");

        // Set up the fetch options, including the Authorization header
        const response = await fetch("http://localhost:4000/api/restaurants/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Add the token here
            },
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
        }

        // Parse and return the JSON data
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in fetchRestaurants:", error.message);
        throw error;
    }
}

function isOpenNow(openingHours) {
    // Create a date object for Israel time
    const now = new Date().toLocaleString("en-US", {timeZone: "Asia/Jerusalem"});
    const israelTime = new Date(now);
    
    const currentDay = israelTime.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = `${String(israelTime.getHours()).padStart(2, '0')}:${String(israelTime.getMinutes()).padStart(2, '0')}`;
  
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
            <p class="status ${isOpen ? 'open' : 'closed'}">
                <strong>Status:</strong> ${isOpen ? `Open now, closes at ${closesAt}` : "Closed now"}
            </p>
            <button class="order-button ${!isOpen ? 'disabled' : ''}" 
                    data-id="${restaurant.id}"
                    ${!isOpen ? 'disabled' : ''}>
                ${isOpen ? 'Order Now' : 'Currently Closed'}
            </button>
        </div>
      `;
      
        // Add click event listener for the "Order Now" button only if restaurant is open
        const orderButton = restaurantDiv.querySelector('.order-button');
        if (isOpen) {
            orderButton.addEventListener('click', () => {
                const restaurantId = restaurant._id;
                window.location.href = `/order.html?restaurantId=${restaurantId}`;
            });
        }
    
        restaurantContainer.appendChild(restaurantDiv);
    });
}

// Add search handler function
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    const filteredRestaurants = window.allRestaurants.filter(restaurant => {
        return (
            restaurant.name.toLowerCase().includes(searchTerm) ||
            restaurant.type.toLowerCase().includes(searchTerm) ||
            restaurant.address.city.toLowerCase().includes(searchTerm) ||
            restaurant.address.street.toLowerCase().includes(searchTerm)
        );
    });

    // Show no results message if no matches
    if (filteredRestaurants.length === 0) {
        const restaurantContainer = document.getElementById("restaurantContainer");
        restaurantContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No restaurants found matching "${event.target.value}"</p>
            </div>
        `;
        return;
    }

    renderRestaurants(filteredRestaurants);
}

document.addEventListener('DOMContentLoaded', function() {
    const scrollButton = document.querySelector('.scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });

    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});
    