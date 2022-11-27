//data structures: map for instructions with functions, registers with sizes 
let regSize = new Map([
    ["AX", 16],["BX", 16],["CX", 16],["DX", 16],
    ["AH", 8],["BH", 8],["CH", 8],["DH", 8],
    ["AL", 8],["BL", 8],["CL", 8],["DL", 8],
    ["SP", 16],["BP" ,16],["SI", 16],["DI", 16]
]);

let regVal = new Map([
    ["AX", 1],["BX", 2],["CX", 3],["DX", 4],
    ["AH", 5],["BH", 6],["CH", 7],["DH", 8],
    ["AL", 9],["BL", 10],["CL", 11],["DL", 12],
    ["SP", 13],["BP", 14],["SI", 15],["DI", 16]
]);

let regCode = new Map([
    ["AX", "000"],["BX", "011"],["CX", "001"],["DX", "010"],
    ["AH", "100"],["BH", "111"],["CH", "101"],["DH", "110"],
    ["AL", "000"],["BL", "011"],["CL", "001"],["DL", "010"],
    ["SP", "100"],["BP", "101"],["SI", "110"],["DI", "111"]
]);

let memCode = new Map([
    ["DS:[BX+SI]", "000"],["DS:[BX+DI]", "001"],["SS:[BP+SI]", "010"],["SS:[BP+DI]", "011"],
    ["DS:[SI]", "100"],["DS:[DI]", "101"],["SS:[BP]", "110"],["DS:[BX]", "111"]
]);

let opcode = new Map([
    ["MOV", "100010"], ["mov2", "1100011"], ["mov3", "1011"],
    ["ADD", "000000"],["SUB", "000101"],["MUL", "1111011"],["DIV","1111011"],
    ["INC", "1111111"],["DEC", "1111111"],["NEG", "1111011"],
    ["AND", "001000"],["OR", "000010"],["NOT", "1111011"],
    ["XOR", "000110"],["SHL", "1101000"],["SHR", "1101000"]
]);

let memory = new Map([
    ['0000', 1],['0001', 1], ['0002', 1], ['0003', 1], ['0004', 1], ['0005', 1], ['0006', 1],
    ['0007', 1], ['0008', 1], ['0009', 1], ['000A', 1], ['000B', 1], ['000C', 1],
    ['000D', 1], ['000E', 1],['000F',1]
]);


//mov reg to imm
function movregtoimm(reg,value){
        if (value[-1]==='H'||value[-1]==='h'){ //value is in hex
            value=value.slice(0,-1);
        }
        else{
            value=conversion(10,16)}
        if (value.length>4){errordisplay();}
        regkey=reg.slice(0,1);
        you_decide=reg[-1];
        if(you_decide==="H"||you_decide==="L")
        {
            value=setsize("00",value);
            if (you_decide==="H")
            {
                value=value+regVal.get(regkey+"L");
            }
            else value=regVal.get(regkey+"H")+value;
        }
        else{
            value=setsize("0000",value);
        }
        regVal.set(regkey+"X",value);
        regVal.set(regkey+"L",value.slice(2,4));
        regVal.set(regkey+"H",value.slice(0,2));
        setreg(destname,value);
}

//mov (reg,[mem]) wala mov
function movmemtoreg(dest,source){
    if (memory.has(source) && regSize.has(dest)) //assuming the brackets are removed from the memory location at this point
    {
        val1=memory.get(source);
        if (regSize.get(dest)===8)
        {
            regkey=dest.slice(0,1);
            regVal.set(dest,val1);
            xval=regVal.get(regkey+"H")+regVal.get(regkey+"L");
            regVal.set(regkey+"X",xval);
            setreg(dest,xval);
        } 
        else{errordisplay();} //8 bit data cannot move directly to 16 bit reg lmao
    }
    else{errordisplay();} //invalid mem location or dest reg
}

//mov ([mem],reg) wala mov
function movregtomem(dest,source){
    if (regSize.has(source) && memory.has(dest))
    {
        if (regSize.get(reg)===8)
        {
            value=regVal.get(reg);
            memory.set(dest,value);
            setmem(dest,value);
        }
        else{errordisplay();} //16 bits from reg cannot be moved to 8 bit mem location
    }
    else{errordisplay();} //invalid mem location or source reg
}


