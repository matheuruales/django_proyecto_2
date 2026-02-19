# django_proyecto_2

Plantilla base para iniciar un proyecto **solo con HTML, CSS y JavaScript** usando una arquitectura hexagonal.

## Objetivo

Separar responsabilidades para que el codigo de negocio no dependa del DOM, de `localStorage` ni de detalles de infraestructura.

## Estructura de carpetas

```text
django_proyecto_2/
├── index.html
├── README.md
├── public/
│   └── assets/
│       ├── icons/
│       └── images/
└── src/
    ├── main.js
    ├── domain/
    │   ├── entities/
    │   │   └── Todo.js
    │   └── ports/
    │       └── TodoRepositoryPort.js
    ├── application/
    │   └── use-cases/
    │       ├── CreateTodoUseCase.js
    │       └── ListTodosUseCase.js
    ├── adapters/
    │   ├── inbound/
    │   │   └── ui/
    │   │       └── TodoController.js
    │   └── outbound/
    │       └── storage/
    │           └── LocalStorageTodoRepository.js
    ├── infrastructure/
    │   ├── config/
    │   │   └── storageKeys.js
    │   └── utils/
    │       └── generateId.js
    └── ui/
        └── styles/
            ├── main.css
            ├── base/
            │   ├── reset.css
            │   └── variables.css
            ├── components/
            │   ├── button.css
            │   └── card.css
            └── pages/
                └── home.css
```

## Flujo hexagonal

1. **UI (entrada):** `TodoController` escucha eventos del formulario.
2. **Application:** llama casos de uso (`CreateTodoUseCase`, `ListTodosUseCase`).
3. **Domain:** contiene reglas y entidades (`Todo`) + puertos (`TodoRepositoryPort`).
4. **Adapters de salida:** `LocalStorageTodoRepository` implementa el puerto.
5. **Infrastructure:** configuracion y utilidades (`storageKeys`, `generateId`).

## Como ejecutar

Opciones simples (sin frameworks):

1. Abrir `index.html` directo en el navegador.
2. Levantar servidor local:

```bash
cd /Users/matheu/trabajo/django_proyecto_2
python3 -m http.server 5500
```

Luego abrir: `http://localhost:5500`

## Siguientes pasos sugeridos

- Agregar casos de uso para editar/eliminar tareas.
- Cambiar `localStorage` por una API REST sin tocar `domain` ni `application`.
- Agregar tests unitarios para `domain` y `application`.
