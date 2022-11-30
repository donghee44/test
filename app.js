const express =require("express")
const app= express();
const path = require("path")
const http = require("http")
const server = http.createServer(app)
const socketIo = require("socket.io");
const moment = require("moment");

const io = socketIo(server)

app.use(express.static(path.join(__dirname,"src")))

const PORT = process.env.PORT || 5000

io.on("connection",(socket)=>{
    console.log(socket.id)
    const id = socket.id
    io.emit("broadcast",(socket.id))

    socket.on("joinroom",(number)=>{
        const item ={number,id}
        socket.join(number)
        console.log("number: ", `${number}에 입장.`)
        io.to(number).emit("broadcast2",item)
    })
    
    socket.on("chatting",(data)=>{
        const {name,msg,number} = data
        console.log(data)
        io.to(number).emit("chatting",{
            name,
            msg,
            time:moment(new Date()).format("h:mm A")
        })
    })

    // socket.on('room1',(data)=>{
    //     console.log(data)
    //     io.to('room1').emit('chatting',data)
    // })
})


server.listen(PORT,()=>console.log(`server is running ${PORT}`))