# Inventory Management System

A full-stack inventory and supplier management system built with Angular on the frontend and a Node.js (Express) backend with a MySQL database.

## Features

### Inventory Management
- **CRUD Operations:** Create, read, update, and delete inventory items.
- **Supplier Association:** Link inventory items to their respective suppliers.
- **Dynamic Filtering:** Filter inventory by category (Electronics, Furniture, etc.) and stock levels (Low, In Stock, Out of Stock).
- **Real-time Updates:** The user interface updates instantly after any operation.

### Supplier Management
- **CRUD Operations:** Add, view, edit, and delete suppliers.
- **Data Integrity:** When a supplier is deleted, all associated inventory items are updated to reflect the change (supplier is set to NULL).

## Tech Stack

- **Frontend:**
  - [Angular](https://angular.io/)
  - [Angular Material](https://material.angular.io/) for UI components.
  - [TypeScript](https://www.typescriptlang.org/)
  - [RxJS](https://rxjs.dev/)

- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express.js](https://expressjs.com/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [MySQL2](https://github.com/sidorares/node-mysql2) for database connection.

- **Database:**
  - [MySQL](https://www.mysql.com/)

## Project Structure

```
Invent/
├── backend/         # Node.js/Express backend source code
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
└── frontend/        # Angular frontend source code
    ├── src/
    ├── package.json
    └── angular.json
```

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v18.x or higher recommended)
- [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/)
- [MySQL](https://dev.mysql.com/downloads/mysql/)

## Setup and Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Invent
```

### 2. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    - Connect to your MySQL server.
    - Create a new database named `inventory_management`.
    - Run the following SQL script to create the necessary tables:

    ```sql
    CREATE TABLE suppliers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        phone VARCHAR(255),
        address VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE inventory (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        supplier_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
    );
    ```

4.  **Configure database connection:**
    - Open the file `backend/src/config/db.ts`.
    - Update the `password` field with your MySQL root password.

5.  **Start the backend server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

### 3. Frontend Setup

1.  **Navigate to the frontend directory (from the root `Invent/` folder):**
    ```bash
    cd ../frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Angular development server:**
    ```bash
    npm start
    ```
    The application will be available at `http://localhost:4200`.

## API Endpoints

### Inventory

| Method | Endpoint             | Description                  |
|--------|----------------------|------------------------------|
| `GET`  | `/api/inventory`     | Get all inventory items      |
| `GET`  | `/api/inventory/:id` | Get a single inventory item  |
| `POST` | `/api/inventory`     | Create a new inventory item  |
| `PUT`  | `/api/inventory/:id` | Update an inventory item     |
| `DELETE`| `/api/inventory/:id` | Delete an inventory item     |
| `GET`  | `/api/inventory/filter`| Filter inventory items       |

### Suppliers

| Method | Endpoint           | Description            |
|--------|--------------------|------------------------|
| `GET`  | `/api/suppliers`   | Get all suppliers      |
| `GET`  | `/api/suppliers/:id`| Get a single supplier  |
| `POST` | `/api/suppliers`   | Create a new supplier  |
| `PUT`  | `/api/suppliers/:id`| Update a supplier      |
| `DELETE`| `/api/suppliers/:id`| Delete a supplier      |
