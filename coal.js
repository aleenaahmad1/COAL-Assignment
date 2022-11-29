//data structures: map for instructions with functions, registers with sizes 
let regSize = new Map([
    ["AX", 16],["BX", 16],["CX", 16],["DX", 16],
    ["AH", 8],["BH", 8],["CH", 8],["DH", 8],
    ["AL", 8],["BL", 8],["CL", 8],["DL", 8],
    ["SP", 16],["BP" ,16],["SI", 16],["DI", 16]
]);

let regVal = new Map([
    ["AX", "0000"],["BX", "0000"],["CX", "0000"],["DX", "0000"],
    ["AH", "00"],["BH", "00"],["CH", "00"],["DH", "00"],
    ["AL", "00"],["BL", "00"],["CL", "00"],["DL", "00"],
    ["SP", "00"],["BP", "00"],["SI", "00"],["DI", "00"]
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
    ["ADD", "000000"],["SUB", "000101"],["MUL", "111101"],["DIV","111101"],
    ["INC", "111111"],["DEC", "111111"],["NEG", "111101"],
    ["AND", "001000"],["OR", "000010"],["NOT", "111101"],
    ["XOR", "000110"],["SHL", "110100"],["SHR", "110100"],["NOP","10010000"]
]);

let memory = new Map([
    ['0000', "00"],['0001', "00"], ['0002', "00"], ['0003', "00"], ['0004', "00"], ['0005', "00"], ['0006', "00"],
    ['0007', "00"], ['0008', "00"], ['0009', "00"], ['000A', "00"], ['000B', "00"], ['000C', "00"],
    ['000D', "00"], ['000E', "00"],['000F', "00"]
]);

//mov reg to imm
function movregtoimm(reg,value){
        if (value.slice(-1)==='H'||value.slice(-1)==='h'){ //value is in hex
            value=value.slice(0,-1);
        }
        else{
            value=conversion(value,10,16)}
        if (value.length>4){
                console.log("imm vale larger than 4, error")}
        regkey=reg.slice(0,1);
        you_decide=reg.slice(-1);
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
        //setreg(destname,value);
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
        else{console.log("8 bit data cannot move directly into 16 bit reg")} 
    }
    else{console.log("invalid mem location or dest reg")} 
}

//mov ([mem],reg) wala mov
function movregtomem(dest,source){
    if (regSize.has(source) && memory.has(dest))
    {
        if (regSize.get(source)===8)
        {
            value=regVal.get(source);
            memory.set(dest,value);
            setmem(dest,value);
        }
        else{console.log("16 bits from reg cannot be moved to 8 bit mem location");}
    }
    else{console.log("invalid mem location or source reg");}
}

