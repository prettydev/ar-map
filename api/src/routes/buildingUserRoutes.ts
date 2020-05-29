import { Router } from "express";
import buildingController from "../controllers/building.controller";
import { tokenValidation } from "../middlewares/verifyToken";
import multer from "multer";
import path from "path";
import xlsx from "xlsx";
import Building from "../models/Building";

declare let process: {
  env: {
    NODE_ENV: string;
  };
};

const file_upload_path = "uploads"; //path.join(process.env.root_path, "uploads");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, file_upload_path);
  },
  filename: (req, file, callback) => {
    callback(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  onError: (err, next) => {
    console.log("error" + err);
  },
}).single("file");

class BuildingRoutes {
  router: Router;

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/", buildingController.getItems);
  }
}

const itemRoutes = new BuildingRoutes();
export default itemRoutes.router;
