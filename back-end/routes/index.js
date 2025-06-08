const express = require('express');
const departmentRouter = require('./department');
const paymentRouter = require('./payment');
const router = express.Router();

router.use('/departments', departmentRouter);
router.use('/payment', paymentRouter); // '/naverpay' 대신 '/pay'

module.exports = router;