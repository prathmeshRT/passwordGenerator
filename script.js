const passwordDisplay = document.querySelector("[datapassword_display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthdisplay = document.querySelector("[datalength_number]");
const inputSlider = document.querySelector("[dataLength_slider]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatebtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//set strength color to grey
setIndicator("#ccc");

//  set password length on UI
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthdisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100) / (max - min) + "% 100%";
}

//set color of indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


//generate random number
function getRandomInteger(min , max){
    return Math.floor(Math.random() * (max - min)) + min;
}

//generate random number between 0 and 9
function generateRandomNum(){
    return getRandomInteger(0,9);
}

//generate random lowercase character
function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97, 123));
}

//generate random uppercase character
function generateuppercase(){
    return String.fromCharCode(getRandomInteger(65, 91));
}

//generate random sysmbol
function generateSysmbol(){
    const rndNum = getRandomInteger(0, symbols.length);
    return symbols.charAt(rndNum);
}


//calculates strength of password
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6)
    {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function shufflePassword(array){
    //fishers yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      let str = "";
      array.forEach((el) => (str += el));
      return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
        checkCount++;
    });

    //speacial condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if(passwordDisplay){
        copyContent();
    }
})


generatebtn.addEventListener('click', () => {
    //none of the checkboxes are checked
    if(checkCount <= 0)
    return;

    if(passwordLength < checkCount)
    passwordLength = checkCount;
    handleSlider();

    //To find new password

    //remove old password
    password="";

    //putting mentioned stuff by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateuppercase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowercase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandomNum;
    // }

    // if(symbolsCheck.checked){
    //     password += generateSysmbol();
    // }

    let funcArr = [];

    //compulsory addition
    if(uppercaseCheck.checked)
        funcArr.push(generateuppercase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNum);

    if(symbolsCheck.checked)
        funcArr.push(generateSysmbol);

    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordLength - funcArr.length;i++){
        let rndIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[rndIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
});