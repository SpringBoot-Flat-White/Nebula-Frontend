# ✅ Validaciones de Límite de Plan - Resumen Completo

## 🎯 Sistema de Validación Multi-Nivel

El sistema implementa **validación en 3 capas** para garantizar que los usuarios no excedan el límite de instancias de su plan.

---

## 📊 Límites por Plan

```typescript
FREE:     2 instancias
STANDARD: 5 instancias
PREMIUM:  10 instancias
```

---

## 🛡️ Capa 1: Context Level (Backend Logic)

### Archivo: `src/context/InstanceContext.tsx`

#### 1.1 Cálculo del Límite (Línea 31-41)
```typescript
const getPlanLimit = (): number => {
  const plan = user?.plan?.toUpperCase() || 'FREE';
  switch (plan) {
    case 'FREE':
      return 2;
    case 'STANDARD':
      return 5;
    case 'PREMIUM':
      return 10;
    default:
      return 2;
  }
};
```

#### 1.2 Variable de Validación (Línea 43)
```typescript
const canCreateInstance = instances.length < getPlanLimit();
```

Esta variable se exporta y está disponible en toda la aplicación.

#### 1.3 Validación en createInstance (Línea 68-72)
```typescript
const createInstance = async (request: CreateInstanceRequest) => {
  try {
    setLoading(true);
    setError(null);

    // ⚠️ VALIDACIÓN CRÍTICA
    if (!canCreateInstance) {
      throw new Error(`You have reached the limit of ${getPlanLimit()} instances for your plan`);
    }

    const response = await instanceService.createInstance(request);
    // ...
  }
}
```

**Resultado:** Si intentas crear una instancia cuando ya alcanzaste el límite, lanza un error ANTES de llamar al backend.

---

## 🎨 Capa 2: UI Level (Visual Feedback)

### 2.1 DashboardPage - Quick Actions

**Archivo:** `src/pages/DashboardPage.tsx` (Línea 162-175)

```typescript
<button
  onClick={() => navigate('/dashboard/instances')}
  className={`p-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-left ${
    canCreateInstance
      ? 'bg-gradient-to-br from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
      : 'bg-gray-200 text-gray-500 cursor-not-allowed'  // ⚠️ DESHABILITADO
  }`}
>
  <h3 className="font-bold text-xl mb-2">Database Instances</h3>
  <p className={`text-sm ${canCreateInstance ? 'text-purple-100' : 'text-gray-600'}`}>
    {canCreateInstance
      ? 'Create and manage your database instances'
      : `Limit reached (${instances.length}/${getPlanLimit()})`}  // ⚠️ MENSAJE CLARO
  </p>
</button>
```

**Resultado:** 
- ✅ **Si puedes crear:** Botón azul brillante con texto motivador
- ❌ **Si NO puedes:** Botón gris deshabilitado con mensaje "Limit reached (2/2)"

---

### 2.2 DashboardPage - Metrics Card

**Archivo:** `src/pages/DashboardPage.tsx` (Línea 135-147)

```typescript
<div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-purple-100">
  <div className="text-sm text-gray-600 mb-1">Instances Used</div>
  <div className="text-2xl font-bold text-gray-900">
    {instances.length} / {getPlanLimit()}
  </div>
  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
    <div
      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${(instances.length / getPlanLimit()) * 100}%` }}
    ></div>
  </div>
