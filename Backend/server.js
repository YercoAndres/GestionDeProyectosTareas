const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes.js'); 
const colors = require('colors');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middlewares/errorHandler');
const userRoutes = require('./routes/userRoutes'); 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('API is running...');
}   );

app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  
app.use('/api/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes); 
app.use('/api/users', userRoutes); 

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(colors.bgGreen(`Servidor web corriendo en el puerto ${PORT}`));
});
