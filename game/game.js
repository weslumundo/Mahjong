// ****************************************
//does this file load?
//alert("Hello World!");

// ***************************************
//variable declaration
const marray = [];
var rowLen=0;//x
var rowNum=0;//y
var height=0;//z
var cnv=document.getElementById("myCanvas");
var ctx = cnv.getContext("2d");
cw =0;//canvas width
cws =0;//canvas width scale;
ch =0;//canvas height
chs =0;//canvas height scale;
xoffset =0;//for tile resizing
yoffset =0;
var blank = new Image(); // Create new img element
var scale=0.6;//canvas scale % of vw
blank.src = "../images/blankTileClean.png";
var imageUrlArray = []; 
var imageArray = [];
var tileHelperX = 0;
var tileHelperY = 0;
var tileHelperZ = 0;
var xoffset = 0;
var yoffset = 0;
var buildStack = [];

// ****************************************
//function delcaration
//check valid coordinates in half units
function halfValid(xcoor, ycoor, zcoor, errOut=false){
    if((xcoor>=rowLen)||(xcoor<0)){
        if(errOut){
            console.log("Invalid xcoor");
        }
        return false;
    }
    if((ycoor>=rowNum)||(ycoor<0)){
        if(errOut){
            console.log("Invalid ycoor");
        }
        return false;
    }
    if((zcoor>=height)||(zcoor<0)){
        if(errOut){
            console.log("Invalid zcoor");
        }
        return false;
    }
    return true;
}

//fetches the value of marray in half units
function getVal(xcoor, ycoor, zcoor){
    return marray[zcoor][ycoor][xcoor];
}

function getValFull(xcoor,ycoor,zcoor){
    return marray[zcoor-1][(ycoor-1)*2][(xcoor-1)*2];
}

//sets value val to marray in half units
function setVal(xcoor,ycoor,zcoor,val,check=false){
    marray[zcoor][ycoor][xcoor]=val;
    if(check){
        if(marray[zcoor][ycoor][xcoor]==val){
            console.log("Set Val Success");
        }
        else{
            console.log("Set Val Failure");
        }
    }
}

//this function places a ? at a specified coordinate and places xs all around
//does not verify valid tile placement
//takes units in visual position or full units ie (3.5,2,1) is a valid placement
function placeTile(xcoor, ycoor, zcoor){
    //convert to half units
    //console.log("In full units: "+xcoor+' '+ycoor+' '+zcoor);
    xcoor=(xcoor-1)*2;
    ycoor=(ycoor-1)*2;
    zcoor--;
    //console.log("In half units: "+xcoor+' '+ycoor+' '+zcoor);
    //test that this tile lies within the marray
    if(!(halfValid(xcoor,ycoor,zcoor,true))){
        return;
    }
    /*else{
        console.log("half Valid passed");
    }*/
    //place the ?
    setVal(xcoor,ycoor,zcoor,'?',false);
    let tempx=0;
    let tempy=0;
    let ogVal='';
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            tempx=xcoor-1+j;
            tempy=ycoor-1+i;
            //console.log("Attempting placement at: "+tempx+' '+tempy);
            if(halfValid(tempx,tempy,zcoor,false)){
                ogVal=getVal(tempx,tempy,zcoor);
                if((i==1)&&(j==1)){}//do nothing
                else if((ogVal=='0')||(ogVal=='x')){
                    setVal(tempx,tempy,zcoor,'x',false);
                }
                else{
                    console.log("Unexpected value encontered during x placement: "+ogVal);
                    return;
                }
            }
        }
    }
}

//takes coor in full units and len to place a line of tiles right of starting coor
function placeLine(xcoor, ycoor, zcoor, len){
    for(let i=0;i<len;i++){
        placeTile(xcoor+i,ycoor,zcoor);
    }
}

//same as line but places an x by y rectangle instead
function placeBlock(xcoor,ycoor,zcoor, len1, len2){
    for(let i=0;i<len2;i++){
        placeLine(xcoor,ycoor+i,zcoor,len1);
    }
}

