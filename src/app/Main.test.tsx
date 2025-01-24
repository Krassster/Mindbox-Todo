import { render, screen, fireEvent } from "@testing-library/react";
import Main from "./Main";

describe("Main Component", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("Загрузка тасок из localStorage при инициализации", () => {
    const mockTasks = [
      { id: 1, title: "Task 1", completed: false },
      { id: 2, title: "Task 2", completed: false },
    ];
    localStorage.setItem("tasks", JSON.stringify(mockTasks));

    render(<Main />);

    const tasks = screen.getAllByRole("listitem");
    expect(tasks.length).toBe(2);
    expect(screen.getByText("Task 1")).toBeTruthy();
    expect(screen.getByText("Task 2")).toBeTruthy();
  });

  test("Сохранение тасок в localStorage при добавлении новой", () => {
    render(<Main />);

    const input = screen.getByPlaceholderText("What needs to be done?");
    fireEvent.change(input, { target: { value: "New Task" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe("New Task");
  });

  test("Обновление тасок в localStorage при изменении статуса", () => {
    const mockTasks = [{ id: 1, title: "Task 1", completed: false }];
    localStorage.setItem("tasks", JSON.stringify(mockTasks));

    render(<Main />);

    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    const updatedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    console.log("Updated tasks in localStorage:", updatedTasks);
    expect(updatedTasks[0].completed).toBe(true);
  });

  test("Обновлении тасок в localStorage при удалении", () => {
    const mockTasks = [
      { id: 1, title: "Task 1", completed: true },
      { id: 2, title: "Task 2", completed: false },
    ];
    localStorage.setItem("tasks", JSON.stringify(mockTasks));

    render(<Main />);

    const clearButton = screen.getByText("Clear completed");
    fireEvent.click(clearButton);

    const updatedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    expect(updatedTasks.length).toBe(1);
    expect(updatedTasks[0].title).toBe("Task 2");
  });
});
