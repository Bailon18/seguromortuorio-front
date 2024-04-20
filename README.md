<h1 align="center">Seguro Mortuorio</h1>

<p align="center">
  <img src="https://example.com/your-logo.png" alt="Logo" width="150" height="150">
</p>

<p align="center">
  <strong>Una aplicación intuitiva para la gestión de pagos, socios, reportes y usuarios.</strong>
</p>

## Descripción

Seguro Mortuorio es una solución integral para la administración eficiente de un sistema de seguro mortuorio. Esta aplicación, desarrollada con Angular, proporciona una interfaz de usuario moderna y fácil de usar para gestionar los módulos de Pagos, Socios, Reportes y Usuarios.

## Funcionalidades

- 💵 **Gestión de Pagos**: Registra y administra los pagos de los asegurados de manera organizada y segura.
- 👥 **Administración de Socios**: Permite mantener un registro detallado de los socios del seguro, incluyendo su información personal y estado de cobertura.
- 📊 **Generación de Reportes**: Genera informes detallados sobre los pagos, socios y otras métricas relevantes para una gestión efectiva del seguro.
- 👤 **Administración de Usuarios**: Gestiona los usuarios del sistema, asignando roles y privilegios según sea necesario.

## Tecnologías Utilizadas

- 🅰️ Angular: Desarrollo del frontend de la aplicación.
- ☁️ [Spring Boot (Repositorio)](https://github.com/Bailon18/seguromortuorio-back): API RESTful utilizada como backend para proporcionar datos y lógica de negocio.
- 🗃️ Base de Datos: MySQL.

## Configuración

1. Clona este repositorio en tu máquina local.
2. Asegúrate de tener Node.js y npm instalados.
3. Ejecuta `npm install` en el directorio raíz del proyecto para instalar las dependencias.
4. Configura la URL del backend en el archivo de configuración (`helpers.ts`) para que coincida con la URL del backend de Spring Boot (por defecto, `localhost:8080`).

## Ejecución

Una vez configurado, puedes ejecutar la aplicación utilizando el siguiente comando:

```bash
ng serve
