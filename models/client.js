'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    static associate(models) {
      // define association here
    }
  }
  Client.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail:true
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    client_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    client_secret: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    redirect_uri: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
  });
  return Client;
};
