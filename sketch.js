var jsonLoaded = false;
document.addEventListener("DOMContentLoaded",load);


//-------------------------------------------------------------------requests:

function load(){
  var body = document.getElementById("body");
  body.addEventListener("click",GetJson);
  console.log("loaded");
}

function GetJson(){
  if(!jsonLoaded){
   loadJSON('http://104.131.172.143:3000/showAll', useData);
  }
  jsonLoaded = true;
}

function useData(positions){
  console.log(positions);
}

//------------------------------------------------------------------------------------------------p5:
var Timer = new Timer();
var tst = new experiment();
var head;
var horn;
var aPressed;
var bPressed
var playerGuess;

function preload(){
  head = loadImage("sprites/head.png");
  horn = loadImage("sprites/horn.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0); 
  Timer.create();
  tst.init(12,height,width);

}

function draw() {
  tst.loadDisplay();
}

//------------------------------------- Target

function Object() { 

  this.ypos=0;
  this.xpos=0;
  this.lSize=0;

  this.create = function ( _x,  _y, _lsize, type) {  
    this.type = type
    this.posX = _x; 
    this.posY = _y;
    this.lSize = _lsize;
  } 

  this.spriteDisplay = function () {

    var size = this.lSize;
    var x = this.posX;
    var y = this.posY;

    var hornSize = size/1.4


    imageMode(CENTER);
    image(head,x,y,size,size);
  
    
    if(this.type == "extra"){
      image(horn,x,y-size/2,10,hornSize);  
    } else{


    }

  }

  return this;
  
}

//-------------------------------------------------------------------------------------------------------------------------------------display

function display(){

  var displayRatio = 11.4/8.8;
  var leveloaded = false;

  this.init = function (_size,_height,_width){

    var verPadd = 0.1
    var displayHeigth = _height;
    var displayWidth = _height*displayRatio;
    var barWidth = (displayHeigth*displayRatio)*0.25;
    var extraSize = _width - barWidth - displayWidth;

    this.objCount = _size;
    this.scoreBar(displayHeigth,displayWidth,extraSize);
    this.dHeight = displayHeigth-(displayHeigth*verPadd);
    this.dWidth = this.dHeight*displayRatio;
    this.Xpos = extraSize/2 + displayWidth/2;
    this.Ypos = displayHeigth/2;

    this.quadrants = {
    
      inner: {
        xPos: [(this.Xpos-this.dWidth/6),(this.Xpos+this.dWidth/6)],
        yPos: [(this.Ypos-this.dHeight/6),(this.Ypos+this.dHeight/6)]
        },
      middle: 4,
      outer: 4,
    }

  }

  this.loadLevel = function(pasP,_tpresence_, _tfeature_){
    
    console.log("----------------------------------------------")
    console.log(pasP,_tfeature_);
    console.log("----------------------------------------------")

    var xxx = 1200;

    if(pasP && playerGuess == "up"){
        console.log("right!")      
        fill(255);
        ellipse( xxx,100,100,100)
        fill(123,12,44);
        text("RIGTH!",xxx,100);
      }else if(!pasP  && playerGuess == "down"){
        console.log("right!")  
        fill(255);
        ellipse(xxx,100,100,100)
        fill(123,12,44);
        text("RIGTH!",xxx,100);
      }else{
        console.log("WRONG!")
        fill(255);
        ellipse(xxx ,100,100,100)
        fill(123,12,44);
        text("WRONG!",xxx,100);
    }


    var quadrante = 1
    var objSize = (1.4/11.4)*this.dHeight;
    var objxPos;
    var objyPos;
    allPos = []

    fill(255);
    strokeWeight(0)
    rect(this.Xpos,this.Ypos,this.dWidth,this.dHeight);

    //----CREATE TYPES
      if(_tfeature_){
        Ttype = "extra"
        Dtype = "noExtra"
      }else{
        Ttype = "noExtra"
        Dtype = "extra"
      }
      if(!_tpresence_){
        Ttype = Dtype;
      }

    //------------------draw target------------->>>>>>>>> 
      objxPos = random(this.Xpos-(this.dWidth/2)+objSize/2,this.Xpos+this.dWidth/2-objSize/2);
      objyPos = random(this.Ypos-(this.dHeight/2)+objSize/2+(objSize*1.4/2),this.Ypos+this.dHeight/2-objSize/2);
      allPos.push([objxPos,objyPos])
      var obj = new Object();
      obj.create(objxPos,objyPos,objSize,Ttype);
      obj.spriteDisplay();

    //------------------draw distracor---------->>>>>>>>>
      for(var i=0; i<this.objCount;i++){

        var touching = false;

        objxPos = random(this.Xpos-(this.dWidth/2)+objSize/2,this.Xpos+this.dWidth/2-objSize/2);
        objyPos = random(this.Ypos-(this.dHeight/2)+objSize/2+(objSize*1.4/2),this.Ypos+this.dHeight/2-objSize/2);
       // console.log("Circle " + (i+1)+ " created at: x:" + objxPos + " y:" + objyPos )

        for(var l=0; l<allPos.length;l++){
        //console.log("checking colision with:" + l)

           var v1 = createVector(allPos[l][0],allPos[l][1]);
           var v2 = createVector(objxPos,objyPos);

           if(!(v1.dist(v2)>objSize+(objSize*0.4))){
          //   console.log("touching!")
             touching = true;
             break;
           }

       }

        if(touching){
          i = i-1;
        }else{
          var obj = new Object();
          obj.create(objxPos,objyPos,objSize,Dtype);
          obj.spriteDisplay();
          allPos.push([objxPos,objyPos])
        }
      }

    return allPos;

  }

  this.scoreBar = function(_displayHeigth,_displayWidth,_extraSize){

    var barWidth = (_displayHeigth*displayRatio)*0.25;
    rectMode(CENTER);
    rect(_extraSize/2 + _displayWidth+barWidth/2,_displayHeigth/2,barWidth,_displayHeigth);
  }

  return this;

}

function keyPressed() {
  if (keyCode == UP_ARROW) {
    playerGuess = "up"
    aPressed = true;
  } else if (keyCode == DOWN_ARROW) {
    playerGuess = "down"
    bPressed = true;
  }
  return false; // prevent default
}

//---------------------------------------------------------------------------------------------------------------------------------------------EXPERIMENT

function experiment(){

  var bool = false;

  this.init = function(_size,_height,_width){
    this.displayLoaded = false;
    display = new display(); 
    display.init(_size,_height,_width);
    this.counter=0;
    bool = false;
  }

  this.loadDisplay = function(){

    if(aPressed == true || bPressed == true){


      if(this.counter > 10 ){
        this.displayLoaded = false;
        this.counter = 0;
      }else{
         aPressed = false;
         bPressed = false;
      }

    }

    if(!this.displayLoaded){
      
      var randomLevelgenerator = Math.floor(random(0,4))

      if(randomLevelgenerator < 1){
        display.loadLevel(bool,true,true);      
        bool = true;
      }else if(randomLevelgenerator < 2 && randomLevelgenerator > 0){
        display.loadLevel(bool,true,false);
        bool = true;
      }else if(randomLevelgenerator < 3 && randomLevelgenerator > 1){
        display.loadLevel(bool,false,false);
        bool = false;
      }else if(randomLevelgenerator < 4 && randomLevelgenerator > 2){
        display.loadLevel(bool,false,true);   
        bool = false;
      }
      aPressed = false;
      bPressed = false;
      this.displayLoaded = true;
      counter = 0;
    }

    this.counter++

  }
}