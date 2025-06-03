/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors:{
                greenC: '#49cc90',
                yellowC: '#edf845',
                blueC: '#1336e2',
                redC: '#f93e3e',
                violetC: '#b886f4'
            },
            fontFamily:{
            }
        },
    },
    plugins: [require('daisyui')],
}