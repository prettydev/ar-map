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
    // this.router.get("/:url", buildingController.getItem);
    // this.router.put("/:url", buildingController.updateItem);
    this.router.delete("/:url", tokenValidation, buildingController.deleteItem);

    this.router.post("/", upload, async (req: Request, res: Response) => {
      if (req.file) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaa", req.file);
        const file_name = req.file.filename;
        if (!(file_name.endsWith(".xlsx") || file_name.endsWith(".csv"))) {
          res.json({ error: "only xlsx and csv filed to be uploaded" });
        }
        const file_path = path.join(file_upload_path, req.file.filename);
        const workbook = xlsx.readFile(file_path);
        const sheet_name_list = workbook.SheetNames;
        const rows = xlsx.utils.sheet_to_json(
          workbook.Sheets[sheet_name_list[0]]
        );

        console.log(rows);

        try {
          await Building.insertMany(rows);

          res.status(200).json({
            success: true,
            msg: "success!",
          });
        } catch (err) {
          console.log("err.......", err);
          res.status(200).json({
            success: false,
            msg: "failed!",
          });
        }
      } else {
        console.log("no attach");
        res.status(200).json({
          success: false,
          msg: "no attach!",
        });
      }
    });
  }
}

const itemRoutes = new BuildingRoutes();
export default itemRoutes.router;
