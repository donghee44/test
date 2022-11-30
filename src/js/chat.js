"use strict"
const socket=io()

const nickname=document.querySelector("#nickname")
const chatList = document.querySelector(".chatting-list")
const chatInput=document.querySelector(".chatting-input")
const sendButton=document.querySelector(".send-button")
const displayContainer = document.querySelector(".display-container")
const roomname = document.querySelector(".roomjoin")
const roomnumber = document.querySelector(".roomnumber")

chatInput.addEventListener("keypress",(event)=>{
    if(event.keyCode===13){
        send()
    }
})
function send(){
    const param = {
        number:roomnumber.value,
        name:nickname.value,
        msg:chatInput.value
        
    }
    chatInput.value=""
    socket.emit("chatting",param)
}
sendButton.addEventListener("click",send)

function room(){
    const number=roomnumber.value
   socket.emit("joinroom",number)
   console.log(number)
}
roomname.addEventListener("click",room)


socket.on("broadcast",(data)=>{
    const item = new LiModel(data+"님이 입장하셨습니다.")
    item.makeLi()
})


socket.on("broadcast2",(data)=>{
    console.log(data)
    const {id,number}= data
    console.log(id,number)
    const item = new LiModel(id+"님이"+number+"방에 입장하셨습니다.")
    item.makeLi()
})

socket.on("chatting",(data)=>{
    const {name,msg,time} = data
    const item = new LiModel(name,msg,time);
    item.makeLi()
    displayContainer.scrollTo(0,displayContainer.scrollHeight)
})

function LiModel(name,msg,time){
    this.name = name
    this.msg = msg
    this.time = time

    this.makeLi = ()=>{
        const li = document.createElement("li")
        li.classList.add(nickname.value===this.name?"sent":"received")
        const dom = `
        <span class="user">${this.name}</span>
        <img class="image" src="https://placeimg.com/50/50/any" alt="any">
    </span>
    <span class="message">${this.msg}</span>
    <span class="time">${this.time}</span>`
        li.innerHTML=dom;
        chatList.appendChild(li)
    }

    socket.on("disconnect",()=>{
        console.log(nickname.value)
    })
    
    // function room(){
    //     const number=roomnumber.value
    //    socket.emit('joinroom',number)
    //    console.log(number)
    // }
    // roomname.addEventListener("click",room)

 
}