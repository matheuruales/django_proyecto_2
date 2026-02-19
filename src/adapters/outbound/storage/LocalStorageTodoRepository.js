import { Todo } from "../../../domain/entities/Todo.js";
import { TodoRepositoryPort } from "../../../domain/ports/TodoRepositoryPort.js";

export class LocalStorageTodoRepository extends TodoRepositoryPort {
  constructor(storage, storageKey) {
    super();
    this.storage = storage;
    this.storageKey = storageKey;
  }

  getAll() {
    const rawTodos = this.storage.getItem(this.storageKey);
    const parsedTodos = rawTodos ? JSON.parse(rawTodos) : [];

    return parsedTodos.map((todo) => new Todo(todo));
  }

  save(todo) {
    const todos = this.getAll();
    todos.push(todo);

    this.storage.setItem(this.storageKey, JSON.stringify(todos));
    return todo;
  }
}
