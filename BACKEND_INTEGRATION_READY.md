# ✅ Backend Integration - Ready to Deploy

## 🎯 Overview
El frontend está **100% listo** para conectarse al backend. Solo necesitas reemplazar **UN SOLO ARCHIVO** con las llamadas reales a tu API.

---

## 📁 Archivo a Reemplazar

### `src/services/instanceService.ts`

Este es el **ÚNICO** archivo que necesitas modificar. Todas las páginas, componentes y el contexto ya están conectados a este servicio.

---

## 🔧 Pasos de Integración

### 1. **Configura la URL del Backend**

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://tu-backend.com/api
# o para desarrollo local:
VITE_API_URL=http://localhost:8080/api
```

### 2. **Reemplaza las Funciones Mock**

Abre `src/services/instanceService.ts` y reemplaza las funciones con llamadas reales:

#### ✅ Función: `getInstances()`
**Mock actual:**
```typescript
export const getInstances = async (): Promise<InstanceDetail[]> => {
  await delay(800);
  return [...mockInstancesStorage];
};
```

**Reemplazar por:**
```typescript
export const getInstances = async (): Promise<InstanceDetail[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/instances`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si usas auth
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch instances');
  }
  
  return response.json();
};
```

---

#### ✅ Función: `createInstance()`
**Mock actual:**
```typescript
export const createInstance = async (
  request: CreateInstanceRequest
): Promise<CreateInstanceResponse> => {
  await delay(1500);
  // ... código mock ...
};
```

**Reemplazar por:**
```typescript
export const createInstance = async (
  request: CreateInstanceRequest
): Promise<CreateInstanceResponse> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/instances`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create instance');
  }
  
  return response.json();
};
```

---

#### ✅ Función: `suspendInstance()`
**Reemplazar por:**
```typescript
export const suspendInstance = async (instanceId: number): Promise<InstanceDetail> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/instances/${instanceId}/suspend`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to suspend instance');
  }
  
  return response.json();
};
```

---

#### ✅ Función: `resumeInstance()`
**Reemplazar por:**
```typescript
export const resumeInstance = async (instanceId: number): Promise<InstanceDetail> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/instances/${instanceId}/resume`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to resume instance');
  }
  
  return response.json();
};
```

---

#### ✅ Función: `deleteInstance()`
**Reemplazar por:**
```typescript
export const deleteInstance = async (instanceId: number): Promise<void> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/instances/${instanceId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to delete instance');
  }
};
```

---

#### ✅ Función: `rotatePassword()`
**Reemplazar por:**
```typescript
export const rotatePassword = async (
  instanceId: number
): Promise<RotatePasswordResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/instances/${instanceId}/rotate-password`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to rotate password');
  }
  
  return response.json();
};
```

---

#### ✅ Función: `getEngines()`
**Reemplazar por:**
```typescript
export const getEngines = async (): Promise<Engine[]> => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/engines`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch engines');
  }
  
  return response.json();
};
```

---

## 📋 Endpoints Esperados del Backend

Asegúrate de que tu backend tenga estos endpoints:

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/instances` | Obtener todas las instancias del usuario |
| `POST` | `/api/instances` | Crear nueva instancia |
| `POST` | `/api/instances/{id}/suspend` | Suspender instancia |
| `POST` | `/api/instances/{id}/resume` | Reanudar instancia |
| `DELETE` | `/api/instances/{id}` | Eliminar instancia |
| `POST` | `/api/instances/{id}/rotate-password` | Rotar contraseña |
| `GET` | `/api/engines` | Obtener motores de BD disponibles |

---

## 🎯 Tipos de Datos (TypeScript Interfaces)

El backend debe devolver datos en estos formatos (ya definidos en `src/types/database.ts`):

### `InstanceDetail`
```typescript
{
  id: number;
  name: string;
  containerId: number;
  userDbId: number;
  userId: number;
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  container: {
    id: number;
    ip: string;
    port: number;
    engineId: number;
    status: 'RUNNING' | 'SUSPENDED' | 'CREATING' | 'DELETED';
    createdAt: string;
  };
  engine: {
    id: number;
    name: string; // 'MySQL', 'PostgreSQL', etc.
  };
  status: 'RUNNING' | 'SUSPENDED' | 'CREATING' | 'DELETED';
  credentials: {
    host: string;
    port: number;
    database: string;
    username: string;
  };
}
```

### `CreateInstanceRequest`
```typescript
{
  engineId: number;
  customName?: string; // Solo para planes pagos
}
```

### `CreateInstanceResponse`
```typescript
{
  instance: InstanceDetail;
  password: string; // ⚠️ Solo se muestra UNA VEZ
}
```

