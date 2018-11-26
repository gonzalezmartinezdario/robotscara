var canvas,redes=[],ctx,simbolos=[],primerLinea,tamañoElementos,btnRed,xNumero,mouseX,mouseY,redSeleccionada,pos,elementoSeleccionado,lugarSeleccionado;

window.addEventListener("load",windowLoaded);

function windowLoaded(){
    init();
}

function init(){
    //Setting up the variables
    canvas=document.getElementById("micanvas");
    ctx=canvas.getContext("2d");    
    btnRed=document.getElementById("Red");
    btnNormallyOpen=document.getElementById("no");
    btnNormallyClosed=document.getElementById("nc");
    btnCoil=document.getElementById("coil");
    btnSubNetwork=document.getElementById("subNet");
    xNumero=10;    
    primerLinea=40;
    tamañoElementos=70;
    mouseX=0;
    mouseY=0;
    redSeleccionada=-1;
    pos=0;
    elementoSeleccionado=false;
    
    //Adding event listeners    
    btnNormallyOpen.addEventListener("click",function(){             
        redSeleccionada=obtenerRedSeleccionada();                   
        nuevoElemento(redSeleccionada,"no");
        adjustCanvasHeight();
        drawFrame();
    },false);
    
    btnNormallyClosed.addEventListener("click",function(){        
        redSeleccionada=obtenerRedSeleccionada();                
        nuevoElemento(redSeleccionada,"nc");
        adjustCanvasHeight();
        drawFrame();
    },false);
    btnRed.addEventListener("click",function(){     
        var redSeleccionada= obtenerRedSeleccionada();
        nuevaRed(redSeleccionada);
        drawFrame();
    },false);
    btnCoil.addEventListener("click",function(){
        redSeleccionada=obtenerRedSeleccionada();
        var elementoAnterior;
            if(elementoSeleccionado){
                    elementoAnterior= obtenerElementoSeleccionado(redSeleccionada);
               }
               else{
                    
                   elementoAnterior=redes[redSeleccionada].elementos.length;
                   elementoAnterior= (elementoAnterior==0)? elementoAnterior+1:elementoAnterior;
               }
        nuevoElemento(redSeleccionada,"coil",elementoAnterior);
        adjustCanvasHeight();
        drawFrame();
    },false);
    btnSubNetwork.addEventListener("click",function(){
        redSeleccionada=obtenerRedSeleccionada();
        nuevoElemento(redSeleccionada,"subNet");
        adjustCanvasHeight();
        drawFrame();
    },false);
    
    
    //Creating end network
    redes.push({
        tipo:"endNetwork",
        y: 0,
        salida: true,
        seleccionada: true,
        elementos:[]
    });
    adjustY();
    
    simbolos.push(new Image);
    simbolos[0].src="no.png";
    simbolos[0].addEventListener("load",function(){
    simbolos.push(new Image);
    simbolos[1].src="nc.png";
    simbolos[1].addEventListener("load",function(){
        simbolos.push(new Image);
        simbolos[2].src="coil.png";
        simbolos[2].addEventListener("load",function(){
            simbolos.push(new Image);
            simbolos[3].src="end.png";
            simbolos[3].addEventListener("load",function(){
                drawFrame();
            },false);
        },false);
    },false);
    },false);
    
   /* simbolos.push(new Image);
    simbolos[0].addEventListener("load",function(){
        drawFrame();    
    },false);
    simbolos[0].src="end.png";*/
}

function drawFrame(){
    adjustCanvasHeight();
    /*//numero de linea
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.fillStyle="black";
    ctx.font="12px sans-serif";
    ctx.lineCap="square";    
    ctx.fillText(0,10,primerLinea+5);
    ctx.restore();*/
    //Lineas vcc y gnd
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.fillStyle="black";
    ctx.font="12px sans-serif";
    ctx.lineCap="square";    
    ctx.moveTo(30,10);
    ctx.lineTo(30,canvas.height-10);
    ctx.stroke();    
    ctx.closePath();
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.fillStyle="black";
    ctx.font="12px sans-serif";
    ctx.lineCap="square";
    ctx.moveTo(canvas.width-30,10);
    ctx.lineTo(canvas.width-30,canvas.height-10);
    ctx.stroke();    
    ctx.closePath();    
    ctx.restore();
    
    drawNetworks();
    
    /*//Redes
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle="black";
    ctx.fillStyle="black";
    ctx.font="12px sans-serif";
    ctx.lineCap="square";    
    ctx.moveTo(30,primerLinea);
    ctx.lineTo(canvas.width-30,primerLinea);
    ctx.stroke();    
    ctx.closePath();
    ctx.restore();    */
}

