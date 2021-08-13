import { Router } from "express";
import { AuthController } from "./controllers/authController";
import { validRegister } from "./middleware/valid";

const routes = Router();

const authController = new AuthController();

routes.post("/api/register", validRegister, authController.register);

routes.post("/api/active", authController.activeAccount);
routes.post("/api/refresh_token", authController.refreshToken);

routes.post("/api/login", authController.login);
routes.get("/api/logout", authController.logout);

routes.post("/api/google_login", authController.googleLogin);
routes.post("/api/facebook_login", authController.facebookLogin);

routes.post("/api/login_SMS", authController.loginSMS);
routes.post("/api/sms_verify", authController.smsVerify);

export { routes };
