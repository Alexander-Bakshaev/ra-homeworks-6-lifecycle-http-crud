const express = require('express');
const cors = require('cors');

const app = express();

// Настройка CORS
app.use(cors({
  origin: 'http://localhost:5173', // Только с этого домена разрешаем запросы
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Обработка preflight запросов
app.options('*', cors());

// Парсинг JSON
app.use(express.json());

// Для тестирования
app.get('/', (req, res) => {
  res.send('Сервер заметок работает! Используйте /notes эндпоинт');
});

let notes = [];
let nextId = 1;

// Получить все заметки
app.get("/notes", (req, res) => {
  console.log('GET /notes - Отправка заметок:', notes);
  res.json(notes);
});

// Добавить новую заметку
app.post("/notes", (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Текст заметки не может быть пустым' });
  }
  
  const newNote = { id: nextId++, content };
  notes.push(newNote);
  console.log('POST /notes - Добавлена новая заметка:', newNote);
  res.status(201).json(newNote);
});

// Удалить заметку
app.delete("/notes/:id", (req, res) => {
  const noteId = Number(req.params.id);
  const initialLength = notes.length;
  
  notes = notes.filter(note => note.id !== noteId);
  
  if (notes.length === initialLength) {
    return res.status(404).json({ error: 'Заметка не найдена' });
  }
  
  console.log(`DELETE /notes/${noteId} - Заметка удалена`);
  res.status(200).json({ message: 'Заметка удалена' });
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
  console.log('Доступные эндпоинты:');
  console.log(`- GET    http://localhost:${port}/notes`);
  console.log(`- POST   http://localhost:${port}/notes`);
  console.log(`- DELETE http://localhost:${port}/notes/:id`);
});
