function restoreMainPage()
{
  clearInterval(animateChartsTimer);
  var leftAnimateChart = document.getElementById("leftAnimateChart");
  var searchHint = document.getElementById("searchHint");
  var leftChart = document.getElementById("leftChart");
  var rightChart = document.getElementById("rightChart");
  var tweetsContainer = document.getElementById("tweetsContainer");
  leftAnimateChart.style.display = 'none';
  searchHint.style.display = 'none';
  leftChart.style.display = 'block';
  rightChart.style.display = 'block';
  tweetsContainer.style.display = 'flex';
}

function searchResetColor()
{
  search_DOM_element.style.background = white_color;
}

function searchUpdate(color)
{
  if (color == undefined)
  {
    return;
    //const random = Math.random();
    //if (random < 0.3) { search_DOM_element.style.background = positive_color; }
    //else if (random < 0.6) { search_DOM_element.style.background = neutral_color; }
    //else { search_DOM_element.style.background = negative_color; }
  } else
  {
    search_DOM_element.style.background = color;
  }
}

function searchForceUpdate()
{
  last_search_text = search_DOM_element.value;
  StartConnection(last_search_text);
}

function updateRightChart(dataset)
{
  if (dataset == undefined)
  {
    //dataset = createData();
    return;
  }
  chart = right_chart;
  chart.data.datasets[0].data = [dataset[0].length, dataset[1].length, dataset[2].length];
  chart.update();
}

function updateLeftChart(dataset)
{
  //chart - хранится переменная с классом графика, с которым работаем
  //unique_twit_times - множество уникальных времен всех твитов
  //data_times - массив массивов времени каждого твита для каждой тональности
  if (dataset == undefined)
  {
    //dataset = createData();
    return;
  }
  var chart = left_chart;
  var unique_tweet_times = new Set();
  for (let data of dataset)
  {
    for (let elem of data)
    {
      unique_tweet_times.add(elem.time);
    }
  }

  var data_times = new Array(3);
  for (var i = 0; i < 3; i++)
  {
    data_times[i] = [];
  }

  var unique_tweet_arr = Array.from(unique_tweet_times.values());
  unique_tweet_arr.sort()

  var len_tweets = unique_tweet_arr.length;
  var batch_size = len_tweets/4;
  if (batch_size == 0)
  {
    batch_size = 1;
  }
  var batches = [unique_tweet_arr[batch_size-1], unique_tweet_arr[2*batch_size-1], unique_tweet_arr[3*batch_size-1], unique_tweet_arr[len_tweets-1] ];

  //for (var i = 0; i < 3; i++)
  //{
  //  for (var j = 0; j < 4; j++)
  //  {
  //    data_times[i][j] = 0;
  //  }
  //}

  //for (var i = 0; i < 3; i++)
  //{
  //  for (let elem of dataset[i])
  //  {
  //    var j = 0;
  //    for (;elem.time < batches[j]; j++) {}
  //    data_times[i][j]++;
  //  }
  //}

  //for (var j = 0; j < 4; j++)
  //{
    for (var i = 0; i < 3; i++)
    {
      data_times[i][j] = 0;
      for (let elem of dataset[i])
      {
        for (var j = 0; j < 4; j++)
        {
          if (elem.time < batches[j])
          {
            data_times[i][j]++;
            break;
          }
        }
      }
    }
  //}
  //var label = [];
  //for (let time of unique_tweet_times)
  //{
  //  date = new Date(time);
  //  label.push(date.toISOString().slice(0,10));
  //}
  //chart.data.labels = label;
  chart.data.datasets[0].data = [];
  chart.data.datasets[1].data = [];
  chart.data.datasets[2].data = [];
  for (var j = 0; j < 4; j++)
  {
    chart.data.datasets[0].data.push(data_times[0][j]+data_times[1][j]+data_times[2][j]);
    chart.data.datasets[1].data.push(data_times[0][j]);
    chart.data.datasets[2].data.push(data_times[1][j]);
  }
  chart.update();
}

function updateTweetContainer(dataset)
{
  //html_dataset - массив DOM-элементов твитов, отображаемых снизу страницы
  if (dataset == undefined)
  {
    dataset = createData();
  }
  var container = document.getElementsByClassName("flex-container")[1];
  var positive = container.getElementsByClassName("positive")[0];
  var neutral = container.getElementsByClassName("neutral")[0];
  var negative = container.getElementsByClassName("negative")[0];
  var html_dataset = [positive, neutral, negative];

  for (var i = 0; i < 3; i++)
  {
    html_data = html_dataset[i];
    while (html_data.firstChild)
    {
      html_data.removeChild(html_data.firstChild);
    }
    for (data of dataset[i])
    {
      var div_node = document.createElement('div');
      var text = document.createTextNode(data.text);
      div_node.classList += "tweet-container";
      div_node.appendChild(text);
      html_data.appendChild(div_node);
    }
  }
}
