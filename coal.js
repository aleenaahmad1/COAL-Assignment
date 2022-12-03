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

//mov imm to reg
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
    document.getElementById(regkey+'X').innerHTML=value;
    /////////////////////Arslan nai imm to reg Likh lia////
}

// mov reg to reg
function movregtoreg(dest,source){
    if ((regSize.has(source) && regSize.has(dest))&&(regSize.get(source)===regSize.get(source)))
    {
        val=regVal.get(source);
        regkey=dest.slice(0,1);
        you_decide=dest.slice(-1);
        if (you_decide==="L" || you_decide==="H")
        {
            if (you_decide==="H")
            {
                val=val+regVal.get(regkey+"L");
            }
            else val=regVal.get(regkey+"H")+val;
        }
        regVal.set(regkey+"X",val);
        regVal.set(regkey+"L",val.slice(2,4));
        regVal.set(regkey+"H",val.slice(0,2));
        //idhr arslan function call karo
        document.getElementById(regkey+'X').innerHTML=val;
    }
}

//mov (reg,[mem]) wala mov
function movmemtoreg(dest,source){
    if (memory.has(source) && regSize.has(dest)) //assuming the brackets are removed from the memory location at this point
    {
        val1=memory.get(source);
        regkey=dest.slice(0,1);
        regVal.set(dest,val1);
        if (regSize.get(dest)===8)
        {
            xval=regVal.get(regkey+"H")+regVal.get(regkey+"L");   
        }
        else
        {
            xval=setsize("0000",val1);
        }
        regVal.set(regkey+"X",xval);
        document.getElementById(regkey+'X').innerHTML=xval;
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
            // setmem(dest,value);
        document.getElementById(dest).innerHTML=value;
        }
        else
        {
            regkey=source.slice(0,1);
            slayvalue=regVal.get(regkey+"L");
            memory.set(dest,slayvalue);
            document.getElementById(dest).innerHTML=slayvalue;
            slayvalue=regVal.get(regkey+"H");
            arslanmem=parseInt(dest,16);
            arslanmem=arslanmem+1;
            if (arslanmem>15)
            {
                return;
            }
            arslanmem=arslanmem.toString(16);
            arslanmem=setsize("0000",arslanmem);
            if (memory.has(arslanmem))
            {
                memory.set(arslanmem,slayvalue);
                document.getElementById(arslanmem).innerHTML=slayvalue;
            }
        }
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
            else
            {
                source=conversion(source,10,16);
                source=setsize("0000",source);
            }
            movmemtoreg(dest,source);
        }
        else if (regSize.has(source) && (dest.slice(0,1)==="[" && dest.slice(-1)==="]")){
            dest=dest.slice(1,-1);
            if (dest.slice(-1)==="H" || dest.slice(-1)==="h"){  //value is in hex
                dest=dest.slice(0,-1);
            }
            else {
                dest=conversion(dest,10,16);
                dest=setsize("0000",dest);
            }
            movregtomem(dest,source);
        }
        else if ((regSize.has(source) && regSize.has(dest))&&(regSize.get(source)===regSize.get(source)))
        {
            movregtoreg(dest,source);
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
            you_decide = dest.slice(-1);
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
            document.getElementById(regkey+'X').innerHTML=val2;
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
                val2=-val2;
                val2=conversion(val2,16,2);
                if (regSize.get(dest)===8){
                    val2 = setsize("00000000",val2);
                }
                else val2=setsize("0000000000000000",val2);
                val2=twoscompliment(val2);
                val2=conversion(val2,2,16);
            }
            else val2=val2.toString(16);
            if (val2.length>4){
                val2=val2.slice(-4);}
            regkey = dest.slice(0,1);
            you_decide = dest.slice(-1);
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
            document.getElementById(regkey+'X').innerHTML=val2;
        }
    }],
    ["NEG", function(dest){
        if (regSize.has(dest)){
            value=regVal.get(dest);
            value=conversion(value,16,2);
            if (regSize.get(dest)===8){
                value = setsize("00000000",value);
            }
            else value=setsize("0000000000000000",value);
            value=twoscompliment(value);
            value=conversion(value,2,16);
            regkey=dest.slice(0,1);
            you_decide=dest.slice(-1);
            if(you_decide==="H"||you_decide==="L")
            {
                setsize("00",value);
                if(you_decide==="H")
                {
                    value = value+regVal.get(regkey+"L");
                }
                else value = regVal.get(regkey+"H")+value;
            }
            else
            {
                setsize("0000",value);
            }
            regVal.set(regkey+"X",value);
            regVal.set(regkey+"L",value.slice(2,4));
            regVal.set(regkey+"H",value.slice(0,2));
            //arslannnn likho pls:OK
            document.getElementById(regkey+'X').innerHTML=value;
        }
    }],
    ["MUL", function(source){                                                               //INSTRUCTION 2
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
                document.getElementById('AX').innerHTML=val1;
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
                document.getElementById('AX').innerHTML=val1.slice(4,8);
                //setreg("DX",regVal.get("DX"));
                document.getElementById('DX').innerHTML=val1.slice(0,4);
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
            you_decide = reg.slice(-1);
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
            document.getElementById(regkey+'X').innerHTML=value;
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
            you_decide = reg.slice(-1);
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
            document.getElementById(regkey+'X').innerHTML=value;

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
        you_decide = dest.slice(-1);
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
        document.getElementById(regkey+'X').innerHTML=val2;
    }],
    ["DIV", function(source){                                                                                    //INSTRUCTION 6
        if (regSize.has(source)){
            if (regSize.get(source)===8){
                val1=regVal.get("AL");
                val2=regVal.get(source);
                val1=parseInt(val1,16);
                val2=parseInt(val2,16);
                if (val2===0)
                {
                    //errordisplay
                    console.log("denominator cant b zero!!!");
                    return;
                }
                quotient=parseInt(val1/val2);
                remainder=val1%val2;
                quotient=quotient.toString(16);
                remainder=remainder.toString(16);
                quotient = setsize("00",quotient);
                remainder = setsize("00",remainder);
                regVal.set("AX",remainder+quotient);
                regVal.set("AL",quotient);
                regVal.set("AH",remainder);
                document.getElementById('AX').innerHTML=remainder+quotient;
            }
            if (regSize.get(source)===16){
                val1=regVal.get("DX")+regVal.get("AX");
                val2=regVal.get(source);
                val1=parseInt(val1,16);
                val2=parseInt(val2,16);
                if (val2===0)
                {
                    //errordisplay
                    console.log("denominator cant b zero!!!");
                    return;
                }
                quotient=parseInt(val1/val2);
                remainder=val1%val2;
                quotient=quotient.toString(16);
                remainder=remainder.toString(16);
                quotient = setsize("0000",quotient);
                remainder = setsize("0000",remainder);
                regVal.set("DX",remainder);
                regVal.set("DL",remainder.slice(2,4));
                regVal.set("DH",remainder.slice(0,2));
                regVal.set("AX",quotient);
                regVal.set("AL",quotient.slice(2,4));
                regVal.set("AH",quotient.slice(0,2));
                //setreg("AX",regVal.get("AX"));
                document.getElementById('AX').innerHTML=quotient;
                //setreg("DX",regVal.get("DX"));
                document.getElementById('DX').innerHTML=remainder;
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
        you_decide = dest.slice(-1);
        if(you_decide=="H"||you_decide=="L")
        {
            val2  = setsize("00",val2);
            if(you_decide=="H")
            {
                val2=val2+regVal.get(regkey+"L");
            }
            else val2=regVal.get(regkey+"H")+val2;
        }
        else
        {
            val2 = setsize("0000",val2);
        }
        regVal.set(regkey+"X",val2);
        regVal.set(regkey+"L",val2.slice(2,4));
        regVal.set(regkey+"H",val2.slice(0,2));
        //setreg(destname,val2);
        document.getElementById(regkey+'X').innerHTML=val2;
    }],

    ["NOT", function(dest){                                                                                 //INSTRUCTION 8
        val1=regVal.get(dest);
        val1=conversion(val1,16,2);
        for(i=0;i<val1.length;i++)
        {
            if(val1[i]=="0")
            {
                val1 = val1.replaceAt(i,"1");
            }
            else val1 = val1.replaceAt(i,"0");
        }
        len=val1.length;
        for(i=0;i<(regSize.get(dest)-len);i++)
        {
            val1 = val1.replace(/^/,"1");
        }
        val1 = conversion(val1,2,16);
        regkey = dest.slice(0,1);
        you_decide = dest.slice(-1);
        if(you_decide=="H"||you_decide=="L")
        {
            val1 = setsize("00",val1);
            if(you_decide=="H")
            {
                val1=val1+regVal.get(regkey+"L");
            }
            else val1=regVal.get(regkey+"H")+val1;
        }
        else
        {
        val1 = setsize("0000",val1);
        }
        regVal.set(regkey+"X",val1);
        regVal.set(regkey+"L",val1.slice(2,4));
        regVal.set(regkey+"H",val1.slice(0,2));
        //setreg(destname,val1);
        document.getElementById(regkey+'X').innerHTML=val1;
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
        you_decide = dest.slice(-1);
        if(you_decide=="H"||you_decide=="L")
        {
            val2 = setsize("00",val2);
            if(you_decide=="H")
            {
                val2=val2+regVal.get(regkey+"L");
            }
            else val2=regVal.get(regkey+"H")+val2;
        }
        else
        {
            val2 = setsize("0000",val2);
        }
        regVal.set(regkey+"X",val2);
        regVal.set(regkey+"L",val2.slice(2,4));
        regVal.set(regkey+"H",val2.slice(0,2));
        //setreg(destname,val2);
        document.getElementById(regkey+'X').innerHTML=val2;
    }],
    ["SHR", function(source,shift){                                                                         //INSTRUCTION 10
        size = regSize.get(source);
        source = conversion(source,16,2);
        if(size==8) source = setsize("00000000",source);
        else source = setsize("0000000000000000",source);
        source = source.slice(0,size-shift);
        regkey= source.slice(0,1);
        for(i=0;i<shift;i++)
        {
            source = source.replace(/^/,"0")
        }
        source = conversion(source,2,16);
        if (size==8)
        {
            you_decide = dest.slice(-1);
            source = setsize("00",source);
            if(you_decide=="H")
            {
                source=source+regVal.get(regkey+"L");
            }
            else source=regVal.get(regkey+"H")+source;
        }
        else
        {
            source = setsize("0000",source);
        }
        regVal.set(regkey+"X",source);
        regVal.set(regkey+"L",source.slice(2,4));
        regVal.set(regkey+"H",source.slice(0,2));
        document.getElementById(regkey+'X').innerHTML=source;

    }],

    ["SHL", function(source,shift){                                                                     //INSTRUCTION 11
        size = regSize.get(source);
        source = conversion(source,16,2);
        if(size==8) source = setsize("00000000",source);
        else source = setsize("0000000000000000",source);
        source = source.slice(shift);
        regkey = source.slice(0,1);
        for(i=0;i<shift;i++)
        {
            source = source.concat("0");
        }
        source = conversion(source,2,16);
        if (size==8)
        {
            you_decide = dest.slice(-1);
            source = setsize("00",source);
            if(you_decide=="H")
            {
                source=source+regVal.get(regkey+"L");
            }
            else source=regVal.get(regkey+"H")+source;
        }
        else
        {
            source = setsize("0000",source);
        }
        regVal.set(regkey+"X",source);
        regVal.set(regkey+"L",source.slice(2,4));
        regVal.set(regkey+"H",source.slice(0,2));
        //setreg(destname,source);
        document.getElementById(regkey+'X').innerHTML=source;

    }],
    ["NOP", function(){}],["", function(){}]
]);

