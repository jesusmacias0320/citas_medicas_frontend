# 🏥 Ecosistema de Gestión de Citas Médicas (Full-Stack)

Plataforma integral para el agendamiento y administración de citas médicas. Para garantizar la seguridad y escalabilidad, el proyecto está dividido en dos interfaces separadas (Micro-frontends) que se conectan a una misma API central.

---

## 🚀 1. Portal de Pacientes (App Pública)
Interfaz para que los usuarios puedan registrarse, iniciar sesión y agendar sus citas.
* **Link en vivo (Vercel):** [https://citas-medicas-frontend.vercel.app](https://citas-medicas-frontend.vercel.app)
* **Credenciales de prueba:**
  * **Usuario:** `paciente@citasmedicas.com`
  * **Contraseña:** `paciente123`

## 🩺 2. Panel Administrativo (App de Médicos)
Interfaz interna para que el personal registre nuevos profesionales, asigne horarios laborales y gestione citas.
* **Link en vivo (Vercel):** [https://admin-citas-medicas-eight.vercel.app](https://admin-citas-medicas-eight.vercel.app)
* **Credenciales de prueba:**
  * **Usuario:** `admin@citasmedicas.com`
  * **Contraseña:** `admin123`
  * *(Nota: En la base de datos ya está configurado el "Dr. Demo" con horarios de L-V de 9am a 5pm y Sábados de 9am a 2pm para probar el flujo completo).*

---

## 🛠️ Arquitectura y Stack Tecnológico
* **Frontend (x2):** React, CSS puro (Ambas apps desplegadas en Vercel)
* **Backend API:** Node.js, Express, Sequelize (Desplegado en Render)
* **Base de Datos:** PostgreSQL (Alojada en Neon Cloud)