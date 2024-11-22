Register a User (POST /register):
  Send a POST request to /register with JSON body containing name, email, and password.
Login (POST /login):
  Send a POST request to /login with email and password, and get a JWT token in the response.
Access Protected Route (GET /profile):
  Send a GET request to /profile with the Authorization header set as Bearer <your-jwt-token> to access the protected route.
