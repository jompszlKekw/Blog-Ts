import { Router } from 'express';

import { validRegister } from './middleware/valid';
import { auth } from './middleware/auth';

import { AuthController } from './controllers/authController';
import { UserController } from './controllers/userController';
import { CategoryController } from './controllers/categoryController';
import { BlogController } from './controllers/blogController';
import { CommentController } from './controllers/commentController';

const routes = Router();

const authController = new AuthController();
const userController = new UserController();
const categoryController = new CategoryController();
const blogController = new BlogController();
const commentController = new CommentController();

routes.post('/api/register', validRegister, authController.register);

routes.post('/api/active', authController.activeAccount);
routes.get('/api/refresh_token', authController.refreshToken);

routes.post('/api/login', authController.login);
routes.get('/api/logout', authController.logout);

routes.post('/api/google_login', authController.googleLogin);
routes.post('/api/facebook_login', authController.facebookLogin);

routes.post('/api/login_SMS', authController.loginSMS);
routes.post('/api/sms_verify', authController.smsVerify);

routes.patch('/api/user', auth, userController.updateUser);
routes.patch('/api/reset_password', auth, userController.resetPassword);
routes.get('/api/user/:id', userController.getUser);

routes.post('/api/category', auth, categoryController.createCategory);
routes.get('/api/category', categoryController.getCategory);
routes.patch('/api/category/:id', auth, categoryController.updateCategory);
routes.delete('/api/category/:id', auth, categoryController.deleteCategory);

routes.post('/api/createBlog', auth, blogController.createBlog);
routes.get('/api/home/blogs', blogController.getHomeBlogs);
routes.get('/api/blogs/category/:id', blogController.getBlogsByCategory);
routes.get('/api/blogs/user/:id', blogController.getBlogsByUser);
routes.get('/api/blog/:id', blogController.getBlog);

routes.post('/api/comment', auth, commentController.createComment);
routes.get('/api/comments/blog/:id', commentController.getCommets);
routes.post('/api/reply_comment', auth, commentController.replyComment);
routes.patch('/api/comment/:id', auth, commentController.updateComment);
routes.delete('/api/comment/:id', auth, commentController.deleteComment);

export { routes };
