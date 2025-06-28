import { useColorMode } from '@vueuse/core'

export const useTheme = () => {
  const mode = useColorMode({
    modes: {
      // custom colors
      cafe: 'cafe',
    },
  })

  return {
    mode
  }
} 