## Getting Started

Let's dive into the setup process:

## Installation

Start by installing the necessary dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

## MongoDB Setup

Create a new cluster on [MongoDB](https://www.mongodb.com/) and grab the URI.
Check the `.env.example` file for guidance on creating the variable and paste the URI.

## Run the Server

Now, fire up the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
docker-compose up -d --build
```

## Explore the API

Open [http://localhost:8080/api/docs/](http://localhost:8080/api/docs/) in your browser to access the API documentation.

## Tools

This API was built with:

-   Typescript
-   NodeJs
-   Nodemon
-   Express
-   Mongoose