function cnvScale(){
    xoffset=0;
    yoffset=0;
    //scale canvas with window
    cnv.width=window.innerWidth*scale;//this needs updated on every draw frame
    cnv.height=window.innerWidth*scale*0.6;
    //fetch accurate pixel size
    cw=cnv.width;
    ch=cnv.height;
    //console.log("canvas size", cw, ch);
    //console.log("array size", rowLen, rowNum);
    //console.log("needed tiles",((((rowLen+1)/2)+2)),((((rowNum+1)/2)+2)))
    //console.log("pixel scale",(cw/(((rowLen+1)/2)+2)),(ch/(((rowNum+1)/2)+2)))
    //calculate pixel scale
    cws=cw/(((rowLen+1)/2)+2);
    chs=ch/(((rowNum+1)/2)+2);
    //normalize based on the smaller of the two
    //I need to normalize based on which scale gives a >/< realitive tile area
    //calculate realtive tile areas.
    //for cws
    //cws is the ideal width, tiles are a 4:3 ratio
    cwa=cws*cws*4/3;
    cha=chs*chs*3/4;
    //console.log("tile areas", cwa, cha);
    if(cwa<=cha){
        chs=cws*4/3;
        //console.log("yoffset set",ch/chs, (rowNum/2));
        yoffset=((ch/chs-((rowNum+1)/2+2))/2)*chs;
    }
    else if(cha<cwa){
        cws=chs*3/4;
        //console.log(cw/cws, (rowLen/2));
        //console.log(cw/cws);
        xoffset=((cw/cws-((rowLen+1)/2+2))/2)*cws;
    }
    else{
        console.log("ERROR: Something has gone horrible wrong while setting the scale for the tiles");
    }
    //console.log("offset", xoffset,yoffset);
}

//https://stackoverflow.com/questions/37854355/wait-for-image-loading-to-complete-in-javascript
async function loadImages(imageUrlArray) {
    const promiseArray = []; // create an array for promises
    const imageArray = []; // array for the images

    for (let imageUrl of imageUrlArray) {

        promiseArray.push(new Promise(resolve => {

            const img = new Image();
            // if you don't need to do anything when the image loads,
            // then you can just write img.onload = resolve;

            img.onload = function() {
                // do stuff with the image if necessary

                // resolve the promise, indicating that the image has been loaded
                resolve();
            };

            img.src = imageUrl;
            imageArray.push(img);
        }));
    }

    await Promise.all(promiseArray); // wait for all the images to be loaded
    console.log("all images loaded");
    return imageArray;
}

/*
//full units
function drawTileShadow(xcoor,ycoor,zcoor){
    let zxscale = -0.03*zcoor;
    let zyscale = -0.04*zcoor;
    let shadowx = -0.13;
    let shadowy = -0.14;
    let x = xoffset+(xcoor*cws)+cws*zxscale+shadowx*cws;
    let y = yoffset+(ycoor*chs)+chs*zyscale+shadowy*chs;
    ctx.drawImage(imageArray[1],x,y,cws,chs);
}

//takes input in full units and draws a tile onto the canvas
function drawTile(xcoor,ycoor,zcoor){
    //need to add in z
    //console.log(xoffset,yoffset);
    //console.log(xoffset/cws, yoffset/chs);
    let zxscale = -0.03*zcoor;
    let zyscale = -0.04*zcoor; 
    let x = xoffset+(xcoor*cws)+cws*zxscale;
    let y = yoffset+(ycoor*chs)+chs*zyscale;
    ctx.drawImage(imageArray[0],x,y,cws,chs);
}

function findTileHelper(curr, x){
    console.log("test");
    if(getValFull((x/2)+1,tileHelperY,tileHelperZ)=='?'){
        console.log("found a tile at "+((x/2)+1));
        drawTile((x/2)+1, tileHelperY, tileHelperZ); 
    }
    else{console.log("found something else: ",getValFull((x/2)+1,tileHelperY,tileHelperZ))}
    //console.log("found a tile at "+((x/2)+1));   
}

function findTileHelperShadow(curr, x){
    if(getValFull((x/2)+1,tileHelperY,tileHelperZ)=='?'){
        //console.log("found a tile at "+((x/2)+1));
        drawTileShadow((x/2)+1, tileHelperY, tileHelperZ); 
    }
    //console.log("found a tile at "+((x/2)+1));   
}

async function findTile(ycoor, zcoor){
    tileHelperY = (ycoor/2)+1;
    tileHelperZ = zcoor+1;
    await marray[zcoor][ycoor].findIndex(findTileHelperShadow);
    await marray[zcoor][ycoor].findIndex(findTileHelper);
}

//units in half
function findTileAll(){
    //console.log(xoffset,yoffset);
    //add in for loop for all z layers
    for(let j = 0; j<rowNum; j++){
        findTile(j,0);
    }
}

//units in half
function findTileAll2(){
    //console.log(xoffset,yoffset);
    //add in for loop for all z layers
    for(let j = 0; j<rowNum; j++){
        findTile(j,1);
    }
}
*/

