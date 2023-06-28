# tunyceMedia

Node.js application with API endpoints for login, signup, and a secret route. Uses MongoDB to store the user data.

- /login: Endpoint for user login. Accepts a POST request with username and password in the request body. Returns a response indicating successful login or authentication failure.

- /signup: Endpoint for user signup. Accepts a POST request with username, password, and other required user information in the request body. Creates a new user in the database.

- /secret: Endpoint to access a secret route. Requires user authentication. Returns the secret content.

1. Install node.js, mongo database and npm on your system.
2. Install dependencies:- npm i bcrypt ejs express mongoose body-parser express-session nodemon
3. Run the app with this command - nodemon app.js
