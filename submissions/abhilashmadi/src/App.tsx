import { ThemeProvider } from '@context/theme-provider';
import storageKeys from "@utils/storage-keys";

function App() {

  return (<ThemeProvider
    defaultTheme="dark"
    storageKey={storageKeys.APP_THEME}>
    Dashboard
  </ThemeProvider>)
}

export default App
