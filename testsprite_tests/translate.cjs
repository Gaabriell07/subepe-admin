const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'testsprite_frontend_test_plan.json');
let content = fs.readFileSync(filePath, 'utf8');

const translations = {
  // Titles
  '"title": "Sign in and reach the dashboard"': '"title": "Iniciar sesión y acceder al dashboard"',
  '"title": "Administrator signs in and reaches the dashboard"': '"title": "El administrador inicia sesión y accede al dashboard"',
  '"title": "Protected dashboard redirects unauthenticated visitors to sign in"': '"title": "El dashboard protegido redirige a los visitantes no autenticados al inicio de sesión"',
  '"title": "Redirect unauthenticated users from the dashboard"': '"title": "Redirigir a usuarios no autenticados desde el dashboard"',
  '"title": "View dashboard summary and trend information"': '"title": "Ver resumen del dashboard e información de tendencias"',
  '"title": "Add a new driver and see it listed"': '"title": "Agregar un nuevo conductor y verlo en la lista"',
  '"title": "Administrator creates a driver and sees it in the list"': '"title": "El administrador crea un conductor y lo ve en la lista"',
  '"title": "Administrator creates a bus unit and sees it in the list"': '"title": "El administrador crea una unidad de bus y la ve en la lista"',
  '"title": "View the driver list"': '"title": "Ver la lista de conductores"',
  '"title": "Register a new bus unit"': '"title": "Registrar una nueva unidad de bus"',
  '"title": "Administrator updates a fare category and sees the new price"': '"title": "El administrador actualiza una categoría de tarifa y ve el nuevo precio"',
  '"title": "Administrator reviews passenger and trip records"': '"title": "El administrador revisa los registros de pasajeros y viajes"',
  '"title": "View the passenger directory"': '"title": "Ver el directorio de pasajeros"',
  '"title": "Review trip history"': '"title": "Revisar el historial de viajes"',
  '"title": "Administrator views announcements"': '"title": "El administrador ve los comunicados"',
  '"title": "Reject invalid sign-in credentials"': '"title": "Rechazar credenciales de inicio de sesión inválidas"',
  '"title": "Administrator reviews penalties"': '"title": "El administrador revisa las penalidades"',
  '"title": "Show validation when required driver fields are missing"': '"title": "Mostrar validación cuando faltan campos requeridos del conductor"',
  '"title": "Reject an incomplete bus unit submission"': '"title": "Rechazar un envío incompleto de unidad de bus"',
  '"title": "Driver creation requires valid required fields"': '"title": "La creación de conductor requiere campos válidos"',
  '"title": "Handle an empty passenger directory"': '"title": "Manejar un directorio de pasajeros vacío"',
  '"title": "Fare pricing update requires a valid amount"': '"title": "La actualización de tarifa requiere un monto válido"',
  '"title": "Handle an empty trip list"': '"title": "Manejar una lista de viajes vacía"',
  
  // Categories
  '"category": "Administrator Login"': '"category": "Inicio de Sesión del Administrador"',
  '"category": "Authentication and protected-route access"': '"category": "Autenticación y acceso a rutas protegidas"',
  '"category": "Dashboard Overview"': '"category": "Resumen del Dashboard"',
  '"category": "Driver Management"': '"category": "Gestión de Conductores"',
  '"category": "Core management and review flows"': '"category": "Flujos centrales de gestión y revisión"',
  '"category": "Bus Unit Management"': '"category": "Gestión de Unidades de Bus"',
  '"category": "Fare Pricing Management"': '"category": "Gestión de Tarifas"',
  '"category": "Passenger Directory"': '"category": "Directorio de Pasajeros"',
  '"category": "Trip Records"': '"category": "Registros de Viajes"',
  '"category": "Announcements Management"': '"category": "Gestión de Comunicados"',
  '"category": "Penalty Review"': '"category": "Revisión de Penalidades"'
};

for (const [en, es] of Object.entries(translations)) {
  content = content.split(en).join(es);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Traducido exitosamente.');
