const logger = require('../lib/logger');
const departmentDao = require('../dao/departmentDao');

const service = {
  async reg(params) {
    try {
      const inserted = await departmentDao.insert(params);
      logger.debug(`(departmentService.reg) ${JSON.stringify(inserted)}`);
      return inserted;
    } catch (err) {
      logger.error(`(departmentService.reg) ${err.toString()}`);
      throw err;
    }
  },
  async list(params) {
    try {
      const result = await departmentDao.selectList(params);
      logger.debug(`(departmentService.list) ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      logger.error(`(departmentService.list) ${err.toString()}`);
      throw err;
    }
  },
};

module.exports = service;