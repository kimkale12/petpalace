module.exports = {
  development: {
    username: 'postgres', // 본인 DB 사용자명
    password: '1111', // 본인 DB 비밀번호
    database: 'petplace', // 본인 DB 이름
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: 'postgres',
    password: 'your_password',
    database: 'petplace_test',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: 'postgres',
    password: 'your_password',
    database: 'petplace_prod',
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
  }
}; 