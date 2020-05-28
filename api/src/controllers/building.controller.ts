import { Request, Response } from "express";
import Building from "../models/Building";
import mongodb from "mongodb";
import generateSchema = require("generate-schema"),
  
class BuildingController {
  
  public async getItems(req: Request, res: Response): Promise<void> {
    const tag = req.query.tag;
    const key = req.query.key;
    const kind = req.query.kind;
    const region = req.query.region;
    const sort = req.query.sort;

    let filter = {};

    if (tag !== undefined && tag !== "") filter = { ...filter, tag };
    if (kind !== undefined && kind !== "") filter = { ...filter, kind };

    if (key !== undefined && key !== "") {
      filter = {
        ...filter,
        $or: [
          { title: { $regex: key, $options: "i" } },
          { description: { $regex: key, $options: "i" } },
        ],
      };
    }

    if (region !== undefined && region !== "")
      filter = { ...filter, place: { $regex: region, $options: "i" } };

    if (sort !== undefined && sort !== "" && parseInt(sort) === 0) {
      filter = { ...filter, ads: true };
    }

    const sortObj = parseInt(sort) === 1 ? { browse: -1 } : { _id: -1 };

    await Building.createIndexes();

    let items = [];

    items = await Building.find(filter).sort(sortObj);

    res.json(items);    
  }  

  public async deleteItem(req: Request, res: Response): Promise<any> {
    try {
      const url = req.params.url;
      const deletedItem = await Building.findOneAndDelete(
        { _id: new mongodb.ObjectID(url) },
        req.body
      );

      if (!deletedItem)
        return res.status(400).json({
          success: false,
          msg: "Item not deleted",
        });

      res.status(200).json({
        success: true,
        msg: "Item deleted.",
        item: deletedItem,
      });
    } catch (err) {
      console.log("error => ", err);
      res.status(500).json({
        success: false,
        msg: "Item not deleted",
      });
    }
  }
}

export default new BuildingController();