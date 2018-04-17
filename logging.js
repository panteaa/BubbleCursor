var ENABLE_NETWORK_LOGGING = true;
var ENABLE_CONSOLE_LOGGING = true;
var LOG_VERSION = 'A';

var EVENT_TYPES_TO_LOG = {
  keydown: true
};

var EVENT_PROPERTIES_TO_LOG = {
  which: true
};

var GLOBAL_STATE_TO_LOG = function() {
  return {
  };
};

(function() {
var uid = getUniqueId();
function hookEventsToLog() {
  for (var event_type in EVENT_TYPES_TO_LOG) {
    document.addEventListener(event_type, logEvent, true);
  }

  $(function() {
    console.log('Your unique id is', uid);
  });

  $(document).on('log', logEvent);
}

function findFirstString(str, choices) {
  for (var j = 0; j < choices.length; j++) {
    if (str.indexOf(choices[j]) >= 0) {
      return choices[j];
    }
  }
  return '?';
}

function getUniqueId() {
  if (!('uid' in localStorage)) {
    var browser = findFirstString(navigator.userAgent, [
      'Seamonkey', 'Firefox', 'Chromium', 'Chrome', 'Safari', 'OPR', 'Opera',
      'Edge', 'MSIE', 'Blink', 'Webkit', 'Gecko', 'Trident', 'Mozilla']);
    var os = findFirstString(navigator.userAgent, [
      'Android', 'iOS', 'Symbian', 'Blackberry', 'Windows Phone', 'Windows',
      'OS X', 'Linux', 'iOS', 'CrOS']).replace(/ /g, '_');
    var unique = ('' + Math.random()).substr(2);
    localStorage['uid'] = os + '-' + browser + '-' + unique;
  }
  return localStorage['uid'];
}

function logEvent(event, customName, customInfo) {
  var time = (new Date).getTime();
    var name =  event.type;
  var infoObj = GLOBAL_STATE_TO_LOG();
  for (var key in EVENT_PROPERTIES_TO_LOG) {
    if (key in event) {
      infoObj[key] = event[key];
    }
  }
  if (customInfo) {
    $.extend(infoObj, customInfo);
  }
  var info = JSON.stringify(infoObj);

  if (ENABLE_CONSOLE_LOGGING) {
  		console.log(infoObj["cursorType"]);//ok
  		console.log(JSON.stringify(infoObj["cursorType"]));
      console.log(uid, time, name, info, LOG_VERSION);
  }
  if (ENABLE_NETWORK_LOGGING) {
      if(name == 'log')
        sendNetworkLog(uid, time, name, info, LOG_VERSION);
  }
}

if (ENABLE_NETWORK_LOGGING) {
  hookEventsToLog();
}
})();

function sendNetworkLog(uid, time, name, info) {
    var formid = "e/1FAIpQLSeQKTQ9Ftrvm-wOO85Zz6QWB3aYYwzCbt9GQVf6BuQP1GNq7w";
    var data = {"entry.232449398": uid, "entry.2000759014": time, "entry.942551297": name, "entry.1754656750": JSON.stringify(infoObj["cursorType"]), "entry.1912923506": JSON.stringify(infoObj["Block"]) , "entry.1891194768": JSON.stringify(infoObj["Trial"]) , "entry.5712609": JSON.stringify(infoObj["Target"]) , "entry.1982079988": JSON.stringify(infoObj["Amplitude"]), "entry.475157168": JSON.stringify(infoObj["R"]), "entry.1806843383": JSON.stringify(infoObj["D"]), "entry.114811808": JSON.stringify(infoObj["time"]), "entry.1053423942": JSON.stringify(infoObj["errors"])};
    var params = [];
    for (key in data) {
        params.push(key + "=" + encodeURIComponent(data[key]));
    }
    (new Image).src = "https://docs.google.com/forms/d/" + formid + "/formResponse?" + params.join("&");
}