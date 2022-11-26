//data structures: map for instructions with functions, registers with sizes 
let regSize = new Map([
    ["AX", 16],["BX", 16],["CX", 16],["DX", 16],
    ["AH", 8],["BH", 8],["CH", 8],["DH", 8], //need 8 registers in total 
    ["AL", 8],["BL", 8],["CL", 8],["DL", 8],
]);

let instruction = new Map([
    ["MOV", function(){}], ["ADD", function(){}],["SUB", function(){}],["MUL", function(){}],
    ["INC", function(){}],["DEC", function(){}],["AND", function(){}], //need 4 more instructions 
    ["DIV", function(){}],["OR", function(){}],["NOT", function(){}],
    ["XOR", function(){}],["SHR", function(){}],["SHL", function(){}]
    ["CBW", function(){}],["", function(){}]
]); //cbw, shr, shl, not,inc, dec: single operand

//inner mov functions for variations 

let regVal = new Map([
    ["AX", "1"],["BX", "2"],["CX", "3"],["DX", "4"],
    ["AH", "5"],["BH", "6"],["CH", "7"],["DH", "8"],
    ["AL", "9"],["BL", "10"],["CL", "11"],["DL", "12"],
]);

let regCode = new Map([
    ["AX", 000],["BX", 011],["CX", 001],["DX", 010],
    ["AH", 100],["BH", 111],["CH", 101],["DH", 110],
    ["AL", 000],["BL", 011],["CL", 001],["DL", 010]
]);

let memCode = new Map([
    ["DS:[BX+SI]", 000],["DS:[BX+DI]", 001],["SS:[BP+SI]", 010],["SS:[BP+DI]", 011],
    ["DS:[SI]", 100],["DS:[DI]", 101],["SS:[BP]", 110],["DS:[BX]", 111]
]);

let opcode = new Map([
    ["MOV", 100010], ["mov2", 1100011], ["mov3", 1011],
    ["ADD", 000000],["SUB", 000101],["MUL", 1111011],["imul",1111011],
    ["INC", 1111111],["DEC", 1111111],["NEG", 1111011],
    ["AND", 001000],["OR", 000010],["NOT", 1111011],
    ["XOR", 000110],["SHL", 1101000],["SHR", 1101000]
]);

let memory = new Map([
    ['0', 1],['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1],
    ['7', 1], ['8', 1], ['9', 1], ['A', 1], ['B', 1], ['C', 1],
    ['D', 1], ['E', 1],['F',1]
])

function is_immediate(source){
    //source: can be integer or hex value 1234H
    //for hex: 4 digits(each 1-9 or A-F), ends with 'H'
    flag = true;
    const digits = source.split("");
    if(digits[digits.length - 1]==="H"){
        for(let i=0;i<digits.length-1;i++){
            if(!(digits[i]>=0 && digits[i]<=15) || (digits[i]>="A" && digits[i]<="F")){
                return !flag;
            }
        }
        return flag;
    }   
    else if(source<=65535){
        return flag;
    }
    else{
        return !flag;
    }
}

function translation(cmnd, dest, source){} //for translation to machine code

function parsing(input){ //mov ax, 1234H
    input = input.toUpperCase();
    const splitArray = input.split(" ");
    splitArray[1]=splitArray[1].substr(0,2);
    let cmnd; //only validity check: correct command
    let dest; //valid name, check size
    let source; //valid name, check size, compatible with destination!

    if(!(instruction.has(splitArray[0]))){ //checks if instruction is valid
        console.log("Invalid instruction.");
        //input again
    }
    if(!(regSize.has(splitArray[1]) || memory.has(splitArray[1]))){ //checks if destination is valid
        console.log("Invalid destination operand.")
    }

    cmnd = splitArray[0];
    dest = splitArray[1];

    //check source: valid, size comparable w dest
    if (splitArray.length == 3){
        if(!(regSize.has(splitArray[2]) || memory.has(splitArray[2]))){
           console.log("Invalid source operand.");
           //get input again
        }
        source = splitArray[2];
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
}

function setreg(destname,destvalue){}
function errordisplay(){}

//conversion function, string as num, base from is initial base, and to is conversion's base
//like hextobinary call: conversion(num,16,2)
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
//add r1,r2 instruction
function and(dest,source){
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
        if(val1[i]==1 && val2[i]==1)
        {
            val2[i]="1";
        }
        else val2[i]="0";
    }
    regVal.set(dest,val2);
    setreg(destname,val2);
}
