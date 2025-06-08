module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('comments', {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        board_id: { type: Sequelize.INTEGER, allowNull: false },
        user_id: { type: Sequelize.STRING(255), allowNull: false },
        content: { type: Sequelize.TEXT, allowNull: false },
        created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      });
    },
    down: async (queryInterface) => {
      await queryInterface.dropTable('comments');
    }
  };