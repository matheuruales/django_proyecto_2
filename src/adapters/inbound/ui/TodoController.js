export class TodoController {
  constructor({
    formElement,
    inputElement,
    listElement,
    createTodoUseCase,
    listTodosUseCase,
  }) {
    this.formElement = formElement;
    this.inputElement = inputElement;
    this.listElement = listElement;
    this.createTodoUseCase = createTodoUseCase;
    this.listTodosUseCase = listTodosUseCase;

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  start() {
    this.formElement.addEventListener("submit", this.handleSubmit);
    this.render();
  }

  handleSubmit(event) {
    event.preventDefault();

    this.createTodoUseCase.execute({
      title: this.inputElement.value,
    });

    this.formElement.reset();
    this.inputElement.focus();
    this.render();
  }

  render() {
    const todos = this.listTodosUseCase.execute();

    this.listElement.innerHTML = "";

    if (!todos.length) {
      const emptyItem = document.createElement("li");
      emptyItem.className = "todo-empty";
      emptyItem.textContent = "Todavia no hay tareas";
      this.listElement.appendChild(emptyItem);
      return;
    }

    todos.forEach((todo) => {
      const item = document.createElement("li");
      item.className = "todo-item";
      item.textContent = todo.title;
      this.listElement.appendChild(item);
    });
  }
}
