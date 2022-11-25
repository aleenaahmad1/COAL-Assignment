//data structures: map for instructions with functions, registers with sizes 
let regSize = new Map([
    ["AX", 16],["BX", 16],["CX", 16],["DX", 16],
    ["AH", 8],["BH", 8],["CH", 8],["DH", 8], //need 8 registers in total 
    ["AL", 8],["BL", 8],["CL", 8],["DL", 8],
]);

let instruction = new Map([
    ["mov1", function(){}], ["mov2", function(){}], ["mov3", function(){}],
    ["add", function(){}],["sub", function(){}],["mul", function(){}],
    ["inc", function(){}],["dec", function(){}],["and", function(){}], //need 4 more instructions 
    ["and", function(){}],["or", function(){}],["not", function(){}],
    ["xor", function(){}],["SHR", function(){}],["SHL", function(){}]
    ["cbw", function(){}],["", function(){}]
]); //cbw, shr, shl, not,inc, dec: single operand

let regVal = new Map([
    ["AX", 1],["BX", 2],["CX", 3],["DX", 4],
    ["AH", 5],["BH", 6],["CH", 7],["DH", 8],
    ["AL", 9],["BL", 10],["CL", 11],["DL", 12],
]);

let regOpcode = new Map([
    ["AX", 111],["BX", 222],["CX", 333],["DX", 444],
    ["AH", 555],["BH", 666],["CH", 777],["DH", 888],
    ["AL", 999],["BL", 100],["CL", 111],["DL", 122],
]);

let instructionOpcode = new Map([
    ["mov1", 000], ["mov2", 000], ["mov3", 000],
    ["add", 000],["sub", 000],["mul", 000],
    ["inc", 000],["dec", 000],["and", 000], //need 2 more instructions 
    ["and", 000],["or", 000],["not", 000],
    ["xor", 000],["lshift", 000],["rshift", 000]
]);

let memory = new Map([
    [0, 1],[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1],
    [7, 1], [8, 1], [9, 1], [10, 1], [11, 1], [12, 1],
    [14, 1], [15, 1]
])

//instruction formats: 
//mov reg, [mem], mov [mem],reg, mov reg, 1234H
//add reg, reg, sub reg, reg, inc reg, dec reg
//mul reg, reg, and reg, reg, or reg, reg, xor reg, reg
//not reg, cbw reg, shr reg, shl reg,

function parsing(input){ //mov ax, 1234H
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
}
