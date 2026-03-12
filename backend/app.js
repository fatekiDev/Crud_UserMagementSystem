const express = require("express");
const connection = require("./db");
const usersRoutes = require("./routes/users.routes");
const cors = require("cors")

const app = express();


app.use(express.json());
app.use(cors());

connection.connect((error) => {
    if (error) {
        console.error("Error conectando al MySQL:", error.message);
    } else {
        console.log("Conectado a MySQL");   
    }
});

app.get("/", (req, res) => {
    res.send("Hola! mi servidor backend esta activo y funcionando!");
});

// prefijo /users
app.use("/users", usersRoutes);

app.listen(3000, () => {
    console.log("Servidor corriendo en el puerto 3000");
});