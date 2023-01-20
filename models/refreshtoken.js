'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      // define association here
    }
  }
  RefreshToken.init({
    token: {
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
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
  });
  return RefreshToken;
};
