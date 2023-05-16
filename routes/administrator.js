const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'database'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.use(bodyParser.json());

app.get('/projects', (req, res) => {
  connection.query('SELECT * FROM projects', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

app.post('/projects', (req, res) => {
  const { name, description, startDate, endDate, client } = req.body;
  const sql = `INSERT INTO projects (name, description, startDate, endDate, client) VALUES (${name}, ${description}, ${startDate}, ${endDate}, ${client})`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.status(201).send(`Project added with ID: ${result.insertId}`);
  });
});

app.put('/projects/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, startDate, endDate, client } = req.body;
  const sql = `UPDATE projects SET name=${name}, description=${description}, startDate=${startDate}, endDate=${endDate}, client=${client} WHERE id=${id}`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).send(`Project modified with ID: ${id}`);
  });
});

app.delete('/projects/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM projects WHERE id=${id}`;
  connection.query(sql, (err, result) => {
    if (err) throw err;
    res.status(200).send(`Project deleted with ID: ${id}`);
  });
});

app.post('/admin/developers', (req, res) => {
  const { name, skillset, level, position } = req.body;
  const query = `INSERT INTO developers (name, skillset, level, position) VALUES ('${name}', '${skillset}', '${level}', '${position}')`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json({ success: true, message: 'Developer registered successfully' });
  });
});

app.put('/admin/developers/:id', (req, res) => {
  const { id } = req.params;
  const { name, skillset, level, position } = req.body;
  const query = `UPDATE developers SET name='${name}', skillset='${skillset}', level='${level}', position='${position}' WHERE id=${id}`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json({ success: true, message: 'Developer updated successfully' });
  });
});

app.post('/admin/evaluations', (req, res) => {
  const { developerId, projectId, score } = req.body;
  const query = `INSERT INTO evaluations (developer_id, project_id, score) VALUES (${developerId}, ${projectId}, ${score})`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json({ success: true, message: 'Evaluation registered successfully' });
  });
});

app.put('/admin/evaluations/:id', (req, res) => {
  const { id } = req.params;
  const { score } = req.body;
  const query = `UPDATE evaluations SET score=${score} WHERE id=${id}`;
  connection.query(query, (error, results) => {
    if (error) throw error;
    res.json({ success: true, message: 'Evaluation updated successfully' });
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