function buildArray(){
    //For the tile array, I need
    //An array, with arrays = layers, with arrays = col, with arrays = row
    //change this to array=layers, array=rows, elements= columns
    // ****************************************
    //Here is where I will import all settings, for know just use the 'default' values

    //Board type
    //Turtle
    //12
    //8, 6
    //10, 6, 4
    //12, 6, 4, 2
    //  1 2, , , ,1
    //12, 6, 4, 2
    //10, 6, 4
    //8, 6
    //12
    //total size 
    //5x15x9
    //but, I need a vertical inbetween and a horizontal inbetween.
    //z can stay quantum
    //I think I can get away with just using 0.5 units for horizontal and vertical
    //so 5x29x17
    //size for x and y = width*2-1 in most cases, I guess it doesnt matter and we just need a case by case basis
    let turtle=false;
    let one=!turtle;

    if(turtle)//condition for turtle
    {
       height=5;
       rowNum=15;
       rowLen=29; 
    }

    if(one){
        height=1;
        rowNum=1;
        rowLen=1;
    }

    // ********************************************
    //create properly sized marray and fill with 0s

    for (let i=0; i<height; i++){
        marray.push(new Array());
        for(let j=0; j<rowNum;j++){
            marray[i].push(new Array());
            for(let z=0; z<rowLen; z++){
                marray[i][j].push(0);
            }
        }
    }

    // *********************************************
    //fill chart with ? and x denoting tiles and invalid tile placements(the half space between tiles)
    if(turtle){//turtle tester
        //this is hell, remember that you are smarter than this
        /*
        marray[0][0]=[0,'x','?','x','?','x','?','x','?','x','?','x','?','x','?','x','?','x','?','x','?','x','?','x','?','x',0,0,0,0];
        marray[0][1]=[0,'x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x',0,0,0,0];
        marray[0][2]=[0,0,0,0,0,'x','?','x','?','x','?','x','?','x','?','x','?','x','?','x','?','x',0,0,0,0,0,0,0,0];
        marray[0][3]=[0,0,0,'x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x','x',0,0,0,0,0,0];
        marray[0][4]=[0,0,0,'x','?','x','?','x','?','x','?','x','?','x','?','x','?','x','?','x','?','x','?','x',0,0,0,0,0,0];
        */

        /*
        //I can automate this further
        for(let i=0;i<12;i++){
            placeTile(2+i,1,1);
        }
        for(let i=0;i<8;i++){
            placeTile(4+i,2,1);
        }
        */

        placeLine(2,1,1,12);
        placeBlock(4,2,1,8,6);
        placeBlock(3,3,1,10,4);
        placeBlock(2,4,1,12,2);
        placeTile(1,4.5,1);
        placeLine(14,4.5,1,2);
        placeLine(2,8,1,12);
        placeBlock(5,2,2,6,6);
        placeBlock(6,3,3,4,4);
        placeBlock(7,4,4,2,2);
        placeTile(7.5,4.5,5);
    }

    if(one){
        placeTile(1,1,1);
    }
}

async function setStyle(){
    // ************************************************
    //color stylization
    // ****************
    //background color
    if (true){
        var bodyBGC = 'burlywood';
    }
    document.body.style.backgroundColor=bodyBGC;
    // ****************
    //board style
    if(true){
        var cnvBGC = 'green';
        var cnvBC = 'darkred';
    }
    cnv.style.backgroundColor=cnvBGC;
    cnv.style.borderColor=cnvBC;
    // ****************
    //button style
    if(true){
        var buttonBGC='green';
        var buttonC='ivory';
        var buttonBC='darkred';
    }
    let butList = document.querySelectorAll("button");
    for(let myBut of butList){
        myBut.style.backgroundColor=buttonBGC;
        myBut.style.color=buttonC;
        myBut.style.borderColor=buttonBC;
    }
    // ****************
    //button hover
    if(true){
        var buttonHBGC = 'lawngreen';
        var buttonHC = 'black';
        var buttonHBC = 'darkgreen';
    }
    for(let myBut of butList){
        myBut.onmouseover = () => {
            myBut.style.backgroundColor=buttonHBGC;
            myBut.style.color=buttonHC;
            myBut.style.borderColor=buttonHBC;
        }
        myBut.onmouseout = () => {
            myBut.style.backgroundColor=buttonBGC;
            myBut.style.color=buttonC;
            myBut.style.borderColor=buttonBC;
        }
    }
    // ************************************************
    //tile stylization
    //default tile
    if(true){
        imageUrlArray.push("../images/blankTileCleanC1.png");
        //console.log("start");
        //console.log("beginning test");
        //console.log("ending test");
    }

    //tile shadow
    if(true){
        imageUrlArray.push("../images/tileShadow25.png");
    }
    imageArray = await loadImages(imageUrlArray);
}

