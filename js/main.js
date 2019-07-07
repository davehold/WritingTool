var fontSizes = ['0.5em', '1em', '2em', '3em'];
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

var $textarea;
var $options;
var $header;
var $results;
 
$( document ).ready(function() {
    $textarea = $("#textarea");//document.getElementById("textarea");
    $options = $("#options");
    $header = $("#header");
    $results = $("#results");
    $textarea.attr("contenteditable", "false");

    // Initialize popup plugin
    $('#start-popup').popup({
        transition: 'all 0.3s',
        autoopen: true,
        opacity: 0.2,
        escape: false,
        scrolllock: true,
        blur: false
      });

    $('#results-popup').popup({
        transition: 'all 0.3s',
        autoopen: false,
        opacity: 0.2,
        escape: false,
        scrolllock: true,
        blur: false
      });

    // register events
    $textarea.on('input', updateText);
    $textarea.on('keydown', handleKeydown);

    // set default font size
    setFontSize();

    // hotfix to make sure blurred text gets blurred again
    // i'am too lazy to fiddle with the checkbox states, reloading
    // and stuff. you know. don't bother me. thanks.
    if($("#checkboxBlind").checked == true && blurMode == true) {
        toggleBlur();
    }
})

// activate input, deactivate preferences
function starteDieMaschine() {
    wordLimit = parseInt(document.getElementById("maxwordcountInput").value, 10);
    document.getElementById("maxwords").innerText = '/' + wordLimit;
    $textarea.attr("contenteditable", true);
    $textarea.text("");
    $textarea.focus();
    $textarea.attr("placeholder", "test");

    //toggleOptions();
    //toggleHeader();

    if(document.getElementById("checkboxTimer").checked == true)
    {
        timerMode = true;
        timer = parseInt(document.getElementById("timerInput").value, 10)*60;
    } else {
        document.getElementById("timer-ui").style.display = "none";
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

/*function toggleGridLayout() {
    if(document.getElementById("body").className == "gridlayout") {
        document.getElementById("body").classList.remove("gridlayout");
        document.getElementById("body").classList.add("gridlayout-fullscreen");
    } else {
        document.getElementById("body").classList.remove("gridlayout");
        document.getElementById("body").classList.remove("gridlayout-fullscreen");
        document.getElementById("body").classList.add("gridlayout");
    }
}*/

function toggleOptions() {
    $options.toggle();
}

function toggleHeader() {
    $header.toggle();
}

function toggleResults() {
    //$results.toggle();
    setInputLock(true);
}


function handleKeydown(event) 
{
    event = event || window.event;

    if(backspaceBlockActive)
    {
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

// just a lazy hotfix to be able to toggle the blur in any situation
function forceBlurToggle() {
    if(blurMode == false) 
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
    //var currentTextareaContent = textarea.innerText.split(' ');
    var currentTextareaContent = textarea.innerText.split(/\s+/);
    var wordcount = currentTextareaContent.length;
    
    return wordcount-1;
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
        document.getElementById("overlay").style.display = "flex";
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
