import { Todo } from "../../domain/entities/Todo.js";

export class CreateTodoUseCase {
  constructor(todoRepository, idGenerator) {
    this.todoRepository = todoRepository;
    this.idGenerator = idGenerator;
  }

  execute({ title }) {
    const todo = new Todo({
      id: this.idGenerator(),
      title,
      completed: false,
    });

    return this.todoRepository.save(todo);
  }
}
