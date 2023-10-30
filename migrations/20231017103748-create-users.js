'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('users', {
      users_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
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
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('users');
  }
};