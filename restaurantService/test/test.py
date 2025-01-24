import random
import pymongo

# MongoDB connection setup
MONGO_URI = "mongodb://127.0.0.1:27017/woltTest"
client = pymongo.MongoClient(MONGO_URI)
db = client.woltTest
restaurants_collection = db.restaurants
category_items_collection = db.categoryItems

# Clear existing data from collections
def clear_database():
    restaurants_collection.delete_many({})
    category_items_collection.delete_many({})
    print("Cleared restaurants and category items collections.")

# Example restaurant categories and opening hours
categories = ['Italian', 'Pizza', 'Fast Food', 'Chinese', 'Indian', 'Dessert', 'Cafe']
default_hours = {
    "monday": {"open": "09:00", "close": "22:00"},
    "tuesday": {"open": "09:00", "close": "22:00"},
    "wednesday": {"open": "09:00", "close": "22:00"},
    "thursday": {"open": "09:00", "close": "22:00"},
    "friday": {"open": "09:00", "close": "22:00"},
    "saturday": {"open": "10:00", "close": "23:00"},
    "sunday": {"open": "10:00", "close": "21:00"}
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
        menu = [
            {
                "name": f"Dish {j} from {restaurant['name']}",
                "description": f"A delicious Dish {j} specially made by {restaurant['name']}",
                "price": random.randint(20, 100)
            }
            for j in range(1, random.randint(8, 15))
        ]

        data.append({
            "name": restaurant['name'],
            "type": random.choice(categories),
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
    if restaurant['menu']:
        for item in restaurant['menu']:
            category_item = {
                "name": item['name'],
                "items": [{
                    "name": item['name'],
                    "description": item['description'],
                    "price": item['price']
                }],
                "restaurant": None  # Placeholder for now
            }
            inserted_category = category_items_collection.insert_one(category_item)
            category_items.append(inserted_category.inserted_id)

    new_restaurant = {
        "name": restaurant['name'],
        "type": restaurant['type'],
        "address": restaurant['address'],
        "phone": restaurant['phone'],
        "email": restaurant['email'],
        "website": restaurant['website'],
        "openingHours": restaurant['openingHours'],
        "menu": category_items
    }
    inserted_restaurant = restaurants_collection.insert_one(new_restaurant)

    # Update the restaurant field in category items
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
