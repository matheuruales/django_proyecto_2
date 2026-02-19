export class Todo {
  constructor({ id, title, completed = false }) {
    if (!id) {
      throw new Error("Todo id is required");
    }

    if (!title || !title.trim()) {
      throw new Error("Todo title is required");
    }

    this.id = id;
    this.title = title.trim();
    this.completed = completed;
  }
}
