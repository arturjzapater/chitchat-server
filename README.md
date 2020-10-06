# ChitChat

[Client repository](https://github.com/arturjzapater/chitchat-client)

Chitchat is a simple chatting webapp. This server is written in [Node](https://nodejs.org/en/), using [Express](https://expressjs.com/) and [Socket.IO](https://socket.io/)

## Install and Run

This project requires node >= 12.

Clone and install its dependencies:

```bash
git@github.com:arturjzapater/chitchat-server.git
cd chitchat-server
npm i
```

To run the server in development mode, use:

```bash
npm run dev
```

To run the server in production mode, use:

```bash
npm start
```

## Test

This project uses [mocha](https://mochajs.org/) as its testing library. Its browser tests use [puppeteer](https://github.com/puppeteer/puppeteer/) to run a headless browser.

To run unit tests, use:

```bash
npm t
```

To run end-to-end tests, you will need a copy of the [client](https://github.com/arturjzapater/chitchat-client). Make sure that both client and server are running on development mode and use:

```bash
npm run e2e
```

## Configuration

The socket's timeout for inactivity can be configured in [config/socket.js](config/socket.js)

## Project Structure

The code of this project is in the [src](src) directory. Its main file is [index.js](src/index.js), which loads the routes and socket and starts the server. [app.js](src/app.js) defines the express application. It also has the following folders:

- [chatroom](src/chatroom): contains the logic pertaining to the websockets. The socket's events are defined in [index.js](src/chatroom/index.js) and the controller functions in [controller.js](src/chatroom/controller.js).
- [middleware](src/middleware): contains the server's middleware. The logging middleware for the socket server is defined in [logger.js](src/middleware/logger.js).
- [users](src/users): keeps track of the users connected to the chatroom. The module's main logic is in [index.js](src/users/index.js). [routes.js](src/users/routes.js) contains the definition of the route `/api/users/:nickname/exists` to allow checking if a nickname is already taken via the API.

The unit tests are included in its relevant modules using the extension `.test.js`. The end-to-end tests are contained in the folder [e2e](e2e).

## Considerations on Scalability

The application is as modular as possible. The modules are short and keep to the single responsibility principle. The goal is to make the code easy to maintain and expand.

The [users](src/users/index.js) module keeps the information regarding connected users in the server's memory. It has been done this way because it is a quick, easy way to keep state. However, if the application were to grow and serve many users at the same time, a different solution would need to be found. A database might be used to keep the load of storing user data off the server. Due to the modularity of the code, this could be achieved with minimal change outside of the user module.
