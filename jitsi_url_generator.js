function JitsiUrlGenerator(callback, domain, roomName, paramGroups) {
  this.callback = callback;
  this.domain = domain || "";
  this.roomName = roomName || "";
  this.paramGroups = paramGroups || {};
}

JitsiUrlGenerator.prototype.trigger = function () {
  // If domain or room name not set, trigger callback with empty url
  if (!this.domain || !this.roomName) {
    this.callback("");
    return;
  }

  let params = [];
  for (let group of Object.values(this.paramGroups)) {
    params = params.concat(flattenParamGroup(group));
  }

  let url = "https://" + this.domain + "/" + this.roomName;
  if (params.length > 0) {
    url += '#' + params.join("&");
  }

  this.callback(url);
};


JitsiUrlGenerator.prototype.updateRoomName = function (roomName) {
  this.roomName = roomName;
  this.trigger();
  return this;
};

JitsiUrlGenerator.prototype.updateDomain = function (domain) {
  this.domain = domain;
  this.trigger();
  return this;
};

JitsiUrlGenerator.prototype.updateParamGroup = function (group, params) {
  this.paramGroups[group] = params;
  this.trigger();
  return this;
};

function makeUrlGenerator(callback, domain, roomName, paramGroup) {
  let urlGen = new JitsiUrlGenerator(callback, domain, roomName, paramGroup);
  urlGen.trigger();
  return urlGen;
}


function flattenParamGroup(group) {
  let params = [];
  for (let p in group) {
    if (group.hasOwnProperty(p)) {
      params.push(p + '=' + group[p]);
    }
  }
  return params;
}
