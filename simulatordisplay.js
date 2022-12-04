document.getElementById("submitButton").onclick=function (){
    // document.getElementById('l1').classList.add('burb');
    document.getElementById('div8').classList.remove('div8');
    document.getElementById('div9').classList.remove('div9');
    document.getElementById('div6').classList.remove('div6');
    document.getElementById('div10').classList.remove('div10');
    document.getElementById('div1').classList.remove('div1');
    document.getElementById('div2').classList.remove('div2');
    document.getElementById('div3').classList.remove('div3');
    document.getElementById('div4').classList.remove('div4');
    document.getElementById('div5').classList.remove('div5');
    document.getElementById('div7').classList.remove('div8');
    document.getElementById('div11').classList.remove('div11');
    document.getElementById('div12').classList.remove('div12');
    document.getElementById('div13').classList.remove('div13');
    document.getElementById('div14').classList.remove('div14');
    components.set('PC',0);
    components.set('reg',0);
    document.getElementById('PC').classList.remove('anime');
    document.getElementById('IR').classList.remove('anime');
    document.getElementById('ax').classList.remove('anime');
    document.getElementById('bx').classList.remove('anime');
    document.getElementById('cx').classList.remove('anime');
    document.getElementById('dx').classList.remove('anime');
    document.getElementById('controller').classList.remove('anime');
    document.getElementById('processor').classList.remove('anime');
    document.getElementById('ALUU').classList.remove('anime');
    document.getElementById('ds').classList.remove('anime');
    document.getElementById('0000').classList.remove('anime');
    document.getElementById('0001').classList.remove('anime');
    document.getElementById('0002').classList.remove('anime');
    document.getElementById('0003').classList.remove('anime');
    document.getElementById('0004').classList.remove('anime');
    document.getElementById('0005').classList.remove('anime');
    document.getElementById('0006').classList.remove('anime');
    document.getElementById('0007').classList.remove('anime');
    document.getElementById('0008').classList.remove('anime');
    document.getElementById('0009').classList.remove('anime');
    document.getElementById('000A').classList.remove('anime');
    document.getElementById('000B').classList.remove('anime');
    document.getElementById('000C').classList.remove('anime');
    document.getElementById('000D').classList.remove('anime');
    document.getElementById('000E').classList.remove('anime');
    document.getElementById('000F').classList.remove('anime');
    parsing(document.getElementById('inputlainawaladabba').value);
    // document.getElementById('processor').
}


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
