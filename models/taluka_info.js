'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class taluka_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  taluka_info.init({
    taluka_id: {
      type:DataTypes.UUID,
      primaryKey:true,
      defaultValue:DataTypes.UUIDV4,
      allowNull:false,
    },
    taluka_name: {
      type:DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'taluka_info',
  });
  return taluka_info;
};