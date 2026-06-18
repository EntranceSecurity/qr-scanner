/*
|--------------------------------------------------------------------------
| CACHE USER DIRECTORY
|--------------------------------------------------------------------------
*/
function buildUserDirectoryCache() {

  const sheet = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName(SHEETS.USERS);

	if(!sheet){
		throw new Error(
			"User Directory sheet not found"
		);
	}

  const data = sheet.getDataRange().getValues();

  const headers = data[0];

  const idCol = headers.indexOf("Unique ID");
  const nameCol = headers.indexOf("Name");
  const genderCol = headers.indexOf("Gender");
  const ageCol = headers.indexOf("Age");
  const facilitatorCol = headers.indexOf("Facilitator");
  const passcodeCol = headers.indexOf("Passcode");

  const byId = {};
  const byFacilitatorPasscode = {};
  const maxSeqByFacilitator = {};

  for (let i = 1; i < data.length; i++) {

    const id = String(data[i][idCol]).trim();

		if (!id) {
			continue;
		}

    const name = String(data[i][nameCol]).trim();
    const gender = data[i][genderCol];
    const age = data[i][ageCol];
    const facilitator = String(data[i][facilitatorCol]).trim();
    const passcode = String(data[i][passcodeCol]).trim();

    byId[id] = {
      name: name,
      gender: gender,
      age: age,
      facilitator: facilitator,
      passcode: passcode
    };

    const facilitatorKey = facilitator.toLowerCase() + "|" + passcode.toLowerCase();

    if (!byFacilitatorPasscode[facilitatorKey]) {
      byFacilitatorPasscode[facilitatorKey] = [];
    }

    byFacilitatorPasscode[facilitatorKey].push({
      id: id,
      name: name,
      nameLower: name.toLowerCase(),
      gender: gender,
      age: age,
      facilitator: facilitator,
      passcode: passcode
    });

    const parts = id.split("_");
    if (parts.length >= 3) {
      const facCode = parts[0];
      const seq = parseInt(parts[2], 10) || 0;
      if (seq > (maxSeqByFacilitator[facCode] || 0)) {
        maxSeqByFacilitator[facCode] = seq;
      }
    }
  }

  return {
    byId: byId,
    byFacilitatorPasscode: byFacilitatorPasscode,
    maxSeqByFacilitator: maxSeqByFacilitator
  };
}

const USER_DIRECTORY_CACHE_TTL = 86400; // fallback TTL only; invalidation is event-driven via edits

function getUsersIndex() {
  const cache = CacheService.getScriptCache();

  const cached = cache.get("USER_DIRECTORY");

  if (cached) {
    return JSON.parse(cached);
  }

  const index = buildUserDirectoryCache();

  cache.put(
    "USER_DIRECTORY",
    JSON.stringify(index),
    USER_DIRECTORY_CACHE_TTL
  );

  return index;
}

function getUsersCache() {
  return getUsersIndex().byId;
}

/*
|--------------------------------------------------------------------------
| VERIFY USER
|--------------------------------------------------------------------------
*/
function verifyUser(id) {

  const users = getUsersCache();

  const user = users[id];

  if (user) {

    return {
      status: "APPROVED",
      id: id,
      name: user.name,
      gender: user.gender,
      age: user.age,
      facilitator: user.facilitator,
      passcode: user.passcode,
      timestamp: new Date()
    };
  }

  return {
    status: "DENIED",
    id: id,
    name: "",
    gender: "",
    age: "",
    facilitator: "",
    passcode: "",
    timestamp: new Date()
  };
}


function processSearch(e) {

  const query = String(
    e.parameter.query || ""
  ).trim().toLowerCase();

  const authority = String(
    e.parameter.authority || ""
  ).trim();

  const users = getUsersCache();
  const candidates = Object.entries(users).map(([id, user]) => ({
    id: id,
    name: String(user.name || "").trim(),
    nameLower: String(user.name || "").trim().toLowerCase(),
    gender: user.gender,
    age: user.age,
    facilitator: user.facilitator,
    passcode: user.passcode
  }));

  for (const user of candidates) {
    if (
      user.id.toLowerCase() === query ||
      user.nameLower.includes(query)
    ) {
      const result = {
        status: "APPROVED",
        id: user.id,
        name: user.name,
        gender: user.gender,
        age: user.age,
        facilitator: user.facilitator,
        passcode: user.passcode,
        timestamp: new Date()
      };

      writeLog(result, authority);

      return json(result);
    }
  }

  const denied = {
    status: "DENIED",
    id: query,
    timestamp: new Date()
  };

  writeLog(denied, authority);

  return json(denied);
}

function clearUserCache(){
    CacheService
    .getScriptCache()
    .remove("USER_DIRECTORY");
}