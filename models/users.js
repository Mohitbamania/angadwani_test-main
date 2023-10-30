'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.users_role, { foreignKey: "users_role_id" })
      this.belongsTo(models.users_role, { foreignKey: "initial_users_role_id" })
    }
  }
  users.init({
    users_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: { msg: "Please enter a valid email." },
      },
    },
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    ip: {
      type: DataTypes.STRING,
    },
    device: {
      type: DataTypes.STRING,
    },
    browser: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    number: DataTypes.STRING,
    forgot_pass_otp: DataTypes.INTEGER,
    initial_added_by: DataTypes.UUID,
    added_by: DataTypes.UUID,
    initial_deactivated_by: DataTypes.UUID,
    deactivated_by: DataTypes.UUID,
    users_role_id: DataTypes.STRING,
    initial_users_role_id: DataTypes.STRING,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'users',
    tableName: 'users',
  });
  return users;
};