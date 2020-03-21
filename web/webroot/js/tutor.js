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
          var prob = getProbability(goal, data["probs"]);

          if (prob > probabilityThreshold)
          {
            var nextIndex = Math.floor(Math.random() * chars.length);

            if (chars[nextIndex] == goal)
            {
              nextIndex = (nextIndex + 1) % chars.length;
            }

            var nextChar = chars[nextIndex];
            goal = nextChar;

            $('#realimage').attr('src', 'img/alphabet/' + nextChar + '.png');
          }

          setProbabilityToUi(prob);
          if (nextChar)
            $('#current_char_target_text').text(nextChar.toUpperCase());
        }
        else
        {
          setProbabilityToUi(0);
        }
    });
}

function getProbability(char, probabilityTable)
{
  for (let i = 0; i < probabilityTable.length; i++)
  {
    const currentChar = probabilityTable[i][0];

    if (currentChar == char)
    {
      return probabilityTable[i][1];
    }
  }

  return 0;
}

function setProbabilityToUi(probability)
{
  const rounded = Math.round(probability * 100);

  $('#current_char_match_text').text(rounded + " %");

  // Set indicator color
  const thirdThreshold = (probabilityThreshold / 3) * 100;

  var bgClass = null;

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

  $('#current_char_match_progress').removeClass("progress-bar-danger");
  $('#current_char_match_progress').removeClass("progress-bar-warning");
  $('#current_char_match_progress').removeClass("progress-bar-success");

  if (bgClass)
  {
    $('#current_char_match_progress').addClass(bgClass);
  }

  const toHundred = (1 / probabilityThreshold) * rounded;

  $('#current_char_match_progress').css('width', toHundred+'%').attr('aria-valuenow', toHundred);  
  $('#current_char_match_progress').text(rounded + " %");
}

$(document).ready(function()
{
    var pollInterval = setInterval(function()
    {
      // Poll server for current prediction
      checkPrediction();
    }, interval);
 });
