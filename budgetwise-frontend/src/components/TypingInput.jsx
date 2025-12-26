import { Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function TypingInput({
  placeholders = [],
  value,
  onChange,
  type = "text",
}) {
  const [placeholder, setPlaceholder] = useState("");
  const safePlaceholders = Array.isArray(placeholders) ? placeholders : [];

  useEffect(() => {
    if (safePlaceholders.length === 0) return;

    let index = 0;
    let charIndex = 0;
    let deleting = false;

    const interval = setInterval(() => {
      const current = safePlaceholders[index];

      if (!current) return;

      if (!deleting) {
        setPlaceholder(current.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex === current.length) deleting = true;
      } else {
        setPlaceholder(current.slice(0, charIndex - 1));
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          index = (index + 1) % safePlaceholders.length;
        }
      }
    }, 120);

    return () => clearInterval(interval);
  }, [safePlaceholders]);

  return (
    <Input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      bg="card"
      borderRadius="xl"
      px={4}
      py={3}
      _focus={{ boxShadow: "md" }}
    />
  );
}
