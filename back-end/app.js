require('dotenv').config(); // 맨 위에 위치

const express = require('express');
const app = express();

const cors = require('cors');
const corsConfig = require('./config/corsConfig.json');
const logger = require('./lib/logger');
const models = require('./models/index');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
// const userRouter = require('./routes/users');
const reservationRouter = require('./routes/reservation');
const inquiryRouter = require('./routes/inquiry');
const authRoutes = require('./routes/auth.routes');
const adminRouter = require('./routes/admin');
const paymentRouter = require('./routes/payment');
const boardRouter = require('./routes/board');

// 미들웨어 등록 (중복 제거)
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 라우터 등록
app.use('/api', indexRouter);
app.use('/api/users', userRouter); // users만 남김
app.use('/api/reservations', reservationRouter);
app.use('/api/inquiries', inquiryRouter);
app.use('/api', authRoutes);
app.use('/api/admin', adminRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/board', boardRouter);

app.use('/api/user', userRouter);
// app.use('/api/users', userRouter)

// 모든 요청 로깅
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// DB 연결 및 동기화
models.sequelize.authenticate().then(() => {
  logger.info('DB connection success');
  models.sequelize.sync().then(() => {
    logger.info('Sequelize sync success');
  }).catch((err) => {
    logger.error('Sequelize sync error', err);
  });
}).catch((err) => {
  logger.error('DB Connection fail', err);
});

module.exports = app;