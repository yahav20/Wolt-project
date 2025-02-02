# Wolt Project

Foo Delivery is a project aimed at providing efficient and reliable delivery services. The project leverages modern technologies to ensure timely and accurate deliveries.

## Features

- Real-time tracking of deliveries
- User-friendly interface
- Integration with various payment gateways
- Scalable microservice architecture
- Display all restaurants
- Handle orders efficiently

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
    ```sh
    git clone https://github.com/yahav20/Wolt-project.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Wolt-Project
    ```
3. Set up the environment variables by creating a `.env` file in the `config` directory and adding the necessary configurations.
   
````bash
CONNECTION_STRING=mongodb://mongo:27017/Wolt
RESTAURANT_SERVICE=http://restaurants:{restaurants_port}
RESTAURANT_PORT={restaurants_port}
ORDERS_SERVICE=http://orders:{order_port}
ORDERS_PORT={order_port}
DELIVERY_SERVICE=http://delivery:{delivery_port}
DELIVERY_PORT={delivery_port}
USERS_SERVICE=http://users:{user_port}
USERS_PORT={user_port}
ROUTER_PORT={router_port}
````
Note you need to replace the ports by what you want you can use .env.dev for example

4. Install Docker Engine you can use this link : https://docs.docker.com/engine/install/

5. Run the project using Docker Compose:
    ```sh
    docker-compose --env-file config/.env.dev up --build
    ```
Note: we take .env.dev for example 

6. open the adress "http://localhost:{router_port}/login.html to use the site , enjoy!
