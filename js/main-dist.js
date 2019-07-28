function starteDieMaschine(){wordLimit=parseInt($("#maxwordcountInput").val(),10),$textarea.attr("contenteditable",!0),$textarea.text(""),$textarea.focus(),$("#maxwords").text("/"+wordLimit),$("#start-popup").popup("hide"),wikiAPI="https://"+lang+"."+wiki+".org/w/api.php?callback=?",$("#checkboxTimer").prop("checked")?(timerMode=!0,timer=60*parseInt($("#timerInput").val(),10),$("#timer-ui").show()):(timerMode=!1,$("#timer-ui").hide()),$("#checkboxWordLimit").prop("checked")?($("#wordcount-ui").show(),$("#maxwords").css("display","inline"),wordLimitActive=!0):($("#maxwords").css("display","none"),wordLimitActive=!1),backspaceBlockActive=!!$("#checkboxBackspace").prop("checked"),$("#checkboxOverlay").prop("checked")&&($("#overlay-wrapper").show(),$("#overlay").css("display","flex"),overlay=!0),$("#checkboxPicture").prop("checked")&&$("#random-image-popup").popup("show"),timerMode&&(timerUpdateInterval=setInterval(startTimer,1e3)),$("#checkboxRNDArticle").prop("checked")&&(articleTimer=setInterval(openWikiPopup,6e4*$("#articleTimerInput").val())),$("#checkboxOWM").prop("checked")&&(owm=!0)}function handleKeydown(e){if(e=e||window.event,backspaceBlockActive&&8===e.keyCode)return"function"==typeof e.preventDefault&&e.preventDefault(),!1;if(32===e.keyCode||13===e.keyCode){if(owm&&(owm_stack+=$textarea.text(),$textarea.text(""),13===e.keyCode))return"function"==typeof e.preventDefault&&e.preventDefault(),!1;if(wordLimitActive){var t=0;owm&&(t=1),wordLimit<=wordCount+t&&32===e.keyCode&&(setInputLock(!0),toggleResults(),blurMode=!1,$textarea.removeClass("active"))}}}function startTimer(){outOfTime||(new Date,minutes=parseInt(timer/60,10),seconds=parseInt(timer%60,10),minutes=minutes<10?"0"+minutes:minutes,seconds=seconds<10?"0"+seconds:seconds,timer--<=0&&(outOfTime=!(blurMode=!1),seconds=minutes="00",$textarea.css("display","none"),setInputLock(!0),toggleBlur(),toggleResults())),document.getElementById("timer").innerText=minutes+":"+seconds}function toggleBlur(){1==outOfTime?(blurMode=!1,$textarea.removeClass("active")):$textarea.toggleClass("active")}function toggleTimer(){timerMode&&clearInterval(timerUpdateInterval)}function togglePicture(){$("#random-image-popup").popup("toggle")}function toggleOptions(){$options.toggle()}function toggleResults(){$("#results-popup").popup("show"),setInputLock(!0)}function toggleOverlay(){var e=$("#wordcount-ui"),t=$("#overlay");e.show(),overlay?($("#overlay").animate({opacity:0,height:0},500),overlay=!1):(t.css("display","flex"),$("#overlay-wrapper").show(),$("#overlay").animate({opacity:.7,height:"3em",display:"flex"},500),overlay=!0)}function countWords(e){return e.split(/\s+/g).filter(function(e){return e}).length}function getCurrentFontSize(){return fontSizes[activeFS]}function increaseFontSize(){activeFS+1<fontSizes.length&&(activeFS+=1),setFontSize()}function decreaseFontSize(){0<=activeFS-1&&(activeFS-=1),setFontSize()}function setFontSize(){$textarea.css("font-size",getCurrentFontSize()),$("#currentFontSize").html(getCurrentFontSize()),$("#qscurrentFontSize").html(getCurrentFontSize())}function updateText(e){if(owm)var t=owm_stack;else t=$textarea.text();var o=$(".wordcount");wordCount=countWords(t),$("#typedtext").text(t),o.eq(0).text(wordCount),o.eq(1).text(wordCount)}function setInputLock(e){e?$textarea.attr("contenteditable",!0):(timerMode=!1,$textarea.attr("contenteditable",!1))}function setLanguage(e){lang=e.value}function setWiki(e){wiki=e.value}var timerUpdateInterval,articleTimer,minutes,seconds,$textarea,$options,$header,$results,fontSizes=["0.5em","1em","1.5em","2em","2.5em","3em","3.5em","4em"],timer=30,timerMode=!1,outOfTime=!1,blurMode=!1,wordLimitActive=!1,backspaceBlockActive=!1,wordLimit=10,wordCount=0,activeFS=2,darkmode=!1,overlay=!1,lang="en",wiki="wikipedia",wikiAPI="https://"+lang+"."+wiki+".org/w/api.php?callback=?",owm=!1,owm_stack="";$(document).ready(function(){$textarea=$("#textarea"),$options=$("#options"),$header=$("#header"),$results=$("#results"),$textarea.attr("contenteditable","false"),$textarea.on("input",updateText),$textarea.on("keydown",handleKeydown),setFontSize(),$("#start-popup").popup({transition:"all 0.3s",autoopen:!0,opacity:.2,escape:!1,scrolllock:!0,blur:!1}),$("#results-popup").popup({transition:"all 0.3s",autoopen:!1,opacity:.2,escape:!1,scrolllock:!0,blur:!1}),$("#random-image-popup").popup({background:!1,horizontal:"right",vertical:"bottom",autoopen:!1,keepfocus:!1,autozindex:!0,blur:!1,onclose:function(){$("#checkboxPicture").prop("checked",!1)},onopen:function(){$("#random-image-popup").html('<img class="random-image-popup_close" src="https://picsum.photos/400/300.jpg">')}}),$("#textarea").click(function(){$("#quick-settings").animate({bottom:"-13em",opacity:"0.1"},200)}),$("#qs-click").click(function(){$("#quick-settings").animate({bottom:"1em",opacity:"1"},500)}),$("#darkModeButton").on("click",function(){darkmode?($("#stylesheet").prop("disabled",!0),$("#darkModeButton").text("Dark Mode 👻"),darkmode=!1):($("#stylesheet").prop("disabled",!1),$("#darkModeButton").text("Bright Mode 🌞"),darkmode=!0)}),$("#checkboxBlind").prop("checked")&&toggleBlur()});
//# sourceMappingURL=main-dist.js.map