//inner mov functions for variations

function is_immediate(source){
    //source: can be integer or hex value 1234H
    //for hex: 4 digits(each 1-9 or A-F), ends with 'H'
    flag = true;
    const digits = source.split("");
    if(digits[digits.length-1]==="H" || digits[digits.length-1]==="h"){
        if(digits.length>5){
            return !flag;
        }
        for(let i=0;i<=digits.length-1;i++){
            if(!((digits[i]>=0 && digits[i]<=9) || (digits[i]>="A" && digits[i]<="F"))){
                return !flag;
            }
            return flag;
        }

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
    let hex = dest.slice(-2,-1);
    flag = true;
    //aleenaaa if mem isnt hex dont return false, in that case ill convert the decimal into hex in my own check
    if (hex==='H'||hex==="h"){ //value is in hex
        dest=dest.slice(1,-2);
        if(!memory.has(dest)){
            return !flag;
        }
        return flag;
    }
    return !flag;

}

function parsing(input){ //mov ax, 1234H
    input = input.toUpperCase();
    splitArray = input.split(" ");
    cmnd = splitArray[0];
    let operands = input.split(" ").slice(1).join("").split(",");
    let dest = operands[0];
    let source;

    if(!(instruction.has(splitArray[0]))){ //checks if instruction is valid
        console.log("Invalid instruction.");
        //input again
    }
    if(!(regSize.has(operands[0]) || !(isMemory(operands[0])))){ //checks if destination is valid
        console.log("Invalid destination operand.")
    }

    cmnd = splitArray[0];
    dest = operands[0];

    //check source: valid, size comparable w dest
    if (operands.length == 2){
        //operands[1]=operands[1].slice(0,-1);
        dest = operands[0];
        //if fun(dest, source)
        if(!(regSize.has(operands[1]) || isMemory(operands[1]) || is_immediate(operands[1]) || isNumber(operands[0], operands[1]))){ //immediate bhi hosakta hai
            console.log("Invalid source operand.");
            //get input again
        }
        source = operands[1];
        instruction.get(cmnd)(dest, source);
        translation(cmnd, dest, source);
    }
    else if(operands.length == 1){
        instruction.get(cmnd)(dest);
        translation(cmnd, dest);
    }
    //else for another length of instruction?
    else{
        console.log("Invalid instruction.");
        //input again
    }
}

function errordisplay(){
    // console.log("Error");
    window.prompt('ERROR SKILL ISSUE');
}

//twos comliment function
function twoscompliment(s){
    const slay = s.split("");
    for (i=0;i<slay.length;i++){
        if (slay[i]==="0"){slay[i]="1";}
        else slay[i]="0";
    }
    slaystring = slay.join('');
    slaystring=binaryAddition(slaystring,"1");
    return slaystring;
}

// binary addition
function binaryAddition(a,b){
    var result = "",
        carry = 0
    while(a || b || carry){
        let sum = +a.slice(-1) + +b.slice(-1) + carry // get last digit from each number and sum
        if( sum > 1 ){
            result = sum%2 + result
            carry = 1
        }
        else{
            result = sum + result
            carry = 0
        }
        a = a.slice(0, -1)
        b = b.slice(0, -1)
    }
    return result
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

function machinecode(opcode, d, w, reg, rm, mod){
    if(arguments.length == 6){
        byte1 = opcode + d + w;
        byte2 = mod + reg + rm;
    }
    else{
        byte1 = opcode + d + w + reg;
        byte2 = rm;
        console.log("RM: ", rm);
    }
    code = byte1 + " " + byte2;
    return code;
}

function getW(input){
    if(regSize.get(input)==8){
        return 0;
    }
    else{
        return 1;
    }
}

function translation(cmnd, dest, source){
    let d = "0"; let mod = "11"; var w; let finalCode;
    if(cmnd=="MOV" && (isMemory(dest) || isMemory(source)) ){ //mov reg, [mem]; mov [mem], reg opcode SAME as in map
        mod = "00";
        if(isMemory(dest)){ //MOV [MEM], REG
            d = 0;
            w = getW(source); //SLICE MEMORY BEFORE PASSING
            dest = dest.slice(1,-2); //removing brackets and H from memory
            dest = conversion(dest, 16, 2);
            len = dest.length;
            for(i=0;i<(16-len);i++){
                dest=dest.replace(/^/,"0");
            }
            finalCode = machinecode(opcode.get(cmnd),d,w,regCode.get(source),dest,mod);
            document.getElementById("mcode").innerHTML = finalCode;
        }
        else if(isMemory(source)){ //MOV REG, [MEM]
            d = 1;
            w = getW(dest);
            source = source.slice(1,-2); //removing brackets and H from memory
            source = conversion(source, 16, 2);
            len = source.length;
            for(i=0;i<(16-len);i++){
                source=source.replace(/^/,"0");
            }
            finalCode = machinecode(opcode.get(cmnd),d,w,regCode.get(dest),source,mod);
            document.getElementById("mcode").innerHTML = finalCode;
        }
    }//10111 00000
    else if(cmnd == "MOV" && (!isMemory(source) && !regSize.has(source))){//MOV REG, IMM(source) CAN EITHER BE DEC OR HEX
        let immcode = "101";
        d = 1; 
        w = getW(dest); let imm;
        h = source.charAt(source. length-1) 
        console.log("H:", h);
        if(h=="H" || h=="h"){//immediate value is HEX
            source = source.slice(0,-1);
            immediate = littlendian(source);
        }
        else{//decimal number
            if(source>256){
                source = conversion(source, 10, 16);
                immediate = littlendian(source);    
            }
            else{
                immediate = conversion(source, 10, 2);
            }
        }
        finalCode = machinecode(immcode,d,w,regCode.get(dest),immediate);
        document.getElementById("mcode").innerHTML = finalCode;
    }
    else{ //move and dest & source is REG OR command not move (dest and source will be reg hi ig lol)
        w = getW(dest);
        if(arguments.length == 3){
            finalCode = machinecode(opcode.get(cmnd),d,w,regCode.get(dest),regCode.get(source),mod);
            document.getElementById("mcode").innerHTML = finalCode;
        }
        else if(arguments.length == 2){
            if(cmnd=="SHR" || cmnd=="SHL"){
                d = "0";
            }
            else{
                d= "1";
            }
            finalCode = machinecode(opcode.get(cmnd),d,w,fixedreg.get(cmnd),regCode.get(dest),mod)
            document.getElementById("mcode").innerHTML = finalCode;
        }
    }
}

function littlendian(source){
    lenhex = source.length; //length of hex (number of hex digits)
    imm = conversion(source, 16, 2);//1234: 00010010 00110100->00110100 00010010
    lenbin = imm.length;
    for(i=0;i<((4*lenhex)-lenbin);i++){
        imm=imm.replace(/^/,"0"); //appends zeroes as needed
    }
    
    if(lenhex==2){
        return imm;
    }
    //IF HEX NUM>2 digits, little endian format needs to be applied
    
    else if(lenhex==4){
        imm1= imm.slice(0,8);
        imm2 = imm.slice(8,16);
    }
    else if(lenhex==3){
        imm1= imm.slice(0,4);
        imm2 = imm.slice(4,12);
        for(i=0;i<4;i++){
            imm1=imm1.replace(/^/,"0"); //appends zeroes 
        }
    }
    imm = imm2+imm1;
    return imm;
}

