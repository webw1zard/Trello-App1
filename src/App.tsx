import React, { useEffect, useState } from "react";
import { database } from "./firebaseConfig";
import { ref, set, onValue } from "firebase/database";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

const App: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const tasksRef = ref(database, "tasks/");
    onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tasksArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTasks(tasksArray);
      } else {
        setTasks([]);
      }
    });
  }, []);

  const addTask = () => {
    if (name.trim()) {
      const taskId = Date.now().toString();
      set(ref(database, `tasks/${taskId}`), {
        name,
        status: "todo",
      });
      setName("");
    }
  };

  const updateTaskStatus = (
    taskId: string,
    status: "todo" | "inProgress" | "done"
  ) => {
    set(ref(database, `tasks/${taskId}`), {
      ...tasks.find((task) => task.id === taskId),
      status,
    });
  };

  const onDragStart = (event: any, taskId: string) => {
    event.dataTransfer.setData("taskId", taskId);
  };

  const onDrop = (event: any, status: "todo" | "inProgress" | "done") => {
    const taskId = event.dataTransfer.getData("taskId");
    updateTaskStatus(taskId, status);
  };

  const onDragOver = (event: any) => {
    event.preventDefault();
  };
  const handleEdit = (id: string, name: string) => {
    const newName = prompt("Enter new task name", name);
    if (newName) {
      set(ref(database, `tasks/${id}`), {
        name: newName,
        status: "todo",
      });
    }
  }
  const handleDelete = (id: string) => {
    set(ref(database, `tasks/${id}`), null);
  }
  return (
    <div className="container mt-5">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Type a task..."
          className="form-control w-50 mx-auto"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="btn btn-primary mt-3 d-block mx-auto"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      <div className="row">
        {["todo", "inProgress", "done"].map((status) => (
          <div
            key={status}
            className="col-4 shadow-lg"
            onDragOver={onDragOver}
            onDrop={(event) =>
              onDrop(event, status as "todo" | "inProgress" | "done")
            }
          >
            <div className="card">
              <div className="card-header text-center text-uppercase fw-bold">
                {status === "todo"
                  ? "To-Do"
                  : status === "inProgress"
                  ? "In Progress"
                  : "Done"}
              </div>
              <div className="card-body">
                {tasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <>
                      <div className="">
                      <div
                        key={task.id}
                        className="card mb-2 p-2 "
                        draggable
                        onDragStart={(event) => onDragStart(event, task.id)}
                      >
                        {task.name}
                      <div className="d-flex gap-3">
                      <button className="btn btn-warning " onClick={()=>handleEdit(task.id, task.name)}>Edit</button>
                      <button className="btn btn-dark " onClick={()=>handleDelete(task.id)}>Delete</button>
                      </div>
                      </div>
                      </div>
                    </>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
