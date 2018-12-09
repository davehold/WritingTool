var fontSizes = ['0.5em', '1em', '2em', '3em'];
var textarea = document.getElementById("textarea");
var options = document.getElementById("options");
var header = document.getElementById("header");
var results = document.getElementById("results");
var timerUpdateInterval;
var duration, minutes, seconds;
var timer = 30;
var timerMode = false;
var outOfTime = false; 
var blurMode = false;
var wordLimitActive = false;
var backspaceBlockActive = false;
var wordLimit = 10;
var inputLock = false;
var showOverlay = false;
var activeFS = 2; //font size for textarea

// deactivate textarea
textarea.setAttribute("contenteditable", false);

// set default font size
setFontSize();

// register events
textarea.addEventListener('input', updateText);
textarea.addEventListener('keydown', handleKeydown);

// hotfix to make sure blurred text gets blurred again
// i'am too lazy to fiddle with the checkbox states, reloading
// and stuff. you know. don't bother me. thanks.
if(document.getElementById("checkboxBlind").checked == true && blurMode == true) {
    toggleBlur();
}

// activate input, deactivate preferences
function starteDieMaschine() {
    wordLimit = parseInt(document.getElementById("maxwordcountInput").value, 10);
    document.getElementById("maxwords").innerText = wordLimit;
    textarea.setAttribute("contenteditable", true);
    textarea.innerText = "";
    textarea.focus();

    toggleOptions();
    toggleHeader();
    toggleResults();

    if(document.getElementById("checkboxTimer").checked == true)
    {
        timerMode = true;
        timer = parseInt(document.getElementById("timerInput").value, 10)*60;
    } else {
        timerMode = false;
    }

    if(document.getElementById("checkboxWordlimit").checked == true)
    {
        document.getElementById("maxwords").style.display = "inline";
        wordLimitActive = true
    } else {
        document.getElementById("maxwords").style.display = "none";
        wordLimitActive = false;
    }

    if(document.getElementById("checkboxBackspace").checked == true) 
    {
        backspaceBlockActive = true;
    } else {
        backspaceBlockActive = false;
    }

    if(document.getElementById("checkboxOverlay").checked == true) 
    {
        toggleOverlay();
    }

    if(timerMode) {
        timerUpdateInterval = setInterval(startTimer, 1000);
    }
}

function toggleGridLayout() {
    if(document.getElementById("body").className == "gridlayout") {
        document.getElementById("body").classList.remove("gridlayout");
        document.getElementById("body").classList.add("gridlayout-fullscreen");
    } else {
        document.getElementById("body").classList.remove("gridlayout");
        document.getElementById("body").classList.remove("gridlayout-fullscreen");
        document.getElementById("body").classList.add("gridlayout");
    }
}

function toggleOptions() {
    if(options.style.display == "none")
    {
        options.style.display = "block";
    } else {
        options.style.display = "none";
    }
}

function toggleHeader() {
    if(header.style.display == "none")
    {
        header.style.display = "block";
    } else {
        header.style.display = "none";
    }
}

function toggleResults() {
    if(results.style.display == "none")
    {
        results.style.display = "block";
    } else {
        results.style.display = "none";
    }
}


function handleKeydown(event) 
{
    if(backspaceBlockActive)
    {
        event = event || window.event;
        
        if(event.keyCode === 8) 
        { 
            if (typeof (event.preventDefault) == 'function') event.preventDefault();
            
            return false;
        }
    }

    if(wordLimitActive)
    {
        if (countWords() >= wordLimit)
        {
            if(event.keyCode === 32) 
            { 
                if(timerMode)
                {
                    // this will trigger the timer function
                    // which does the rest
                    timer = 0;
                } else {

                    setInputLock(true);             
                    toggleBlur();
                    toggleResults();
                    toggleHeader();   
                    textarea.style.display = "none";
                }

                if (typeof (event.preventDefault) == 'function') event.preventDefault();
                
                return false;
            }
            
        }
    }
}

function updateText(event)
{
    var textContent = textarea.innerText;
    
    document.getElementById("typedtext").innerText = textContent;
    document.getElementsByClassName("wordcount")[0].innerText = countWords();
    document.getElementsByClassName("wordcount")[1].innerText = countWords();
    console.log("text updated");
}

function setInputLock(state) {
    if(state) {
        textarea.removeAttribute("contenteditable");
        
    } else {
        timerMode = false;
        textarea.setAttribute("contenteditable", true);
    }
}

function startTimer() {
    if(!outOfTime)
    {
        var currentDate = new Date();            

        minutes = parseInt(timer / 60, 10)
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        if (timer-- <= 0) {
            blurMode = false;
            outOfTime = true;

            minutes = "00";
            seconds = "00";

            textarea.style.display = "none";

            setInputLock(true);
            toggleBlur();
            toggleResults();
            toggleHeader();
            
            console.log("timer ran out of tape");
        }
    }
    
    document.getElementById("timer").innerText = minutes + ":" + seconds;
}

function toggleBlur() {
    if(document.getElementById("checkboxBlind").checked == true) 
    {
        blurMode = true;
        textarea.setAttribute("class", "active");
    } else {
        blurMode = false;
        textarea.setAttribute("class", "");
    }

    if (outOfTime == true ) {
        blurMode = false;
        textarea.setAttribute("class", "");
    }
}

function toggleTimer() {
    if(timerMode) {
        clearInterval(timerUpdateInterval);
    }
}

function getCurrentWord() {
    var lastWord = textarea.innerText.split(' ').pop();
    
    return lastWord;
}

function countWords() {
    var currentTextareaContent = textarea.innerText.split(' ');
    var wordcount = currentTextareaContent.length;
    
    return wordcount;
}

function toggleBackspaceBlock() {
    if(!backspaceBlockActive)
    {
        backspaceBlockActive = true;
    } else {
        backspaceBlockActive = false;
    }
}

function toggleOverlay() {
    if(document.getElementById("checkboxOverlay").checked == true) 
    {
        document.getElementById("overlay").style.display = "block";
        showOverlay = true;
    } else {
        document.getElementById("overlay").style.display = "none";
        showOverlay = false;
    }
}

function getCurrentFontSize() {
    return fontSizes[activeFS];
}

function setFontSize() {
    document.getElementById("textarea").style.fontSize = getCurrentFontSize();
    document.getElementById("currentFontSize").innerHTML = getCurrentFontSize();
}

function increaseFontSize() {
    //array
    if(activeFS + 1 < fontSizes.length)
    {
        activeFS += 1;
    }

    setFontSize();
}

function decreaseFontSize() {
    if(activeFS - 1 >= 0)
    {
        activeFS -= 1;
    }

    setFontSize();
}
