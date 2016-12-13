'use strict';

var state = {
    questionsAsked: 6,
    i_currentQuestion: 0,
    n_correct: 0,
    questionSubset: []
};

// data-oriented functions ::
function initQuestions() {
    // returns the subset of the questions we're going to actually ask
    var question_n = state.questionsAsked;
    var allQs = Object.create(questions);
    state.questionSubset = scrambler(allQs, question_n);
}

function getQuestion() {
    // returns an object containing
    //  .q: a question in string form
    //  .a: our four possible answers in randomized order
    var Q = state.questionSubset[state.i_currentQuestion];
    var answers = [ Q.ans1, Q.ans2, Q.ans3, Q.ans4 ];
    var scrambled = scrambler(answers, answers.length);

    state.i_currentQuestion < state.questionsAsked && state.i_currentQuestion++;
    return { q:Q.question, k:Q.no, a:scrambled };
}

function scrambler(array, n_vals) {
    // input:  array
    // output: array of length n_vals, chosen randomly from the input.
    // For a randomized version of `array`, use scrambler(array, array.length);
    var outArray = [];
    for ( ; n_vals; n_vals--) {
        var len = array.length;
        var cur = array.splice( Math.floor(Math.random() * len), 1 )[0];
        outArray.push(cur);
    }
    return outArray;
}




// display and event-oriented functions ::
function resultsAction() {
    $('.js-heading').html('<h1 class="game-end">You did it!</h1>');
    $('.js-text').html(`<p>You got ${state.n_correct} of ${state.questionsAsked} right</p>`
                       + '<p>Click to play again.<p>');
    $('.js-widget').addClass('hidden');

    $('button').text('Again?');
    $('button').off();
    $('button').click(introAction);    // start all over again
}

function evalQ(currentQ, pressedButton) {
    var i = currentQ.k;
    var realAnswer = questions[i].ans4; // global `questions`
    var theirAnswer = currentQ.a[pressedButton - 1];
    if (theirAnswer == realAnswer) {
        $('.js-heading').html('<h1 class="question-right">You\'re right!</h1>');
        state.n_correct++;
    } else {
        $('.js-heading').html('<h1 class="question-wrong">No, no, no</h1>');
    }
    $('.js-text').html('<p>'+currentQ.q+' '+realAnswer+'.</p>').removeClass('hidden');
}


function queResponseAction(currentQ) {
    var pressedButton = $('input[name=q_1]:checked').val();
    if (pressedButton) {
        $('.js-question').addClass('hidden');

        evalQ(currentQ, pressedButton);
        $('.ques_k_of_n').addClass('hidden');
        $('.n-right').text(state.n_correct);
        $('.n-wrong').text(state.i_currentQuestion - state.n_correct);

        $('button').off();
        if (state.i_currentQuestion != state.questionsAsked) {
            $('button').click(function(event){
                questionsAction();
            });
        } else {
            $('button').text('You\'re done!');
            $('button').click(function(event){
                resultsAction();
            });
        }
    }
}


function displayQuestions(currentQ) {
    $('.js-heading h1').text(currentQ.q);
    for (var i = 0; i <  currentQ.a.length; i++)
        $(`label[for=ans-${i+1}]`).text(currentQ.a[i]);

    $('.js-question').removeClass('hidden');
    $('#ans-1').prop("checked", true).focus();
}

function updateWidget() {
    $('.k').text(state.i_currentQuestion);
    $('.n').text(state.questionsAsked);
    $('.js-widget').removeClass('hidden');
    $('.ques_k_of_n').removeClass('hidden');
}

function questionsAction() {
    var currentQ = getQuestion();
    displayQuestions(currentQ);
    updateWidget();

    // hide text & update styling
    $('.js-text').addClass('hidden');
    $('h1').removeClass();
    $('button').text('OK');

    // next event  --  add ENTER functionality
    $('button').off();
    $('button').click(function(){
        queResponseAction(currentQ);
    });
}

var introState = {           // clone of the initial state of our page
    heading: $('.js-heading').html(),
    text: $('.js-text').html(),
    button: $('button').text()
};
function introAction() {
    console.log('we here fam');
    initQuestions();

    $('.js-heading').html(introState.heading);
    $('.js-text').html(introState.text);
    $('button').text(introState.button);
    $('button').focus();

    $('.js-widget').addClass('hidden'); // hide status widget

    $('button').off();
    $('button').click(questionsAction);
}

$(document).ready(function(event) {
    introAction();
});
