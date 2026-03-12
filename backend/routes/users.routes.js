const express = require("express");
const router = express.Router();
const connection = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("..//middlewares/auth.middleware");
require('dotenv').config();

// READ | Get Users
router.get("/", (req, res) => {
    const query = "SELECT * FROM users";

    connection.query(query, (error, results) => {
        if (error) {
            console.error("Error al obtener usuarios", error);
            res.status(500).send("Error al obtener usuarios");
        } else {
            res.json(results);
        }
    });
});

//Ruta privada de perfil
router.get("/profile", verifyToken, (req, res) => {
    const userId = req.user.id;

    const query = "SELECT id, email FROM users WHERE id = ?";

    connection.query(query,[userId], (error, results) => {
        
        if (error) {
            return res.status(400).json({
                message:"Error al buscar el perfil"
            });
        } 

        if (results.length === 0) {
            return res.status(404).json({
                message:"Usuario no encontrado"
            });
        }

        res.json({
            message:"Perfil obtenido correctamente",
            user:results[0]
        });
        
    });

});



// READ | Get User by ID
router.get("/:id", (req, res) => {
    const userId = req.params.id;

    const query = `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
    `;

    connection.query(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).send("Error al buscar usuario");
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: `No existe el usuario con id ${userId}`
            });
        }

        res.json(results[0]);
    });
});

// CREATE | Post Users
router.post("/", async (req, res) => {
    const { name, email, password } = req.body;

    // Validaciones 
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "Todos los campos son obligatorios"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "La password debe contener al menos 6 caracteres."
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Email no valido."
        })
    }


    const checkEmailQuery = "SELECT id FROM users WHERE email = ?"

    connection.query(checkEmailQuery, [email], async (error, results)=> {
        if (error) {
            return res.status(500).json({
                messsage: "Error al verificar el email"
            });
        }

        if (results.length > 0) {
            return res.status(409).json({
                message: "El email ya esta registrado"
            });
        }

    


    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)
        `;

        connection.query(
            query,
            [name, email, hashedPassword],
            (error, result) => {
                if (error) {
                    return res.status(500).send("Error al crear el usuario");
                }

                res.status(201).json({
                    message: "Usuario creado correctamente",
                    userID: result.insertId
                });
            }
        );
    } catch (error) {
        res.status(500).send("Error al hashear contraseña");
    }
});
});

// LOGIN | Authenticate User
router.post("/login", (req, res) => {
    const {email, password} = req.body;

    //Validaciones Basicas
    if (!email || !password) {
        return res.status(400).json({
            message: "El email y la password son campos obligatorios"
        });
    }

    // Buscar usuario por el email
    const query = "Select * from users where email = ?";

    connection.query(query, [email], async (error,results) =>{
        if (error) {
            return res.status(500).json({
                message: "Error al buscar el usuario"
            });
        }

        // Si no existe el usuario
        if (results.length === 0) {
            return res.status(401).json({
                message: "Credenciales Inválidas."
            });
        }

        const user = results[0];

        try {
            // Comprar la password
            const isMatch = await bcrypt.compare(password, user.password);

            // Si no coincide
            if (!isMatch) {
                return res.status(401).json({
                    message:"Credenciales Inválidas."
                });
            }


            const token = jwt.sign(
                {id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            // Si coincide
            res.json({
                message:"login Exitoso",
                token
        });




        } catch (error) {
            res.status(500).json({
                message:"Ha ocurrido un error al verificar la password."
            })
        }


    })
})

// UPDATE | Put Users
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            message:"El nombre y el email son campos obligatorios."
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message:"Email no valido"
        });
    }

    const query = `
        UPDATE users
        SET name = ?, email = ?
        WHERE id = ?
    `;

    connection.query(query, [name, email, id], (error, result) => {
        if (error) {
            return res.status(500).send("Error al actualizar usuario");
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: `No existe el usuario con id ${id}`
            });
        }

        res.json({ message: "Usuario actualizado correctamente" });
    });
});

// DELETE | Delete Users
router.delete("/:id", (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM users WHERE id = ?";

    connection.query(query, [id], (error, result) => {
        if (error) {
            return res.status(500).send("Error al eliminar usuario");
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: `No existe el usuario con id ${id}`
            });
        }

        res.json({ message: "Usuario eliminado correctamente" });
    });
});



module.exports = router;