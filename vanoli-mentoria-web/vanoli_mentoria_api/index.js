const express = require('express');
const pg = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const pool = new pg.Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});

app.post('/register', async (req, res) => {
    const { name, email, password, role_id } = req.body;
    console.log("Dados recebidos:", name, email, password, role_id);
  
    try {
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log("Hash da senha gerado:", hashedPassword);
  
      // Inserir o usuário no banco de dados
      const result = await pool.query(
        'INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, email, hashedPassword, role_id]
      );
      console.log("Usuário registrado:", result.rows[0]);
      res.status(201).json({ message: 'Usuário registrado com sucesso!', user: result.rows[0] });
    } catch (error) {
        console.error("Erro ao registrar usuário:", error);
      res.status(500).json({ message: 'Erro ao registrar o usuário' });
    }
  });

  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Verificar se o usuário existe
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
  
      if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }
  
      // Verificar a senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Senha incorreta' });
      }
  
      // Gerar um token JWT
      const token = jwt.sign({ id: user.id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ message: 'Login bem-sucedido!', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao realizar o login' });
    }
  });
  
  
