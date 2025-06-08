// models/inquiry.js
module.exports = (sequelize, DataTypes) => {
    const Inquiry = sequelize.define('Inquiry', {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      message: DataTypes.TEXT,
      room: DataTypes.STRING
    });
    return Inquiry;
  };