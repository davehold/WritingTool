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
var currentWordOnlyActive = false;
var showOverlay = false;

// deactivate textarea
textarea.setAttribute("contenteditable", false);

// register events
textarea.addEventListener('input', updateText);
textarea.addEventListener('keydown', handleKeydown);

// hotfix to make sure blurred text gets blurred again
// i'am too lazy to fiddle with the checkbox states, reloading
// and stuff. you know. don't bother me. thanks.
if(document.getElementById("checkboxBlind").checked == true) {
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

// f that, just reload when done
function resetEverything()
{
    //reset timer
    timer = 30;
    timerMode = false;
    outOfTime = false; 
    blurMode = false;
    wordLimitActive = false;
    backspaceBlockActive = false;
    wordLimit = 10;
    inputLock = false;
    currentWordOnlyActive = false;
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
        //console.log(event.keyCode);
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
                setInputLock(true);                
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
    document.getElementById("wordcount").innerText = countWords();

    //document.getElementById("lastWord").innerText = getCurrentWord();
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
            minutes = "00";
            seconds = "00";

            // block input 
            //document.getElementById("textarea").removeAttribute("contenteditable");
            setInputLock(true);
            toggleBlur();
            toggleOptions();
            console.log("timer ran out of tape");
            outOfTime = true;
        }
    }
    
    document.getElementById("timer").innerText = minutes + ":" + seconds;
}

function toggleBlur() {
    if(!blurMode) {
        blurMode = true;
        //textarea.setAttribute("class", "blur");
        textarea.setAttribute("class", "active");
    } else {
        blurMode = false;
        //textarea.setAttribute("class", "unblur");
        textarea.setAttribute("class", "");
    }
}

function toggleTimer() {
    if(!timerMode) {
        //timerMode = true;
        // debug stuff... document.getElementById("timerMode").innerText = "Timer Mode is ON";
        //timer = parseInt(document.getElementById("timerInput").value, 10)*60;
    } else {
        //timerMode = false;
        //document.getElementById("timerMode").innerText = "Timer Mode is OFF";
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

function toggleWordLimit() {
    if(!wordLimitActive)
    {
        //document.getElementById("maxwords").style.display = "inline";
        //wordLimitActive = true;
    } else {
        //document.getElementById("maxwords").style.display = "none";
        //wordLimitActive = false;
    }
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

    //var oobj = document.getElementById("overlay");
    /*if(oobj.style.display == "block")
    {
        //oobj.style.width = "1%";
        //oobj.style.height = "1%";
        //document.getElementById("overlay").style.display = "none";
        //oobj.classList.toggle("overlay-shrink");
    } else {
        //oobj.style.width = "10%";
        //oobj.style.height = "10%";
        //oobj.classList.remove("overlay-shrink");
       // oobj.classList.toggle("overlay-shrink");
        document.getElementById("overlay").style.display = "block";
    }*/
}
