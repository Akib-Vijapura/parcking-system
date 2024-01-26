// 1. Import `extendTheme`
import { extendTheme } from "@chakra-ui/react"

// 2. Call `extendTheme` and pass your custom values
const theme = extendTheme({
  colors: {
    white:"#fefefe",
    babyblue:"#9dd2ec", 
    celestialblue:"#009fe2", 
    jet:"#2a2928", 
    black:"#000000"
  },
})

export default theme