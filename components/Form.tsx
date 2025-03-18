import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Task } from "./Todo";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { memo, RefObject } from "react";

const Form = ({
  handleSubmit,
  handleTaskSubmit,
  editingTask,
  register,
  errors,
  inputRef,
}: {
  handleSubmit: (fn: (data: any) => void) => (e: React.FormEvent) => void;
  handleTaskSubmit: (data: {title: string}) => void;
  editingTask: Task | null;
  register: UseFormRegister<{title: string}>;
  errors: FieldErrors<{title: string}>;
  inputRef: RefObject<HTMLInputElement | null>
}) => {
    return (
        <>
        <form onSubmit={handleSubmit(handleTaskSubmit)} className="flex gap-2 mt-4">
          <Input {...register("title")} ref={(e) => {
            register("title").ref(e);
            inputRef.current = e;
          }}  placeholder="Добавить или изменить задачу..." />
          <Button type="submit">{editingTask ? "Сохранить" : "Добавить"}</Button>
        </form>
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </>
    )
}

export default memo(Form)