// alphabet letters
const alphabet = 'abcdefghijklmnopqrstuvwxyz';

// threshold to accept shown hand figure by user
const probabilityThreshold = 0.75;

// poll interval
const interval = 500;

// first character a
var goal = 'a';

function checkPrediction()
{
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

            var nextChar = alphabet[nextIndex];
            goal = nextChar;

            $('#demandedLetterImage').attr('src', 'img/alphabet/' + nextChar + '.png');
          }

          setProbabilityToUi(prob, probabilityTable);
        }
        else
        {
          setProbabilityToUi(0);
        }
    });
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

  // determine progress bar color
  if (probability == 0)
  {
    bgClass = "";

    // reset recognized image
    $('#recognizedLetterImage').attr('src', '');
  }
  else if (rounded < thirdThreshold)
  {
    // set progressbar color to red
    bgClass = "bg-danger";
  }
  else if (rounded < thirdThreshold * 2)
  {
    // set progressbar color to yellow
    bgClass = "bg-warning";
  }
  else
  {
    // set progressbar color to green
    bgClass = "bg-success";
  }

  // remove color classes of progress bar
  $('#current_char_match_progress').removeClass("bg-danger");
  $('#current_char_match_progress').removeClass("bg-warning");
  $('#current_char_match_progress').removeClass("bg-success");

  // set color of progress bar
  if (bgClass)
  {
    $('#current_char_match_progress').addClass(bgClass);
  }

  // set progress bar value
  $('#current_char_match_progress').css('height', rounded + '%').attr('aria-valuenow', rounded);
  $('#current_char_match_progress').text(rounded + " %");
}

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

$(document).ready(function()
{
    var pollInterval = setInterval(function()
    {
      // Poll server for current prediction
      checkPrediction();
    }, interval);

    $('.bar-step').css('bottom', 'calc(' + probabilityThreshold * 100 + '%  - 1.1rem)');
    $('.label-percent').text(probabilityThreshold * 100 + '%');
 });