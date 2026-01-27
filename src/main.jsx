import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App";
import { useTelegramStore } from "./entities/telegram/model/useTelegramStore";

import styles from "./index.module.css";

// Дополнительная защита от крашей на уровне React
if (typeof window !== 'undefined') {
    const originalConsoleError = console.error;
    console.error = (...args) => {
        // Игнорируем некритичные React ошибки которые могут крашить Xiaomi WebView
        const errorString = args.join(' ');
        if (errorString.includes('ResizeObserver') ||
            errorString.includes('Non-passive event listener')) {
            return;
        }
        originalConsoleError.apply(console, args);
    };
}

useTelegramStore.getState().init();

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <div className={styles.container}>
        <div className={styles.app}>
            <App />
        </div>
    </div>
);
