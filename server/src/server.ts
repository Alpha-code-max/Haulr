import { env } from "./config/env";
import app from "./app";
import { connectDB } from "./config/database";

const PORT = env.PORT;

await connectDB();

app.listen(PORT, () => {
  console.log(`🚚 Haulr API running on port ${PORT}`);
});
