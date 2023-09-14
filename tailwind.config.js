const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

// https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/master/tailwind.config.js
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.ts', './src/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      blue: colors.blue,
      green: {
        400: '#7dc5a4',
      },
      white: colors.white,
      leftnav: '#0F1537',
      gray: colors.coolGray,
      indigo: colors.indigo,
      red: colors.red,
      yellow: colors.amber,
      orange: colors.orange,
    },
    extend: {
      spacing: {
        128: '32rem',
        144: '36rem',
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
