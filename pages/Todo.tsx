import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
// import "../styles/theme.css";

// Определение схемы валидации для задач
const taskSchema = z.object({
  title: z.string().trim().min(1, "Заполните поле"),
});

// Типизация задачи
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

// Функция для создания новой задачи
const createNewTask = (title: string): Task => ({
  id: Date.now(),
  title,
  completed: false,
});


const filters = ["все", "активные", "выполнено"]

export default function TodoApp() {
  // Локальное состояние для задач, фильтрации, режима редактирования и темной темы
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<"все" | "активные" | "выполнено">("все");
  const [darkMode, setDarkMode] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Загрузка задач из localStorage при монтировании компонента и установка темы
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

  // Добавление или редактирование задачи
  const handleTaskSubmit = (data: { title: string }) => {
    let updatedTasks;

    if (editingTask) {
      updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? { ...task, title: data.title } : task
      );
      setEditingTask(null);
    } else {
      updatedTasks = [...tasks, createNewTask(data.title)];
    }

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    reset();
  };

  // Переключение состояния выполнения задачи
  const toggleTask = (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Удаление задачи
  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Начало редактирования задачи
  const startEditing = (task: Task) => {
    setEditingTask(task);
    setValue("title", task.title);
  };
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", !darkMode ? "dark" : "light");
  };

  // Фильтрация задач
  const filteredTasks = tasks.filter((task) => {
    switch (filter) {
      case "выполнено":
        return task.completed;
      case "активные":
        return !task.completed;
      default:
        return true;
    }
  });

  console.log('darkMode',darkMode)
  return (
    <div
    className={`min-h-screen p-6 transition-colors duration-300 ${!darkMode ? "dark" : "light"}`}
    >
      <div className="max-w-lg mx-auto">
        {/* Переключение темы */}
        <Button onClick={toggleTheme}>Переключить тему</Button>

        {/* Форма для добавления и редактирования задач */}
        <form onSubmit={handleSubmit(handleTaskSubmit)} className="flex gap-2 mt-4">
          <Input {...register("title")} placeholder="Добавить или изменить задачу..." />
          <Button type="submit">{editingTask ? "Сохранить" : "Добавить"}</Button>
        </form>
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        {/* Фильтр задач */}
        <div className="flex gap-2 my-4">
          {filters.map((type) => (
            <Button key={type} onClick={() => setFilter(type as "все" | "активные" | "выполнено")}>
              {type}
            </Button>
          ))}
        </div>

        {/* Отображение списка задач */}
        {filteredTasks.map((task) => (
          <Card key={task.id} className="flex justify-between p-4 my-2">
            <div className="flex items-center gap-2">
              <Switch checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
              <span className={task.completed ? "line-through" : ""}>{task.title}</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => startEditing(task)}>Редактировать</Button>
              <Button onClick={() => deleteTask(task.id)}>Удалить</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

