const db = require('../models');
const { Op } = require('sequelize');

const { Department } = db;

const dao = {
  insert(params) {
    return Department.create(params);
  },
  selectList(params) {
    const setQuery = {};
    if (params.name) {
      setQuery.where = {
        ...setQuery.where,
        name: { [Op.like]: `%${params.name}%` },
      };
    }
    setQuery.order = [['id', 'DESC']];

    return Department.findAndCountAll({
      ...setQuery,
    });
  },
};

module.exports = dao;