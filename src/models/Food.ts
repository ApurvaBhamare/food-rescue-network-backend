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
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
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