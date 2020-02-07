$(function () {
    for (var i = 0; i <= 3; i++){
        var randNum = Math.floor((Math.random() * 6) + 0);
        var elem = $('<div class="itemss" data-color=""></div>');
        elem.attr('data-color', Config.colors[randNum]);
        elem.addClass('bg-' + Config.colors[randNum])
        elem.attr('data-checked', false)
        Config.solution.push(elem)
    }
    // for (var j = 0; j <= Config.solution.length; j++){
    //     $('.solution').append(Config.solution[j])
    // }
    $('.itemsColored').each(function (i) {
        $(this).addClass('bg-' + Config.colors[i]);
        $(this).attr('data-color', Config.colors[i])
        Config.colorsItems.push($(this));
        
    });
    Config.colorsItems.forEach(function (element) {
        element.on('click', function () {
            $('.items').eq(Config.response.length).addClass('bg-' + $(this).attr('data-color'));
            $('.items').eq(Config.response.length).attr('data-color', $(this).attr('data-color'));
            $('.items').eq(Config.response.length).attr('data-checked', false);
            if (Config.response.length < 4) {
                $('.items').on('click', function () {
                    $(this).removeClass("bg-" + $(this).attr('data-color'));
                    $(this).attr('data-color', '');
                    $(this).attr('data-checked', false);
                })
                Config.response.push($('.items').eq(Config.response.length))
            }
            else {
                var color = $(this).attr('data-color');
                $('.items').each(function (i, elem) {
                    if ($(elem).attr('data-color') == '') {
                        $(elem).addClass('bg-' + color);
                        $(elem).attr('data-color', color);
                        return false;
                    }
                })
            }
        })
    });
    $('.validate').on('click', function () {
        Config.turns++;
        if (Config.turns == 11) {
            var sol = '';
            for (var j = 0; j < Config.solution.length; j++){
                sol += Config.solution[j][0].outerHTML;
            }
            $('.game').prepend($('<div class="overlay"><span>Dommage, perdu !</span><span class="solution">'+sol+'</span><span class="replay"><a href="index.html">Rejouer</a></span></div>'))
            return false;
        }
        deCheck();
        if (Config.response.length == $('.items').length) {
            if (checkDataColor()) {
                Config.finalResponse = [];
                Config.finalResponse = Config.response;
                var historyToPrepend = '';
                $(Config.finalResponse).each(function (i, elem) {
                    var dataColor = elem.attr('data-color');
                    itemz = $('<div class="itemz"></div>')
                    $(itemz).attr('data-color', dataColor);
                    $(itemz).addClass('bg-' + dataColor);
                    $(itemz).attr('data-checked', false);
                    historyToPrepend += $(itemz)[0].outerHTML;
                })
                var i;
                for (i = 0; i < Config.response.length; i++){
                    if (Config.response[i][0].attributes[1].value == Config.solution[i][0].attributes[1].value) {
                        Config.solution[i][0].attributes[2].value = "true";
                        Config.response[i][0].attributes[2].value = "true";
                        Config.hints[i] = $('<div class="flex"><div class="hintsItem bg-darkGrey" data-color="darkGrey"></div></div>');
                    }
                }
                for (var k = 0; k < Config.response.length; k++) {
                    if (Config.response[k][0].attributes[2].value == "false") {
                        for (var f = 0; f < Config.solution.length; f++){
                            if (Config.solution[f][0].attributes[2].value == "false") {
                                if (Config.response[k][0].attributes[1].value == Config.solution[f][0].attributes[1].value) {
                                    Config.solution[f][0].attributes[2].value = "true";
                                    Config.response[k][0].attributes[2].value = "true";
                                    Config.hints[k] = $('<div class="flex"><div class="hintsItem bg-grey" data-color="grey"></div></div>');
                                    break;
                                }
                            }
                        }
                    }
                }
                var hintsToAppend = '';
                for (i = 0; i < Config.hints.length; i++){
                    if (Config.hints[i] == null) {
                        Config.hints[i] = $('<div class="flex"><div class="hintsItem bg-white" data-color="white"></div></div>')
                    }
                    hintsToAppend += Config.hints[i][0].outerHTML
                }
                $('.history').prepend('<div class="historyLine"><div class="historyItems">' + historyToPrepend + '</div><div class="hints">' + hintsToAppend + '</div>')
                if (checkWin()) {
                    $('.game').prepend($('<div class="overlay"><span>Bravo c\'est gagné en '+Config.turns+' essais !</span><span class="replay"><a href="index.html">Rejouer</a></span></div>'))
                }
            }
        }
    });
});

function checkDataColor() {
    var toReturn = true;
    $(Config.response).each(function (i, elem) {
        if (elem.attr('data-color') == "") {
            toReturn = false;
            return toReturn;
        }
    })
    return toReturn;
}

function deCheck() {
    for (var i = 0; i < Config.response.length; i++){
        Config.solution[i][0].attributes[2].value = "false";
        Config.response[i][0].attributes[2].value = "false";

    }
}

function checkWin() {
    var blackPieces = 0;
    for (i = 0; i < Config.hints.length; i++){
        console.log(Config.hints[0][0].childNodes[0].attributes[1].value)
        if (Config.hints[i][0].childNodes[0].attributes[1].value == "darkGrey") {
            blackPieces++
        }
    }
    if (blackPieces == 4) {
        return true;
    }
    else {
        return false;
    }
}