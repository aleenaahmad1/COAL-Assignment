//data structures: map for instructions with functions, registers with sizes 
let regSize = new Map([
    ["AX", 16],["BX", 16],["CX", 16],["DX", 16],
    ["AH", 8],["BH", 8],["CH", 8],["DH", 8], //need 8 registers in total 
    ["AL", 8],["BL", 8],["CL", 8],["DL", 8],
]);

let instruction = new Map([
    ["mov1", function(){}], ["mov2", function(){}], ["mov3", function(){}],
    ["add", function(){}],["sub", function(){}],["mul", function(){}],
    ["inc", function(){}],["dec", function(){}],["and", function(){}], //need 2 more instructions 
    ["and", function(){}],["or", function(){}],["not", function(){}],
    ["xor", function(){}],["SHR", function(){}],["SHL", function(){}]
    ["cbw", function(){}],["", function(){}]
]);

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

