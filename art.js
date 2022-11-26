
var div=document.createElement('button');
var divv=document.createElement('div');
var dialoguebox=document.createElement('input')
dialoguebox.style.fontSize='25px'
dialoguebox.style.fontFamily="Courier New";
div.style.fontFamily="Courier New";
dialoguebox.style.fontWeight="bolder";
div.style.fontWeight="bolder";
div.style.backgroundColor='#840037'


divv.style.borderStyle='double';
divv.style.borderColor='#840037';
//using an element that will store the register for the function to dispay the register contents
div.id='skrt';
function heelo(){
    // document.getElementById('ajeeb').appendChild(divv);
    // document.getElementById('ara').style.position='relative';
    document.getElementById('ajeeb').appendChild(divv);
    divv.id='hellos';
    console.log(document.getElementById('hellos').id);
    // document.getElementById('hellos').innerHTML='select a register';
    divv.appendChild(dialoguebox);
    dialoguebox.style.marginTop='3%';
    dialoguebox.style.width='90%';
    dialoguebox.style.height='30px';

    divv.appendChild(div);
    div.innerHTML='SUBMIT';
    div.style.marginTop='10px'
div.style.height='25%';
div.style.width='50%';
div.style.marginLeft='10px';
    document.getElementById('hellos').style.position='absolute';
    document.getElementById('hellos').style.textAlign='center';
    document.getElementById('hellos').style.height='99%';
    document.getElementById('hellos').style.width='100%';


}
document.getElementById('ara').onclick=function (){
    document.getElementById('ara').style.visibility='hidden';
heelo();
    document.getElementById('skrt').onclick=function (){
        // heelo();
        gee();
        document.getElementById('ara').style.visibility='visible';

    }
}
function gee(){
divv.parentNode.removeChild(divv);
}
// document.getElementById('btn1').onclick=function (){
//
//     document.getElementById('Ax').innerHTML+='hello';
//     document.getElementById('btn1').id='btn2';
//     document.getElementById('btn2').onclick=function (){
//         console.log(document.getElementById('btn2').id);
//         document.getElementById('Ax').innerHTML='Ax';
//         document.getElementById('btn2').id='btn1';
//          console.log(document.getElementById('btn1').id)
//     }
// }
//for making a new window from navbar
var clicker=false;
const btn1 = document.createElement('button');
btn1.id = 'menubtn1';
btn1.type='submit';

btn1.style.height='10px';
document.getElementById('n1').onclick=function () {
    console.log(clicker);

    if (!clicker) {

        const navbarExt = document.getElementById('liest')
        navbarExt.style.width = '30vw';
        document.getElementById('basic').style.visibility = 'hidden';
        clicker = true;
        // document.getElementById('n1').style.height='20%'
        // document.getElementById('byan').style.height='5%'
        console.log(clicker)
        document.getElementById('byan').appendChild(btn1);
        btn1.style.height='5%';

        }

}
btn1.onclick=function (){
    // clicker = false;
    document.getElementById('liest').style.width = '100%';
    document.getElementById('basic').style.visibility = 'visible';
    btn1.parentNode.removeChild(btn1);
    // document.getElementById('byan').style.height=0;
    // document.getElementById('n1').style.height='25%'
    return clicker=false;
}



   //  btn1.onclick =function () {
   //      if (clicker) {
   //
   //
   //      }
   //  }
   // console.log(clicker)
// btn1.onclick =function (){
//     navbarExt.style.width='5%';
//     document.getElementById('BIU').style.visibility='visible';
//     btn1.parentNode.removeChild(btn1);
//     clicked=false;
// }
