
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const carImage = new Image() 
carImage.src = '../images/car.png'
carImage.onload = animate //Calling the function animate after car has loaded


class Game {
  constructor({obstacles, bullets, frames, id, score}){
    this.obstacles = obstacles
    this.bullets = bullets
    this.frames = frames 
    this.id = id 
    this.score = score
  }
  drawObs = () => this.obstacles.forEach(obstacle => obstacle.drawThisObs())
  
  drawBullet = () => this.bullets.forEach(bullet => bullet.drawThisBullet())
  
  shootGun = () => { 
    this.bullets.push( new Bullet({x: carObj.x + carObj.width / 2, y: carObj.y, color: 'black', width: 2, height: 10 }) )
  }

  startObs = () => {
    setInterval(()=>{
      let obs = new Obstacle({
        color:  "#"+((1<<24)*Math.random()|0).toString(16),
        x:canvas.width * Math.random(),
        y:-50,
        width: canvas.width / 2 * Math.random(),
        height: 50,
        good: .5 > Math.random()
      })
    
      this.obstacles.push(obs)
    
    }, 500)
  }

  draw = () => {
    game.drawObs()
    game.drawBullet()
    game.detectCollision()
  }

 detectCollision = () => {
  this.obstacles.forEach((obs,i) => { //Look at each obstacle to see if it hit the car?

    this.bullets.forEach((bullet,j) => {

      if (bullet.x < obs.x + obs.width &&
        bullet.x + bullet.width > obs.x &&
        bullet.y < obs.y + obs.height &&
        bullet.y + bullet.height > obs.y) {
          this.obstacles.splice(i,1)
          this.bullets.splice(j,1)
      }
      
    })

    if (carObj.x < obs.x + obs.width &&
      carObj.x + carObj.width > obs.x &&
      carObj.y < obs.y + obs.height &&
      carObj.y + carObj.height > obs.y) {
       window.cancelAnimationFrame(id)
      //  alert('game over')
    }  

  })

}
}

let game = new Game({ 
  obstacles:[],
  bullets: [],
  frames: 1, 
  id: null,
  score: 0
})

game.startObs()



class Object extends Game{
  constructor({x,y,width,height, bullets}){
    super({bullets})
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height; 
  }
}


class Car extends Object {

  constructor({x,y,width,height,bullets}){
    super({x,y,width,height, bullets})
  }

  moveCar = (dir, val) => {
    this[dir] += val
  }

  drawCar = () => {
    ctx.drawImage(carImage, this.x, this.y, this.width, this.height)
  }
  shootGun = () => { 
    this.bullets.push( new Bullet({x: this.x + this.width / 2, y: this.y, color: 'black', width: 2, height: 10 }) )
  }
}

let carObj = new Car({ x:canvas.width/2-35, y:canvas.height-200,  width:60, height:120})
let carObj2 = new Car({ x:canvas.width/2-35, y:canvas.height-100,  width:60, height:120})


class Bullet extends Object {
  constructor({x,y,width,height, color}){
    super({x,y,width,height})
    this.color = color 
  }

  drawThisBullet = () => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y-=5, this.width, this.height)
  }

}

class Obstacle extends Object {
  constructor({x, y, width, height, color, good, bullets}){
    super({x, y, width, height, bullets})
    this.color = color 
    this.good = good
  }

  drawThisObs = () => {
    this.y+=10
    ctx.fillStyle = this.color      
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}










document.addEventListener('keydown', function(event){

  switch(event.key) {
    case "ArrowLeft" :
      carObj.moveCar('x', -10)
      break
    case "ArrowRight" :
      carObj.moveCar('x', 10)
      break
    case "ArrowUp" :
      carObj.moveCar('y', -10)
      break
    case "ArrowDown" :
      carObj.moveCar('y', +10)
      break
    case " ":
      game.shootGun()      
  }
})














function drawRoad() {
  ctx.fillStyle = 'green'
  ctx.fillRect(0,0, canvas.width, canvas.height) //w 500, h 700
  ctx.fillStyle = 'gray'
  ctx.fillRect(70,0, canvas.width-140, canvas.height)
}















function animate(){ //Game Engine .... Loops forever and draws everything 
  id = window.requestAnimationFrame(animate)
  ctx.clearRect(0,0,canvas.width, canvas.height) //Erases everything 
  
  drawRoad()
  carObj.drawCar()
  game.draw()


  if(frames % 100 === 0){
    
    score+=1000
    document.querySelector('#scoreboard').innerText = score
  }
  frames++; 
}



