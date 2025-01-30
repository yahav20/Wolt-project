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

4. Install Docker Engine you can use this link : https://docs.docker.com/engine/install/

5. Run the project using Docker Compose:
    ```sh
    docker-compose --env-file config/.env.dev up --build
    ```
Note: we take .env.dev for example 
