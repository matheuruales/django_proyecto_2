export class ListTodosUseCase {
  constructor(todoRepository) {
    this.todoRepository = todoRepository;
  }

  execute() {
    return this.todoRepository.getAll();
  }
}
