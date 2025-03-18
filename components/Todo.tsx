"use client"
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import  List from "./List";
import Filter  from "./Filter";
import Form  from "./Form";
import { createNewTask, taskSchema } from "@/utils/utils";


export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"все" | "активные" | "выполнено">("все");
  const [darkMode, setDarkMode] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        setTasks(savedTasks);
    
        document.documentElement.setAttribute("data-theme", !darkMode ? "dark" : "light");
        setDarkMode(localStorage.getItem("theme") === "dark");
        
      }, [darkMode]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<{ title: string }>({
    resolver: zodResolver(taskSchema),
  });

  const handleTaskSubmit = useCallback((data: { title: string }) => {
    console.log('data', data)
    setTasks((prevTasks) => {
      const updatedTasks = editingTask
        ? prevTasks.map((task) => (task.id === editingTask.id ? { ...task, title: data.title } : task))
        : [...prevTasks, createNewTask(data.title)];

      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
    setEditingTask(null);
    reset();
  }, [editingTask, reset]);

  const toggleTask = useCallback((id: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);

  const deleteTask = useCallback((id: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((task) => task.id !== id);
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      return updatedTasks;
    });
  }, []);

  const startEditing = useCallback((task: Task) => {
    inputRef.current?.focus();
    setEditingTask(task);
    setValue("title", task.title);
    
  }, [setValue]);

  const toggleTheme = useCallback(() => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("theme", newMode ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", newMode ? "dark" : "light");
      return newMode;
    });
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      switch (filter) {
        case "выполнено":
          return task.completed;
        case "активные":
          return !task.completed;
        default:
          return true;
      }
    });
  }, [tasks, filter]);

  return (
    <div className="min-h-screen p-6 transition-colors duration-300">
      <div className="max-w-lg mx-auto">
        <Button onClick={toggleTheme}>Переключить тему</Button>
        <Form
          handleSubmit={handleSubmit}
          handleTaskSubmit={handleTaskSubmit}
          editingTask={editingTask}
          register={register}
          errors={errors}
          inputRef={inputRef}
        />
        <Filter setFilter={setFilter} />
        <List
          toggleTask={toggleTask}
          filteredTasks={filteredTasks}
          startEditing={startEditing}
          deleteTask={deleteTask}
        />
      </div>
    </div>
  );
}
