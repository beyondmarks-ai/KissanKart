import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative h-9 w-9">
        <div className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-9 w-9 overflow-hidden hover:bg-primary/5 transition-colors duration-300"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sun icon */}
      <Sun 
        className={`h-5 w-5 absolute transition-all duration-500 ease-out
          ${isDark 
            ? 'rotate-90 scale-0 opacity-0' 
            : 'rotate-0 scale-100 opacity-100'
          }
        `}
      />
      {/* Moon icon */}
      <Moon 
        className={`h-5 w-5 absolute transition-all duration-500 ease-out
          ${isDark 
            ? 'rotate-0 scale-100 opacity-100' 
            : '-rotate-90 scale-0 opacity-0'
          }
        `}
      />
      
      {/* Background glow effect */}
      <span 
        className={`absolute inset-0 rounded-lg transition-all duration-500
          ${isDark 
            ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10' 
            : 'bg-gradient-to-br from-amber-400/10 to-orange-400/10'
          }
        `}
      />
    </Button>
  );
}
