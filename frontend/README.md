
# Frontend Centro de Masajes Relax Total

## Variables de entorno

Copia `.env.example` a `.env` y ajusta la URL del backend si es necesario.

```
REACT_APP_API_URL=http://localhost:8080/api
```

## Estructura de carpetas
- `src/components`: Componentes atómicos y de dominio
- `src/pages`: Páginas principales
- `src/services`: Servicios (DAO/Repository frontend)
- `src/hooks`: Custom hooks
- `src/styles`: Estilos globales y de componentes
- `src/tests`: Pruebas unitarias e integración

**Patrón:** Atomic Design + carpeta por dominio

## Scripts disponibles
- `npm run dev`: Levanta la app en modo desarrollo
- `npm run build`: Compila la app para producción
- `npm run lint`: Linting con ESLint
- `npm test`: Ejecuta pruebas unitarias con Jest

## Cómo ejecutar
1. Instala dependencias:
	```sh
	npm install
	```
2. Copia `.env.example` a `.env` y ajusta la URL si es necesario.
3. Levanta la app:
	```sh
	npm run dev
	```
4. Ejecuta pruebas:
	```sh
	npm test
	```

## Endpoints consumidos
- `GET /api/clientes` → Listar clientes
- `GET /api/clientes/:id` → Detalle cliente
- `POST /api/clientes` → Crear cliente
- `PUT /api/clientes/:id` → Editar cliente
- `DELETE /api/clientes/:id` → Eliminar cliente

## Notas de integración
- El backend debe tener CORS habilitado para `http://localhost:5173`.
- El método de pago está implementado en soles (S/).
- Seguridad y validaciones aplicadas en formularios.
- Pruebas unitarias listas para TDD.
