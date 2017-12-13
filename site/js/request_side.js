// Создает запрос в зависимости от браузера
function CreateRequest()
{
  var Request = false;
  if (window.XMLHttpRequest)
  {
    Request = new XMLHttpRequest();
  } else if (window.ActiveXObject)
  {
    try
    {
      Request = new ActiveXObject("Microsoft.XMLHTTP");
    }
    catch (CatchException)
    {
      Request = new ActiveXObject("Msxml2.XMLHTTP");
    }
  }

  if (!Request)
  {
    alert("Невозможно создать XMLHttpRequest");
  }
  return Request;
}

// Отправляет запрос с аргументами (args) и обработчиком(handler)
// Request.onreadystatechange не играет роли, просто для красоты
// Request.onreadystatechange, важен только последний этап с обработчиком
function SendRequest(args, handler)
{
  var Request = CreateRequest();
  if (!Request)
  {
    NProgress.done();
    return;
  }
  Request.onreadystatechange = function()
  {
    if (Request.readyState == 1)
    {
      NProgress.inc();
    } else if (Request.readyState == 2)
    {
      NProgress.inc();
    } else if (Request.readyState == 3)
    {
      NProgress.inc();
    } else if (Request.readyState == 4)
    {
      if (Request.status == 200)
      {
        NProgress.inc();
        handler(Request);
      }
      else
      {
        NProgress.remove();
      }
    }
  }
  Request.open("POST", encodeURIComponent(request_url), true);
  Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
  Request.send(args);
}

//Создает соединение и отправляет text
//По факту описывает обработчик и вызывает функцию SendRequest()
function StartConnection(text)
{
  console.log("request started");
  if (request_url == undefined)
  {
    searchUpdate();
    return;
  }
  var Handler = function(Request)
  {
    //let json = eval("(" + Request.responseText + ")");
    let json = Request.responseText;
    console.log("request ended");
    console.log(json);
    updateData(json);
  }
  NProgress.start();
  SendRequest("text="+encodeURIComponent(text), Handler);
}
