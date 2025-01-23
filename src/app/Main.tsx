import { useEffect, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import "./styles.css";

interface TaskProps {
  id: number;
  title: string;
  completed: boolean;
}

const Main: React.FC = () => {
  const [tasks, setTasks] = useState<TaskProps[]>(() => {
    const saveTasks = localStorage.getItem("tasks");
    return saveTasks ? JSON.parse(saveTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [filteredTasks, setFilteredTasks] = useState<TaskProps[]>(tasks);

  useEffect(() => {
    updateFilteredTasks(filter);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const updateFilteredTasks = (status: "all" | "active" | "completed") => {
    if (status === "all") {
      setFilteredTasks(tasks);
    }
    if (status === "active") {
      setFilteredTasks(tasks.filter((task) => !task.completed));
    }
    if (status === "completed") {
      setFilteredTasks(tasks.filter((task) => task.completed));
    }
  };

  const addTask = () => {
    if (newTask.trim() === "") return;

    const newTodo: TaskProps = {
      id: Date.now(),
      title: newTask.trim(),
      completed: false,
    };

    setTasks((prev) => [...(prev || []), newTodo]);
    setNewTask("");
  };

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTasks = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const handleFilter = (status: "all" | "active" | "completed") => {
    setFilter(status);
    updateFilteredTasks(status);
  };

  return (
    <div className="wrapper">
      <div className="header">todos</div>
      <div className="container">
        <div className="tasks">
          <div className="add-task">
            <button onClick={addTask} aria-label="Add">
              <FaAngleDown size={"25px"} color={"#959595"} />
            </button>
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What needs to be done?"
              onKeyDown={(e) => e.key === "Enter" && addTask()}></input>
          </div>
          <ul className="task-list">
            {filteredTasks?.map((task) => (
              <li key={task.id} className="task-item">
                <div className="checkbox-wrapper">
                  <input
                    id={`checkbox-${task.id}`}
                    type="checkbox"
                    className="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />
                  <label htmlFor={`checkbox-${task.id}`}></label>
                </div>

                <span
                  className={`task-text ${task.completed ? "completed" : ""}`}>
                  {task.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer">
          <span className="items-left">
            {tasks.filter((task) => !task.completed).length} items left
          </span>
          <div className="filters">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => handleFilter("all")}>
              All
            </button>
            <button
              className={filter === "active" ? "active" : ""}
              onClick={() => handleFilter("active")}>
              Active
            </button>
            <button
              className={filter === "completed" ? "active" : ""}
              onClick={() => handleFilter("completed")}>
              Completed
            </button>
          </div>
          <button className="clear" onClick={deleteTasks}>
            Clear completed
          </button>
        </div>
      </div>
    </div>
  );
};

export default Main;
