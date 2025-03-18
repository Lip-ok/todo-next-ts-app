"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Task } from "./Todo"
import { Switch } from "@/components/ui/switch"
import { memo } from "react"

const List = ({
  toggleTask,
  filteredTasks,
  startEditing,
  deleteTask
}: {
  toggleTask: (id: number) => void;
  filteredTasks: Task[];
  startEditing: (task: Task) => void;
  deleteTask: (id: number) => void;
}) => {

    return (
        <>
        {filteredTasks.map((task:Task) => (
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
          </>
    )
}

export default memo(List)