document.getElementById("submitButton").onclick=function (){
    parsing(document.getElementById('inputlainawaladabba').value);
    // document.getElementById('processor').
}
// let regSize = new Map([
//     ["AX", 16],["BX", 16],["CX", 16],["DX", 16],
//     ["AH", 8],["BH", 8],["CH", 8],["DH", 8], //need 8 registers in total
//     ["AL", 8],["BL", 8],["CL", 8],["DL", 8],
// ]);
//
// // let instruction = new Map([
// //     ["mov1", function(){}], ["mov2", function(){}], ["mov3", function(){}],
// //     ["add", function(){}],["sub", function(){}],["mul", function(){}],
// //     ["inc", function(){}],["dec", function(){}],["and", function(){}], //need 4 more instructions
// //     ["and", function(){}],["or", function(){}],["not", function(){}],
// //     ["xor", function(){}],["SHR", function(){}],["SHL", function(){}]
// //         ["cbw" , function(){}],["", function(){}]
// // ]); //cbw, shr, shl, not,inc, dec: single operand
//
// let regVal = new Map([
//     ["AX", "1"],["BX", "2"],["CX", "3"],["DX", "4"],
//     ["AH", "5"],["BH", "6"],["CH", "7"],["DH", "8"],
//     ["AL", "9"],["BL", "10"],["CL", "11"],["DL", "12"],
// ]);
//
// const regOpcode = new Map([
//     ["AX", 0b000],["BX", 0b011],["CX", 0b001],["DX", 0b010],
//     ["AH", 0b100],["BH", 0b111],["CH", 0b101],["DH", 0b110],
//     ["AL", 0b000],["BL", 0b011],["CL", 0b001],["DL", 0b010]
// ]);
//
// let memOpcode = new Map([
//     ["DS:[BX+SI]", 0b000],["DS:[BX+DI]", 0b001],["SS:[BP+SI]", 0b010],["SS:[BP+DI]", 0b011],
//     ["DS:[SI]", 0b100],["DS:[DI]", 0b101],["SS:[BP]", 0b110],["DS:[BX]", 0b111]
// ]);
//
let instructionOpcode = new Map([
    ["mov1", 0b100010], ["mov2", 0b1100011], ["mov3", 0b1011],
    ["add", 0b000000],["sub", 0b000101],["mul", 0b1111011],["imul",0b1111011],
    ["inc", 1111111],["dec", 0b1111111],["neg", 0b1111011],
    ["and", 0b001000],["or", 0b000010],["not", 1111011],
    ["xor", 0b000110],["shl", 0b1101000],["shr", 0b1101000]
]);
//
// let memory = new Map([
//     ['0', 1],['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1],
//     ['7', 1], ['8', 1], ['9', 1], ['A', 1], ['B', 1], ['C', 1],
//     ['D', 1], ['E', 1],['F',1]
// ])
//
// //instruction formats:
// //mov reg, [mem], mov [mem],reg, mov reg, 1234H
// //add reg, reg, sub reg, reg, inc reg, dec reg
// //mul reg, reg, and reg, reg, or reg, reg, xor reg, reg
// //not reg, cbw reg, shr reg, shl reg,

function parsing(input){ //mov ax, 1234H
    if(document.getElementById('inputlainawaladabba').value==''){
        document.getElementById('mcode').innerHTML='No Command Entered';
    }
    else{
        const splitArray = input.split(" ");
        let cmnd; //only validity check: correct command
        let dest; //valid name, check size
        let source; //valid name, check size, compatible with destination!
        let movnum = 0;

        if(!(instruction.has(splitArray[0]))){ //checks if instruction is valid
            console.log("Invalid instruction.");
            //input again
        }
        if(!(regSize.has(splitArray[1]) || memory.has(splitArray[1]))){ //checks if destination is valid
            console.log("Invalid destination operand.")
        }

        cmnd=splitArray[0];
        dest = splitArray[1];

        //check source: valid, size comparable w dest
        if (splitArray.length == 3){
            if(!(regSize.has(splitArray[2]))){
                console.log("Invalid source operand.");
                //get input again
            }
            source = splitArray[2];
            if(!(regSize.get(source)==regSize.get(dest))){
                console.log("Sizes of operands do not match.");
                //get input again
            }
            instruction.cmnd(dest, source);
        }
        else if(splitArray.length == 2){
            instruction.cmnd(dest);
        }
        //else for another length of instruction?
        else{
            console.log("Invalid instruction.");
            //input again
        }
    }}

function setreg(destname,destvalue){}
function errordisplay(){}


//conversion function, string as num, base from is initial base, and to is conversion's base
//like hext0binary call: conversion(num,16,2)
function conversion (num,from,to) {
    return parseInt(num, from).toString(to);
};

//readjusts the smaller size where val1>val2 by appending zeros in the beginning
function setsize(a,b){
    len_a = a.length;
    len_b = b.length;
    if(len_a>len_b)
    {
        for(i=0; i<len_a-len_b;i++)
        {
            b=b.replace(/^/,"0");
        }
    }
    return b;
}

//add function, reg to reg
function addition(dest,source){
    if ((regSize.has(source) && regSize.has(dest))&&(regSize.get(source)==regSize.get(dest))){
        val1=regVal.get(source);
        val2=regVal.get(dest);
        val1=parseInt(val1, 16);
        val2=parseInt(val2, 16);
        val2=val2+val1;
        val2=val2.toString(16);
        regVal.set(dest,val2);
        setreg(destname,val2);
    }
    else{errordisplay();}
}

function or(dest,source){
    val1=regVal.get(source);
    val2=regVal.get(dest);
    val1=conversion(val1,16,2);
    val2=conversion(val2, 16, 2);
    if(val1.length!=val2.length) //sets size to be the same
    {
        val1 = setsize(val2,val1);
        val2 = setsize(val1,val2);
    }
    for(i=0;i<val1.length;i++)
    {
        if(val1[i]==1 || val2[i]==1)
        {
            val2[i]="1";
        }
        else val2[i]="0";
    }
    val2 = conversion(val2,2,16);
    regVal.set(dest,val2);
    setreg(destname,val2);
}

function xor(dest,source){
    val1=regVal.get(source);
    val2=regVal.get(dest);
    val1=conversion(val1,16,2);
    val2=conversion(val2, 16, 2);
    if(val1.length!=val2.length) //sets size to be the same
    {
        val1 = setsize(val2,val1);
        val2 = setsize(val1,val2);
    }
    for(i=0;i<val1.length;i++)
    {
        if(val1[i]!=val2[i])
        {
            val2[i]="1";
        }
        else val2[i]="0";
    }
    val2 = conversion(val2,2,16);
    regVal.set(dest,val2);
    setreg(destname,val2);
}

function not(source){
    val1=regVal.get(source);
    val1=conversion(val1,16,2);
    for(i=0;i<val1.length;i++)
    {
        if(val1[i]=="0")
        {
            val1[i]="1";
        }
        else val1[i]="0";
    }
    val1 = conversion(val2,2,16);
    regVal.set(dest,val1);
    setreg(destname,val1);
}
