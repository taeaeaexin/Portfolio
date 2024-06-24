const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/guestbook', (req, res) => {
    fs.readFile('guestbook.txt', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading guestbook');
        }
        const entries = data.trim().split('\n').map(line => {
            const [name, date, time, message] = line.split('|');
            return { name, date, time, message };
        });
        res.json(entries);
    });
});

app.post('/guestbook', (req, res) => {
    const { name, message } = req.body;
    const timestamp = new Date();
    const date = `${timestamp.getFullYear() % 100}.${(timestamp.getMonth() + 1).toString().padStart(2, '0')}.${timestamp.getDate().toString().padStart(2, '0')}`;
    const time = `${timestamp.getHours().toString().padStart(2, '0')}:${timestamp.getMinutes().toString().padStart(2, '0')}`;
    const entry = `${name}|${date}|${time}|${message}\n`;

    fs.appendFile('guestbook.txt', entry, (err) => {
        if (err) {
            return res.status(500).send('Error saving entry');
        }
        res.status(201).send('Entry saved');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
