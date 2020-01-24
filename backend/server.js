const express = require("express");
const cors = require("cors");

const loginController = require("./lib/controllers/login");
const dashboardController = require("./lib/controllers/dashboard");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: "100"
  })
);

router.post("/login", loginController.emailLogin);
router.post("/verify-2fa", loginController.verify2FA);
router.get("/dashboard", dashboardController.get);

app.use(router);

app.listen(3001, () => {
  console.log("App rodando na porta 3001.");
});
