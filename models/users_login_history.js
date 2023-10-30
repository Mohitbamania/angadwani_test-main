'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users_login_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users, { foreignKey: "users_id" })
    }
  }
  users_login_history.init({
    users_login_history_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    ip: {
      type: DataTypes.STRING,
    },
    device: {
      type: DataTypes.STRING,
    },
    browser: {
      type: DataTypes.STRING,
    },
    users_id: {
      type: DataTypes.UUID,
    },
  }, {
    sequelize,
    modelName: 'users_login_history',
    tableName: 'users_login_histories',
  });
  return users_login_history;
};