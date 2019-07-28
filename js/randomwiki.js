function openWikiPopup() {
    $("#wiki").popup('show');
}

$(document).ready(function() {
    // register wiki popup
    $("#wiki").popup({
        transition: 'all 0.3s',
        autoopen: false,
        escape: true,
        scrolllock: true,
        blur: true,
        onopen: function() {
            $("#wiki-pop-head").html("");
            $("#wiki-pop-text").html("");

            $.getJSON( wikiAPI, {
                action: "query",
                generator: "random",
                prop: "info|revisions|extracts",
                exsentences: 10,
                exlimit: 5,
                inprop: "url",
                grnlimit: 1,
                grnnamespace: 0,
                rvprop: "content|contentmodel",
                rvslots: "main",
                format: "json"
            })
            .done(function( data ) {
                $.each(data.query.pages, function(i, item) {
                    $("#wiki-pop-head").html("<h1>"+item.title+"</h1><a href=\""+item.fullurl+"\" target=\"_blank\">Read full article</a>");
                    $("#wiki-pop-text").html(item.extract);
                    $("#wiki-pop-text").append("<p>Source: "+wiki+".org</p>");
                });
            })
            .fail(function() {
                $("#wiki").text("Couldn\'t reach wikipedia");
            })
        }
    });
})