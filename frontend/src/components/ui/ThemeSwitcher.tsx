import { useTheme } from '@heroui/use-theme'
import { Button, Tooltip } from '@heroui/react'
import { PiMoon, PiSun } from 'react-icons/pi'

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <Tooltip 
      content={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'} 
      placement="right"
    >
      <Button
        isIconOnly
        size="md"
        variant="light"
        className="w-10 h-10"
        onPress={toggleTheme}
      >
        {theme === 'light' ? <PiMoon size={20} /> : <PiSun size={20} />}
      </Button>
    </Tooltip>
  )
}