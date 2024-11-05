import { createBaseServer } from "./base_backend/create";
import * as express from "express";

const PORT = process.env.CANVA_BACKEND_PORT || 3001;

// create an empty router or use custom routes if required
const router = express.Router();

// Initialise the server
const server = createBaseServer(router);

// Start the server on the specified port
server.start(PORT);
