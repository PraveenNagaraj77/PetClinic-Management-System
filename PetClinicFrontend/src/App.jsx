import AppRouter from "./router/AppRouter";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <AppRouter />
    </>
  );
}

export default App;
