'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuthCode extends Model {
    static associate(models) {
      // define association here
    }
  }
  AuthCode.init({
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    client_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'AuthCode',
    tableName: 'auth_codes',
  });
  return AuthCode;
};
