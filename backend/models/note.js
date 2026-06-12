'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      Note.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Note.init({
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Note',
  });
  return Note;
};