let canvas = document.getElementById("canvas")
let context = canvas.getContext("2d")
let inputo = document.getElementById("range")
let allCircles = []
let mouseLivre = false

canvas.width = 500
canvas.height = 500
var partidas = document.getElementById("range").value

canvas.style.background = "#fff"
canvas.style.border = "black solid 1px"

function getDistance(x1, x2, y1, y2){
    return ((x1-x2)**2+(y1-y2)**2)**(1/2)
}

function desenhaLinhas(e, c){
    let g = 0
    for (let i = 0; i < partidas; i++){
        for (let j = 0; j < partidas; j++){
            if(Math.abs(e[g][0]) > 2 || Math.abs(e[g][1]) > 2){
                let xi = canvas.width/partidas/2 + i*canvas.width/partidas
                let yi = canvas.height/partidas/2 + j*canvas.height/partidas
                let xf = xi + e[g][0]
                let yf = yi + e[g][1]
                let ang = Math.atan((yf-yi)/(xf-xi)) + Math.PI
                if (xf - xi == 0){
                    ang = Math.PI/2 + Math.PI
                }

                context.beginPath()

                context.strokeStyle = "blue"
                context.moveTo(xi, yi)
                context.lineTo(xf, yf)
                context.stroke()

                context.beginPath()
                context.strokeStyle = "green"
                context.moveTo(xf,yf)

                if(e[g][1] >= 0){ //quarto quadrante
                    if (e[g][0] > 0){
                        let x1 = xf + 6*Math.cos(Math.PI/4 + ang)
                        let y1 = yf + 6*Math.sin(Math.PI/4 + ang)
                        context.lineTo(x1, y1)
    
                        context.moveTo(xf, yf)
                        let x2 = xf + 6*Math.cos(-Math.PI/4 + ang)
                        let y2 = yf + 6*Math.sin(-Math.PI/4 + ang)
                        context.lineTo(x2, y2)
                    }else if (e[g][0] < 0){ //terceiro quadrante
                        context.moveTo(xf,yf)
                        let x1 = xf - 6*Math.cos(-Math.PI/4 - ang)
                        let y1 = yf + 6*Math.sin(-Math.PI/4 - ang)
                        context.lineTo(x1, y1)

                        context.moveTo(xf, yf)
                        let x2 = xf - 6*Math.cos(Math.PI/4 - ang)
                        let y2 = yf + 6*Math.sin(Math.PI/4 - ang)
                        context.lineTo(x2, y2)
                    }
                }else{ //segundo quadrante
                    if (e[g][0] <= 0){
                        context.moveTo(xf, yf)
                        let x1 = xf - 6*Math.cos(-Math.PI/4 + ang)
                        let y1 = yf - 6*Math.sin(-Math.PI/4 + ang)
                        context.lineTo(x1, y1)
    
                        context.moveTo(xf, yf)
                        let x2 = xf - 6*Math.cos(+Math.PI/4 + ang)
                        let y2 = yf - 6*Math.sin(+Math.PI/4 + ang)
                        context.lineTo(x2, y2)
                    }else{ //primeiro quadrante
                        context.moveTo(xf, yf)

                        let x1 = xf + 6*Math.cos(Math.PI/4 + ang)
                        let y1 = yf + 6*Math.sin(Math.PI/4 + ang)
                        context.lineTo(x1, y1)
                        
                        context.moveTo(xf, yf)
                        let x2 = xf + 6*Math.cos(-Math.PI/4 + ang)
                        let y2 = yf + 6*Math.sin(-Math.PI/4 + ang)
                        context.lineTo(x2, y2)
                    }
                }
                context.stroke()
            }
            g++
        }
    }
}

class Circle{
    constructor(xpos, ypos, radius, carga){
        this.xpos = xpos
        this.ypos = ypos
        this.radius = radius
        this.carga = carga
        this.e = []
        this.c = []
        this.k = 9*10**1

        let g = 0
        for (let i = canvas.width/partidas/2; i < canvas.width; i += canvas.width/partidas){
            for (let j = canvas.height/partidas/2; j < canvas.height; j += canvas.height/partidas){
                this.dist = getDistance(i, this.xpos, j, this.ypos)
                if (this.dist > this.radius){
                    this.e.push([this.k*this.carga/this.dist**(3/2)*(i-this.xpos), this.k*this.carga/this.dist**(3/2)*(j-this.ypos)])
                }else{
                    this.e.push([0,0])
                }
                this.c.push((this.e[g][0]**2 + this.e[g][1]**2)**(1/2)/5) //só pra ver o tamanho da seta
            }
            g++
        }
    }

