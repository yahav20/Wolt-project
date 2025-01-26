import random
import pymongo

# MongoDB connection setup
MONGO_URI = "mongodb://127.0.0.1:27017/woltTest"
client = pymongo.MongoClient(MONGO_URI)
db = client.woltTest
restaurants_collection = db.restaurants
category_items_collection = db.categoryitems

# Default opening hours
default_hours = {
    "Monday": "9:00 AM - 9:00 PM",
    "Tuesday": "9:00 AM - 9:00 PM",
    "Wednesday": "9:00 AM - 9:00 PM",
    "Thursday": "9:00 AM - 9:00 PM",
    "Friday": "9:00 AM - 10:00 PM",
    "Saturday": "10:00 AM - 10:00 PM",
    "Sunday": "10:00 AM - 8:00 PM"
}

# Clear existing data from collections
def clear_database():
    restaurants_collection.delete_many({})
    category_items_collection.delete_many({})
    print("Cleared restaurants and category items collections.")

# Example restaurant categories and items by type
categories_by_type = {
    "Italian": ["Pasta", "Pizza", "Appetizers"],
    "Pizza": ["Classic Pizzas", "Specialty Pizzas", "Desserts"],
    "Fast Food": ["Burgers", "Fries", "Shakes"],
    "Chinese": ["Noodles", "Rice Dishes", "Dim Sum"],
    "Indian": ["Curries", "Breads", "Snacks"],
    "Dessert": ["Cakes", "Cookies", "Ice Cream"],
    "Cafe": ["Beverages", "Sandwiches", "Pastries"]
}

items_by_category = {
    "Pasta": ["Spaghetti Carbonara", "Fettuccine Alfredo", "Penne Arrabiata"],
    "Pizza": ["Margherita", "Pepperoni", "Veggie Supreme"],
    "Appetizers": ["Bruschetta", "Caprese Salad", "Garlic Bread"],
    "Classic Pizzas": ["Cheese Pizza", "Hawaiian Pizza", "BBQ Chicken Pizza"],
    "Specialty Pizzas": ["Truffle Pizza", "Buffalo Chicken Pizza", "Mediterranean Pizza"],
    "Desserts": ["Tiramisu", "Chocolate Lava Cake", "Gelato"],
    "Burgers": ["Cheeseburger", "Bacon Burger", "Veggie Burger"],
    "Fries": ["Classic Fries", "Sweet Potato Fries", "Loaded Fries"],
    "Shakes": ["Vanilla Shake", "Chocolate Shake", "Strawberry Shake"],
    "Noodles": ["Chow Mein", "Lo Mein", "Pad Thai"],
    "Rice Dishes": ["Fried Rice", "Steamed Rice", "Sticky Rice"],
    "Dim Sum": ["Pork Dumplings", "Shrimp Dumplings", "Vegetable Dumplings"],
    "Curries": ["Butter Chicken", "Paneer Tikka Masala", "Lamb Vindaloo"],
    "Breads": ["Naan", "Paratha", "Chapati"],
    "Snacks": ["Samosa", "Pakora", "Bhel Puri"],
    "Cakes": ["Cheesecake", "Black Forest Cake", "Red Velvet Cake"],
    "Cookies": ["Chocolate Chip Cookies", "Oatmeal Raisin Cookies", "Sugar Cookies"],
    "Ice Cream": ["Vanilla", "Chocolate", "Strawberry"],
    "Beverages": ["Coffee", "Tea", "Smoothies"],
    "Sandwiches": ["Club Sandwich", "Grilled Cheese", "BLT"],
    "Pastries": ["Croissant", "Danish", "Muffin"]
}