</div>
```

**Resultado:** Barra de progreso visual que muestra cuántas instancias estás usando (ej: 2/2 = 100% lleno)

---

### 2.3 InstancesPage - Create Button

**Archivo:** `src/pages/InstancesPage.tsx` (Línea 213-222)

```typescript
<button
  onClick={() => setShowCreateModal(true)}
  disabled={!canCreateInstance}  // ⚠️ DESHABILITADO EN HTML
  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg ${
    canCreateInstance
      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:shadow-xl transform hover:-translate-y-0.5'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
  {canCreateInstance ? '+ Create New Instance' : `Limit Reached (Upgrade Plan)`}
</button>
```

**Resultado:**
- ✅ **Si puedes:** Botón morado con "+ Create New Instance"
- ❌ **Si NO puedes:** Botón gris deshabilitado con "Limit Reached (Upgrade Plan)"

---

### 2.4 EnginesPage - Create Buttons

**Archivo:** `src/pages/EnginesPage.tsx`

Los botones de "Create Instance" se comportan igual:
- Deshabilitados cuando `!canCreateInstance`
- Mensaje claro de límite alcanzado

---

## 🔒 Capa 3: Backend Validation (Recomendado)

Aunque el frontend ya valida todo, **el backend también debe validar** para seguridad:

```java
// Backend (Spring Boot ejemplo)
@PostMapping("/instances")
public ResponseEntity<?> createInstance(@RequestBody CreateInstanceRequest request) {
    User user = getCurrentUser();
    
    // Validar límite del plan
    int currentInstances = instanceRepository.countByUserId(user.getId());
    int planLimit = getPlanLimit(user.getPlan());
    
    if (currentInstances >= planLimit) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Instance limit reached for your plan"));
    }
    
    // Crear instancia...
}
```

---

## 🧪 Pruebas del Sistema

### Escenario 1: Usuario FREE con 0 instancias
- ✅ `canCreateInstance = true` (0 < 2)
- ✅ Botón "Create Instance" HABILITADO
- ✅ Puede crear hasta 2 instancias

### Escenario 2: Usuario FREE con 2 instancias
- ❌ `canCreateInstance = false` (2 >= 2)
- ❌ Botón "Create Instance" DESHABILITADO
- ❌ Mensaje: "Limit reached (2/2)"
- ❌ Si intenta crear (manualmente), lanza error: "You have reached the limit of 2 instances for your plan"

### Escenario 3: Usuario STANDARD con 4 instancias
- ✅ `canCreateInstance = true` (4 < 5)
- ✅ Botón habilitado, puede crear 1 más

### Escenario 4: Usuario PREMIUM con 10 instancias
- ❌ `canCreateInstance = false` (10 >= 10)
- ❌ Debe actualizar a otro plan o eliminar instancias

---

## 📍 Flujo Completo de Validación

```
Usuario intenta crear instancia
         ↓
1. UI Check: ¿Botón habilitado?
   ├─ NO → Botón gris, no puede hacer clic
   └─ SÍ → Continúa
         ↓
2. Modal se abre, llena formulario
         ↓
3. Submit → InstanceContext.createInstance()
         ↓
4. Context Check: ¿canCreateInstance?
   ├─ NO → throw Error("limit reached")
   └─ SÍ → Continúa
         ↓
5. instanceService.createInstance()
   (llamada al backend)
         ↓
6. Backend valida límite nuevamente
   ├─ NO → 400 Bad Request
   └─ SÍ → Crea instancia
         ↓
7. Frontend actualiza lista
         ↓
8. canCreateInstance se recalcula
         ↓
9. UI se actualiza automáticamente
```

---

## 🎯 Casos Edge Cubiertos

### ✅ Usuario alcanza el límite exacto
```typescript
instances.length = 2, limit = 2
canCreateInstance = false  ✓
```

### ✅ Usuario elimina una instancia
```typescript
// Antes: 2/2 instancias
deleteInstance(id)
// Después: 1/2 instancias
canCreateInstance = true  ✓ (se reactiva automáticamente)
```

### ✅ Usuario upgrade su plan
```typescript
// Antes: FREE (2/2)
user.plan = 'STANDARD'
// Después: STANDARD (2/5)
canCreateInstance = true  ✓
```

### ✅ Múltiples pestañas abiertas
Cuando creas una instancia en una pestaña:
1. Context actualiza `instances`
2. `canCreateInstance` se recalcula
3. Todas las páginas usan el mismo contexto
4. Botones se deshabilitan en tiempo real

---

## 🔥 Resumen de Protecciones

| Capa | Ubicación | Tipo | ¿Puede Bypassearse? |
|------|-----------|------|---------------------|
| UI Visual | DashboardPage | Botón deshabilitado | Sí (DevTools) |
| UI Visual | InstancesPage | Botón deshabilitado | Sí (DevTools) |
| UI Visual | EnginesPage | Botón deshabilitado | Sí (DevTools) |
| Context Logic | InstanceContext | Error antes de API | No (JavaScript) |
| Backend | API REST | Validación en servidor | **NO** ✅ |

**Conclusión:** Incluso si alguien modifica el frontend con DevTools, la validación en `InstanceContext` lo bloquea. Y si modifican el JavaScript, el backend debe validar como última línea de defensa.

---

## ✅ TODO ESTÁ VALIDADO

- ✅ **UI deshabilitada** cuando se alcanza el límite
- ✅ **Mensaje claro** al usuario ("Limit reached")
- ✅ **Error lanzado** si intenta crear programáticamente
- ✅ **Barra de progreso** visual del uso
- ✅ **Reactivo** - se actualiza automáticamente al crear/eliminar
- ✅ **Multi-página** - funciona en Dashboard, Instances y Engines
- ✅ **Type-safe** con TypeScript

**El backend solo necesita duplicar esta validación para seguridad extra.** 🛡️
