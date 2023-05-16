const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');
const app = express();

// MySQL 연결 설정
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql'
});

// 모델 정의
const User = sequelize.define('user', {
  name: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  role: Sequelize.INTEGER // 권한
});

// MySQL 연결 확인
sequelize.authenticate()
  .then(() => {
    console.log('MySQL 연결 성공');
  })
  .catch(err => {
    console.error('MySQL 연결 실패:', err);
  });

// body-parser 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 로그인 라우터
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  // 이메일로 사용자 찾기
  User.findOne({ where: { email: email } })
    .then(user => {
      // 사용자가 존재하면 비밀번호 검사
      if (user) {
        if (password === user.password) {
          // 비밀번호가 일치하면 토큰 발급
          const token = jwt.sign({ email: user.email, role: user.role }, 'secret_key', { expiresIn: '1h' });
          res.status(200).json({ token: token });
        } else {
          res.status(401).send('비밀번호가 일치하지 않습니다');
        }
      } else {
        res.status(401).send('사용자가 존재하지 않습니다');
      }
    })
    .catch(err => {
      console.error('로그인 오류:', err);
      res.status(500).send('서버 오류');
    });
});

// 마이페이지 라우터
app.get('/mypage', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, 'secret_key');
  const email = decodedToken.email;
  const role = decodedToken.role;
  // 사용자 이메일로 사용자 정보 찾기
  User.findOne({ where: { email: email } })
    .then(user => {
      // 권한에 따라 마이페이지 다르게 제공
      if (role === 0) {
        // 일반사원 마이페이지
        res.status(200).send(`안녕하세요 ${user.name}님! 일반사원 마이페이지입니다.`);
      } else if (role === 1) {
        // 관리자 마이페이지
        res.status(200).send(`안녕하세요 ${user.name}님! 관리자 마이페이지입니다.`);
      } else if (role === 2) {
        // 경영진 마이페이지
        res.status(200).send(`안녕하세요 ${user.name}님! 경영진 마이페이지입니다.`);
      } else {
        res.status(401).send()
