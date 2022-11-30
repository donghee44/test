const express =require("express")
const app= express();
const path = require("path")
const http = require("http")
const server = http.createServer(app)
const socketIo = require("socket.io");
const moment = require("moment");

const io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

app.use(express.static(path.join(__dirname,"src")))

const PORT = process.env.PORT || 4000

const chatspace = io.of("/chat")

io.on("connection",(socket)=>{
    console.log(socket.id)
    const id = socket.id
    io.emit("broadcast",(socket.id))

    socket.on("joinroom",(chatroom)=>{
        const item ={chatroom,id}
        socket.join(chatroom)
        console.log("chatroom: ", `${chatroom}에 입장.`)
        io.to(chatroom).emit("broadcast2",item)
    })
    
    socket.on("chatting",(data)=>{
        const {chatroom,userId,message} = data
        console.log(data)
        io.to(chatroom).emit("chatting",{
            chatroom,
            userId,
            message,
            time:moment(new Date()).format("h:mm A")
        })
    })
    
    socket.on("disconnect",()=>{
        //데이터 저장
    })
})

    // socket.on('room1',(data)=>{
    //     console.log(data)
    //     io.to('room1').emit('chatting',data)
    // })


server.listen(PORT,()=>console.log(`server is running ${PORT}`))