import { Router } from "express";

import { AuthController } from "./controllers/authController";
import { UserController } from "./controllers/userController";
import { CategoryController } from "./controllers/categoryController";

import { validRegister } from "./middleware/valid";
import { auth } from "./middleware/auth";
import { BlogController } from "./controllers/blogController";

const routes = Router();

const authController = new AuthController();
const userController = new UserController();
const categoryController = new CategoryController();
const blogController = new BlogController();

routes.post("/api/register", validRegister, authController.register);

routes.post("/api/active", authController.activeAccount);
routes.post("/api/refresh_token", authController.refreshToken);

routes.post("/api/login", authController.login);
routes.get("/api/logout", authController.logout);

routes.post("/api/google_login", authController.googleLogin);
routes.post("/api/facebook_login", authController.facebookLogin);

routes.post("/api/login_SMS", authController.loginSMS);
routes.post("/api/sms_verify", authController.smsVerify);

routes.patch("/api/user", auth, userController.updateUser);
routes.patch("/api/reset_password", auth, userController.resetPassword);

routes.post("/api/category", auth, categoryController.createCategory);
routes.get("/api/category", categoryController.getCategory);
routes.patch("/api/category/:id", auth, categoryController.updateCategory);
routes.delete("/api/category/:id", auth, categoryController.deleteCategory);

routes.post("/api/createBlog", auth, blogController.createBlog);
routes.get("/api/home/blogs", blogController.getHomeBlogs);
routes.get("/api/blogs/:category_id", blogController.getBlogsByCategoryId);

export { routes };
