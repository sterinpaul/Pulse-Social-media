import withMT from "@material-tailwind/react/utils/withMT";
 
export default withMT({
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textShadow: {
        sm: '0 1px 2px var(--tw-shadow-color)',
        DEFAULT: '0 2px 4px var(--tw-shadow-color)',
        lg: '0 8px 16px var(--tw-shadow-color)'
      },
      screens: {
        "3xl": "1600px"
      },
      keyframes: {
        mybounce: {
          '0%, 100%': { transform: 'translateY(-150%)'},
          '50%': { transform: 'translateY(150%)'}
        }
      },
      animation:{
        mybounce: 'mybounce 1s ease-in-out infinite'
      }
    }
  },
  plugins: []
})
