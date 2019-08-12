import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import routes from "./routes/routes";
import firebase from "./config/firebase.config";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use('/github/auth', routes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`running on port ${port}`));

export default app;