# Product Requirements Document (PRD): SubePe Admin Web Panel

## 1. Introducción
El proyecto **SubePe Admin** es un panel web frontend desarrollado en React (Vite) cuyo propósito es permitir a los administradores gestionar el sistema de cobro de pasajes SubePe.

## 2. Objetivos
- Proveer una interfaz gráfica segura para el personal administrativo.
- Permitir la visualización de métricas en tiempo real.
- Gestionar conductores, unidades (buses), rutas y tarifarios.

## 3. Funcionalidades Core (Scope for Frontend Testing)

### 3.1. Autenticación (Login)
- **URL**: `/login` o modal principal.
- **Flujo**: El administrador ingresa su correo electrónico y contraseña. Al validar correctamente contra el backend de Supabase, se le redirige al Dashboard (`/`).

### 3.2. Dashboard Principal (Métricas)
- **Vista**: Resumen general.
- **Elementos UI**:
  - Tarjetas (Cards) que muestran: Total de pasajeros, total de conductores, viajes del mes, e ingresos recaudados.
  - Gráficos (Recharts) que muestran la tendencia de viajes y recargas.

### 3.3. Gestión de Conductores
- **Flujo**: Ver tabla de conductores y crear nuevos.
- **Acciones UI**:
  - Botón "Agregar Conductor".
  - Formulario que solicita: Nombres, Apellidos, DNI, Correo y Contraseña.
  - Tabla que lista el estado (Activo/Inactivo) y opciones para "Pagar Sueldo" o "Asignar Unidad".

### 3.4. Gestión de Unidades (Buses)
- **Flujo**: Crear y asignar buses.
- **Acciones UI**: Formulario para registrar Placa y Nombre del Bus.

### 3.5. Tarifario
- **Flujo**: Modificar precios.
- **Acciones UI**: Botones de edición para actualizar el precio del pasaje "Adulto", "Medio", "Universitario", etc.

### 3.6. Navegación Global
- **Sidebar/Menú**: Debe contener links o pestañas funcionales para cambiar entre "Dashboard", "Conductores", "Unidades", "Pasajeros", y "Tarifas".

## 4. Stack Tecnológico
- **Frontend**: React 19, Vite, TailwindCSS.
- **Componentes**: Shadcn UI (Radix UI), Lucide Icons, Recharts.
- **Conexión API**: Axios apuntando al backend NodeJS.
