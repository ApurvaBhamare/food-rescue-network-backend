import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Food = sequelize.define("Food", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  hotel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  food_name: {
  type: DataTypes.STRING(150),
  allowNull: false,
  validate: {
    notEmpty: {
      msg: "Food name is required",
    },
    len: {
      args: [2, 150],
      msg: "Food name must be between 2 and 150 characters",
    },
  },
},
  quantity: {
  type: DataTypes.INTEGER,
  allowNull: false,
  validate: {
    min: {
      args: [1],
      msg: "Quantity must be at least 1",
    },
    isInt: {
      msg: "Quantity must be a whole number",
    },
  },
},
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  expiry_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("AVAILABLE", "CLAIMED", "PICKED_UP"),
    defaultValue: "AVAILABLE",
    allowNull: false,
  },

  claimed_by_ngo_id: {
  type: DataTypes.INTEGER,
  allowNull: true,
},


});