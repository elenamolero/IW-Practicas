# Documentación de Inicio de Sesión y Puesta en Marcha del Proyecto

## Tecnologías necesarias

Para ejecutar este proyecto necesitas tener instalados:

- **Node.js** (para el backend y el frontend)
- **React** (frontend, ya incluido en el proyecto)
- **MongoDB** (como base de datos)

---

## Puesta en marcha del proyecto

### 1. Clona el repositorio y accede a la carpeta principal

```bash
git clone <URL_DEL_REPOSITORIO>
cd IW-Practicas
```

### 2. Instala las dependencias y ejecuta el backend

```bash
npm install
npm run dev
```

Esto instalará las dependencias y levantará el servidor Express en modo desarrollo.

### 3. Instala las dependencias y ejecuta el frontend

```bash
cd view
npm install
npm run dev
```

Esto levantará el frontend en React.

---

## Arquitectura de Inicio de Sesión

### Servidor Express

- El servidor Express configura las rutas y gestiona la lógica de inicio de sesión.
- Se utilizan **esquemas de validación** (con Zod) para asegurar que los datos de inicio de sesión sean correctos (por ejemplo, email válido y contraseña de al menos 6 caracteres).

### Controladores de Autenticación

- Los controladores de inicio de sesión verifican si las credenciales del usuario coinciden con los registros de la base de datos.
- Si las credenciales son correctas, se genera un **token de acceso** (JWT).

### Middleware de Validación de Token

- Se utiliza un middleware para garantizar que las rutas protegidas solo sean accesibles para usuarios autenticados.
- Este middleware verifica la validez del token y establece la identidad del usuario en la petición (`req.user`).

### JWT (JSON Web Tokens)

- La generación y gestión de tokens de acceso se realiza mediante JWT.
- Estos tokens se usan para autenticar a los usuarios en las rutas protegidas.

---
## Cliente (Frontend)

- Las páginas de inicio de sesión permiten a los usuarios ingresar su correo electrónico y contraseña.
- Al enviar el formulario, se realiza una solicitud al servidor para verificar las credenciales.
- **Axios** se utiliza para gestionar la comunicación entre el cliente y el servidor.

### ProtectedRoute

- Se ha implementado una ruta protegida que redirige a los usuarios no autenticados a la página de inicio de sesión.
- Esta ruta protege páginas como tareas y perfil.

---

## Resumen de pasos para ejecutar el proyecto

1. Instala Node.js y MongoDB en tu máquina.
2. Ejecuta el backend:
   - `npm install`
   - `npm run dev`
3. Ejecuta el frontend:
   - `cd view`
   - `npm install`
   - `npm run dev`
4. Accede a la aplicación desde tu navegador.

---

## Notas adicionales

- Asegúrate de que MongoDB esté corriendo antes de iniciar el backend.
- Puedes modificar la configuración de la base de datos en el archivo `.env`.
- El sistema de autenticación está basado en JWT y validación robusta de datos con Zod.

