function getJSON()
{
  var time = new Date("February 6 2017").getTime();
  var time2 = new Date("August 23 2016").getTime();
  var time3 = new Date("June 15 2015").getTime();
  var text = '{"tweets": [ [' +
'{ "text":"Досмотрел 2-ой сезон Как избежать наказания за убийство.", "time":'+  time.toString() +' },' +
'{ "text":"Мстители: Война бесконечности: Эпичная битва начинается", "time":'+  time.toString() +' },' +
'{ "text":"Дочь Путина популяризирует акробатические танцы. Навальный – танцы живота. Здорово", "time":'+  time2.toString() +' }]'+
                        ',[' +
'{ "text":"Внезапно для себя обнаружил что перешёл на Firefox на всех устройствах, включая iPhone.", "time":'+  time.toString() +' },' +
'{ "text":"Она должна заполнить пустоты между предыдущими сезонами", "time":'+  time2.toString() +' },' +
'{ "text":"Бабуль, ну там правда в телеграме легко, ты разберёшься. Ох, не знаю, внученька, мне 84 года", "time":'+  time2.toString() +' }]' +
                        ',[' +
'{ "text":"Досмотрел 2-ой сезон Как избежать наказания за убийство.", "time":'+  time.toString() +' },' +
'{ "text":"Мстители: Война бесконечности: Эпичная битва начинается", "time":'+  time.toString() +'},' +
'{ "text":"Дочь Путина популяризирует акробатические танцы. Навальный – танцы живота. Здорово", "time":'+  time3.toString() +' }]' +
                          '], "type": 2 }';
  return text;
}

function parseJSON(json)
{
  return JSON.parse(json);
}

function createData(json)
{
  if (json == undefined)
  {
    json = getJSON();
  }
  var obj = parseJSON(json);
  var tweets = obj['tweets'];
  request_type = obj['type'];
  return new Array(tweets[0], tweets[1], tweets[2]);
}

function updateDataForOneTweet()
{
  updateData('{"tweets": [[{"text":"test", "time":101123}], [], []],"type":0}');
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
