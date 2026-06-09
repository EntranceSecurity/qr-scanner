/*
|--------------------------------------------------------------------------
| CACHE USER DIRECTORY
|--------------------------------------------------------------------------
*/
function getUsersCache() {

  const cache = CacheService.getScriptCache();

  const cached = cache.get("USER_DIRECTORY");

  if (cached) {
    return JSON.parse(cached);
  }

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

  const users = {};

  for (let i = 1; i < data.length; i++) {

    const id = String(
      data[i][idCol]
    ).trim();

		if(!id){
			continue;
		}
    users[id] = {
      name: data[i][nameCol],
      gender: data[i][genderCol],
      age: data[i][ageCol],
      facilitator: data[i][facilitatorCol],
      passcode: data[i][passcodeCol]
    };
  }

  cache.put(
    "USER_DIRECTORY",
    JSON.stringify(users),
    21600
  );

  return users;
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

  const sheet = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName(SHEETS.USERS);

	if(!sheet){
		throw new Error(
			"User Directory sheet not found"
		);
	}
  const data = getUsersCache 
	/* sheet.getDataRange().getValues(); */
  
  const headers = data[0];

  const idCol = headers.indexOf("Unique ID");
  const nameCol = headers.indexOf("Name");
  const genderCol = headers.indexOf("Gender");
  const ageCol = headers.indexOf("Age");
  const facilitatorCol = headers.indexOf("Facilitator");
  const passcodeCol = headers.indexOf("Passcode");

  for (let i = 1; i < data.length; i++) {

    const id =
      String(data[i][idCol]).trim().toLowerCase();

    const name =
      String(data[i][nameCol]).trim().toLowerCase();

    if (
      id === query ||
      name.includes(query)
    ) {

      const result = {
        status: "APPROVED",
        id: data[i][idCol],
        name: data[i][nameCol],
        gender: data[i][genderCol],
        age: data[i][ageCol],
        facilitator: data[i][facilitatorCol],
        passcode: data[i][passcodeCol],
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