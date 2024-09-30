# Arena MRV Backend

This is the backend service for the Arena MRV website. It provides data about matches and concerts happening at the Arena MRV, and includes a WhatsApp notification system for upcoming events.

## Technologies Used

- Node.js
- TypeScript
- Express
- Apollo Server (GraphQL)
- TypeORM
- PostgreSQL
- Twilio (for WhatsApp notifications)

## Project Structure

- `src/`: Source code
  - `index.ts`: Main entry point
  - `whatsappBot.ts`: WhatsApp notification logic
  - `scrape/`: Web scraping logic for matches and concerts
  - `model/`: Database models
  - `schema.ts`: GraphQL schema
  - `resolvers.ts`: GraphQL resolvers

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- Twilio account (for WhatsApp notifications)

## Setup

1. Clone the repository:

   ```
   git clone https://github.com/your-username/arena-mrv-backend.git
   cd arena-mrv-backend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:

   ```
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   DATABASE_URL=postgres://username:password@localhost:5432/arena-mrv-db
   ```

4. Set up the PostgreSQL database:
   - Create a new database named `arena-mrv-db`
   - Update the `DATABASE_URL` in the `.env` file with your PostgreSQL credentials

## Running the Application

1. Start the development server:

   ```
   npm run dev
   ```

2. The server will start running at `http://localhost:4000/graphql`

## Available Scripts

- `npm start`: Builds and runs the production version
- `npm run dev`: Runs the development server with hot-reloading
- `npm test`: Runs the test suite (currently not
