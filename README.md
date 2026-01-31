# Altairis BackOffice

## Descripción

**Altairis BackOffice** es una plataforma web para la gestión de hoteles, habitaciones, reservas e inventarios.  
Permite administrar de manera centralizada los hoteles, tipos de habitaciones, bookings y disponibilidad de habitaciones.  
Está desarrollado con **.NET 7** en el backend y **Next.js 16** en el frontend, y usa **SQLite** como base de datos.  

Esta aplicación está pensada como un **proyecto de prueba técnica**, con funcionalidad completa y diseño sencillo, enfocado en la operatividad del BackOffice.

---

## Características principales

- Gestión de **Hoteles**
  - Crear, editar y eliminar hoteles.
  - Listado de hoteles existentes.
  
- Gestión de **Tipos de Habitaciones (RoomTypes)**
  - Crear, editar y eliminar tipos de habitaciones.
  - Asignación a hoteles específicos.
  
- Gestión de **Bookings**
  - Crear y eliminar reservas.
  - Asignación de habitaciones y hoteles.
  
- Gestión de **Inventarios**
  - Control de disponibilidad de habitaciones por fecha.
  - Creación y eliminación de inventarios.

- **Panel único y funcional** para todas las operaciones del BackOffice.

---

## Tecnologías utilizadas

- **Backend:** .NET 8 (C#), Entity Framework Core, SQLite  
- **Frontend:** Next.js 16, React 18  
- **Contenedores:** Docker y Docker Compose  
- **Control de versiones:** Git y GitHub

---

## Requisitos

- Docker y Docker Compose instalados en tu máquina.
- Node.js 20+ (para desarrollo frontend local opcional)
- .NET 8 SDK (para desarrollo backend local opcional)

---

## Configuración y ejecución con Docker

1. Clonar el repositorio:

```bash
git clone https://github.com/KG-Crimson/-Altairis-BackOffice.git
cd Altairis-BackOffice

docker-compose up --build