let instruction = new Map([
    ["MOV", function(dest,source){
        if (is_immediate(source))
        {
            movregtoimm(dest,source);
        }
        else if (regSize.has(dest) && (source.slice(0,1)==="[" && source.slice(-1)==="]")){
            source=source.slice(1,-1); //removing square brackets
            if (source.slice(-1)==="H" || source.slice(-1)==="h"){  //value is in hex
                source=source.slice(0,-1);
            }
            else {source=conversion(source,10,16);}
            movmemtoreg(dest,source);
        }
        else if (regSize.has(source) && (dest.slice(0,1)==="[" && dest.slice(-1)==="]")){
            dest=dest.slice(1,-1);
            if (dest.slice(-1)==="H" || dest.slice(-1)==="h"){  //value is in hex
                dest=dest.slice(0,-1);
            }
            else {console.log("mem should be in hex");}
            movregtomem(dest,source);
        }
        else{console.log("mov didnt slay");}
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
        //setreg(destname,val2);
    }
    }],
    ["SUB", function(dest,source){                                                                         
        if ((regSize.has(source) && regSize.has(dest))&&(regSize.get(source)==regSize.get(dest))){
        val1=regVal.get(source);
        val2=regVal.get(dest);
        val1=parseInt(val1,16);
        val2=parseInt(val2,16);
        val2=val2-val1;
        if (val2<0)
        {
            errordisplay(); //negative value
        }
        else{
            val2=val2.toString(16);
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
            //setreg(destname,val2);
        }
    }
    }],["MUL", function(source){                                                               //INSTRUCTION 2
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
                //setreg("AX",val1);
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
                //setreg("AX",regVal.get("AX"));
                //setreg("DX",regVal.get("DX"));
            }}
    }],
        ["INC", function(reg){                                                                                   //INSTRUCTION 3
    if (regSize.has(reg))
    {
        value=regVal.get(reg);
        value=parseInt(value,16);
        value=value+1;
        value=value.toString(16);
        if (value.length>4){
            value=value.slice(-4);}
        regkey = reg.slice(0,1);
        you_decide = reg[-1];
        if(you_decide==="H"||you_decide==="L")
        {
            setsize("00",value);
            if(you_decide==="H")
            {
                value=value+regVal.get(regkey+"L");
            }
            else value=regVal.get(regkey+"H")+value;
        }
        else
        {
        setsize("0000",value);
        }
        regVal.set(regkey+"X",value);
        regVal.set(regkey+"L",value.slice(2,4));
        regVal.set(regkey+"H",value.slice(0,2));
        //setreg(regkey+"X",value);
    }
    else {errordisplay();} //invalid reg
}],
    ["DEC", function(reg){                                                                                  //INSTRUCTION 4
    if (regSize.has(reg))
    {
        value=regVal.get(reg);
        value=parseInt(value,16);
        value=value-1;
        value=value.toString(16);
        if (value.length>4){
            value=value.slice(-4);}
        regkey = reg.slice(0,1);
        you_decide = reg[-1];
        if(you_decide==="H"||you_decide==="L")
        {
            setsize("00",value);
            if(you_decide==="H")
            {
                value=value+regVal.get(regkey+"L");
            }
            else value=regVal.get(regkey+"H")+value;
        }
        else
        {
        setsize("0000",value);
        }
        regVal.set(regkey+"X",value);
        regVal.set(regkey+"L",value.slice(2,4));
        regVal.set(regkey+"H",value.slice(0,2));
        //setreg(regkey+"X",value);    
    }
    else {errordisplay();}
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
        //setreg(destname,val2);
    }], 
    ["DIV", function(source){                                                                                    //INSTRUCTION 6
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
                    //setreg("AX",val1);
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
                    //setreg("AX",regVal.get("AX"));
                    //setreg("DX",regVal.get("DX"));
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
        //setreg(destname,val2);
    }],
    
    ["NOT", function(dest){                                                                                 //INSTRUCTION 8
        val1= regVal.get(dest);
        val1=conversion(val1,16,2);
        for(i=0;i<val1.length;i++)
        {
            if(val1[i]=="0") 
            {
              val1 = val1.replaceAt(i,"1");
            }
            else val1 = val1.replaceAt(i,"0");
        }
        len = val1.length;
        for(i=0;i<(regSize.get(dest)-len);i++)
        {
            val1 = val1.replace(/^/,"1");
        }
        val1 = conversion(val1,2,16);
        regkey = dest.slice(0,1);
        you_decide = dest.slice(-1);
        if(you_decide=="H"||you_decide=="L")
        {
            setsize("00",val2);
            if(you_decide=="H")
            {
                val1=val1+regVal.get(regkey+"L");
            }
            else val1=regVal.get(regkey+"H")+val1;
        }
        setsize("0000",val1);
        regVal.set(regkey+"X",val1);
        regVal.set(regkey+"L",val1.slice(2,4));
        regVal.set(regkey+"H",val1.slice(0,2));
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
        //setreg(destname,val2);
    }],
    ["SHR", function(source,shift){                                                                         //INSTRUCTION 10
    size = regSize.get(source);
    source = conversion(source,16,2);
    if(size==8) setsize("00000000",source);
    else setsize("0000000000000000",source);
    source = source.slice(0,size-shift);
    regkey= source.slice(0,1);
    for(i=0;i<shift;i++)
    {
        source = source.replace(/^/,"0")
    }
    source = conversion(source,2,16);
    if (size==8)
    {
        you_decide = dest[-1]
        setsize("00",source);
        if(you_decide=="H")
        {
            source=source+regVal.get(regkey+"L");
        }
        else source=regVal.get(regkey+"H")+source;
    }
    else
    {
    setsize("0000",source);
    }
    regVal.set(regkey+"X",source);
    regVal.set(regkey+"L",source.slice(2,4));
    regVal.set(regkey+"H",source.slice(0,2));  
    }],
    
    ["SHL", function(source,shift){                                                                     //INSTRUCTION 11
    size = regSize.get(source);
    source = conversion(source,16,2);
    if(size==8) setsize("00000000",source);
    else setsize("0000000000000000",source);
    source = source.slice(shift);
    regkey = source.slice(0,1);
    for(i=0;i<shift;i++)
    {
        source = source.concat("0");
    }
    source = conversion(source,2,16);
    if (size==8)
    {
        you_decide = dest[-1]
        setsize("00",source);
        if(you_decide=="H")
        {
            source=source+regVal.get(regkey+"L");
        }
        else source=regVal.get(regkey+"H")+source;
    }
    else
    {
    setsize("0000",source);
    }
    regVal.set(regkey+"X",source);
    regVal.set(regkey+"L",source.slice(2,4));
    regVal.set(regkey+"H",source.slice(0,2));
    //setreg(destname,source);
    }],   
    ["NOP", function(){}],["", function(){}]
]);

