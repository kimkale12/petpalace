const express = require('express');
const { Board, User, Comment } = require('../models');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const bcrypt = require('bcrypt');



// 게시글 등록 (DB에 저장)
router.post('/', async (req, res) => {
  try {
    const { title, content, category, user_id } = req.body;

    if (!title || !content || !category || !user_id) {
      return res.status(400).json({ error: '필수값 누락 (title, content, category, user_id)' });
    }

    const newBoard = await Board.create({
      title,
      content,
      category,
      user_id
    });

    res.status(201).json({ success: true, post: newBoard });
  } catch (err) {
    console.error('게시글 등록 실패:', err);
    res.status(500).json({ error: '게시글 등록 실패', details: err.message });
  }
});

// 게시글 목록 조회
router.get('/', async (req, res) => {
  try {
    const boards = await Board.findAll({
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });
    res.json(boards);
  } catch (err) {
    res.status(500).json({ error: '게시글 조회 실패' });
  }
});

// 게시글 상세 조회 + 조회수 1 증가
router.get('/:id', async (req, res) => {
  try {
    const board = await Board.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });
    if (!board) return res.status(404).json({ error: 'Not found' });

    // 조회수 1 증가
    board.views += 1;
    await board.save();

    res.json(board);
  } catch (err) {
    res.status(500).json({ error: '상세 조회 실패' });
  }
});

// 게시글 수정
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, content, category } = req.body;

    const board = await Board.findByPk(id);
    if (!board) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }

    await board.update({ title, content, category });
    res.json({ success: true, post: board });
  } catch (err) {
    res.status(500).json({ error: '게시글 수정 실패', details: err.message });
  }
});

// 게시글 삭제
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const result = await Board.destroy({ where: { id } });
    if (!result) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: '게시글 삭제 실패', details: err.message });
  }
});

// 게시글 조회수 반환
router.get('/:id/views', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const board = await Board.findByPk(id);
    if (!board) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    res.json({ views: board.views });
  } catch (err) {
    res.status(500).json({ error: '조회수 조회 실패', details: err.message });
  }
});

// 게시글 좋아요 1 증가
router.post('/:id/like', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const board = await Board.findByPk(id);
    if (!board) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    board.likes += 1;
    await board.save();
    res.json({ success: true, likes: board.likes });
  } catch (err) {
    res.status(500).json({ error: '좋아요 증가 실패', details: err.message });
  }
});

// 게시글 좋아요 수 반환
router.get('/:id/likes', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const board = await Board.findByPk(id);
    if (!board) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    res.json({ likes: board.likes });
  } catch (err) {
    res.status(500).json({ error: '좋아요 조회 실패', details: err.message });
  }
});

// 게시글 삭제
router.delete('/board/:id', authenticate, async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;
  const user = await User.findByPk(userId);
  if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
  const board = await Board.findByPk(req.params.id);
  if (!board) return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
  await board.destroy();
  res.json({ success: true });
});


// 댓글 등록
router.post('/:id/comments', async (req, res) => {
  try {
    // ✅ 여기에 수정
    const { content, user_name } = req.body;
    if (!content || !user_name) {
      return res.status(400).json({ error: '댓글 내용 또는 유저 정보가 누락되었습니다.' });
    }

    const comment = await Comment.create({
      board_id: Number(req.params.id),
      user_name,
      content
    });

    res.json({ success: true, comment });
  } catch (err) {
    res.status(500).json({ error: '댓글 등록 실패', details: err.message });
  }
});

// 댓글 목록 조회
router.get('/:id/comments', async (req, res) => {
  try {
    const board_id = Number(req.params.id);
    const comments = await Comment.findAll({
      where: { board_id },
      order: [['created_at', 'ASC']],
      // include: [
      //   { model: User, as: 'user', attributes: ['id', 'name', 'role'] }
      // ]
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: '댓글 조회 실패', details: err.message });
  }
});

//댓글 삭제
router.delete('/comments/:commentId', authenticate, async (req, res) => {
  try {
    // 여러 경로에서 password를 받아옴
    const password = req.body?.password || req.query?.password || req.headers['x-password'];
    const userId = req.user.id;

    if (!password) return res.status(400).json({ error: '비밀번호가 필요합니다.' });

    // 1. 유저의 비밀번호 해시 조회
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });

    // 2. 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });

    // 3. 댓글 삭제
    const comment = await Comment.findByPk(req.params.commentId);
    if (!comment) return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });

    // (권한 체크: 본인 댓글만 삭제 가능)
    if (comment.user_id && comment.user_id !== userId) {
      return res.status(403).json({ error: '본인 댓글만 삭제할 수 있습니다.' });
    }

    await comment.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('댓글 삭제 에러:', err);
    res.status(500).json({ error: '댓글 삭제 실패', details: err.message });
  }
});
router.post('/api/board/:id/comments', authenticate, async (req, res) => {
  // req.user에서 id, name 등 추출 가능
  const { content } = req.body;
  const userId = req.user.id;
  const userName = req.user.name;
  const boardId = req.params.id;
});

module.exports = router;