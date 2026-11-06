// Xem thử website trên máy: http://localhost:8691
import express from 'express';
const app = express();
app.use(express.static(new URL('./docs', import.meta.url).pathname.replace(/^\/(\w:)/, '$1'), { extensions: ['html'] })); // giống GitHub Pages: /idol = idol.html
app.listen(8691, '127.0.0.1', () => console.log('http://localhost:8691'));
