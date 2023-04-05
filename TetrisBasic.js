let canvas;
let ctx;
let gBArrayHeight = 20;
let gBArrayWidth = 12;
let startX = 4;
let startY = 0;
let score = 0;
let points = 1000;
let level = 1;
let tetrisLogo;
let winOrLose = "Playing";
let nextShape = [...Array(310)].map(e => Array(210).fill(0))
let curTet =[[1,0], [0,1], [1,1], [2,1]];
let nextTet = [[1,0], [0,1], [1,1], [2,1]];
let interval = 1000;
let tets = []; // array that will hold all blocks
let tetColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red']; // array that holds the possible colors of blocks
let curTetColor; // holds current block color
let nextTetColor; // holds next block color
let audio = new Audio("music.mp3");
let paused = false;
let musicOn = false;

// contains all possible x and y coordinates usable on canvas
let coordinateArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

// creates gameboard array so we know where other squares are
let gameBoardArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

// holds colors when a shape stops and is added
let stoppedShapeArray = [...Array(gBArrayHeight)].map(e => Array(gBArrayWidth).fill(0));

// tracks the direction the block is moving
let direction;
let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3
};


class Coordinates{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}
// sets up the canvas when page loads
document.addEventListener('DOMContentLoaded', SetupCanvas);

