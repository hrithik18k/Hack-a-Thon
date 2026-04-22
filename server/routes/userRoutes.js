const express = require("express");
const { auth, requireRole } = require("../middleware/auth");
const userController = require("../controllers/userController");
const userRouter = express.Router();

userRouter.get("/getuser/:id", auth, userController.getuser);

userRouter.get("/getallusers", auth, requireRole("Admin"), userController.getallusers);

userRouter.post("/login", userController.login);

userRouter.post("/register", userController.register);

userRouter.post("/forgotpassword", userController.forgotpassword);

userRouter.post("/resetpassword/:id/:token", userController.resetpassword);

userRouter.put("/updateprofile", auth, userController.updateprofile);

userRouter.put("/changepassword", auth, userController.changepassword);


userRouter.delete("/deleteuser", auth, requireRole("Admin"), userController.deleteuser);


module.exports = userRouter;