def generate_restaurant_data():
    """Generate data for 20 restaurants."""
    data = []
    restaurant_data = [
        {"name": "The Hungry Chef", "city": "Jerusalem"},
        {"name": "Pizza Paradise", "city": "Haifa"},
        {"name": "Noodle Haven", "city": "Tel Aviv"},
        {"name": "Tandoori Delight", "city": "Beersheba"},
        {"name": "Sweet Tooth Bakery", "city": "Eilat"},
        {"name": "Cafe Harmony", "city": "Nazareth"},
        {"name": "The Italian Table", "city": "Ramat Gan"},
        {"name": "Fast Feast", "city": "Ashdod"},
        {"name": "Burger Barn", "city": "Herzliya"},
        {"name": "Dragon Wok", "city": "Petah Tikva"},
        {"name": "Spice Symphony", "city": "Acre"},
        {"name": "Dessert Dreams", "city": "Netanya"},
        {"name": "Coffee Corner", "city": "Kfar Saba"},
        {"name": "Pasta Palace", "city": "Holon"},
        {"name": "Sushi Central", "city": "Bat Yam"},
        {"name": "Gourmet Grub", "city": "Rehovot"},
        {"name": "Urban Eats", "city": "Hadera"},
        {"name": "Bistro Bliss", "city": "Rishon Lezion"},
        {"name": "Grill House", "city": "Ashkelon"},
        {"name": "Veggie Vibes", "city": "Modiin"}
    ]

    for restaurant in restaurant_data:
        restaurant_type = random.choice(list(categories_by_type.keys()))
        categories = categories_by_type[restaurant_type]

        menu = []
        for category in categories:
            num_items = random.randint(3, 10)
            items = random.sample(items_by_category[category], min(num_items, len(items_by_category[category])))
            for item in items:
                menu.append({
                    "name": item,
                    "category": category,
                    "description": f"A delicious {item} from {restaurant['name']}.",
                    "price": random.randint(20, 100)
                })

        data.append({
            "name": restaurant['name'],
            "type": restaurant_type,
            "address": {
                "street": f"Main Street {random.randint(1, 100)}",
                "city": restaurant['city'],
                "state": "Israel",
                "zipCode": "N/A"
            },
            "phone": f"+972-{random.randint(1000000, 9999999)}",
            "email": f"{restaurant['name'].replace(' ', '').lower()}@example.com",
            "website": f"https://{restaurant['name'].replace(' ', '').lower()}.com",
            "openingHours": default_hours,
            "menu": menu
        })

    return data

def add_restaurant_with_categories(restaurant):
    """Add a restaurant and its menu categories to the database."""
    category_items = []

    # Group menu items by category
    categories = {}
    for item in restaurant['menu']:
        category_name = item['category']
        if category_name not in categories:
            categories[category_name] = []
        categories[category_name].append({
            "name": item['name'],
            "description": item['description'],
            "price": item['price']
        })

    # Create a category document for each category with grouped items
    for category_name, items in categories.items():
        category_item = {
            "name": category_name,
            "items": items,
            "restaurant": None  # Placeholder for now
        }
        inserted_category = category_items_collection.insert_one(category_item)
        category_items.append(inserted_category.inserted_id)

    # Add restaurant document with category references
    new_restaurant = {
        "name": restaurant['name'],
        "type": restaurant['type'],
        "address": restaurant['address'],
        "phone": restaurant['phone'],
        "email": restaurant['email'],
        "website": restaurant['website'],
        "openingHours": restaurant['openingHours'],
        "menu": category_items  # References to category items
    }
    inserted_restaurant = restaurants_collection.insert_one(new_restaurant)

    # Update category documents to reference the restaurant
    category_items_collection.update_many(
        {"_id": {"$in": category_items}},
        {"$set": {"restaurant": inserted_restaurant.inserted_id}}
    )

def insert_restaurants_to_db(restaurants):
    """Insert restaurant data into MongoDB."""
    if restaurants:
        for restaurant in restaurants:
            add_restaurant_with_categories(restaurant)
        print(f"Inserted {len(restaurants)} restaurants into the database.")
    else:
        print("No restaurant data to insert.")

if __name__ == "__main__":
    clear_database()
    restaurant_data = generate_restaurant_data()
    insert_restaurants_to_db(restaurant_data)
