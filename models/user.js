'use strict';
const {Model} = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {

  class User extends Model {
    static associate(models) {
      // define association here
    }
    static async getUserByEmailAndPassword(email, password){
      if (!email || !password){
        return false;
      }

      var user = await this.findOne({where: {email}});

      if (!user) {
        return false;
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return false;
      }

      return user;
    }
  }

  User.init({
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
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value){
        if (value){
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(value, salt);
          this.setDataValue('password', hash);
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  });

  return User;
};
