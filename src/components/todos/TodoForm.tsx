import { useState, useEffect, useRef } from "react";
import { Plus, Calendar, Flag, Hash, Repeat } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import Select from "../ui/Select";
import { useTodos } from "../../hooks/useTodos";
import { useCategories } from "../../hooks/useCategories";
import { useProfile } from "../../hooks/useProfile";
import { t } from "../../lib/i18n";
import type { TodoPriority } from "../../types";
import {
  RecurringTaskModal,
  type RecurrenceFormValues,
} from "./RecurringTaskModal";

interface TodoFormProps {
  defaultDate?: string;
  defaultPriority?: TodoPriority;
}

export function TodoForm({
  defaultDate = "",
  defaultPriority = "high",
}: TodoFormProps) {
  const { addTodo } = useTodos();
  const { categories, fetchCategories } = useCategories();
  const { profile } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const dueDateInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TodoPriority>(defaultPriority);
  const [categoryId, setCategoryId] = useState<string>("");
  const [dueDate, setDueDate] = useState(defaultDate);
  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [recurrence, setRecurrence] = useState<RecurrenceFormValues | null>(
    null,
  );

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen, fetchCategories]);

  useEffect(() => {
    if (!title) {
      setPriority(defaultPriority);
      return;
    }

    const trimmedTitle = title.trimStart();

    if (trimmedTitle.startsWith("!") || trimmedTitle.startsWith("!")) {
      setPriority("high");
    } else if (
      priority === "high" &&
      !trimmedTitle.startsWith("!") &&
      !trimmedTitle.startsWith("!")
    ) {
      setPriority(defaultPriority);
    }

    if (
      (trimmedTitle.startsWith("#") || trimmedTitle.startsWith("#")) &&
      categories.length > 0
    ) {
      if (!categoryId) {
        setCategoryId(categories[0].id);
      }
    }
  }, [title, priority, defaultPriority, categoryId, categories]);

  // Reset form with defaults when opening/submitting
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority(defaultPriority);
    setCategoryId("");
    setDueDate(defaultDate);
    setRecurrence(null);
    setIsOpen(false);
  };

  const language = profile?.language_preference ?? "ru-RU";

  const openDatePicker = () => {
    const input = dueDateInputRef.current;
    if (!input) return;
    if (typeof input.showPicker === "function") {
      input.showPicker();
      return;
    }
    input.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let processedTitle = title.trimStart();
    let shouldSetPriority = priority;

    if (processedTitle.startsWith("!") || processedTitle.startsWith("!")) {
      processedTitle = processedTitle.substring(1).trimStart();
      shouldSetPriority = "high";
    }

    if (processedTitle.startsWith("#") || processedTitle.startsWith("#")) {
      processedTitle = processedTitle.substring(1).trimStart();
    }

    await addTodo({
      title: processedTitle,
      description: description || null,
      priority: shouldSetPriority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      category_id: categoryId || null,
      recurring_task_id: null,
      tags: [],
      reminder_time: null,
      status: "pending",
      recurrence: recurrence
        ? {
            mode: recurrence.mode,
            frequency: recurrence.frequency,
            interval: recurrence.interval,
            startDate: recurrence.startDate || null,
            reminderTime: recurrence.reminderTime || null,
          }
        : null,
    });

    resetForm();
  };

  if (!isOpen) {
    return (
      <Button
        className="w-full justify-start text-muted-foreground h-12 px-4"
        variant="outline"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        {t(language, "addTaskPlaceholder")}
      </Button>
    );
  }

  return (
    <div className="relative z-50">
      <RecurringTaskModal
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
        value={recurrence}
        onSave={setRecurrence}
        language={language}
      />
      <form
        onSubmit={handleSubmit}
        className="rounded-lg border bg-card p-4 space-y-4 animate-fadeIn hover:shadow-md transition-all duration-300"
      >
        <div className="space-y-2">
          <div className="relative">
            <Input
              placeholder={t(language, "taskTitlePlaceholder")}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full"
            />
            {(title.trimStart().startsWith("!") ||
              title.trimStart().startsWith("! ")) && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-destructive animate-fadeIn">
                <Flag className="h-3 w-3" />
              </div>
            )}
            {(title.trimStart().startsWith("#") ||
              title.trimStart().startsWith("#")) &&
              !title.trimStart().startsWith("!") &&
              !title.trimStart().startsWith("!") && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs text-primary animate-fadeIn">
                  <Hash className="h-3 w-3" />
                </div>
              )}
          </div>
          <Input
            placeholder={t(language, "descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-3 pt-2 border-t">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                ref={dueDateInputRef}
                type="date"
                value={dueDate}
                className="sr-only"
                onChange={(e) => setDueDate(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={openDatePicker}
                className={`rounded-full transition-all duration-200 ${
                  dueDate
                    ? "text-primary bg-primary/10 hover:bg-primary/20"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dueDate || t(language, "dueDate")}
              </Button>
            </div>

            <Select
              value={priority}
              onChange={(value) => {
                setPriority(value as TodoPriority);
              }}
              options={[
                { value: "low", label: t(language, "lowPriority") },
                { value: "medium", label: t(language, "mediumPriority") },
                { value: "high", label: t(language, "highPriority") },
              ]}
              placeholder={t(language, "priority")}
              icon={<Flag className="h-4 w-4" />}
            />
            <Select
              value={categoryId}
              onChange={setCategoryId}
              options={[
                { value: "", label: t(language, "noCategory") },
                ...categories.map((cat) => ({
                  value: cat.id,
                  label: cat.name,
                  color: cat.color,
                })),
              ]}
              placeholder={t(language, "category")}
              icon={<Hash className="h-4 w-4" />}
              className={`${
                categoryId
                  ? "bg-primary/10 hover:bg-primary/20"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            />

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="rounded-full text-muted-foreground hover:bg-accent transition-all duration-200"
              onClick={() => setIsRecurringModalOpen(true)}
            >
              <Repeat className="mr-2 h-4 w-4" />
              {recurrence ? "✓" : t(language, "repeat")}
            </Button>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={resetForm}
              className="rounded-full transition-all duration-200"
            >
              {t(language, "cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!title.trim()}
              className="rounded-full transition-all duration-200"
            >
              {t(language, "addTask")}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
