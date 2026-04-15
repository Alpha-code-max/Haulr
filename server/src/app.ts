import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler } from "./middlewares/error.middleware";
import userRoutes from "./modules/users/user.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import deliveryRoutes from "./modules/deliveries/delivery.routes";
import walletRoutes from "./modules/wallet/wallet.routes";
import transactionRoutes from "./modules/transaction/transaction.routes";
import driverRoutes from "./modules/driver/driver.routes";
import adminRoutes from "./modules/admin/admin.routes";



const app = express();


app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use("/api/users/", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admin", adminRoutes);

app.get("/health", (_, res) => {
  res.json({ status: "Haulr API running on Bun 🚀" });
});

app.use(errorHandler);

export default app;