let instruction = new Map([
    ["MOV", function(dest,source){
        if (is_immediate(source))
        {
            movregtoimm(dest,source);
        }
        else if (regSize.has(dest) && (source[0]==="[" && source[-1]==="]")){
            source=source.slice(1,-1); //removing square brackets
            if (source[-1]==="H" || source[-1]==="h"){  //value is in hex
                source=source.slice(0,-1);
            }
            else {conversion(source,10,16);}
            movmemtoreg(dest,source);
        }
        else if (regSize.has(source) && (dest[0]==="[" && dest[-1]==="]")){
            dest=dest.slice(1,-1);
            if (dest[-1]==="H" || dest[-1]==="h"){  //value is in hex
                dest=dest.slice(0,-1);
            }
            else {conversion(dest,10,16);}
            movregtomem(dest,source);
        }
        else{errordisplay();}
    }],
    ["ADD", function(dest, source){                                                                         //INSTRUCTION 1
        if ((regSize.has(source) && regSize.has(dest))&&(regSize.get(source)==regSize.get(dest))){
        val1=regVal.get(source);
        val2=regVal.get(dest);
        val1=parseInt(val1,16);
        val2=parseInt(val2,16);
        val2=val2+val1;
        val2=val2.toString(16);
        //yahan write code for caary flag?
        if (val2.length>4){
            val2=val2.slice(-4);}
        regkey = dest.slice(0,1);
        you_decide = dest[-1];
        if(you_decide==="H"||you_decide==="L")
        {
            setsize("00",val2);
            if(you_decide==="H")
            {
                val2=val2+regVal.get(regkey+"L");
            }
            else val2=regVal.get(regkey+"H")+val2;
        }
        else
        {
        setsize("0000",val2);
        }
        regVal.set(regkey+"X",val2);
        regVal.set(regkey+"L",val2.slice(2,4));
        regVal.set(regkey+"H",val2.slice(0,2));
        setreg(destname,val2);
    }
    }
    }],
    ["SUB", function(){}],["MUL", function(){                                                               //INSTRUCTION 2
            if (regSize.has(source)){
            if (regSize.get(source)===8){
                val1=regVal.get("AL");
                val2=regVal.get(source);
                val1=parseInt(val1,16);
                val2=parseInt(val2,16);
                val1=val1*val2;
                val1=val1.toString(16);
                val1=setsize("0000",val1);
                regVal.set("AX",val1);
                regVal.set("AL",val1.slice(4,8));
                regVal.set("AH",val1.slice(0,4));
                setreg("AX",val1);
            }
            if (regSize.get(source)===16){
                val1=regVal.get("AX");
                val2=regVal.get(source);
                val1=parseInt(val1,16);
                val2=parseInt(val2,16);
                val1=val1*val2;
                val1=val1.toString(16);
                //pad w zeros to make final value 8 hex digits
                val1=setsize("00000000",val1);
                regVal.set("DX",val1.slice(0,4));
                regVal.set("DL",val1.slice(2,4));
                regVal.set("DH",val1.slice(0,2));
                regVal.set("AX",val1.slice(4,8));
                regVal.set("AL",val1.slice(6,8));
                regVal.set("AH",val1.slice(4,6));
                setreg("AX",regVal.get("AX"));
                setreg("DX",regVal.get("DX"));
            }}
    }],
    ["INC", function(reg){                                                                                   //INSTRUCTION 3
    if (regSize.has(reg)){
            setreg(reg,regVal.get(reg)+1);
    }
    else {console.log("Invalid Operand Name.");}
}],
    ["DEC", function(reg){                                                                                  //INSTRUCTION 4
    if (regSize.has(reg)){
        setreg(reg,regVal.get(reg)-1);
    }
    else {console.log("Invalid Operand Name.");}
}],
    ["AND", function(dest, source){                                                                        //INSTRUCTION 5
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
            if(val1[i]=="1" && val2[i]=="1")
            {
              val2 = val2.replaceAt(i,"1");
            }
            else val2 = val2.replaceAt(i,"0");
        }
        val2 = conversion(val2,2,16);
        regkey = dest.slice(0,1);
        you_decide = dest[-1];
        if(you_decide=="H"||you_decide=="L")
        {
            setsize("00",val2);
            if(you_decide=="H")
            {
                val2=val2+regVal.get(regkey+"L");
            }
            else val2=regVal.get(regkey+"H")+val2;
        }
        else
        {
        setsize("0000",val2);
        }
        regVal.set(regkey+"X",val2);
        regVal.set(regkey+"L",val2.slice(2,4));
        regVal.set(regkey+"H",val2.slice(0,2));
        setreg(destname,val2);
    }], 
    ["DIV", function(){                                                                                    //INSTRUCTION 6
            if (regSize.has(source)){
                if (regSize.get(source)===8){
                    val1=regVal.get("AX");
                    val2=regVal.get(source);
                    val1=parseInt(val1,16);
                    val2=parseInt(val2,16);
                    quotient=val1/val2;
                    remainder=val1%val2;
                    quotient=quotient.toString(16);
                    remainder=remainder.toString(16);
                    setsize("00",quotient);
                    setsize("00",remainder);
                    regVal.set("AX",quotient+remainder);
                    regVal.set("AL",quotient);
                    regVal.set("AH",remainder);
                    setreg("AX",val1);
                }
                if (regSize.get(source)===16){
                    val1=regVal.get("DX")+regVal.get("AX");
                    val2=regVal.get(source);
                    val1=parseInt(val1,16);
                    val2=parseInt(val2,16);
                    quotient=val1/val2;
                    remainder=val1%val2;
                    quotient=quotient.toString(16);
                    remainder=remainder.toString(16);
                    setsize("0000",quotient);
                    setsize("0000",remainder);
                    regVal.set("DX",remainder);
                    regVal.set("DL",remainder(2,4));
                    regVal.set("DH",remainder(0,2));
                    regVal.set("AX",quotient);
                    regVal.set("AL",quotient(2,4));
                    regVal.set("AH",quotient(0,2));
                    setreg("AX",regVal.get("AX"));
                    setreg("DX",regVal.get("DX"));
                }
            }
            else{
                //error
            }
    }],
    ["OR", function(dest, source){                                                                                  //INSTRUCTION 7
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
            if(val1[i]=="1" || val2[i]=="1")
            {
              val2 = val2.replaceAt(i,"1");
            }
            else val2 = val2.replaceAt(i,"0");
        }
        val2 = conversion(val2,2,16);
            regkey = dest.slice(0,1);
        you_decide = dest[-1];
        if(you_decide=="H"||you_decide=="L")
        {
            setsize("00",val2);
            if(you_decide=="H")
            {
                val2=val2+regVal.get(regkey+"L");
            }
            else val2=regVal.get(regkey+"H")+val2;
        }
        else
        {
        setsize("0000",val2);
        }
        regVal.set(regkey+"X",val2);
        regVal.set(regkey+"L",val2.slice(2,4));
        regVal.set(regkey+"H",val2.slice(0,2));
        setreg(destname,val2);
    }],
    
    ["NOT", function(dest){                                                                                 //INSTRUCTION 8
        val1=regVal.get(source);
        val1=conversion(val1,16,2);
        for(i=0;i<val1.length;i++)
        {
            if(val1[i]=="0") 
            {
              val1 = val1.replaceAt(i,"1");
            }
            else val1 = val1.replaceAt(i,"0");
        }
        val1 = conversion(val1,2,16);
        regkey = dest.slice(0,1);
        you_decide = dest[-1];
        if(you_decide=="H"||you_decide=="L")
        {
            setsize("00",val2);
            if(you_decide=="H")
            {
                val1=val1+regVal.get(regkey+"L");
            }
            else val1=regVal.get(regkey+"H")+val1;
        }
        else
        {
        setsize("0000",val2);
        }
        regVal.set(regkey+"X",val1);
        regVal.set(regkey+"L",val1.slice(2,4));
        regVal.set(regkey+"H",val1.slice(0,2));
        setreg(destname,val1);
    }],
    ["XOR", function(dest, source){                                                                             //INSTRUCTION 9
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
              val2 = val2.replaceAt(i,"1");
            }
            else val2 = val2.replaceAt(i,"0");
        }
        val2 = conversion(val2,2,16);
        regkey = dest.slice(0,1);
        you_decide = dest[-1];
        if(you_decide=="H"||you_decide=="L")
        {
            setsize("00",val2);
            if(you_decide=="H")
            {
                val2=val2+regVal.get(regkey+"L");
            }
            else val2=regVal.get(regkey+"H")+val2;
        }
        else
        {
        setsize("0000",val2);
        }
        regVal.set(regkey+"X",val2);
        regVal.set(regkey+"L",val2.slice(2,4));
        regVal.set(regkey+"H",val2.slice(0,2));
        setreg(destname,val2);
    }],
    ["SHR", function(source,shift){                                                                         //INSTRUCTION 10
    size = regSize.get(source);
    source = conversion(source,16,2);
    if(size==8) setsize("00000000",source);
    else setsize("0000000000000000",source);
    source = source.slice(0,size-shift);
    for(i=0;i<shift;i++)
    {
        source = source.replace(/^/,"0")
    }
    source = conversion(source,2,16);
    if (size==8)
    {
        you_decide = dest[-1]
        setsize("00",val2);
        if(you_decide=="H")
        {
            val2=val2+regVal.get(regkey+"L");
        }
        else val2=regVal.get(regkey+"H")+val2;
    }
    else
    {
    setsize("0000",val2);
    }
    regVal.set(regkey+"X",val2);
    regVal.set(regkey+"L",val2.slice(2,4));
    regVal.set(regkey+"H",val2.slice(0,2));
    setreg(destname,val2);  
    }],
    
    ["SHL", function(source,shift){                                                                     //INSTRUCTION 11
    size = regSize.get(source);
    source = conversion(source,16,2);
    if(size==8) setsize("00000000",source);
    else setsize("0000000000000000",source);
    source = source.slice(shift);
    for(i=0;i<shift;i++)
    {
        source = source.concat("0");
    }
    source = conversion(source,2,16);
    if (size==8)
    {
        you_decide = dest[-1]
        setsize("00",val2);
        if(you_decide=="H")
        {
            val2=val2+regVal.get(regkey+"L");
        }
        else val2=regVal.get(regkey+"H")+val2;
    }
    else
    {
    setsize("0000",val2);
    }
    regVal.set(regkey+"X",val2);
    regVal.set(regkey+"L",val2.slice(2,4));
    regVal.set(regkey+"H",val2.slice(0,2));
    setreg(destname,val2);
    }],   
    ["CBW", function(){}],["", function(){}]
]);

