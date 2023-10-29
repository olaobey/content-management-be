# content-management-be
A RESTful API for content management to perform CRUD operation on post with category and user profile. The API supports user authentication and authorization, enabling users to create and manage their own posts.
Content Management project is a comprehensive platform that empowers users with essential features for managing their content seamlessly. Users can easily register, login, and access a convenient "forgot password" option for account recovery. The system also provides functionalities to retrieve all user profiles, access specific user profiles by ID, and reset passwords for enhanced security.

In addition to user management, this project equips users with the ability to create, edit, delete, and update posts, ensuring the effortless organization and customization of their content. Furthermore, users can effortlessly create, edit, delete, and update categories, enabling them to efficiently categorize and manage their content according to their preferences.

## **Getting Started**

### **Prerequisites**

Before you can run the API, you will need to have the following installed:

- Node.js(v14 or later)

- Mongodb atlas

### **Installing**

Clone the repository to your local machine.

In the root directory, create a .env file and add the
following environment variables:

1. Clone the repository to your local machine.
2. Install the required dependencies with npm install
3. In the root directory, create a **`.env`** file based on the **`.env.example`** file, and update the values as needed with the following variables

- MONGO_DB= **`mongodb url`**
- PORT= **`specified number`**
- JWT_SECRET= **`jwt secret`**
- NODE_ENV= **`stage of the project`**

4. Run **`npm install`** to install the required packages.
5. The API server will start running on http://localhost:5000. You can now send HTTP requests to the API endpoints.

## **Running**

To start the API, **`run npm start dev`**.

## **E-Contributing**

If you'd like to contribute to the Project Name, follow these steps:

1. Fork the repository using this link: [GitHub](https://github.com/olaobey/content-management-be)
2. Create a new branch for your changes
3. Make your changes and commit them to your branch
4. Push your branch to your forked repository
5. Create a pull request to merge your changes into the main repository

## **API Endpoints**

## **Base_Url**

[BASE_URL](https://content-management-be.onrender.com)

### **Authentication**

- POST api/v1/user/register: `Register a new user.`
- POST api/v1/user/login: `Log in and generate a JWT token.`
- POST api/v1/user/forgot: `Link to get new password.`
- GET api/v1/user/getUsers: `Getting all users.`
- GET api/v1/user/getUser: `Getting a user`
- POST api/v1/user/reset: `resetting a new password`
- DELETE api/v1/user/logout: `Log out to clear cookies if exist`

### **Blog Posts**

- GET api/v1/posts/getPosts: `Get a list of all blog posts.`
- GET api/v1/posts/get/:id: `Get a specific blog post by ID.`
- POST api/v1/posts/addBlog: `Create a new blog post.`
- PUT api/v1/posts/update/:id: `Update an existing blog post by ID.`
- DELETE api/v1/posts/remove: `Delete a blog post by ID.`

### **Categories**

- POST api/v1/categories/create: `Create a new blog category`
- PUT api/v1/categories/update/:id: `Update a blog category`
- GET api/v1/categories/get: `Get a list of all categories.`
- DELETE api/v1/categories/remove/:id: `Delete a blog category by ID.`

## **Built With**

- bcrypt
- cookie-parser
- cors
- date-fns
- dotenv
- express
- express-paginate
- express-validator
- jsonwebtoken
- mongoose
- mongoose-unique-validator
- winston
- hpp
- morgan
- uuid
- helmet

### **Devdependency**

- nodemon

## **License**

This project is licensed under the MIT License
