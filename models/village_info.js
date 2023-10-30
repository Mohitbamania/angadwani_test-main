'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class village_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  village_info.init({
    village_id: {
      type:DataTypes.UUID,
      allowNull:false,
    },
    village_name: {
      type:DataTypes.STRING,
    },
    taluka_id: {
      type:DataTypes.UUID,
      defaultValue:DataTypes.UUIDV4,
      allowNull:false,
    },
  }, {
    sequelize,
    modelName: 'village_info',
  });
  return village_info;
};