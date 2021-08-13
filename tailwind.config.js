module.exports = {

  corePlugins: {
    // ...
    outline: false,
  },
  
  mode: "jit",
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    maxHeight: {
      159: "36em",
      160: "40em",
    },
    zIndex: {
      '-1': '-1',
    },


    screens: {
      sm: "640px",
     
      md: "768px",

      lg: "1024px",

      xl: "1280px",
     
    },

    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
    },
  },
  plugins: [require("daisyui")],

  daisyui: {
    base: false,
    themes: ["emerald"],
  },
};
