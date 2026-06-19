'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PV extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PV.init({
    username: DataTypes.STRING,
    token: DataTypes.STRING,
    attempts: DataTypes.INTEGER,
    lastAttempt: DataTypes.DATE,
    otp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PV',
  });
  return PV;
};