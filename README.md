### Employee Routes

- `GET /employees` - Fetch all employees.
- `GET /employees/:id` - Fetch a specific employee by ID.
- `POST /employees` - Create a new employee.
- `PUT /employees/:id` - Update an existing employee.
- `DELETE /employees/:id` - Delete an employee.

### Project Routes

- `GET /projects` - Fetch all projects.
- `GET /projects/:id` - Fetch a specific project by ID.
- `POST /projects` - Create a new project.
- `PUT /projects/:id` - Update an existing project.
- `DELETE /projects/:id` - Delete a project.

### User Routes

- `POST /register` - Register a new user.
- `POST /login` - Log in an existing user.
- `POST /logout` - Log out the current user.

### Employee Pair Route

- `GET /employees-pair` - Calculate the longest working employee pairs from a CSV file. Requires a `filePath` query parameter pointing to the CSV file.

## Local Development

### Prerequisites

- Node.js
- Docker (optional for containerized development)

### Installation

1. Install dependencies:
   npm install
   
2. Create a .env file in the root directory with the following example variables:

   PORT=5000
   JWT_KEY=your_jwt_secret
   MONGO_URI=mongodb://localhost:27017/employees-app

3. Start the application
   npm start

### Testing

1. Run the test suite using:
   npm run test

### Running with Docker

1. Build and start the containers:
   docker-compose up --build

2. The app will be available at http://localhost:5001.

### Postman Collection

A Postman collection is included in the repository: KM_Emploees_App.postman_collection.json. Import it into Postman to test the API endpoints.

### CSV File for Employee Pair Calculation

Place your CSV file in the data/ directory. Use the GET /employees-pair endpoint with the filePath query parameter to calculate the longest working employee pairs.

example: GET /employees-pair?filePath=employees.csv

##
