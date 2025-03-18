import { Task } from "@/components/Todo";
import { z } from "zod";

 // validation ZOD
export const taskSchema = z.object({
    title: z.string().trim().min(1, "Заполните поле"),
  });

  // create Task funk
export const createNewTask = (title: string): Task => ({
    id: Date.now(),
    title,
    completed: false,
  });
