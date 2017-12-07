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

function SendRequest(method, path, args, handler)
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
  Request.open(method, path, true);
  if (r_method.toLowerCase() == "post")
  {
    Request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=utf-8");
    Request.send(args);
  }
}

function StartConnection(url, text)
{
  var Handler = function(Request)
  {
    let json = eval("(" + Request.responseText + ")");
    updateData(json);
  }
  SendRequest("POST", "url://"+url, "text="+text, Handler);
}
