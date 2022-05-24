// ****************************************
//does this file load?
//alert("Hello World!");

// ***************************************
//variable declaration
const marray = [];
var rowLen=0;//y
var rowNum=0;//x
var height=0;//z
var cnv=document.getElementById("myCanvas");

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
if(true)//condition for turtle
{
   height=5;
   rowNum=15;
   rowLen=29; 
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
if(true){//turtle tester
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


// ************************************************
//edit the canvas to be the correct size
//cnv.width=window.innerWidth;
//cnv.height=window.innerHeight;



//testing


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
