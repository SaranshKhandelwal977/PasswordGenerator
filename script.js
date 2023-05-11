// handling slider function

let slider = document.querySelector(".slide");
let input = document.querySelector(".input");
let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
function handleSlider(){
    slider.value = passwordLength;
    input.innerText = passwordLength;
    const min = slider.min;
    const max = slider.max;
    slider.style.backgroundSize = ((passwordLength) *100/(20)) + "% 100%";

}
slider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

//setting the dic color according to password strength
let dataIndicator = document.querySelector(".box"); 
function setIndicator(color){
    dataIndicator.style.backgroundColor = color;
    dataIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

let uppercaseCheck = document.querySelector("#uppercase"); 
let lowercaseCheck = document.querySelector("#lowercase"); 
let numbersCheck = document.querySelector("#number"); 
let symbolsCheck = document.querySelector("#symbol"); 
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;
    if(hasUpper && hasLower && (hasNum||hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower||hasUpper)&&(hasNum || hasSym)&&passwordLength >= 6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

//getting random numbers, alphabets
let sym = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
function getRndInt(min, max){
    return Math.floor(Math.random()*(max-min)) + min;
}
function generateRandomNumber(){
    return getRndInt(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInt(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInt(65,91));
}
function generateSymbol(){
    let randNum = getRndInt(0,sym.length);
    return sym.charAt(randNum) ;
}

//setting properties on copy button using clipboard api
let copyBtn = document.querySelector(".btn-con"); 
copyBtn.addEventListener('click', () => {
    if(passwordDispaly.value){
       copyContent();
    }
})
let copyMsg = document.querySelector("[data-CopyMsg]");
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDispaly.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 1500);
}

//generating password according to selected check boxes
let passwordDispaly = document.querySelector(".password-random");
let generateBtn =  document.querySelector(".generate"); 
let allCheckBox = document.querySelectorAll("input[type=checkbox]");

function shufflePassword(array) {
    //Fisher Yates Method
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
function handleCheckBoxChange(){
    checkCount= 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });
    if(passwordLength < checkCount)
        passwordLength = checkCount;
        handleSlider();
}
allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

generateBtn.addEventListener('click', () => {
    if(checkCount == 0) 
        return;
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
    //genertae password
    //remove old password
    password = "";
{
    //stuff mentioned by checkboxes
    // if(uppercase.checked){
    //     password+= generateUpperCase();
    // }
    // if(lowercase.checked){
    //     password+= generateLowerCase();
    // }
    // if(numbers.checked){
    //     password+= generateRandomNumber();
    // }
    // if(symbols.checked){
    //     password+= generateSymbol();
    // }
}    
    let funcArr = [];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }
    //complulsary addition
    for(let i = 0; i<funcArr.length; i++){
        password += funcArr[i]();
    }
    //remaining addition
    for(let i = 0; i<passwordLength-funcArr.length; i++){
        let randIndex = getRndInt(0, funcArr.length);
        password += funcArr[randIndex]();
    }
    //shuffle passwoed
    password = shufflePassword(Array.from(password));
    passwordDispaly.value = password;
    calcStrength();
})