//inner mov functions for variations 

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
function setmem(destname,destvalue){}
function errordisplay(){}

//replacing at a particular index in string 
//calling: str = str.replaceAt(index, "value")
String.prototype.replaceAt = function(index, replacement) {
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}

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

//1111111 //000 (dest)
//increment value in registers
function increment(reg){
    if (regSize.has(reg)){
            setreg(reg,regVal.get(reg)+1);
    }
    else {console.log("Invalid Operand Name.");}
}

//1111111 //001 (dest)
//decrement value in registers
function decrement(reg){
    if (regSize.has(reg)){
        setreg(reg,regVal.get(reg)-1);
    }
    else {console.log("Invalid Operand Name.");}
}

//MACHINE CODE TRANSLATION: 
let fixedreg = new Map(
    ["DIV", "110"], ["MUL","100"],["INC","000"],["DEC","001"],
    ["NOT","010"],["NEG","011"],["SHR","101"],
    ["SHL","100"]
)

function translation(cmnd, dest, source){
    let d = "0"; let mod = "11"; let w; let finalCode;
    if(regSize.get(dest)==8){
        w = "0";
    }
    else{
        w = "1";
    }
    if(arguments.length == 3){
        finalCode = machinecode(opcode.get(cmnd),d,w,mod,regCode.get(dest),regCode.get(source));
        return finalCode;
    }
    else if(arguments.length == 2){
        if(cmnd=="SHR" || cmnd=="SHL"){
            d = "0";
        }
        else{
            d= "1";
        }
        finalCode = machinecode(opcode.get(cmnd),d,w,mod,fixedreg.get(cmnd),regCode.get(dest))
        return finalCode;
    }
} 

function machinecode(opcode, d, w, mod, reg, rm){
    byte1 = opcode + d + w;
    byte2 = mod + reg + rm;
    code = byte1 + " " + byte2;
    return code;
}
