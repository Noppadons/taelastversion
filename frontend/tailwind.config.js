// frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // บอกให้ Tailwind สแกนไฟล์ใน src ทั้งหมด
  ],
  theme: {
    extend: {
      colors: {
        // นี่คือการกำหนดสีตามที่คุณต้องการ
        'primary': '#000000', // สีดำ
        'secondary': '#FF0000', // สีแดง
        // คุณสามารถเพิ่มสีอื่นๆ ได้ตามต้องการ
        'base-100': '#1d232a', // สีพื้นหลังที่เข้มเกือบดำ
        'base-content': '#A6ADBB', // สีตัวอักษรทั่วไป
      }
    },
  },
  plugins: [],
}