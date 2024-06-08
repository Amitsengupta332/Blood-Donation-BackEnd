# Blood Donation Application

- Live Link : https://blood-donation-backend-ten.vercel.app/

This Blood Donation Application is a TypeScript-based web application built using Express.js and Prisma for PostgreSQL as the Object Relational Mapping (ORM) tool. It allows users to register, login, request blood donations, manage donation requests, and update their profiles.

## Technology Stack:

- **Programming Language:** TypeScript
- **Web Framework:** Express.js
- **Object Relational Mapping (ORM):** Prisma for PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)

## Features:

- User registration and authentication
- Donor and requester profiles
- Blood donation request management
- Profile update functionality

## Endpoints:

Detailed information about endpoints, request bodies, response structures, and sample responses can be found in the [Endpoints](#endpoints) section of the README.

## Error Handling:

The application implements proper error handling throughout, including global error handling middleware to catch and handle errors, providing appropriate error responses with status codes and error messages.

## Getting Started:

To set up the project locally, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Set up your PostgreSQL database and configure the connection string in `.env` file.
4. Run database migrations using `npx prisma migrate dev`.
5. Start the server using `npm start`.

## Contribution Guidelines:

If you'd like to contribute to this project, please follow these guidelines:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Create a new Pull Request.

## License:

This project is licensed under the [MIT License](LICENSE).
