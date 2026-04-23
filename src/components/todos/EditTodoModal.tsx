import { useState, useEffect } from "react";
import { Flag, Hash } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useCategories } from "../../hooks/useCategories";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import Modal from "../ui/Modal";
import Select from "../ui/Select";
import { toast } from "react-hot-toast";
import type { Todo, TodoPriority } from "../../types";

interface EditTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo: Todo | null;
  onUpdate: () => void;
  language: string;
}

export function EditTodoModal({
  isOpen,
  onClose,
  todo,
  onUpdate,
  language,
}: EditTodoModalProps) {
  const { categories, fetchCategories } = useCategories();
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [categoryId, setCategoryId] = useState("");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || "");
      setPriority(todo.priority);
      setCategoryId(todo.category_id || "");
      setDueDate(todo.due_date ? todo.due_date.split("T")[0] : "");
    }
  }, [todo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todo || !title.trim()) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("todos")
        .update({
          title: title.trim(),
          description: description || null,
          priority,
          category_id: categoryId || null,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
        })
        .eq("id", todo.id);

      if (error) throw error;

      toast.success(
        language === "ru-RU"
          ? "Успешно обновлено"
          : "Task updated successfully",
      );
      onUpdate();
      onClose();

      setTitle("");
      setDescription("");
      setPriority("medium");
      setCategoryId("");
      setDueDate("");
    } catch (error: any) {
      toast.error(
        error.message ||
          (language === "ru-RU"
            ? "Ошибка при обновлении"
            : "Failed to update task"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={language === "ru-RU" ? "Редактировать задачу" : "Edit Task"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {language === "ru-RU" ? "Заголовок" : "Title"}
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              language === "ru-RU" ? "Введите заголовок" : "Enter task title"
            }
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {language === "ru-RU" ? "Описание" : "Description"}
          </label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              language === "ru-RU"
                ? "Добавить описание (не обязательно)"
                : "Add description (optional)"
            }
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {language === "ru-RU" ? "Приоритет优先级" : "Priority"}
          </label>
          <Select
            value={priority}
            onChange={(value) => setPriority(value as TodoPriority)}
            options={[
              { value: "low", label: language === "ru-RU" ? "Низкий" : "Low" },
              {
                value: "medium",
                label: language === "ru-RU" ? "Средний" : "Medium",
              },
              {
                value: "high",
                label: language === "ru-RU" ? "Высокий" : "High",
              },
            ]}
            placeholder={
              language === "ru-RU" ? "Выбрать приоритет" : "Select priority"
            }
            icon={<Flag className="h-4 w-4" />}
            className={`${
              priority !== "medium"
                ? priority === "high"
                  ? "text-destructive bg-destructive/10"
                  : "text-info bg-info/10"
                : "text-muted-foreground"
            }`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {language === "zh-CN" ? "分类" : "Category"}
          </label>
          <Select
            value={categoryId}
            onChange={setCategoryId}
            options={[
              {
                value: "",
                label: language === "ru-RU" ? "Без категории" : "No Category",
              },
              ...categories.map((cat) => ({
                value: cat.id,
                label: cat.name,
                color: cat.color,
              })),
            ]}
            placeholder={
              language === "ru-RU" ? "Выберите категории" : "Select category"
            }
            icon={<Hash className="h-4 w-4" />}
            className={categoryId ? "bg-primary/10" : "text-muted-foreground"}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">
            {language === "ru-RU" ? "До даты" : "Due Date"}
          </label>
          <Input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {language === "ru-RU" ? "Отмена" : "Cancel"}
          </Button>
          <Button
            type="submit"
            disabled={isLoading || !title.trim()}
            className="flex-1"
          >
            {isLoading
              ? language === "ru-RU"
                ? "Сохраняем..."
                : "Saving..."
              : language === "ru-RU"
                ? "Сохранить"
                : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
