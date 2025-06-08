module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    board_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'boards',
        key: 'id',
      },
    },
    user_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'comments',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    underscored: true,
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Board, { foreignKey: 'board_id', as: 'board' });
    // 필요하다면 다른 관계 추가
  };

  return Comment;
};

// 예시: 라우터에서 에러 발생 시 콘솔 출력
// catch (err) {
//   console.error('댓글 등록 중 에러:', err);
//   res.status(500).json({ error: '댓글 등록 실패', details: err.message });
// }

