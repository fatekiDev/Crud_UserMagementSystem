# CrudWebBaseDeDatos

Aplicación web desarrollada como proyecto de aprendizaje para el ramo de **Bases de Datos**, que implementa un **CRUD completo** utilizando **Node.js, Express y MySQL**, siguiendo una arquitectura tipo **API REST**.

El proyecto está pensado para trabajar con un **frontend en HTML, CSS y JavaScript** que se comunica con un backend encargado de la lógica de negocio y la persistencia de datos.

---

## 🎯 Objetivo del Proyecto

- Comprender el funcionamiento de una base de datos relacional.
- Implementar operaciones **Create, Read, Update y Delete (CRUD)**.
- Conectar una base de datos MySQL a una aplicación web.
- Familiarizarse con el desarrollo backend utilizando Node.js y Express.
- Aplicar buenas prácticas básicas de desarrollo y organización de proyectos.

---

## 🧱 Tecnologías Utilizadas

### Backend
- Node.js
- Express
- MySQL
- mysql2
- dotenv
- bcrypt
- jsonwebtoken

### Frontend
- HTML
- CSS
- JavaScript (Vanilla)

---

## 🔁 Funcionalidades (CRUD)

- Crear usuarios (Create)
- Listar usuarios (Read)
- Actualizar usuarios (Update)
- Eliminar usuarios (Delete)
- Autenticación básica mediante login (JWT)

---

## 📂 Estructura del Proyecto

```text
CrudWebBaseDeDatos/
│
├── frontend/
│   ├── html/
│   ├── css/
│   └── js/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── .env
│
└── README.md