async function fillBuild(){
    //let height = 2;
    for(let i = 0; i<height; i++){
        for(let j = 0; j<rowNum; j++){
            tileHelperY = (j/2)+1;
            tileHelperZ = i+1;
            await marray[i][j].findIndex(tileBuilder);  
        }
    }    
}

function tileBuilder(curr, x){
    console.log("looking at an marray location");
    if(getValFull((x/2)+1,tileHelperY,tileHelperZ)=='?'){
        //console.log("found a tile at "+((x/2)+1));
        buildStack.push(createObj((x/2)+1, tileHelperY, tileHelperZ));
    }
}

//full units
function createObj(xcoor, ycoor, zcoor,imgId = 0, mlay=zcoor){
    let myObj = {
        x: xcoor,
        y: ycoor,
        z: zcoor,
        im: imageArray[imgId],
        vis: true,
        act: false,
        lay: mlay,
        drawMyBlank: function() {
            drawBlank(this.x, this.y, this.z, this.act);
            //drawSymbol(this.x, this.y, this.z, this.act, this.im);
        },
        drawMyShadow: function() {
            //console.log("drawing tile");
            drawShadow(this.x, this.y, this.z, this.act);
        },
        drawMySymbol: function() {
            drawSymbol(this.x, this.y, this.z, this.act, this.im);
        }
    };
    return myObj;
}

function drawBlank(xcoor, ycoor, zcoor, act){
    let zscale = -0.02;
    let zxscale = zscale*zcoor;
    let zyscale = zscale*zcoor*4/3; 
    let x = xoffset+(xcoor*cws)+cws*zxscale;
    let y = yoffset+(ycoor*chs)+chs*zyscale;
    ctx.drawImage(imageArray[0],x,y,cws,chs);
}

function drawShadow(xcoor, ycoor, zcoor, act){
    let zscale = -0.02;
    let zxscale = zscale*zcoor;
    let zyscale = zscale*zcoor*4/3;
    let shadowx = -0.1;
    let shadowy = shadowx*4/3;
    let x = xoffset+(xcoor*cws)+cws*zxscale+shadowx*cws;
    let y = yoffset+(ycoor*chs)+chs*zyscale+shadowy*chs;
    ctx.drawImage(imageArray[1],x,y,cws,chs);
}

function drawSymbol(xcoor, ycoor, zcoor, act, im){

}

function drawAll(){
    //console
    let tileCount=0;
    let layer=0;
    while(tileCount<buildStack.length){
        for(let i=0; i<buildStack.length; i++){
            if(buildStack[i].lay==layer){
                tileCount++;
                buildStack[i].drawMyShadow();
            }
        }
        for(let i=0; i<buildStack.length; i++){
            if(buildStack[i].lay==layer){
                buildStack[i].drawMyBlank();
            }
        }
        for(let i=0; i<buildStack.length; i++){
            if(buildStack[i].lay==layer){
                buildStack[i].drawMySymbol();
            }
        }
        layer++;
    }
    tileCount=0;
    layer=0;

}

// *************************************************
//I need to read the marray and plot tiles for each ?/tile id


// *************************************************
//This is where I will start actually calling things

async function main(){
    buildArray();
    await setStyle();
    cnvScale();
    //drawTile(2,1,1);
    // ************************************************
    //lets plot one tile on the canvas
    //let img = imageArray[0];
    //console.log(img);
    //ctx.drawImage(img,0,0,150,180);
    //ctx.drawImage(img,xoffset+(2*cws),yoffset+chs,cws,chs);
    //findTileAll();
    //findTileAll2();
    //cnvGrid();
    //for()
    //print();
    await fillBuild();
    drawAll();
}


// *****************************************
//testing

function print(){
    //lets output marray onto a blank html page
    let myDiv = document.createElement("div");
    let myP = document.createElement("p");
    let tempString = ""

    for(let i=0; i<height; i++){
        for(let j=0;j<rowNum;j++){
            tempString = tempString+marray[i][j].toString();
            tempString = tempString+"\n";
        }
        tempString = tempString + "\n\n";
    }

    let myTxt = document.createTextNode(tempString);
    myP.appendChild(myTxt);
    myDiv.appendChild(myP);
    document.body.appendChild(myDiv);
    document.body.style = "white-space: pre;";
}

function cnvGrid(){
    ctx.beginPath(); 
    ctx.moveTo(cnv.width/2,0);
    ctx.lineTo(cnv.width/2,cnv.height);
    ctx.stroke();
}