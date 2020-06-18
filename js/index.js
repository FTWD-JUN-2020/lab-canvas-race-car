
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')
const carImage = new Image() 
carImage.src = '../images/car.png'
carImage.onload = animate //Calling the function animate after car has loaded


const carObj = {
  x:canvas.width/2-35, 
  y:canvas.height-200,
  width:60,
  height:120
}

const obstacles = []
const bullets = []
let frames = 1; 
let id = null;
let score = 0; 





document.addEventListener('keydown', function(event){
  console.log(event)

  switch(event.key) {
    case "ArrowLeft" :
      carObj.x -= 10
      break
    case "ArrowRight" :
      carObj.x += 10
      break
    case "ArrowUp" :
      carObj.y -= 10
      break
    case "ArrowDown" :
      carObj.y += 10
      break
    case " ":
      shootGun()      
  }
})





function drawBullet(){
  bullets.forEach(bullet => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y-=5, bullet.width, bullet.height)
  })
}

function shootGun() {
  console.log('shootGun')
  let bullet = {
    x: carObj.x + carObj.width / 2,
    y: carObj.y,
    color: 'black',
    width: 2,
    height: 10
  }
  bullets.push(bullet)
}



function drawRoad() {
  ctx.fillStyle = 'green'
  ctx.fillRect(0,0, canvas.width, canvas.height) //w 500, h 700
  ctx.fillStyle = 'gray'
  ctx.fillRect(70,0, canvas.width-140, canvas.height)
}



function drawCar(){
  ctx.drawImage(carImage, carObj.x, carObj.y, carObj.width, carObj.height)
}


function drawObs(){
  obstacles.forEach(obstacle => {
    obstacle.y+=10
    ctx.fillStyle = obstacle.color
    
    //ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    
   // if(obstacle.good){
      // ctx.arc(obstacle.x, obstacle.y, obstacle.width/2, 0, 2 * Math.PI);
      // ctx.fill()
   // } else {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    //}

  })
}

function detectCollision(){
  obstacles.forEach((obs,i) => { //Look at each obstacle to see if it hit the car?

    bullets.forEach((bullet,j) => {

      if (bullet.x < obs.x + obs.width &&
        bullet.x + bullet.width > obs.x &&
        bullet.y < obs.y + obs.height &&
        bullet.y + bullet.height > obs.y) {
        console.log('bullet hit')
          obstacles.splice(i,1)
          bullets.splice(j,1)
      }
      
    })

    if (carObj.x < obs.x + obs.width &&
      carObj.x + carObj.width > obs.x &&
      carObj.y < obs.y + obs.height &&
      carObj.y + carObj.height > obs.y) {
       console.log('collision')
       window.cancelAnimationFrame(id)
      //  alert('game over')
    }  

  })

}








function animate(){ //Game Engine .... Loops forever and draws everything 
  id = window.requestAnimationFrame(animate)
  ctx.clearRect(0,0,canvas.width, canvas.height) //Erases everything 
  
  drawRoad()
  drawCar()
  drawObs()
  drawBullet()
  detectCollision()

  if(frames % 100 === 0){
    
    score+=1000
    document.querySelector('#scoreboard').innerText = score
  }
  frames++; 
}



//This creates each obstacle on a timer and adds it to an array
setInterval(()=>{
  let obs = {
    color:  "#"+((1<<24)*Math.random()|0).toString(16),
    x:canvas.width * Math.random(),
    y:-50,
    width: canvas.width / 2 * Math.random(),
    height: 50,
    good: .5 > Math.random()
  }

  obstacles.push(obs)
  console.log('obstacles')

}, 500)