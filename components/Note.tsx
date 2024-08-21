"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import { Info, NotepadText } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Note({ currentGroupId }: { currentGroupId: string }) {
  const textId = "text" + currentGroupId;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    if (isOpen) {
      const storedText = localStorage.getItem(textId);
      setText(storedText || "");
      placeCursorToEnd();
    }
  }, [isOpen, textId]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setTypingTimeout(
      setTimeout(() => {
        localStorage.setItem(textId, e.target.value);
      }, 1000)
    );
  };

  const placeCursorToEnd = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.focus();
      const end = textarea.value.length;
      textarea.setSelectionRange(end, end);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <Popover onOpenChange={(open) => setIsOpen(open)}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="size-9 shrink-0">
          <NotepadText className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      {isOpen && (
        <PopoverContent className="w-72 bg-muted">
          <textarea
            id="note-textarea"
            ref={textareaRef}
            rows={5}
            className="custom__no_resize w-full rounded-sm border-border bg-muted text-sm focus-visible:outline-none focus-visible:ring-0"
            onChange={handleChange}
            value={text}
            placeholder="Type anything"
          />
          <div className="flex items-center gap-1">
            <Info className="h-3 w-3 text-foreground/50" />
            <span className="select-none text-xs text-foreground/50">
              Notes are autosaved locally
            </span>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
