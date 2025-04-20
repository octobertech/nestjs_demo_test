Nest.JS demo app

Basic crud app for users managing using Postgresql database and Prisma, also JWT for authentication. Supports http error handling, requests logger middleware and input validation.

Installation and setting up:

Make sure to install all dependencies via npm i command
Create .env file with Postgresql database url and JWT secret
Run npx prisma migrate dev --name check-config --schema ./prisma/schema.prisma for creating a table
Run npx prisma generate to create Prisma client
Run npm run start:dev (debug/prod) to run backend
Use postman collection for testing backend endpoints: you may want to comment out @UseGuards(JwtAuthGuard) in users.controller for initial user creation via POST to circumvent JWT check 
Run npm run test for unit testing via Jest