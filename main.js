var textarea = document.getElementById("textarea");
        var timerUpdateInterval;
        var duration, minutes, seconds;
        var timer = 30;
        var timerMode = false;
        var blurMode = false;
        var wordLimitActive = false;
        var backspaceBlockActive = false;
        var wordLimit = 10;
        var inputLock = false;
        var currentWordOnlyActive = false;

        // register events
        textarea.addEventListener('input', updateText);
        textarea.addEventListener('keydown', handleKeydown);
        
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
                if (countWords() > wordLimit)
                {
                    toggleInputLock(false);
                }
            }

            document.getElementById("lastWord").innerText = getCurrentWord();
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
            var wordcount = textarea.innerText.split(' ').length;
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