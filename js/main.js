var fontSizes = ['0.5em', '1em', '2em', '3em'];
var timerUpdateInterval;
var minutes, seconds;
var timer = 30;
var timerMode = false;
var outOfTime = false; 
var blurMode = false;
var wordLimitActive = false;
var backspaceBlockActive = false;
var wordLimit = 10;
var wordCount = 0;
var activeFS = 2; //font size for textarea
var darkmode = false;
var overlay = false;

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

    // register events
    $textarea.on('input', updateText);
    $textarea.on('keydown', handleKeydown);

    // set default font size
    setFontSize();

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

    $('#random-image-popup').popup({
        background: false,
        horizontal: 'right',
        vertical: 'bottom',
        autoopen: false,
        keepfocus: false,
        autozindex: true,
        blur: false,
        onclose: function() {
            $("#checkboxPicture").prop("checked", false);
        },
        onopen: function() {
            // Load a random image
    $('#random-image-popup').html('<img class="random-image-popup_close" src="https://picsum.photos/400/300.jpg">');
        }
    });

    // when user clicks on textarea
    $("#textarea").click(function() {
        // hide "quick settings" popup
        $("#quick-settings").animate({
            bottom: "-8rem",
            opacity: "0.1"
        }, 200)
    })

    // when user clicks on "quick settings"
    // then show the whole popup
    $( "#qs-click" ).click(function() {
        $("#quick-settings").animate({
            bottom: "1em",
            opacity: "1"
        }, 500)
        
    });

    $("#darkModeButton").on('click', function(){
        if(darkmode)
        {
            $("#stylesheet").prop('disabled', true);
            $("#darkModeButton").text("Dark Mode 👻");
            darkmode = false;
        } else {
            $("#stylesheet").prop('disabled', false);
            $("#darkModeButton").text("Bright Mode 🌞");
            darkmode = true;
        }
    });

    // blur text if blindmode is actuve
    if($("#checkboxBlind").prop("checked")) {
        toggleBlur();
    }

}) // If dec ready end

// 
function starteDieMaschine() {
    wordLimit = parseInt($("#maxwordcountInput").val(), 10);
    $textarea.attr("contenteditable", true);
    $textarea.text("");
    $textarea.focus();

    $("#maxwords").text('/' + wordLimit);
    $('#start-popup').popup('hide');

    if($("#checkboxTimer").prop("checked"))
    {
        timerMode = true;
        timer = parseInt($("#timerInput").val(), 10)*60;
        $("#timer-ui").show();
    } else {
        timerMode = false;
        $("#timer-ui").hide();
    }

    if($("#checkboxWordLimit").prop("checked"))
    {
        $("#wordcount-ui").show();
        $("#maxwords").css("display", inline);
        wordLimitActive = true
    } else {
        $("#maxwords").css("display", "none");
        wordLimitActive = false;
    }

    if($("#checkboxBackspace").prop("checked"))
    {
        backspaceBlockActive = true;
    } else {
        backspaceBlockActive = false;
    }

    if($("#checkboxOverlay").prop("checked")) 
    {
        $("#overlay-wrapper").show();
        $("#overlay").css("display", "flex");
        overlay = true;
    } 

    if($('#checkboxPicture').prop("checked")) {
        $('#random-image-popup').popup('show');
    }

    if(timerMode) {
        timerUpdateInterval = setInterval(startTimer, 1000);
    }
}

function handleKeydown(event) 
{
    // capturing event
    event = event || window.event;

    // if set, prevent the backspace key to do its thing
    if(backspaceBlockActive)
    {
        if(event.keyCode === 8) // "8" = Backspace
        { 
            if (typeof (event.preventDefault) == 'function') event.preventDefault();
            
            return false;
        }
    }

    // If word limit is set call the function
    if(wordLimitActive)
    {
       if (countWords() + 1 > wordLimit)
        {
            // the next time the user hits space
            if(event.keyCode === 32) // "32" = space
            { 
                setInputLock(true);
                toggleResults();
                
                blurMode = false;
                $textarea.removeClass("active");
                // preventing the space key from doing something else at this point
                if (typeof (event.preventDefault) == 'function') event.preventDefault();
                return false;
            }
        }
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

            $textarea.css("display", "none");

            setInputLock(true);
            toggleBlur();
            toggleResults();
        }
    }
    
    document.getElementById("timer").innerText = minutes + ":" + seconds;
}

function toggleBlur() {
    if (outOfTime == true ) {
        blurMode = false;
        $textarea.removeClass("active");
    } else {
        $textarea.toggleClass("active");
    }
}

function toggleTimer() {
    if(timerMode) {
        clearInterval(timerUpdateInterval);
    }
}

function togglePicture() {
    $('#random-image-popup').popup('toggle');
}

function toggleOptions() {
    $options.toggle();
}

function toggleResults() {
    $("#results-popup").popup('show');
    setInputLock(true);
}

// toggles the overlay
function toggleOverlay() {
    var $wcui = $("#wordcount-ui");
    var $ol = $("#overlay");

    // always show the wordcount
    $wcui.show();

    if (overlay) {
        $("#overlay").animate({
            opacity: 0,
            height: 0
        }, 500);
        overlay = false;
    } else {
        
        $ol.css("display", "flex");
        $("#overlay-wrapper").show();

        $("#overlay").animate({
            opacity: 0.7,
            height: "3em",
            display: "flex"
        }, 500);
        overlay = true;
    }
}

// returns the current word count
function countWords() {
    // split the content of the textarea and filter empty fields
    var currentTextareaContent = $textarea.text().split(/\s+/).filter(function(el) { return el });
    var count = currentTextareaContent.length;
    
    return count;
}

// returns the currently selected font size
function getCurrentFontSize() {
    return fontSizes[activeFS];
}

// increases the selected fontsize by one
function increaseFontSize() {
    if(activeFS + 1 < fontSizes.length)
    {
        activeFS += 1; 
    }

    setFontSize();
}

// decreases font size by one
function decreaseFontSize() {
    // prevent font size become 0 or less
    if(activeFS - 1 >= 0)
    {
        activeFS -= 1;
    }

    setFontSize();
}

// set font size for the text area
// and show the current selecting on the front end
function setFontSize() {
    $textarea.css("font-size", getCurrentFontSize());
    $("#currentFontSize").html(getCurrentFontSize());
}

function updateText(event)
{
    var textContent = $textarea.text();
    var $wc = $(".wordcount");              // get all elements with this classname 

    wordCount = countWords();
    $("#typedtext").text( textContent );
    
    $wc.eq(0).text(wordCount);
    $wc.eq(1).text(wordCount);
}

function setInputLock(state) {
    if(state) {
        $textarea.attr("contenteditable", true);
    } else {
        timerMode = false;
        $textarea.attr("contenteditable", false); 
    }
}