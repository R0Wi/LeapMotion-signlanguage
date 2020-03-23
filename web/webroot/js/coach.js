// alphabet letters
const alphabet = 'abcdefghijklmnopqrstuvwxyz';

// threshold to accept shown hand figure by user
const probabilityThreshold = 0.75;

// poll interval
const interval = 500;

// first character a
var goal = 'a';

// recent comment state
var recentCommentState = '';

// poll timer
var pollTimer = null;

// timer running flag
var timerRunning = false;

// comments on player result
const comments =
{
  "perfect":
  [
    "Well done !",
    "You have made it !",
    "This can only be done by a professional !",
    "Hats off, well done !",
  ],
  "super":
  [
    "So close !",
    "On target by a hair's breadth !",
    "Only a few percent to go !",
    "The goal is very close !"
  ],
  "good":
  [
    "Quite acceptable, but there's more !",
    "Already better, but not perfect yet !",
    "Almost there !",
    "There is not much left to reach the goal !"
  ],
  "bad":
  [
    "I'm sure you can do better than that !",
    "Try it again !",
    "I can't accept that !",
    "Well, that wasn't very good.",
    "There's still a long way to go."
  ]
};

function checkPrediction()
{
  if (!timerRunning)
    return;

  $.get('/currentPrediction', '', function(data, textStatus, jqXHR)
  {
      if (data.hasData)
      {
        var probabilityTable = data["probs"];

        setRecognizedImage(probabilityTable);

        var prob = getProbability(goal, probabilityTable);

        if (prob > probabilityThreshold)
        {
          var nextIndex = Math.floor(Math.random() * alphabet.length);

          if (alphabet[nextIndex] == goal)
          {
            nextIndex = (nextIndex + 1) % alphabet.length;
          }

          showNextLetterModal(goal, prob);

          var nextChar = alphabet[nextIndex];
          goal = nextChar;

          $('#demandedLetterImage').attr('src', 'img/alphabet/' + nextChar + '.png');

          return;
        }

        setProbabilityToUi(prob, probabilityTable);
      }
      else
      {
        setProbabilityToUi(0);
      }
  });
}

function showNextLetterModal(letter, prob)
{  
  stopPollTimer();

  clearView();

  $('#modalNextLetterImage').attr('src', 'img/alphabet/' + letter + '.png');  
  $('#modalNextLetterText').html('You\'ve learned the <b>' + letter.toUpperCase() + ' </b>letter successfully.');
  $('#modalNextLetterComment').text(getComment('perfect'));
  $('#modalNextLetterAccurency').html('Accurency : <b>' + (prob * 100).toFixed(2) + ' </b>%');

  // show modal window
  $('#modalNextLetter').modal('show');
}

function stopPollTimer()
{
  // set timer running flag
  timerRunning = false;

  // stop poll timer
  clearInterval(pollTimer);
}

// reset view for next letter
function clearView()
{
  // set progressbar value to 0
  setProgressbarValue(0);

  // set comment text
  $('#comment').text('');
}

function getProbability(demandedLetter, probabilityTable)
{
  for (let i = 0; i < probabilityTable.length; i++)
  {
    const currentLetter = probabilityTable[i][0];

    if (currentLetter == demandedLetter)
      return probabilityTable[i][1];
  }

  return 0;
}

function setProbabilityToUi(probability)
{
  const rounded = Math.round(probability * 100);

  $('#current_char_match_text').text(rounded + " %");

  // calculate third of threshold
  // const thirdThreshold = (probabilityThreshold / 3) * 100;
  const thirdThreshold = 100 / 3;

  var bgClass = null;

  var commentState = '';
  var comment = null;

  // determine progress bar color
  if (probability == 0)
  {
    bgClass = '';

    // reset recognized image
    $('#recognizedLetterImage').attr('src', '');

    // set comment
    $('#comment').text('No hand detected !');

    // set recent comment state
    recentCommentState = '';
  }
  else if (rounded < thirdThreshold)
  {
    // set progressbar color to red
    bgClass = 'bg-danger';

    // set comment
    comment = getComment('bad');

    // set comment state
    commentState = 'bad';
  }
  else if (rounded < thirdThreshold * 2)
  {
    // set progressbar color to yellow
    bgClass = 'bg-warning';

    // set comment
    comment = getComment('good');

    // set comment state
    commentState = 'good';
  }
  else
  {
    // set progressbar color to green
    bgClass = 'bg-success';

    // set comment and comment state
    if (rounded < thirdThreshold * 3)
    {
      comment = getComment('super');
      commentState = 'super';
    }
    else
    {
      comment = getComment('perfect');
      commentState = 'perfect';
    }
  }

  // remove color classes of progress bar
  $('#current_char_match_progress').removeClass('bg-danger');
  $('#current_char_match_progress').removeClass('bg-warning');
  $('#current_char_match_progress').removeClass('bg-success');

  // set color of progress bar
  if (bgClass)
  {
    $('#current_char_match_progress').addClass(bgClass);

    if (recentCommentState != commentState)
    {
      // set comment text
      $('#comment').text(comment);

      // set recent comment state
      recentCommentState = commentState;
    }
  }

  // set progress bar value
  setProgressbarValue(rounded);
}

// set progressbar value
function setProgressbarValue(value)
{
  $('#current_char_match_progress').css('height', value + '%').attr('aria-valuenow', value);
  $('#current_char_match_progress').text(value + ' %');
}

// get random text of given categorie
function getComment(probability)
{
  return comments[probability][Math.floor(Math.random() * comments[probability].length)];
}

// set recognized image
function setRecognizedImage(probabilityTable)
{
  var recognizedLetter = null;

  probabilityTable.forEach(element =>
  {
    if (recognizedLetter == null)
    {
      recognizedLetter = element;
      return;
    }

    if (element[1] > recognizedLetter[1])
      recognizedLetter = element;
  });

  $('#recognizedLetterImage').attr('src', 'img/alphabet/' + recognizedLetter[0] + '.png');
}

 // window on load event
$(window).on('load',function()
{
  var delayMs = 500; // delay in milliseconds

  setTimeout(function()
  {
    // show modal window
    $('#modalStartup').modal('show');
  }, delayMs);
});

// startup modal hide event
$('#modalStartup').on('hidden.bs.modal', function (e)
{
  // start poll timer
  startPollTimer();

  // set threshold indicator
  $('.bar-step').css('bottom', 'calc(' + probabilityThreshold * 100 + '%  - 1.1rem)');
  $('.label-percent').text(probabilityThreshold * 100 + '%');
})

// next letter modal hide event
$('#modalNextLetter').on('hidden.bs.modal', function (e)
{
  // start poll timer
  startPollTimer();
})

// function to start poll timer
function startPollTimer()
{
  // set timer running flag
  timerRunning = true;

  pollTimer = setInterval(function ()
  {
    // Poll server for current prediction
    checkPrediction();
  }, interval);
}

$( "#helpButton" ).click(function()
{
  stopPollTimer();

  // show modal help window
  $('#modalHelp').modal('show');
});

// help modal hide event
$('#modalHelp').on('hidden.bs.modal', function (e)
{
  // start poll timer
  startPollTimer();
})