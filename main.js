var textarea = document.getElementById("textarea");
var options = document.getElementById("options");
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

// deactivate textarea
textarea.setAttribute("contenteditable", false);

// register events
textarea.addEventListener('input', updateText);
textarea.addEventListener('keydown', handleKeydown);

// activate input, deactivate preferences
function starteDieMaschine() {
    timer = parseInt(document.getElementById("timerInput").value, 10)*60;
    
    textarea.setAttribute("contenteditable", true);
    textarea.innerText = "";
    textarea.focus();

    toggleOptions();
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

function toggleOptions() {
    if(options.style.display == "none")
    {
        options.style.display = "block";
    } else {
        options.style.display = "none";
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
}

function updateText(event)
{
    var textContent = textarea.innerText;
    
    document.getElementById("typedtext").innerText = textContent;
    document.getElementById("wordcount").innerText = countWords();

    if(wordLimitActive)
    {
        if (countWords() >= wordLimit)
        {
            toggleInputLock(false);
        }
    }

    //document.getElementById("lastWord").innerText = getCurrentWord();
}

function toggleInputLock(state) {
    if(!state) {
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
            toggleInputLock(false);
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
        timerMode = true;
        // debug stuff... document.getElementById("timerMode").innerText = "Timer Mode is ON";
        timerUpdateInterval = setInterval(startTimer, 1000);
    } else {
        timerMode = false;
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
        wordLimitActive = true;
    } else {
        wordLimitActive = false;
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