function nuevaRed(redSeleccionada){
    redes.splice(redSeleccionada,0,{
        tipo: "network",
        y:0,
        salida:false,
        seleccionada: false,
        elementos: []        
    });
    adjustY();    
    adjustCanvasHeight();
    /*
    redes.unshift({
        tipo: "network",
        y:0,
        salida:false,
        seleccionada: false,
        elementos: []        
    });    */    
    //drawNetworks();
    //console.log("nueva red creada, numero de elementos en el arreglo: " + redes.length);
    
}

function adjustY(){
    for(var i=0;i<redes.length;i++){
        if(i==0){
            redes[i].y=primerLinea;
        }
        else{
            redes[i].y=redes[i-1].y + 50;
        }
    }
}

function drawNetworks(){    
   // console.clear();    
    for(var i=0; i<redes.length;i++)
    {
        
        //Numero de la linea
        ctx.save();        
        ctx.strokeStyle="black";
        ctx.fillStyle="black";
        ctx.font="12px sans-serif";
        ctx.lineCap="square";          
        //Numero de la Linea
        if(redes[i].seleccionada){
            ctx.save();
            ctx.fillStyle="red";
            ctx.fillRect(xNumero-2,redes[i].y-20,18,45);
            ctx.restore();            
        }
        ctx.fillText(i,xNumero,redes[i].y + 5);     
        ctx.restore();
        
        //Linea
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle="black";
        ctx.fillStyle="black";
        ctx.font="12px sans-serif";
        ctx.lineCap="square";          
        //Linea
        ctx.moveTo(30,redes[i].y);
        ctx.lineTo(canvas.width-30,redes[i].y);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
        //console.log("Tipo: " + redes[i].tipo + " y: " + redes[i].y);       
        
        //Dibujar elementos de la red
        for(var j=0; j<redes[i].elementos.length;j++){            
            //activo o inactivo
        if(redes[i].elementos[j].valor==0){
           ctx.fillStyle="white";
           }
            else{
                ctx.fillStyle="green";
            }
           
            switch(redes[i].elementos[j].tipo){
                case "subNet":
                    
                    ctx.save();            
                    ctx.strokeStyle="black";            
                    ctx.font="12px sans-serif";
                    ctx.lineCap="square"; 
                    ctx.beginPath();
                    ctx.moveTo(redes[i].elementos[j].x,redes[i].y);
                    ctx.lineTo(redes[i].elementos[j].x,redes[i].y+30);
                    ctx.stroke();
                    ctx.closePath();
                
                    ctx.strokeStyle="black";            
                    ctx.font="12px sans-serif";
                    ctx.lineCap="square"                
                    ctx.beginPath();
                    ctx.moveTo(redes[i].elementos[j].x,redes[i].y+30);
                    ctx.lineTo(redes[i].elementos[j].x + tamañoElementos,redes[i].y+30);
                    ctx.stroke();
                    ctx.closePath();
                    
                    //ctx.drawImage(simbolos[redes[i].elementos[j].icono],redes[i].elementos[j].x,redes[i].y-(tamañoElementos/2),tamañoElementos,tamañoElementos);
                    ctx.restore();   
                    
                    if(redes[i].elementos[j].seleccionado && elementoSeleccionado)
                    {
                        ctx.save();                          
                        ctx.strokeRect(redes[i].elementos[j].x-6,redes[i].y+25,tamañoElementos+12,10);
                        ctx.restore();                       
                    }
                    else
                    {
                        if(redes[i].elementos[j].seleccionado && lugarSeleccionado)
                        {
                            ctx.save();                              
                            ctx.strokeRect(redes[i].elementos[j].x+(2),redes[i].y-5,tamañoElementos-4,10);
                            ctx.restore();                       
                        }
                    }
                    
                    
                    break;
                    
                case "subNetEnd":
                    console.log("subNetEnd encontrado");
                    ctx.save();            
                    ctx.strokeStyle="black";            
                    ctx.font="12px sans-serif";
                    ctx.lineCap="square"; 
                    ctx.beginPath();
                    ctx.moveTo(redes[i].elementos[j].x,redes[i].y);
                    ctx.lineTo(redes[i].elementos[j].x,redes[i].y+30);
                    ctx.stroke();
                    ctx.closePath();                                                        
                    //ctx.drawImage(simbolos[redes[i].elementos[j].icono],redes[i].elementos[j].x,redes[i].y-(tamañoElementos/2),tamañoElementos,tamañoElementos);
                    ctx.restore(); 
                    
                    if(redes[i].elementos[j].seleccionado && elementoSeleccionado)
                    {
                        ctx.save();                           
                        ctx.strokeRect(redes[i].elementos[j].x-5,redes[i].y-1,10,32);
                        ctx.restore();                       
                    }
                                
                    
                    break;
                    
                default:
                                        
                    ctx.save();            
                    ctx.strokeStyle="black";            
                    ctx.font="12px sans-serif";
                    ctx.lineCap="square";     
                    ctx.fillRect(redes[i].elementos[j].x +1,redes[i].y-(tamañoElementos/2 -20),tamañoElementos,tamañoElementos-40);
                    ctx.drawImage(simbolos[redes[i].elementos[j].icono],redes[i].elementos[j].x,redes[i].y-(tamañoElementos/2),tamañoElementos,tamañoElementos);
                    ctx.restore();                
                    
                     if(redes[i].elementos[j].seleccionado && elementoSeleccionado)
                    {
                        ctx.save();                          
                        ctx.strokeRect(redes[i].elementos[j].x +1,redes[i].y-(tamañoElementos/2 -20),tamañoElementos-1,tamañoElementos-40);
                        ctx.restore();                       
                    }
                    else
                    {
                        if(redes[i].elementos[j].seleccionado && lugarSeleccionado)
                        {
                            ctx.save();  
                            ctx.fillStyle="red";
                            ctx.fillRect(redes[i].elementos[j].x +(tamañoElementos-6),redes[i].y-(3),6,7);
                            ctx.restore();                       
                        }
                    }
                    
                    
                    break;
            }
            
                    
               }
            
        
        //Simbolo de finalizacion
            if(redes[i].tipo=="endNetwork"){
                ctx.save();
                ctx.fillStyle="white";                
                ctx.fillRect(canvas.width-(tamañoElementos+30),redes[i].y-15,tamañoElementos-1,30);
                ctx.restore();
                ctx.drawImage(simbolos[simbolos.length-1],canvas.width-(tamañoElementos+30),redes[i].y-(tamañoElementos/2),tamañoElementos,tamañoElementos);
                //console.log("End encontrada");
            }
        /*//seleccionar lugar
            if(pos){
                ctx.save();
                ctx.fillStyle="red";
                ctx.fillRect(mouseX-5,mouseY-5,10,10);
                ctx.restore();
            }*/            
    }
}

