const express =  require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
const db = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'checkin_db'
});

db.connect(err =>{
	if (err) throw err;
	console.log("Connected to MySQL");
});

app.post('/checkin', (req,res) =>{
const {user_id, latitude, longitude, timestap}= req.body;
const sql = 'INSERT INTO checkins (user_id, latitude, longitude, timestap)VALUES(?,?,?,?)';
db.query(sql, [user_id, latitude, longitude, timestap], (err) =>{
	if(err) return res.status(500).send('Database error');
	res.send('Check-in successful');
});
});

app.get('/checkons', (req,res) =>{
db.query('SELECT* FROM checkins ORDER BY id DESC', (err,results) =>{
	if(err) return res.status(500).send('Fetch error');
	res.json(results);
});
});

app.listen(3000, () =>{
	console.log("Server running on port 3000");
});


