import { app } from "./app";
import "./config/database";

const PORT = 1000;

app.listen(PORT, () =>
  console.log(`Server is running in port: http://localhost:${PORT}`)
);
