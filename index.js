const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();
const PORT = 8080;

// Utiliza body-parser para parsear JSON
app.use(bodyParser.json());
app.use(cors());

// Crea un pool de conexiones
const pool = mysql.createPool({
  connectionLimit: 10, // Número máximo de conexiones en el pool
  host: '193.203.175.67',
  user: 'u702099497_pulso123',
  password: 'Pulso123@',
  database: 'u702099497_pulso_agendar'
});

// Definir una ruta para obtener la información del usuario por ID
app.get("/usuario/:id", (req, res) => {
  const { id } = req.params; // Obtener el ID del parámetro de la ruta
  const sql = "SELECT * FROM demo WHERE id = ?";
  
  // Usar el método getConnection del pool para obtener una conexión de la piscina
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión desde el pool', err);
      res.status(500).send("Hubo un error al obtener la conexión de la base de datos");
      return;
    }

    // Ejecutar la consulta SQL en la conexión obtenida del pool
    connection.query(sql, [id], (error, results) => {
      // Devolver la conexión al pool para ser reutilizada
      connection.release();
      
      if (error) {
        console.error(error);
        res.status(500).send("Hubo un error al obtener el usuario de la base de datos");
        return;
      }
      
      if (results.length > 0) {
        res.json(results[0]); // Devuelve el primer usuario que coincida con el ID
      } else {
        res.status(404).send("Usuario no encontrado");
      }
    });
  });
});

// Definir la ruta para crear un nuevo usuario
app.post("/usuario", (req, res) => {
  // Datos del usuario desde el cuerpo de la solicitud
  const { correo, nombre, prefix, numero} = req.body;
  // La consulta SQL para insertar un nuevo usuario en la base de datos
  const sql = "INSERT INTO demo (nombre, correo, prefix, numero) VALUES (?, ?, ?, ?)";
  
  // Usar el método getConnection del pool para obtener una conexión de la piscina
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error al obtener la conexión desde el pool', err);
      res.status(500).send("Hubo un error al obtener la conexión de la base de datos");
      return;
    }

    // Ejecutar la consulta SQL en la conexión obtenida del pool
    connection.query(sql, [nombre, correo, prefix, numero], (error, results) => {
      // Devolver la conexión al pool para ser reutilizada
      connection.release();
      
      if (error) {
        console.error(error);
        res.status(500).send("Hubo un error al insertar el usuario en la base de datos");
        return;
      }
      
      res.status(201).send("Usuario creado exitosamente");
    });
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
