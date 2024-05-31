/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                lightsky: '#B7D5DD', // light sky blue
                sky: '#55B2CF', // sky blue
                ocean: '#3E8BAB', // medium blue
                deepsea: '#2D80A6', // deep sea blue
                midnight: '#091B34', // midnight blue
            },
        },
    },
    plugins: [],
}
