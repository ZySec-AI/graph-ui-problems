import { type FC } from 'react'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@ui/button'
import { useTheme } from '@hooks/use-theme'

const ThemeSwitch: FC = () => {
  const { setTheme, theme } = useTheme();
  const isDark = theme === 'dark';

  return (<Button
    onClick={() => setTheme(isDark ? 'light' : 'dark')}
    size='icon'
  >
    {isDark ? <Sun /> : <Moon />}
  </Button>)
}

export default ThemeSwitch;