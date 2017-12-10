function getJSON()
{
  var time = Date.now();
  var text = '{"twits": [ [' +
'{ "text":"Досмотрел 2-ой сезон Как избежать наказания за убийство.", "time":'+  time.toString() +' },' +
'{ "text":"Мстители: Война бесконечности: Эпичная битва начинается", "time":'+  time.toString() +' },' +
'{ "text":"Дочь Путина популяризирует акробатические танцы. Навальный – танцы живота. Здорово", "time":'+  (time-10000).toString() +' }]'+
                        ',[' +
'{ "text":"Внезапно для себя обнаружил что перешёл на Firefox на всех устройствах, включая iPhone.", "time":'+  time.toString() +' },' +
'{ "text":"Она должна заполнить пустоты между предыдущими сезонами", "time":'+  (time-10000).toString() +' },' +
'{ "text":"Бабуль, ну там правда в телеграме легко, ты разберёшься. Ох, не знаю, внученька, мне 84 года", "time":'+  (time-10000).toString() +' }]' +
                        ',[' +
'{ "text":"Досмотрел 2-ой сезон Как избежать наказания за убийство.", "time":'+  time.toString() +' },' +
'{ "text":"Мстители: Война бесконечности: Эпичная битва начинается", "time":'+  time.toString() +'},' +
'{ "text":"Дочь Путина популяризирует акробатические танцы. Навальный – танцы живота. Здорово", "time":'+  (time-20000).toString() +' }]' +
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
  var twits = obj['twits'];
  request_type = obj['type'];
  return new Array(twits[0], twits[1], twits[2]);
}

function updateDataForOneTweet()
{
  updateData('{"twits": [[{"text":"test", "time":101123}], [], []],"type":0}');
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
      }
    }
  }
  NProgress.inc();
  updateLeftChart(dataset);
  NProgress.inc();
  updateRightChart(dataset);
  NProgress.inc();
  updateTwitContainer(dataset);
  NProgress.done();
}
