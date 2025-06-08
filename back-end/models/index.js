const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('./connection');

const UserModel = require('./user');
const BoardModel = require('./board');
const Department = require('./department');
const CommentModel = require('./comment');
const ReservationModel = require('./reservation.model');

const db = {};

// 모델 등록
try {
  db.User = UserModel(sequelize, DataTypes);
  db.Board = BoardModel(sequelize, DataTypes);
  db.Comment = CommentModel(sequelize, DataTypes);
  db.Reservation = ReservationModel(sequelize, DataTypes);
  db.Inquiry = require('./inquiry')(sequelize, DataTypes);

  // Department 클래스 초기화
  Department.init(
    {
      name: DataTypes.STRING(50),
      code: DataTypes.STRING(50),
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Department',
      tableName: 'departments',
      underscored: true,
      timestamps: true,
      paranoid: true,
    }
  );
  db.Department = Department;

  // 관계 설정
  const models = [db.User, db.Board, db.Comment, db.Department, db.Reservation];
  models.forEach(model => {
    if (model && typeof model.associate === 'function') {
      model.associate(db);
    }
  });

  // Reservation과 User 관계 설정
  db.Reservation.belongsTo(db.User, { foreignKey: 'userId' });
  db.User.hasMany(db.Reservation, { foreignKey: 'userId' });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

} catch (error) {
  console.error('모델 초기화 중 오류 발생:', error);
  throw error;
}

module.exports = db;