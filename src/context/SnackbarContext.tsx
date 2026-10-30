import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Portal, Snackbar } from "react-native-paper";

// Optional action in the snackbar, e.g. "Undo".
export interface SnackbarAction {
  label: string;
  onPress: () => void;
}

interface SnackbarContextValue {
  showMessage: (message: string, action?: SnackbarAction) => void;
}

interface SnackbarState {
  message: string;
  action?: SnackbarAction;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

// Provides one snackbar for the whole app,
// so feedback looks the same everywhere and no screen needs its own state for it.
export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  const showMessage = useCallback((message: string, action?: SnackbarAction) => {
    setSnackbar({ message, action });
  }, []);

  return (
    <SnackbarContext.Provider value={{ showMessage }}>
      {children}
      <Portal>
        <Snackbar visible={snackbar !== null} onDismiss={() => setSnackbar(null)} action={snackbar?.action}>
          {snackbar?.message}
        </Snackbar>
      </Portal>
    </SnackbarContext.Provider>
  );
}

// Access to the snackbar: showMessage(message, action?).
// Throws if used outside of SnackbarProvider.
export function useSnackbar(): SnackbarContextValue {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used inside SnackbarProvider");
  }
  return context;
}
