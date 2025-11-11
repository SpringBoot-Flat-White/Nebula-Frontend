# ✅ Diferenciación de Planes - FREE vs STANDARD/PREMIUM

## 🎯 Funcionalidad Implementada

El sistema **YA diferencia automáticamente** entre planes FREE y planes pagos (STANDARD/PREMIUM) en cuanto a la creación de instancias.

---

## 📋 Diferencias por Plan

| Característica | FREE Plan | STANDARD/PREMIUM |
|----------------|-----------|------------------|
| **Nombre de instancia** | ❌ Auto-generado | ✅ Usuario elige |
| **Usuario DB** | ❌ Auto-generado | ✅ Usuario elige (futuro) |
| **Contraseña** | ❌ Auto-generada | ❌ Auto-generada (por seguridad) |
| **Límite instancias** | 2 | 5 / 10 |
| **Control del nombre** | Backend | Usuario + Backend |

---

## 🔧 Implementación Actual

### 1. **Detección del Plan** (Línea 22)

**Archivo:** `src/components/instances/CreateInstanceModal.tsx`

```typescript
const isFree = user?.plan?.toUpperCase() === 'FREE' || !user?.plan;
```

Esta variable determina qué campos mostrar en el formulario.

---

### 2. **Formulario Dinámico - Plan FREE**

#### Vista del Usuario FREE (Líneas 113-120)

```typescript
{isFree ? (
  // ⚠️ USUARIO FREE - CAMPO BLOQUEADO
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <p className="text-sm text-blue-800">
      <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      On the <strong>Free plan</strong>, instance names are auto-generated. 
      Upgrade to Standard or Premium to choose custom names.
    </p>
  </div>
) : (
  // ✅ USUARIO STANDARD/PREMIUM - INPUT HABILITADO
  <input
    type="text"
    value={instanceName}
    onChange={(e) => setInstanceName(e.target.value)}
    placeholder="e.g., my-production-db"
    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
    required={!isFree}
  />
)}
```

**Resultado:**
- **FREE:** Mensaje informativo azul explicando que el nombre es automático
- **STANDARD/PREMIUM:** Input de texto para escribir nombre custom

---

### 3. **Envío al Backend** (Líneas 45-48)

```typescript
const result = await createInstance({
  engineId: selectedEngineId,
  name: isFree ? undefined : instanceName || undefined,
});
```

**Lógica:**
- **FREE:** Envía `name: undefined` → Backend genera nombre automático
- **STANDARD/PREMIUM:** Envía `name: "mi-nombre-custom"` → Backend usa ese nombre

---

### 4. **Generación Automática en el Backend** (Mock)

**Archivo:** `src/services/instanceService.ts` (Líneas 79-82)

```typescript
// Generate random database name for Free plan
const generateDbName = (engineName: string): string => {
  const randomHash = Math.random().toString(36).substring(2, 10);
  return `${engineName.toLowerCase()}_${randomHash}`;
};
```

**Ejemplos generados:**
- `mysql_a8f3d2e1`
- `postgresql_9c4b7e3f`
- `mongodb_2d8a5f6c`

---

### 5. **Uso en createInstance** (Líneas 128)

```typescript
const instanceName = request.name || generateDbName(engine.name);
```

**Lógica:**
- Si `request.name` existe (plan pago) → usa ese nombre
- Si `request.name` es `undefined` (plan free) → genera automáticamente

---

## 🎨 Experiencia del Usuario

### Usuario con Plan FREE

1. Abre modal "Create New Instance"
2. Ve selector de motores (MySQL, PostgreSQL, etc.)
3. Ve cuadro azul informativo:
   ```
   ℹ️ On the Free plan, instance names are auto-generated.
      Upgrade to Standard or Premium to choose custom names.
   ```
4. No puede escribir nombre custom
5. Click "Create Instance"
6. Backend genera nombre: `mysql_x8d4f2a1`

---

### Usuario con Plan STANDARD/PREMIUM

1. Abre modal "Create New Instance"
2. Ve selector de motores (MySQL, PostgreSQL, etc.)
3. Ve campo de texto habilitado:
   ```
   Instance Name *
   [my-production-db          ]
   ```
4. Puede escribir nombre personalizado
5. Click "Create Instance"
6. Backend usa el nombre: `my-production-db`

---

## 📝 Tipos de Datos

### Request Type

**Archivo:** `src/types/database.ts`

```typescript
export interface CreateInstanceRequest {
  engineId: number;
  name?: string; // ⚠️ OPCIONAL - Solo para planes pagos
}
```

### Ejemplo de Request

#### Plan FREE
```json
{
  "engineId": 1
  // name NO se envía (undefined)
}
```

#### Plan STANDARD/PREMIUM
```json
{
  "engineId": 1,
  "name": "my-custom-database"
}
```

---

## 🔐 Credenciales (Siempre Auto-generadas)

Independiente del plan, las **contraseñas siempre se generan automáticamente** por seguridad:

```typescript
const password = `pwd_${Math.random().toString(36).substring(2, 15)}`;
```

**Ejemplo:** `pwd_a8f3d2e1x9c4b`

**¿Por qué?**
- ✅ Mayor seguridad (contraseñas complejas)
- ✅ No hay riesgo de contraseñas débiles
- ✅ Único punto de falla (se muestra solo 1 vez)

---

## 🚀 Próximas Funcionalidades (Opcional)

### Campos Adicionales para Planes Pagos

Podrías agregar más campos personalizables:

