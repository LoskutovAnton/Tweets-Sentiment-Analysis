function getJSON()
{
  var text = '{"twits": [{ "positive" : [' +
'{ "text":"Досмотрел 2-ой сезон Как избежать наказания за убийство.", "time":'+  (Date.now()).toString() +' },' +
'{ "text":"Мстители: Война бесконечности: Эпичная битва начинается", "time":'+  (Date.now()).toString() +' },' +
'{ "text":"Дочь Путина популяризирует акробатические танцы. Навальный – танцы живота. Здорово", "time":'+  (Date.now()-10000).toString() +' }]'+
                          '},' +
                        '{ "neutral" : [' +
'{ "text":"Внезапно для себя обнаружил что перешёл на Firefox на всех устройствах, включая iPhone.", "time":'+  (Date.now()).toString() +' },' +
'{ "text":"Она должна заполнить пустоты между предыдущими сезонами", "time":'+  (Date.now()-10000).toString() +' },' +
'{ "text":"Бабуль, ну там правда в телеграме легко, ты разберёшься. Ох, не знаю, внученька, мне 84 года", "time":'+  (Date.now()-10000).toString() +' }]' +
                        '},' +
                        '{ "negative" : [' +
'{ "text":"Досмотрел 2-ой сезон Как избежать наказания за убийство.", "time":'+  (Date.now()).toString() +' },' +
'{ "text":"Мстители: Война бесконечности: Эпичная битва начинается", "time":'+  (Date.now()).toString() +'},' +
'{ "text":"Дочь Путина популяризирует акробатические танцы. Навальный – танцы живота. Здорово", "time":'+  (Date.now()-20000).toString() +' }]' +
                          '}]' +
'}';
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
  return new Array(twits[0].positive, twits[1].neutral, twits[2].negative);
}

function updateData(json)
{
  NProgress.start();
  var dataset = createData(json);
  NProgress.inc();
  updateLeftChart(dataset);
  NProgress.inc();
  updateRightChart(dataset);
  NProgress.inc();
  updateTwitContainer(dataset);
  NProgress.done();
}
