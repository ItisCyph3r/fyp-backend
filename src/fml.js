import express, { Express } from 'express';
const app = express();
const port = process.env.PORT;


app.get('/api/example/exampleRoute1/:attribute', (req, res) => {
    console.log('GET Request with a user-supplied variable')
})
app.patch('/api/example/exampleRoute2/:attribute', (req, res) => {
    console.log('PATCH Request with a user-supplied variable')
})
app.post('/api/example/exampleRoute3', (req, res) => {
    console.log('POST Request')
})
app.delete('/api/example/:attribute', (req, res) => {
    console.log('DELETE Request with a user-supplied variable')
})


