const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { Comment } = require('../models');

// 댓글 등록
router.post('/api/board/:id/comments', authenticate, async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id;
  const userName = req.user.name;
  const boardId = req.params.id;

  if (!content) return res.status(400).json({ message: '내용이 없습니다.' });
  if (!userId || !userName) return res.status(400).json({ message: '유저 정보가 없습니다.' });

  try {
    await Comment.create({ content, board_id: boardId, user_id: userId, user_name: userName });
    res.status(201).json({ message: '댓글 작성 완료' });
  } catch (err) {
    res.status(500).json({ message: '댓글 등록 실패', error: err.message });
  }
});

module.exports = router;