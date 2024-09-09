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
  const [clonedValue, setClonedValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      const storedText = localStorage.getItem(textId);
      setText(storedText || "");
      setClonedValue(storedText || "");

      // `requestAnimationFrame` ensures that the function is called after the browser has finished updating the DOM
      requestAnimationFrame(() => {
        placeCursorToEnd();
      });
    }
  }, [isOpen, textId]);

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setClonedValue(e.target.value);
  };

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
        <PopoverContent className="w-72 bg-background p-2">
          <div
            className="grid text-sm
            after:invisible after:whitespace-pre-wrap after:border after:px-3.5 after:pt-2.5 after:text-inherit after:content-[attr(data-cloned-val)_'_'] after:[grid-area:1/1/2/2]
            [&>textarea]:resize-none [&>textarea]:overflow-hidden [&>textarea]:text-inherit [&>textarea]:[grid-area:1/1/2/2]"
            data-cloned-val={clonedValue}
          >
            <textarea
              className="w-full appearance-none rounded border border-neutral-200 bg-background px-2 pt-1.5 text-sm focus-visible:outline-none focus-visible:ring-0 dark:border-neutral-800"
              name="note-textarea"
              id="note-textarea"
              rows={4}
              ref={textareaRef}
              onInput={handleInput}
              onChange={handleChange}
              value={text}
              placeholder="Type anything..."
              required
            />
          </div>
          <div className="mt-2 flex items-center gap-1">
            <Info className="h-3 w-3 text-foreground/50" />
            <span className="select-none text-xs text-foreground/50">
              Anything you type is autosaved locally
            </span>
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
}
