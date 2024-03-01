const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

const gravity=0.7

c.fillRect(0, 0, canvas.width, canvas.height);

const background=new Sprite({
    position:{
        x:0,
        y:0
    },
    imageSrc: './assets/background.png'
})

const Shop = new Sprite({
    position:{
        x:600,
        y:125
    },
    imageSrc:'./assets/shop.png',
    scale:2.75,
    frameMax:6
})

const Player = new Fighter({
    position:{
        x:0,
        y:0
    },
    velocity:{
        x:0,
        y:0
    },
    offset:{
        x:0,
        y:0
    },
    imageSrc:'./assets/samuraiMack/Idle.png',
    frameMax:8,
    scale:2.5,
    offset:{
        x:215,
        y:157
    },
    sprites:{
        idle:{
            imageSrc:'./assets/samuraiMack/Idle.png',
            frameMax:8
        },
        run:{
            imageSrc:'./assets/samuraiMack/Run.png',
            frameMax:8
        },
        jump:{
            imageSrc:'./assets/samuraiMack/Jump.png',
            frameMax:2
        },
        fall:{
            imageSrc:'./assets/samuraiMack/Fall.png',
            frameMax:2
        },
        attack1:{
            imageSrc:'./assets/samuraiMack/Attack1.png',
            frameMax:4
        },
        attack1l:{
            imageSrc:'./assets/samuraiMack/Attack1l.png',
            frameMax:4
        },
        takeHit:{
            imageSrc:'./assets/samuraiMack/Take Hit.png',
            frameMax:4
        },
        death:{
            imageSrc:'./assets/samuraiMack/Death.png',
            frameMax:6
        }
    },
    attackBox:{
        offset:{
            x:30,
            y:50
        },
        width:200,
        height:50
    }
})

const Enemy = new Fighter({
    position:{
        x:900,
        y:0
    },
    velocity:{
        x:0,
        y:0
    },
    offset:{
        x:-50,
        y:0
    },
    color:'blue',
    imageSrc:'./assets/kenji/Idle.png',
    frameMax:4,
    scale:2.5,
    offset:{
        x:215,
        y:167
    },
    sprites:{
        idle:{
            imageSrc:'./assets/kenji/Idle.png',
            frameMax:4
        },
        run:{
            imageSrc:'./assets/kenji/Run.png',
            frameMax:8
        },
        jump:{
            imageSrc:'./assets/kenji/Jump.png',
            frameMax:2
        },
        fall:{
            imageSrc:'./assets/kenji/Fall.png',
            frameMax:2
        },
        attack1:{
            imageSrc:'./assets/kenji/Attack1.png',
            frameMax:4
        },
        attack1l:{
            imageSrc:'./assets/kenji/Attack1l.png',
            frameMax:4
        },
        takeHit:{
            imageSrc:'./assets/Kenji/Take hit.png',
            frameMax:3
        },
        death:{
            imageSrc:'./assets/Kenji/Death.png',
            frameMax:7
        }
    },
    attackBox:{
        offset:{
            x:-180,
            y:50
        },
        width:200,
        height:50
    }
})

console.log(Player)

const keys = {
    a:{
        pressed: false
    },
    d:{
        pressed: false
    },
    w:{
        pressed: false
    },
    l:{
        pressed: false
    },
    j:{
        pressed: false
    },
    i:{
        pressed: false
    },
}



