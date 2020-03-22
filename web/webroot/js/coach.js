const chars = 'abcdefghijklmnopqrstuvwxyz';
const probabilityThreshold = 0.6;

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
            var nextIndex = Math.floor(Math.random() * chars.length);

            if (chars[nextIndex] == goal)
            {
              nextIndex = (nextIndex + 1) % chars.length;
            }

            var nextChar = chars[nextIndex];
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

function setProbabilityToUi(probability, probabilityTable)
{
  const rounded = Math.round(probability * 100);

  $('#current_char_match_text').text(rounded + " %");

  // Set indicator threshold
  const thirdThreshold = (probabilityThreshold / 3) * 100;

  var bgClass = null;

  // determine progress bar color
  if (probability == 0)
  {
    bgClass = "";
  }
  else if (rounded < thirdThreshold)
  {
    bgClass = "progress-bar-danger";
  }
  else if (rounded < thirdThreshold * 2)
  {
    bgClass = "progress-bar-warning";
  }
  else
  {
    bgClass = "progress-bar-success";
  }

  // remove color classes of progress bar
  $('#current_char_match_progress').removeClass("progress-bar-danger");
  $('#current_char_match_progress').removeClass("progress-bar-warning");
  $('#current_char_match_progress').removeClass("progress-bar-success");

  // set color of progress bar
  if (bgClass)
  {
    $('#current_char_match_progress').addClass(bgClass);
  }

  // convert to percent
  const toHundred = (1 / probabilityThreshold) * rounded;

  // set progress bar value
  $('#current_char_match_progress').css('height', toHundred+'%').attr('aria-valuenow', toHundred);  
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
 });