### `RotatePasswordResponse`
```typescript
{
  newPassword: string; // ⚠️ Solo se muestra UNA VEZ
}
```

---

## 🔐 Autenticación

Si tu backend usa JWT, asegúrate de:

1. Guardar el token después del login:
```typescript
localStorage.setItem('token', response.token);
```

2. Las funciones ya están preparadas para enviar el header:
```typescript
'Authorization': `Bearer ${localStorage.getItem('token')}`
```

---

## 🚀 Páginas que se Actualizarán Automáticamente

Una vez reemplaces `instanceService.ts`, estas páginas funcionarán con datos reales sin modificar nada:

✅ **DashboardPage** (`/dashboard`)
- Muestra cantidad de instancias
- Barra de progreso del límite del plan
- Quick actions

✅ **InstancesPage** (`/dashboard/instances`)
- Lista completa de instancias
- CRUD completo (crear, suspender, reanudar, eliminar)
- Rotar contraseñas
- Modales de credenciales

✅ **EnginesPage** (`/dashboard/engines/:engineId`)
- Vista filtrada por motor de BD
- Mismas funcionalidades que InstancesPage

---

## ⚠️ Validaciones Importantes

### En el Backend, valida:

1. **Límites de Plan:**
   - FREE: Máximo 2 instancias
   - STANDARD: Máximo 5 instancias
   - PREMIUM: Máximo 10 instancias

2. **Nombres de Instancias:**
   - FREE: Auto-generar nombres (frontend lo hace, pero backend debe validar)
   - STANDARD/PREMIUM: Permitir nombres custom

3. **Estados de Contenedores:**
   - Solo RUNNING puede suspenderse
   - Solo SUSPENDED puede reanudarse
   - DELETED no puede modificarse

---

## 📝 Ejemplo Completo de `instanceService.ts` con Backend Real

```typescript
import type {
  InstanceDetail,
  CreateInstanceRequest,
  CreateInstanceResponse,
  RotatePasswordResponse,
  Engine,
} from '../types/database';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

export const getInstances = async (): Promise<InstanceDetail[]> => {
  const response = await fetch(`${API_URL}/instances`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to fetch instances');
  return response.json();
};

export const createInstance = async (
  request: CreateInstanceRequest
): Promise<CreateInstanceResponse> => {
  const response = await fetch(`${API_URL}/instances`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(request),
  });
  
  if (!response.ok) throw new Error('Failed to create instance');
  return response.json();
};

export const suspendInstance = async (instanceId: number): Promise<InstanceDetail> => {
  const response = await fetch(`${API_URL}/instances/${instanceId}/suspend`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to suspend instance');
  return response.json();
};

export const resumeInstance = async (instanceId: number): Promise<InstanceDetail> => {
  const response = await fetch(`${API_URL}/instances/${instanceId}/resume`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to resume instance');
  return response.json();
};

export const deleteInstance = async (instanceId: number): Promise<void> => {
  const response = await fetch(`${API_URL}/instances/${instanceId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to delete instance');
};

export const rotatePassword = async (
  instanceId: number
): Promise<RotatePasswordResponse> => {
  const response = await fetch(`${API_URL}/instances/${instanceId}/rotate-password`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) throw new Error('Failed to rotate password');
  return response.json();
};

export const getEngines = async (): Promise<Engine[]> => {
  const response = await fetch(`${API_URL}/engines`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) throw new Error('Failed to fetch engines');
  return response.json();
};
```

---

## ✅ Checklist de Integración

- [ ] Crear archivo `.env` con `VITE_API_URL`
- [ ] Reemplazar las 7 funciones en `instanceService.ts`
- [ ] Verificar que el backend devuelve datos en el formato correcto
- [ ] Probar login y que el token se guarde
- [ ] Probar crear instancia → ver credenciales
- [ ] Probar suspender/reanudar instancia
- [ ] Probar eliminar instancia
- [ ] Probar rotar contraseña
- [ ] Verificar límites de plan
- [ ] Probar filtrado por motor en EnginesPage

---

## 🎉 Resumen

### Lo que YA está listo:
✅ Todas las páginas (Dashboard, Instances, Engines, Plans)
✅ Todos los componentes (modales, formularios)
✅ Context API (InstanceContext, AuthContext)
✅ Hooks personalizados (useInstances, useAuth)
✅ Tipos TypeScript completos
✅ Rutas de navegación
✅ UI/UX profesional sin emojis

### Lo que FALTA:
❌ Solo reemplazar `instanceService.ts` con llamadas reales
❌ Configurar `.env` con la URL del backend

---

**¡ESO ES TODO!** 🚀

Solo un archivo, 7 funciones, y tu aplicación estará conectada al backend real.