decreaseTimer()

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle='black'
    c.fillRect(0,0, canvas.width, canvas.height)
    background.update()
    Shop.update()
    c.fillStyle='rgba(255,255,255,0.1)'
    c.fillRect(0,0, canvas.width, canvas.height)
    Player.update()
    Enemy.update()   


    Player.velocity.x=0
    Enemy.velocity.x=0

    if(keys.a.pressed && Player.lastKey==='a'){
        Player.velocity.x=-5
        Player.switchSprite('run')
    }else if(keys.d.pressed&& Player.lastKey==='d'){
        Player.velocity.x=5
        Player.switchSprite('run')
    }else{
        Player.switchSprite('idle')
    }

    if(Player.velocity.y<0){
        Player.switchSprite('jump')
    }else if(Player.velocity.y>0){
        Player.switchSprite('fall')
    }

    if(keys.w.pressed && Player.legalJump){
        Player.velocity.y=-25
    }

    if(keys.j.pressed && Enemy.lastKey==='j'){
        Enemy.velocity.x=-5
        Enemy.switchSprite('run')
    }else if(keys.l.pressed&& Enemy.lastKey==='l'){
        Enemy.velocity.x=5
        Enemy.switchSprite('run')
    }else{
        Enemy.switchSprite('idle')
    }
    
    if(keys.i.pressed && Enemy.legalJump){
        Enemy.velocity.y=-25
        Enemy.switchSprite('jump')
    }else if(Enemy.velocity.y>0){
        Enemy.switchSprite('fall')
    }
    
    // rectangularCollision({rectangle1:Player, rectangle2:Enemy})
    if(rectangularCollision({
        rectangle1:Player,
        rectangle2:Enemy
    }) && Player.isAttacking && Player.framesCurrent ===2){
            Enemy.takeHit()
            Player.isAttacking=false
            document.querySelector('#enemyHealth').style.width=Enemy.health+'%'
            gsap.to('#enemyHealth',{
                width:Enemy.health + '%'
            })
            // console.log("Attacked (Enemy)")
    }

    if(Player.isAttacking && Player.framesCurrent===2){
        Player.isAttacking=false
    }

    if(rectangularCollision({
        rectangle1:Enemy,
        rectangle2:Player
    }) && Enemy.isAttacking && Enemy.framesCurrent===2){
        Player.takeHit()
            Enemy.isAttacking=false
            document.querySelector('#playerHealth').style.width=Player.health+'%'
            // console.log("Attacked (Player)")
            gsap.to('#playerHealth',{
                width:Player.health + '%'
            })
    }

    if(Enemy.isAttacking && Enemy.framesCurrent===2){
        Enemy.isAttacking=false
    }

    if(Enemy.health<=0||Player.health<=0){
        Enemy.check()
        Player.check()
        results({Player:Player,Enemy:Enemy, timesId})
    }
}

animate()

window.addEventListener('keydown',(event)=>{
    if(!Player.dead){
        switch(event.key){
            case 'd':
                keys.d.pressed=true
                Player.lastKey='d'
                break;
            case 'a':
                keys.a.pressed=true
                Player.lastKey='a'
                break;
            case 'w':
                keys.w.pressed=true
                // Player.velocity.y=-20
                break;
            case 'e':
                Player.attackBox.offset.x=30
                Player.attack()
                break;
            case 'q':
                Player.attackBox.offset.x=-130
                Player.attackBack()
                break;
            }
    }
    if(!Enemy.dead){
            switch(event.key){
            case 'l':
                keys.l.pressed=true
                Enemy.lastKey='l'
                break;
            case 'j':
                keys.j.pressed=true
                Enemy.lastKey='j'
                break;
            case 'i':
                keys.i.pressed=true
                // Enemy.velocity.y=-20
                break;
            case 'u':
                Enemy.attackBox.offset.x=-180
                Enemy.attack()
                break;
            case 'o':
                Enemy.attackBox.offset.x=20
                Enemy.attackBack()
                break;
        }
    }
    // console.log(event.key)
})

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'd':
            keys.d.pressed=false
            break;
        case 'a':
            keys.a.pressed=false
            break;
        case 'w':
            keys.w.pressed=false
            break;
    }
    switch(event.key){
        case 'l':
            keys.l.pressed=false
            break;
        case 'j':
            keys.j.pressed=false
            break;
        case 'i':
            keys.i.pressed=false
            break;
    }
    console.log(event.key)
})