// creates the array with square coordinates
function CreateCoordArray(){
    let i = 0, j = 0;
    for(let y = 9; y <= 446; y+= 23){
        for(let x = 11; x <= 264; x += 23){
            coordinateArray[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}



function SetupCanvas(){
    canvas = document.getElementById('my-canvas');
    ctx = canvas.getContext('2d');
    canvas.width = 936;
    canvas.height = 956;

    ctx.scale(2,2); // doubles the size of elements to fit screen

    // draws canvas background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // draws border around gameboard
    ctx.strokeStyle = 'black';
    ctx.strokeRect(8, 8, 280, 462);

    // places logo
    tetrisLogo = new Image(161, 54);
    tetrisLogo.onload =  DrawTetrisLogo;
    tetrisLogo.src = "images/tetrislogo.png";
    function DrawTetrisLogo(){
        ctx.drawImage(tetrisLogo, 300, 8, 161, 54);
    }

    // draws score 
    ctx.fillStyle = 'black';
    ctx.font = '21px Tahoma';
    ctx.fillText("SCORE", 300, 98);
    ctx.strokeRect(300, 107, 161, 24);
    ctx.fillText(score.toString(), 310, 127);

    // draws level
    ctx.fillText("LEVEL", 300, 157);
    ctx.strokeRect(300, 171, 161, 24);
    ctx.fillText(level.toString(), 310, 190);


    // draws next piece box
    ctx.fillText("NEXT PIECE", 300, 221);
    ctx.strokeRect(300, 232, 161, 95);


    // draws controls
    ctx.fillText("CONTROLS", 300, 354);
    ctx.strokeRect(300,366,161,104);
    ctx.font = '12px Tahoma ';
    ctx.fillText(" A: Move Left", 305, 380);
    ctx.fillText(" D: Move Right", 305, 400);
    ctx.fillText(" S: Move Down", 305, 420);
    ctx.fillText(" E: Rotate", 305, 440);
    ctx.fillText(" T: Toggle Music", 370, 440);
    ctx.fillText(" R: Restart", 305, 460);
    ctx.fillText(" SPACE: Pause", 370, 460);
    ctx.font = '18px Arial';

    // handles keyboard presses
    document.addEventListener('keydown', HandleKeyPress);

    // populates array of blocks
    CreateTets();

    // generates coordinate lookup table
    CreateCoordArray();
    CreateNextCoordArray();

    // creates random block
    CreateFirstTet();
    // spawns block
    DrawFirstTet();
}

// takes the next block and turns it into current block then sets next block to a random index on the tets array
function CreateTet(){
    let randomTet = Math.floor(Math.random() * tets.length);
    curTet = nextTet;
    curTetColor = nextTetColor;
    nextTet = tets[randomTet];
    nextTetColor = tetColors[randomTet];
}

function DrawTet(){
    // cycle through x and y array for the block looking for all the places a square should be drawn
    for(let i = 0; i < curTet.length; i++){

        // spawns the block in the middle of the gameboard
        let x = curTet[i][0] + startX;
        let y = curTet[i][1] + startY;

        // put the shape in the gameboard
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        ctx.fillStyle = curTetColor;
        ctx.fillRect(coorX, coorY, 21, 21);
        DrawNextTet();
    }
}
// creates the first block that is called by SetupCanvas() by selecting a random index from the tets array
function CreateFirstTet(){
    let randomTet = Math.floor(Math.random() * tets.length);
    curTet = tets[randomTet];
    curTetColor = tetColors[randomTet];
    nextTet = tets[1];
    nextTetColor = tetColors[1];
}

function DrawFirstTet(){
    // cycle through x and y array for the block looking for all the places a square should be drawn
    for(let i = 0; i < curTet.length; i++){

        //spawns the block in the middle of the gameboard
        let x = curTet[i][0] + startX;
        let y = curTet[i][1] + startY;

        // put the shape in the gameboard
        gameBoardArray[x][y] = 1;
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;

        ctx.fillStyle = curTetColor;
        ctx.fillRect(coorX, coorY, 21, 21);
        //DrawNextTet();
    }
}


// draws the next block in the next shape box
function DrawNextTet(){
    ctx.fillStyle = 'white';
    ctx.fillRect(301, 233, 158, 92);
    for(let i = 0; i < nextTet.length; i++){
        let x = nextTet[i][0] + 15;
        let y = nextTet[i][1] + 11;
        let coorX = nextShapeArray[x][y].x;
        let coorY = nextShapeArray[x][y].y;
        ctx.fillStyle = nextTetColor;
        ctx.fillRect(coorX, coorY, 21, 21);
    }
}
// not the best solution but allows to place blocks anywhere on the screen not just the gameboard as the previous array
let nextShapeArray = [...Array(478)].map(e => Array(468).fill(0));
function CreateNextCoordArray(){
    let i = 0, j = 0;
    for(let y = 0; y <= 446; y+= 23){
        for(let x = 0; x <= 478; x += 23){
            nextShapeArray[i][j] = new Coordinates(x,y);
            i++;
        }
        j++;
        i = 0;
    }
}

// handles all the key presses for the various controls
function HandleKeyPress(key){
    if(paused != true && winOrLose != "Game Over"){
        if(key.keyCode === 65){
            direction = DIRECTION.LEFT;
            if(!HittingTheWall() && !CheckHorColl()){
                DeleteTet();
                startX--;
                DrawTet();
            }
        } else if(key.keyCode === 68){
            direction = DIRECTION.RIGHT;
            if(!HittingTheWall() && !CheckHorColl()){
            DeleteTet();
            startX++;
            DrawTet();
            }
        } else if(key.keyCode === 83){
            MoveDown();
        } else if(key.keyCode === 69){
                Rotate();
        } 
    }
    if(key.keyCode === 32){
        TogglePause();
    }
    if(key.keyCode === 82){
        window.location.reload();
    }
    if(key.keyCode === 84){
            playMusic();
    }
}

// if there is no vertical collision increments the y position of the block 
function MoveDown(){
    direction = DIRECTION.DOWN;
    if(!CheckVertColl()){
        DeleteTet();
        startY++;
        DrawTet();
    }
    
}

// toggles pause feature by clearing window interval and pauses music if it is playing
function TogglePause(){
    if (!paused)
    {
        paused = true;
        window.clearInterval(theInterval);
        if (musicOn){
            audio.pause();
        }
        
    } else if (paused)     {
        theInterval = window.setInterval(Moving, 1000);
        if (musicOn){
            audio.play();
        }
    }
}

// handles turning music on and off
function playMusic() {
    if (musicOn === false){
    audio.play();
    musicOn = true;
    } else if (musicOn === true){
        audio.pause();
        audio.currentTime = 0;
        musicOn = false;
    }
}

// clears the previously drawn block and replaces the squares with white squares
function DeleteTet(){
    for(let i = 0; i < curTet.length; i++){
        let x = curTet[i][0] + startX;
        let y = curTet[i][1] + startY;
        gameBoardArray[x][y] = 0; // removes block from gameboard array
        let coorX = coordinateArray[x][y].x;
        let coorY = coordinateArray[x][y].y;
        ctx.fillStyle = 'white';
        ctx.fillRect(coorX, coorY, 21, 21);
    }
    
}

// adds all the block types to the tets array
function CreateTets(){
    // T
    tets.push([[1,0], [0,1], [1,1], [2,1]]);
    // I
    tets.push([[0,0], [1,0], [2,0], [3,0]]);
    // J
    tets.push([[0,0], [0,1], [1,1], [2,1]]);
    // []
    tets.push([[0,0], [1,0], [0,1], [1,1]]);
    // L
    tets.push([[2,0], [0,1], [1,1], [2,1]]);
    // S
    tets.push([[1,0], [2,0], [0,1], [1,1]]);
    // Z
    tets.push([[0,0], [1,0], [1,1], [2,1]]);
}



// validates that the block is not hitting the wall of the gameboard
function HittingTheWall(){
    for(let i = 0; i < curTet.length; i++){
        let newX = curTet[i][0] + startX;
        if(newX <= 0 && direction === DIRECTION.LEFT){
            return true;
        } else if(newX >= 11 && direction === DIRECTION.RIGHT){
            return true;
        }  
    }
    return false;
}

// validates that there is no vertical collision FIXME SOMETIMES BLOCKS COLLIDE
function CheckVertColl(){
    let tetCopy = curTet; // creates a copy of the current block to move before moving the real one
    let collision = false;

    // cycle through all block squares
    for(let i = 0; i < tetCopy.length; i++){
        // get each square of the block and adjust the position to check for collision
        let square = tetCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        if(direction === DIRECTION.DOWN){
            y++
        }
            // check if block is going to hit a previously set piece if yes delete block
            if(typeof stoppedShapeArray[x][y+1] === 'string'){
                DeleteTet();
                startY++;
                DrawTet();
                collision = true;
                break;
            }
            if(y >= 20){ // checks if the block is at the floor of the gameboard
                collision = true;
                break;
                
            }
        }

            if(collision){
                if(startY <= 2){
                    winOrLose = "Game Over";
                    ctx.fillStyle = 'white';
                    ctx.fillRect(301, 172, 158, 22);
                    ctx.fillStyle = 'black';
                    ctx.fillText(winOrLose, 330, 190);
                } else {
                    for(let i = 0; i < tetCopy.length; i++){
                        let square = tetCopy[i];
                        let x = square[0] + startX;
                        let y = square[1] + startY;
                        stoppedShapeArray[x][y] = curTetColor;
                    }
                    CheckComplete();
                    CreateTet();
                    direction = DIRECTION.IDLE;
                    startX = 4;
                    startY = 0;
                    DrawTet();
                }
            }
        
    }

// checks for horizontal collision of blocks
function CheckHorColl(){
    let tetCopy = curTet;
    let collision = false;
    for(let i = 0; i < tetCopy.length; i++){
        let square = tetCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;
        
        if(direction === DIRECTION.LEFT){
            x--
        } else if (direction === DIRECTION.RIGHT){
            x++
        }
        var stoppedShapeVal = stoppedShapeArray[x][y];
        if(typeof stoppedShapeVal === 'string'){
            collision = true;
            break;
        }
    }
    return collision;
}

// checks for complete line of squares
function CheckComplete(){
    let rowsToDelete = 0;
    let startOfDelete = 0;

    for(let y = 0; y < gBArrayHeight; y++){
        let completed = true;
        
        for(let x = 0; x < gBArrayWidth; x++){
            let square = stoppedShapeArray[x][y];
            if(square === 0 || (typeof square === 'undefined')){
                completed = false;
                break;
            }
        }

        if(completed){
            if(startOfDelete === 0) startOfDelete = y;
            rowsToDelete++;
            level++;
            ctx.clearRect(301, 172, 158, 22);
            
            ctx.fillStyle = 'black';
            ctx.fillText(level.toString(), 310, 190);
            
            for(let i = 0; i < gBArrayWidth; i++){
                stoppedShapeArray[i][y] = 0;
                gameBoardArray[i][y] = 0;
                let coorX = coordinateArray[i][y].x;
                let coorY = coordinateArray[i][y].y;
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
    if(rowsToDelete > 0){
        score = (points * rowsToDelete * level) + score;
        ctx.fillStyle = 'white';
        ctx.fillRect(310, 109, 140, 19);
        ctx.fillStyle = 'black';
        ctx.fillText(score.toString(), 310, 127);
        MoveAllRowsDown(rowsToDelete, startOfDelete);
    }
}

// moves previous rows down if you have completed a line of squares
function MoveAllRowsDown(rowsToDelete, startOfDelete){
    for(var i = startOfDelete-1; i >= 0; i--){
        for(var x = 0; x < gBArrayWidth; x++){
            var y2 = i + rowsToDelete;
            var square = stoppedShapeArray[x][i];
            var nextSquare = stoppedShapeArray[x][y2];
            if(typeof square === 'string'){
                nextSquare = square;
                gameBoardArray[x][y2] = 1;
                stoppedShapeArray[x][y2] = square;
                let coorX = coordinateArray[x][y2].x
                let coorY = coordinateArray[x][y2].y
                ctx.fillStyle = nextSquare;
                ctx.fillRect(coorX, coorY, 21, 21);

                square = 0;
                gameBoardArray[x][i] = 0;
                stoppedShapeArray[x][i] = 0;
                coorX = coordinateArray[x][i].x
                coorY = coordinateArray[x][i].y
                ctx.fillStyle = 'white';
                ctx.fillRect(coorX, coorY, 21, 21);
            }
        }
    }
}

// rotates block FIXME DOES NOT ROTATE PERFECTLY AND WILL COLLIDE WITH OTHER BLOCKS AND SIDE
function Rotate(){
    let newRotate = new Array();
    let tetCopy = curTet;
    let curTetB;
    
    for(let i = 0; i < tetCopy.length; i++){
        curTetB = [...curTet];
        let x = tetCopy[i][0];
        let y = tetCopy[i][1];
        let newX = (GetLastSquareX() - y);
        let newY = x;
        newRotate.push([newX, newY]);
    }
    DeleteTet();
    
    
    try{
        curTet = newRotate;
        DrawTet();
    }
    catch(e){
        if(e instanceof TypeError){
            curTet = curTetB;
            DeleteTet();
            DrawTet();
        }
    }
}

// gets the x value of a previous square
function GetLastSquareX(){
    let lastX = 0;
    for(let i = 0; i < curTet.length; i++){
        let square = curTet[i];
        if(square[0] > lastX)
            lastX = square[0];
    }
    return lastX;
}

// sets default interval to 1 second
theInterval = window.setInterval(Moving, 1000);

// handles level increase with speed increase. FIXME COULD BE OPTIMIZED
function Moving(){
    if(winOrLose != "Game Over"){
        paused = false;
        MoveDown();
    }
    if (level === 4){
        window.clearInterval(theInterval);
        theInterval = window.setInterval(Moving, 900);
    }
    else if (level === 3){
        window.clearInterval(theInterval);
        theInterval = window.setInterval(Moving, 800);
    }
    else if (level === 4){
        window.clearInterval(theInterval);
        theInterval = window.setInterval(Moving, 700);
    }
    else if (level === 5){
        window.clearInterval(theInterval);
        theInterval = window.setInterval(Moving, 600);
    }
    else if (level === 6){
        window.clearInterval(theInterval);
        theInterval = window.setInterval(Moving, 500);
    }
    else if (level === 7){
        window.clearInterval(theInterval);
        theInterval = window.setInterval(Moving, 400);
    }
    else if (level === 8){
        window.clearInterval(theInterval);
        theInterval = window.setInterval(Moving, 300);
    }
    else if (level === 9){
        window.clearInterval(theInterval);
        theInterval = window.setInterval(Moving, 200);
    }
    else if (level === 10){
        window.clearInterval(theInterval);
        theInterval = window.setInterval(Moving, 100);
    }
    else if (level > 10){
        window.clearInterval(theInterval);
        winOrLose = "Game Over"
        ctx.fillStyle = "white";
        ctx.fillRect(301, 172, 158, 22);
        ctx.fillStyle = "black";
        ctx.fillText("You Win", 345, 190);
    }
}