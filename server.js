const connection_web3 = new solanaweb3.Connection("https://api.devnet.solana.com");
import * as anchor from "@project-serum/anchor";
import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from "cors";
import mysql from "mysql";
import http from 'http';
import { Server } from 'socket.io';

// import {
//     PublicKey,
//     Keypair,
//     Connection,
//     Transaction,
//     clusterApiUrl,
//     SystemProgram,
//     SYSVAR_RENT_PUBKEY,
//     // TransactionSignature,
//     TransactionInstruction,
//     LAMPORTS_PER_SOL,
//     sendAndConfirmTransaction
// } from "@solana/web3.js";
import solanaweb3 from "@solana/web3.js";
// import bs58 from "bs58";
// import { toast } from "react-toastify";
import dotenv from 'dotenv'


dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 3000
const { BN } = anchor.default;
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // origin: 'https://humble-halibut-4wv5p96jj427pg9-5173.app.github.dev',
        origin: 'http://127.0.0.1:5173',
        methods: ['GET', 'POST'],
    },
});

const CHAT_BOT = 'ChatBot';
let chatRoom = ''; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);

    let __createdtime__ = Date.now(); // Current timestamp
    let chatRoomUsers = []
    socket.on('join_room', (data) => {
        const { username, room } = data; // Data sent from client when join_room event emitted
        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        socket.to(room).emit('chatroom_users', chatRoomUsers);
        socket.emit('chatroom_users', chatRoomUsers);
        socket.join(room); // Join the user to a socket room

        // Send message to all users currently in the room, apart from the user that just joined
        socket.to(room).emit('receive_message', {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT,
            __createdtime__,
        });
        socket.emit('receive_message', {
            message: `Welcome ${username}`,
            username: CHAT_BOT,
            __createdtime__,
        });
    });

    socket.on('send_message', (data) => {
        // const { message, username, room, __createdtime__ } = data;
        const { room } = data;
        io.in(room).emit('receive_message', data); // Send to all users in room, including sender
        // todo: save message to db
        // saveMessage(message, username, room, __createdtime__) // Save message in db
        //   .then((response) => console.log(response))
        //   .catch((err) => console.log(err));
      });
});

const pebble_count = 8;
let total_amount = 0;
var total_each_pebble = [0, 0, 0, 0, 0, 0, 0, 0];
let expected_winner_pebble = 1;
let bettingFlag = false;


let connection = null;

try {
    // create a connection object
    connection = mysql.createConnection({
        host: '127.0.0.1',
        post: 3306,
        user: 'root',
        password: '',
        database: 'mydb'
    });
} catch (error) {
    console.log("failed to connect to db error");
    console.log(error.message);
}

// connect to the database
connection?.connect((err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the MySQL server.');
});

function bettingEnd() {

}

function getProgram(wallet) {

};

function calWinner(deposit_pebble_num, deposit_amount) {

}

function deposit(deposit_amount, deposit_pebble_num, bettor) {

}

app.get('/', (req, res) => {
    console.log('/ visited');
    res.send('Hello world');
});

app.post('/', (req, res) => {
    console.log('/ :post | visited');
    return res.json({ message: 'ping successful!', ...req.body });
});

app.get("/init", (req, res) => {
    console.log("Init Setting!!!");
    res.json({ status: "success", msg: bettingFlag });
});

// Create an endpoint to handle the frontend request
app.get("/deposit", (req, res) => {

});

app.get("/decidewinner", (req, res) => {

});

app.get("/expetwinner", (req, res) => {
    res.json({ status: "success", msg: expected_winner_pebble });
});

app.get("/bettingEnd", async (req, res) => {

});

app.get("/bettingStart", (req, res) => {

});


app.get("/init", (req, res) => {
    console.log("Init Setting!!!");
    res.json({ status: "success", msg: { bettingFlag, last_vetting_result } });
});

app.get("/onViewStat", (req, res) => {
    console.log("Get Detail!!!");
    var pool = mysql.createPool({
        connectionLimit: 100,
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'mydb',
        timezone: 'Z'
    });

    var pebble_number = req.query.query;
    let send_data;
    console.log(pebble_number);

    var getQuery = `SELECT * FROM WinnigRate WHERE pebble_number = ?`;
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            return reject(err);
        }
        connection?.on('error', function (err) {
            console.log('>>> error >>>', err);
        });

        const values = [pebble_number];
        connection?.query(getQuery, values, (err, result) => {
            if (err) {
                console.error('Error inserting data into MySQL:', err);
                throw err;
            }
            console.log('Retrieved data:', result);
            let data = result.map(row => Object.values(row));
            send_data = data[0];
        });
    });

    res.json({ status: "success", send_data });
});


// Start the server
// app.listen(3000, () => {
//     console.log("Server running on port 3000");
// });
server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
