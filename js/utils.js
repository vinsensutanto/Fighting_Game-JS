function rectangularCollision({rectangle1,rectangle2}){
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x +rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function results({Player,Enemy, timesId}){
    clearTimeout(timesId)
    document.querySelector('#displayText').style.display = 'flex'
    if(Player.health === Enemy.health){
        document.querySelector('#displayText').innerHTML ='TIE'
    }else if(Player.health > Enemy.health){
        document.querySelector('#displayText').innerHTML ='PLAYER 1 WINS'
    }else if(Player.health < Enemy.health){
        document.querySelector('#displayText').innerHTML ='PLAYER 2 WINS'
    }
}

let times=30
let timesId

function decreaseTimer(){
    if(times>0){
        timesId = setTimeout(decreaseTimer,1000)
        times--
        document.querySelector('#timer').innerHTML = times
    }
    if(times===0){
        results({Player:Player,Enemy:Enemy, timesId})
    }
}