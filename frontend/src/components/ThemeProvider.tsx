import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface ThemeProviderProps {
  children: React.ReactNode;
}

// ThemeProvider component to provide theme to the app based on the theme state from redux
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme } = useSelector((state: RootState) => state.theme);
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)] min-h-screen">
        {children}
      </div>
    </div>
  );
}
