# 🔌 Cómo Conectar con el Backend Real

## 📁 Archivo Principal: `src/services/instanceService.ts`

Este archivo contiene **todas las funciones mock** que simulan llamadas al backend. Cuando tu backend esté listo, solo necesitas reemplazar las funciones mock por llamadas fetch reales.

---

## 🎯 Funciones a Reemplazar

### 1. **Obtener todas las instancias**
```typescript
// MOCK ACTUAL (línea ~85)
export const getInstances = async (): Promise<InstanceDetail[]> => {
  await delay(500);
  return [...mockInstancesStorage];
};

// REEMPLAZAR POR:
export const getInstances = async (): Promise<InstanceDetail[]> => {
  const response = await fetch('http://your-backend-url/api/instances', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}` // Tu token JWT
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch instances');
  }
  
  return await response.json();
};
```

---

### 2. **Crear nueva instancia**
```typescript
// MOCK ACTUAL (línea ~120)
export const createInstance = async (
  request: CreateInstanceRequest
): Promise<CreateInstanceResponse> => {
  await delay(2000);
  // ...código mock...
};

// REEMPLAZAR POR:
export const createInstance = async (
  request: CreateInstanceRequest
): Promise<CreateInstanceResponse> => {
  const response = await fetch('http://your-backend-url/api/instances', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    throw new Error('Failed to create instance');
  }
  
  return await response.json();
};
```

---

### 3. **Suspender instancia**
```typescript
// MOCK ACTUAL (línea ~170)
export const suspendInstance = async (id: number): Promise<InstanceDetail> => {
  await delay(1000);
  // ...código mock...
};

// REEMPLAZAR POR:
export const suspendInstance = async (id: number): Promise<InstanceDetail> => {
  const response = await fetch(`http://your-backend-url/api/instances/${id}/suspend`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to suspend instance');
  }
  
  return await response.json();
};
```

---

### 4. **Reanudar instancia**
```typescript
// MOCK ACTUAL (línea ~190)
export const resumeInstance = async (id: number): Promise<InstanceDetail> => {
  await delay(1000);
  // ...código mock...
};

// REEMPLAZAR POR:
export const resumeInstance = async (id: number): Promise<InstanceDetail> => {
  const response = await fetch(`http://your-backend-url/api/instances/${id}/resume`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to resume instance');
  }
  
  return await response.json();
};
```

---

### 5. **Eliminar instancia**
```typescript
// MOCK ACTUAL (línea ~210)
export const deleteInstance = async (id: number): Promise<void> => {
  await delay(1000);
  // ...código mock...
};

// REEMPLAZAR POR:
export const deleteInstance = async (id: number): Promise<void> => {
  const response = await fetch(`http://your-backend-url/api/instances/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete instance');
  }
};
```

---

### 6. **Rotar contraseña**
```typescript
// MOCK ACTUAL (línea ~235)
export const rotatePassword = async (id: number): Promise<RotatePasswordResponse> => {
  await delay(1500);
  // ...código mock...
};

// REEMPLAZAR POR:
export const rotatePassword = async (id: number): Promise<RotatePasswordResponse> => {
  const response = await fetch(`http://your-backend-url/api/instances/${id}/rotate-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to rotate password');
  }
  
  return await response.json();
};
```

---

### 7. **Obtener motores de base de datos**
```typescript
// MOCK ACTUAL (línea ~260)
export const getEngines = async (): Promise<Engine[]> => {
  await delay(200);
  return MOCK_ENGINES;
};

// REEMPLAZAR POR:
export const getEngines = async (): Promise<Engine[]> => {
  const response = await fetch('http://your-backend-url/api/engines', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch engines');
  }
  
  return await response.json();
};
```

---

## 🔐 Función Helper para el Token

Crea esta función en el mismo archivo o en un archivo de utilidades:

```typescript
// Agregar al inicio del archivo
const getToken = (): string => {
  // Ajusta según cómo guardes el token en tu AuthContext
  const token = localStorage.getItem('access_token');
  return token || '';
};
```

---

## 📝 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://your-backend-url
```

Luego usa en el código:
```typescript
const API_URL = import.meta.env.VITE_API_URL;

// Ejemplo:
const response = await fetch(`${API_URL}/api/instances`, {...});
```

---

## ✅ Checklist de Integración

- [ ] Reemplazar `getInstances()` con llamada real
- [ ] Reemplazar `createInstance()` con llamada real
- [ ] Reemplazar `suspendInstance()` con llamada real
- [ ] Reemplazar `resumeInstance()` con llamada real
- [ ] Reemplazar `deleteInstance()` con llamada real
- [ ] Reemplazar `rotatePassword()` con llamada real
- [ ] Reemplazar `getEngines()` con llamada real
- [ ] Crear función `getToken()` para autenticación
- [ ] Configurar variables de entorno
- [ ] Probar todos los endpoints

---

## 🎨 Lo que NO necesitas cambiar

✅ **Context** (`src/context/InstanceContext.tsx`) - Ya está listo
✅ **Componentes** (Modales, páginas) - Ya están listos
✅ **Tipos** (`src/types/database.ts`) - Ya están definidos
✅ **Hooks** (`src/hooks/useInstances.ts`) - Ya está listo

Solo necesitas cambiar el archivo `instanceService.ts` y todo funcionará automáticamente! 🚀
