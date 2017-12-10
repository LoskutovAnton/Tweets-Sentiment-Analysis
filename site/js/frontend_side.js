function searchUpdate(color)
{
  if (color == undefined)
  {
    const random = Math.random();
    if (random < 0.3) { search_DOM_element.style.background = positive_color; }
    else if (random < 0.6) { search_DOM_element.style.background = neutral_color; }
    else { search_DOM_element.style.background = negative_color; }
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
    dataset = createData();
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
    dataset = createData();
  }
  var chart = left_chart;
  var unique_twit_times = new Set();
  for (let data of dataset)
  {
    for (let elem of data)
    {
      unique_twit_times.add(elem.time);
    }
  }

  var data_times = new Array(3);
  for (var i = 0; i < 3; i++)
  {
    data_times[i] = [];
  }

  var unique_twit_arr = Array.from(unique_twit_times.values());
  unique_twit_arr.sort()

  for (var j = 0; j < unique_twit_arr.length; j++)
  {
    for (var i = 0; i < 3; i++)
    {
      data_times[i][j] = 0;
      for (let elem of dataset[i])
      {
        if (elem.time == unique_twit_arr[j])
        {
          data_times[i][j]++;
        }
      }
    }
  }
  var label = [];
  for (let time of unique_twit_times)
  {
    date = new Date(time);
    label.push(date.toISOString().slice(0,10));
  }
  chart.data.labels = label;
  chart.data.datasets[0].data = [];
  chart.data.datasets[1].data = [];
  chart.data.datasets[2].data = [];
  for (var j = 0; j < unique_twit_times.size; j++)
  {
    chart.data.datasets[0].data.push(data_times[0][j]+data_times[1][j]+data_times[2][j]);
    chart.data.datasets[1].data.push(data_times[0][j]);
    chart.data.datasets[2].data.push(data_times[1][j]);
  }
  chart.update();
}

function updateTwitContainer(dataset)
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
      div_node.classList += "twit-container";
      div_node.appendChild(text);
      html_data.appendChild(div_node);
    }
  }
}