function adjustCanvasHeight(){
    canvas.height=redes[redes.length -1 ].y + 40;
}

function nuevoElemento(red,elemento){
    //console.clear();
    //console.log("nueva red " + elemento);
    // Si la red es la red que delimita el final del programa
    if(redes[red].tipo=="endNetwork"){
        return;
    }
    //Si la red ya tiene un elemento de salida y el elemento que se desea agregar es un elemento de salida
    if(redes[red].salida && elemento=="coil"){
        return;
    }
    var icon;
    switch(elemento)
        {
            case "no":                
                icon=0;
                break;
            case "nc": 
                icon=1;
                break;
            case "coil":
                icon=2;
                break;
            case "subNet":
                icon=4;
                break;
        }
    //Si se desea agregar un elemento de salida
    if(icon==2){
        redes[red].salida=true;
    }
    
    //Si la red esta vacia
    if(redes[red].elementos.length==0)
    {
        //Si el elemento que se desea agregar no es una sub red
        if(icon!=4){                       
        redes[red].elementos.push({
        etiqueta:"no",
        tipo: elemento,
        x: 30,
        icono:icon,
        seleccionado: false,
        valor:0               
    });  
        
    }
    else //Si el elemento que se desea agregar es una sub red
        {
            
            redes[red].elementos.push({
                etiqueta:"subNetwork",
                tipo:elemento,
                x: 30 ,
                icono: icon,
                elementos: [],
                seleccionado: false,
                valor:0
            });
            
            redes[red].elementos.push({
                etiqueta:"subNetworkEnd",
                tipo:"subNetEnd",
                seleccionado: false,
                x: 30+ tamañoElementos,                
            });
        }
    
    }
    else{ //Si la red no esta vacia
        // si la red no es una sub red
        if(icon!=4){               
            //Si la red es la clausura de la subred
            if(redes[red].elementos[redes[red].elementos.length-1].tipo=="subNetEnd")
            {                
                redes[red].elementos.push({
                etiqueta:"no",
                tipo: elemento,
                x: redes[red].elementos[redes[red].elementos.length -1].x,
                seleccionado: false,
                icono:icon,
                valor:0               
                }); 
            }
            else //Si no es la clausura de una sub red
            {                
                redes[red].elementos.push({
                etiqueta:"no",
                tipo: elemento,
                x: redes[red].elementos[redes[red].elementos.length -1].x+tamañoElementos,
                icono:icon,
                seleccionado: false,
                valor:0               
                }); 
                
            }
         
        
    }
    else //Si la red no es la clausura de una sub red
        {
            //Si la red es la clausura de una sub red
            if(redes[red].elementos[redes[red].elementos.length-1].tipo=="subNetEnd"){
                    redes[red].elementos.push({
                    etiqueta:"subNetwork",
                    tipo:elemento,
                    x: redes[red].elementos[redes[red].elementos.length -1].x,
                    icono: icon,
                    elementos: [],
                    seleccionado: false,
                    valor:0
                });

                redes[red].elementos.push({
                    etiqueta:"subNetworkEnd",
                    tipo:"subNetEnd",
                    seleccionado: false,
                    x: redes[red].elementos[redes[red].elementos.length -1].x+tamañoElementos,                
                });                
                
            }
            else{ // Si la red no es una clausura de una sub red
            redes[red].elementos.push({
                etiqueta:"subNetwork",
                tipo:elemento,
                x: redes[red].elementos[redes[red].elementos.length -1].x+tamañoElementos,
                icono: icon,
                elementos: [],
                seleccionado: false,
                valor:0
            });
            
            redes[red].elementos.push({
                etiqueta:"subNetworkEnd",
                tipo:"subNetEnd",
                x: redes[red].elementos[redes[red].elementos.length -1].x+tamañoElementos,                
                seleccionado: false
            });
            
            }
        }
    
        
    }
     
}