//inner mov functions for variations 

function is_immediate(source){
    //source: can be integer or hex value 1234H
    //for hex: 4 digits(each 1-9 or A-F), ends with 'H'
    flag = true;
    const digits = source.split("");
    if(digits[digits.length - 1]==="H"){
        if(digits.length>5){
            return !flag;
        }
        for(let i=0;i<digits.length-1;i++){
            if(!(digits[i]>=0 && digits[i]<=9) || (digits[i]>="A" && digits[i]<="F")){
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

function isNumber(dest, source){
    if(!isNaN(source)){
        if(source>regSize.has(dest)){
            return false;
            //input again
        }
        return true;
    }
    else{
        return false;
    }
}

function isMemory(dest){
    flag = true;
    if (dest[-1]==='H'){ //value is in hex
        dest=dest.slice(1,-2);
    }
    else{
        return !flag;
    }
    if(!memory.has(dest)){
        return !flag;
    }
    return flag;
}

function parsing(input){ //mov ax, 1234H
    input = input.toUpperCase();
    const splitArray = input.split(" ");
    let cmnd; //only validity check: correct command
    let dest; //valid name, check size
    let source; //valid name, check size, compatible with destination!

    if(!(instruction.has(splitArray[0]))){ //checks if instruction is valid
        console.log("Invalid instruction.");
        //input again
    }
    if(!(regSize.has(splitArray[1]) || !(isMemory(splitArray[1])))){ //checks if destination is valid
        console.log("Invalid destination operand.")
    }

    cmnd = splitArray[0];
    dest = splitArray[1];

    //check source: valid, size comparable w dest
    if (splitArray.length == 3){
        splitArray[1]=splitArray[1].slice(0,-1);
        dest = splitArray[1];
        //if fun(dest, source)
        if(!(regSize.has(splitArray[2]) || isMemory(splitArray[2]) || is_immediate(splitArray[2]) || isNumber(splitArray[1], splitArray[2]))){ //immediate bhi hosakta hai
           console.log("Invalid source operand.");
           //get input again
        }
        source = splitArray[2];
        instruction.get(cmnd)(dest, source);
        //translation(cmnd, dest, source);
    }
    else if(splitArray.length == 2){
        instruction.get(cmnd)(dest);
        //translation(cmnd, dest);
    }
    //else for another length of instruction?
    else{
        console.log("Invalid instruction.");
        //input again
    }
}

function setreg(destname,destvalue){
    console.log("Set reg.");
}
function setmem(destname,destvalue){
    console.log("set mem.");
}
function errordisplay(){
    console.log("Error");
}

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

//readjusts the smaller size where val1>source by appending zeros in the beginning
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



//MACHINE CODE TRANSLATION: 
let fixedreg = new Map([
    ["DIV", "110"], ["MUL","100"],["INC","000"],["DEC","001"],
    ["NOT","010"],["NEG","011"],["SHR","101"],
    ["SHL","100"]
])

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
parsing("mov AX, 1234H");
console.log(regVal.get("AX"));
parsing("NOT AX");
console.log(regVal.get("AX"));
