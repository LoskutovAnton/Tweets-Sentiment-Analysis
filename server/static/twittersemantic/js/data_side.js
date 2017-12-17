function parseJSON(json)
{
  console.log(json);
  return JSON.parse(json);
}

function createData(json)
{
  if (json == undefined)
  {
    //json = getJSON();
    return;
  }
  var obj = parseJSON(json);
  var tweets = obj['tweets'];
  request_type = obj['type'];
  return new Array(tweets[0], tweets[1], tweets[2]);
}

function updateData(json)
{
  if (NProgress.isStarted())
  {
    NProgress.inc();
  } else
  {
    NProgress.start();
  }
  var dataset = createData(json);
  if (request_type == 0)
  {
    for (var i = 0; i < 3; i++)
    {
      if (dataset[i].length != 0)
      {
        if (dataset[i][0].text == search_DOM_element.value)
        {
          searchUpdate(color_array[i]);
        }
        NProgress.done();
        return;
      }
    }
  } else
  {
    searchResetColor();
  }
  NProgress.inc();
  updateLeftChart(dataset);
  NProgress.inc();
  updateRightChart(dataset);
  NProgress.inc();
  updateTweetContainer(dataset);
  if (request_type != 0)
  {
    restoreMainPage();
  }
  NProgress.done();
}
