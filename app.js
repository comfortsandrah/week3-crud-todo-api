const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos); // Send array as JSON
});

app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  if (completed.length === 0) {
    return res.status(404).json({ message: "No completed tasks" });
  }
  res.status(200).json(completed); // Custom Read!
});

app.get("/todos/active", (req, res) => {
  const active = todos.filter((t) => !t.completed);
  if (active.length === 0) {
    return res.status(404).json({ message: "No active tasks" });
  }
  res.json(active);
})

// Get specific task
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ message: 'Not Found' });
  res.status(200).json(todo);
})

// POST New – Create
app.post('/todos', (req, res) => {
  //validation POST requires "task" field
  const { task, completed } = req.body;
  if (!task) {
    return res.status(400).json({ message: "Task is required" });
  }
  let nextId = Math.max(...todos.map(t => t.id)) + 1;
  //create new todo
  const newTodo = { id: nextId, task, completed: completed ?? false }; // Auto-ID
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  // only update if the fields are present
  const { task, completed } = req.body;
  if (task) todo.task = task;
  if (completed !== undefined) todo.completed = completed;
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({ error: 'Server error!' });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