function getMousePosition(event){     
    var rect= canvas.getBoundingClientRect();
    var x = event.clientX-rect.left;
    var y = event.clientY-rect.top;
    var coords = "X coords: " + x + ", Y coords: " + y;
   
    document.getElementById("posicion").innerHTML=coords;
    
}
function getMousePosition1(event){     
    var rect= canvas.getBoundingClientRect();
    var x = event.clientX-rect.left;
    var y = event.clientY-rect.top;
    mouseX=x; mouseY=y;
    var coords = "X coords: " + mouseX + ", Y coords: " + mouseY;
    document.getElementById("clicked").innerHTML= coords;    
    lineaSeleccionada();
}

function lineaSeleccionada(){
    if(inRange(mouseX,xNumero,30)){
        //Selecciona una red
            for(var i=0;i<redes.length;i++){
                if(inRange(mouseY,redes[i].y - 20,redes[i].y + 20)){
                    pos=0;
                    deseleccionarRedes();
                    deseleccionarElementos();
                    redes[i].seleccionada=true;
                    elementoSeleccionado=false;
                    //alert("una red ha sido seleccionada");
                    drawFrame();
                   }
            }
        return;
       }
    
    if(mouseX>=30)
    {
        
        for(var i=0;i<redes.length;i++){
            
            if(redes[i].elementos.length>0)
            {   
                for(var j=0;j<redes[i].elementos.length;j++){
                    
                    if(redes[i].elementos[j].tipo!="subNet" && redes[i].elementos[j].tipo!="subNetEnd")
                    {

                            if(inRange(mouseX,redes[i].elementos[j].x,redes[i].elementos[j].x+(tamañoElementos-6)) && inRange(mouseY,redes[i].y-(tamañoElementos/2), redes[i].y+(tamañoElementos/2))){
                                    deseleccionarElementos();
                                    deseleccionarRedes();
                                    redes[i].seleccionada=true;
                                    redes[i].elementos[j].seleccionado=true;
                                    elementoSeleccionado=true;
                                    drawFrame();
                               }
                            else{

                                if(inRange(mouseX,redes[i].elementos[j].x+(tamañoElementos-6),redes[i].elementos[j].x+(tamañoElementos)) && inRange(mouseY,redes[i].y-(5), redes[i].y+(5))){
                                    deseleccionarElementos();
                                    deseleccionarRedes();
                                    redes[i].seleccionada=true;
                                    redes[i].elementos[j].seleccionado=true;
                                    elementoSeleccionado=false;
                                    lugarSeleccionado=true;                            
                                    drawFrame();
                               }

                            }
                    }
                    
                    if(redes[i].elementos[j].tipo=="subNetEnd")
                    {
                        if(inRange(mouseX,redes[i].elementos[j].x-6,redes[i].elementos[j].x+6) && inRange(mouseY,redes[i].y-(5), redes[i].y+30))
                        {
                            deseleccionarElementos();
                            deseleccionarRedes();
                            redes[i].seleccionada=true;
                            redes[i].elementos[j].seleccionado=true;
                            elementoSeleccionado=true;
                            lugarSeleccionado=false;                            
                            drawFrame();
                        }
                        
                    }
                    
                     if(redes[i].elementos[j].tipo=="subNet")
                    {
                        if(inRange(mouseX,redes[i].elementos[j].x-6,redes[i].elementos[j].x+(tamañoElementos)) && inRange(mouseY,redes[i].y+(25), redes[i].y+35))
                        {
                            deseleccionarElementos();
                            deseleccionarRedes();
                            redes[i].seleccionada=true;
                            redes[i].elementos[j].seleccionado=true;
                            elementoSeleccionado=true;
                            lugarSeleccionado=false;                            
                            drawFrame();
                        }                        
                        
                    }   
                    
                    if(redes[i].elementos[j].tipo=="subNet")
                    {
                        if(inRange(mouseX,redes[i].elementos[j].x+2,redes[i].elementos[j].x+(tamañoElementos)) && inRange(mouseY,redes[i].y-5, redes[i].y+5))
                        {
                            deseleccionarElementos();
                            deseleccionarRedes();
                            redes[i].seleccionada=true;
                            redes[i].elementos[j].seleccionado=true;
                            elementoSeleccionado=false;
                            lugarSeleccionado=true;                            
                            drawFrame();
                        }                        
                        
                    } 
                    
                }
            }
        }
        
        /*for(var i=0;i<redes.length;i++)
        {
            if(inRange(mouseY,redes[i].y-10,redes[i].y+10 )){
                mouseY=redes[i].y;
                deseleccionarRedes();
                redes[i].seleccionada=true;
                pos=1;                                
                drawFrame();
                return;
            }
        }*/
        
    }   
}

function inRange(number,downLimmit,upperLimit){
    
    if(number>=downLimmit && number<=upperLimit){
       return true;
       }
       else{
       return false;
       }
    
}

function deseleccionarRedes(){
    for(var i=0;i<redes.length;i++){
        redes[i].seleccionada=false;
    }
}

function deseleccionarElementos(){
    for(var i=0; i<redes.length;i++){
        
        for(var j=0;j<redes[i].elementos.length;j++){
            redes[i].elementos[j].seleccionado=false;            
        }
        
    }
}

function obtenerRedSeleccionada(){
    for(var i=0;i<redes.length;i++)
        {
            if(redes[i].seleccionada){                
                return i;                
            }
        }
}

function obtenerElementoSeleccionado(redSeleccionada){
    
    for(var i=0; i<redes[redSeleccionada].elementos.length;i++){
        if(redes[redSeleccionada].elementos[i].seleccionado)
            {
                return i;
            }
    }
    
}

