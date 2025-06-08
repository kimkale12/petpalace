module.exports = (sequelize, DataTypes) => {
  const Reservation = sequelize.define('Reservation', {
    order_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    user_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    room_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    check_in: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    check_out: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    total_price: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending'
    }
  }, {
    tableName: 'reservations',
    underscored: true,
    timestamps: true
  });
  return Reservation;
}