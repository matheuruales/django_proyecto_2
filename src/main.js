import { CreateTodoUseCase } from "./application/use-cases/CreateTodoUseCase.js";
import { ListTodosUseCase } from "./application/use-cases/ListTodosUseCase.js";
import { TodoController } from "./adapters/inbound/ui/TodoController.js";
import { LocalStorageTodoRepository } from "./adapters/outbound/storage/LocalStorageTodoRepository.js";
import { TODO_LIST_KEY } from "./infrastructure/config/storageKeys.js";
import { generateId } from "./infrastructure/utils/generateId.js";

const repository = new LocalStorageTodoRepository(window.localStorage, TODO_LIST_KEY);
const createTodoUseCase = new CreateTodoUseCase(repository, generateId);
const listTodosUseCase = new ListTodosUseCase(repository);

const controller = new TodoController({
  formElement: document.getElementById("todo-form"),
  inputElement: document.getElementById("todo-title"),
  listElement: document.getElementById("todo-list"),
  createTodoUseCase,
  listTodosUseCase,
});

controller.start();