    draw(context){
        context.beginPath()

        context.strokeStyle = "black"
        context.font = "12px monospace"
        context.textAlign = "center"
        context.textBaseline = "middle"
        if (this.carga >= 0){
            context.fillText("+", this.xpos, this.ypos)
            this.color = "#ff2213ff"
        }else{
            this.color = "#81018dff"
            context.fillText("-", this.xpos, this.ypos)
        }

        context.strokeStyle = this.color
        context.arc(this.xpos, this.ypos, this.radius, 0, 2*Math.PI, false)
        context.stroke()
        
        context.closePath
        
        // desenhaLinhas(this.e, this.c, this.carga)
    }

    mudaPos(xmouse,ymouse){
        this.xpos = xmouse
        this.ypos = ymouse
    }

    update(){
        this.e = []
        this.c = []
        let g = 0
        for (let i = canvas.width/partidas/2; i < canvas.width; i += canvas.width/partidas){
            for (let j = canvas.height/partidas/2; j < canvas.height; j += canvas.height/partidas){
                this.dist = getDistance(i, this.xpos, j, this.ypos)
                if (this.dist > this.radius){
                    this.e.push([this.k*this.carga/this.dist**(3/2)*(i-this.xpos), this.k*this.carga/this.dist**(3/2)*(j-this.ypos)])
                }else{
                    this.e.push([0,0])
                }
                this.c.push((this.e[g][0]**2 + this.e[g][1]**2)**(1/2)/5) //só pra ver o tamanho da seta
            }
            g++
        }
    }
}

function calculaEr(listaBolas){
    let er = []
    let cr = []

    for(let g = 0; g < partidas**2; g++){
        er.push([0,0])
        for (let bolaDaVez = 0; bolaDaVez < listaBolas.length; bolaDaVez++) {
            er[g][0] += listaBolas[bolaDaVez].e[g][0]
            er[g][1] += listaBolas[bolaDaVez].e[g][1]
            
            cr.push((er[g][0]**2+er[g][1]**2)**(1/2)/2)
        }
    }
    desenhaLinhas(er, cr)
}

function cargaMovel(){
    allCircles = []
    context.clearRect(0, 0, canvas.width, canvas.height)
    let circu = new Circle(0, 0, 2, 1 - 1)
    for (let i = 0; i < 3; i++){
        circu = new Circle(500*Math.random(), 500*Math.random(), 10, (-1)**Math.round(Math.random()))
        allCircles.push(circu)
        allCircles[i].draw(context)
    }
    
    mouseLivre = true
}

function barraLonga(){
    mouseLivre = false
    allCircles = []
    context.clearRect(0, 0, canvas.width, canvas.height)
    criaBarra(250, 1.1, 11)
}

function barrasParalelas(){
    context.clearRect(0, 0, canvas.width, canvas.height)
    mouseLivre = false
    allCircles = []
    criaBarra(150, 1, 100)
    criaBarra(350, -1, 100)
}

function criaBarra(y, carga, deixaMaisRetangular){
    let tamanho = allCircles.length
    let raio = 10
    for (let i = tamanho; i < tamanho + deixaMaisRetangular; i++){
        circu = new Circle(250 - raio*(deixaMaisRetangular-1) + 2*raio*(i-tamanho), y, raio, carga/deixaMaisRetangular)
        allCircles.push(circu)
        allCircles[i].draw(context)
    }
    calculaEr(allCircles)
}

canvas.addEventListener('mousemove', function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    
    context.clearRect(0, 0, canvas.width, canvas.height)
    if(mouseLivre == true){
        allCircles[0].mudaPos(x, y)
    }
    for (let i = 0; i < allCircles.length; i++) {
        allCircles[i].draw(context)
        allCircles[i].update()
    }
    calculaEr(allCircles)
})

canvas.addEventListener('mouseup', function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    
    if (mouseLivre == true){
        context.clearRect(0, 0, canvas.width, canvas.height)
        allCircles.push(new Circle(x, y, 10, (-1)**Math.round(Math.random())))
        for (let i = 0; i < allCircles.length; i++) {
            allCircles[i].update()
            allCircles[i].draw(context)
        }
        calculaEr(allCircles)
    }
})

inputo.addEventListener('input', function partes(input) {
    partidas = inputo.value
    
    context.clearRect(0, 0, canvas.width, canvas.height)
    for (let i = 0; i < allCircles.length; i++) {
        allCircles[i].update()
        allCircles[i].draw(context)
    }
    calculaEr(allCircles)
})