```typescript
export interface CreateInstanceRequest {
  engineId: number;
  name?: string;           // ✅ YA IMPLEMENTADO
  username?: string;       // 🔜 FUTURO (solo planes pagos)
  databaseName?: string;   // 🔜 FUTURO (solo planes pagos)
  port?: number;           // 🔜 FUTURO (solo planes pagos)
}
```

### Ejemplo de Modal Extendido (Futuro)

```tsx
{!isFree && (
  <>
    {/* Custom Instance Name */}
    <input
      type="text"
      value={instanceName}
      onChange={(e) => setInstanceName(e.target.value)}
      placeholder="e.g., my-production-db"
      required
    />
    
    {/* Custom Username */}
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      placeholder="e.g., admin_user"
      required
    />
    
    {/* Custom Database Name */}
    <input
      type="text"
      value={databaseName}
      onChange={(e) => setDatabaseName(e.target.value)}
      placeholder="e.g., my_database"
      required
    />
  </>
)}
```

---

## 🛡️ Validación en el Backend (Recomendado)

Tu backend debe validar que los usuarios FREE no envíen nombres custom:

```java
@PostMapping("/instances")
public ResponseEntity<?> createInstance(@RequestBody CreateInstanceRequest request) {
    User user = getCurrentUser();
    
    // ✅ Validar que FREE no envíe nombre custom
    if (user.getPlan() == Plan.FREE && request.getName() != null) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Free plan users cannot choose custom names"));
    }
    
    // ✅ Validar que STANDARD/PREMIUM envíen nombre
    if (user.getPlan() != Plan.FREE && request.getName() == null) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Please provide an instance name"));
    }
    
    // Generar nombre si es FREE
    String instanceName = request.getName() != null 
        ? request.getName() 
        : generateRandomName(request.getEngine());
    
    // Crear instancia...
}
```

---

## 📊 Tabla Resumen - Control del Frontend

| Campo | FREE | STANDARD | PREMIUM | ¿Quién genera? |
|-------|------|----------|---------|----------------|
| **Engine** | Usuario elige | Usuario elige | Usuario elige | Usuario |
| **Instance Name** | ❌ Bloqueado | ✅ Input | ✅ Input | Usuario (pagos) / Backend (free) |
| **Username** | Auto | Auto | Auto | Backend |
| **Password** | Auto | Auto | Auto | Backend |
| **Port** | Auto | Auto | Auto | Backend |
| **IP** | Auto | Auto | Auto | Backend |

---

## ✅ Checklist de Validación

### Frontend (Ya implementado)
- ✅ Detecta plan del usuario: `isFree`
- ✅ Muestra mensaje informativo para FREE
- ✅ Bloquea input de nombre para FREE
- ✅ Habilita input de nombre para STANDARD/PREMIUM
- ✅ Envía `name: undefined` para FREE
- ✅ Envía `name: "custom"` para STANDARD/PREMIUM
- ✅ Marca campo como requerido solo para planes pagos

### Backend (Recomendado)
- [ ] Validar que FREE no envíe nombre custom
- [ ] Validar que STANDARD/PREMIUM envíen nombre
- [ ] Generar nombre automático para FREE
- [ ] Usar nombre custom para STANDARD/PREMIUM
- [ ] Validar formato del nombre (regex)
- [ ] Validar que el nombre no exista ya

---

## 🎯 Flujo Completo

```
Usuario inicia sesión
       ↓
Frontend detecta plan: user.plan = "FREE" | "STANDARD" | "PREMIUM"
       ↓
Usuario abre modal de creación
       ↓
Frontend evalúa: isFree = (plan === "FREE" || !plan)
       ↓
┌─────────────────────┬────────────────────┐
│      PLAN FREE      │   PLAN STANDARD    │
├─────────────────────┼────────────────────┤
│ Muestra mensaje azul│ Muestra input text │
│ "auto-generated"    │ + placeholder      │
│                     │                    │
│ instanceName = ""   │ instanceName = user│
│ (no se usa)         │ input value        │
└─────────────────────┴────────────────────┘
       ↓                       ↓
Request: { engineId, name: undefined } | { engineId, name: "custom" }
       ↓
Backend recibe request
       ↓
┌─────────────────────┬────────────────────┐
│   name = undefined  │   name = "custom"  │
├─────────────────────┼────────────────────┤
│ Genera automático:  │ Usa el enviado:    │
│ "mysql_a8f3d2e1"    │ "my-production-db" │
└─────────────────────┴────────────────────┘
       ↓
Instancia creada con nombre correspondiente
       ↓
Frontend muestra credenciales (1 sola vez)
```

---

## 🔥 Resumen Final

| Aspecto | Estado |
|---------|--------|
| ¿Detecta el plan? | ✅ SÍ - `isFree` variable |
| ¿Bloquea nombre en FREE? | ✅ SÍ - Muestra mensaje informativo |
| ¿Permite nombre en STANDARD/PREMIUM? | ✅ SÍ - Input habilitado |
| ¿Envía datos correctos? | ✅ SÍ - `undefined` vs custom name |
| ¿UI clara para el usuario? | ✅ SÍ - Mensaje azul explicativo |
| ¿Contraseñas seguras? | ✅ SÍ - Siempre auto-generadas |
| ¿Validación en backend? | ⚠️ RECOMENDADO - Debes implementar |

---

**TODO ESTÁ LISTO EN EL FRONTEND.** El backend solo debe:
1. Recibir `CreateInstanceRequest`
2. Si `name` es `null/undefined` → Generar automático
3. Si `name` existe → Validar y usar ese nombre
4. Validar que FREE no envíe nombre (seguridad extra)

🚀 **El formulario ya controla todo perfectamente.**
