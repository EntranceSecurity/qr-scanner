const SHEET_ID = "1ekPMhADptgnsBwbPqIQYdTUYNXEHgMePJLa44sNLvBA";

/*
|--------------------------------------------------------------------------
| MAIN ENTRY
|--------------------------------------------------------------------------
*/
function doGet(e) {

  try {

    const action = e.parameter.action || "";

    if(action === "ping"){
        return json({
            status:"OK"
        });
    }

    if (action === "authorities") {
      return getAuthorities();
    }

    if (action === "login") {
      return validateAuthority(e);
    }

    if (action === "scan") {
      return processScan(e);
    }

    if (action === "search") {
      return processSearch(e);
    }

    if (action === "manualVerify") {
      return manualVerify(e);
    }

    if (action === "checkDuplicateUser") {
      return checkDuplicateUser(e);
    }

    if (action === "generateUserId") {
      return generateUserId(e);
    }

    if (action === "addUser") {
      return addUser(e);
    }

    if(action === "facilitators"){
        return getFacilitators();
    }

    if(action === "confirmManualMatch"){
      return confirmManualMatch(e);
    }

    return json({
      status: "ERROR",
      error: "Invalid action"
    });

  } catch (err) {

    return json({
      status: "ERROR",
      error: err.toString()
    });

  }
}

/*
|--------------------------------------------------------------------------
| AUTHORITIES DROPDOWN
|--------------------------------------------------------------------------
*/
function getAuthorities() {

  const sheet = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName("Authorities");

  const data = sheet.getDataRange().getValues();

  const list = [];

  for (let i = 1; i < data.length; i++) {

    const authority = String(data[i][0]).trim();

    if (authority) {
      list.push(authority);
    }
  }

  return json({
    status: "OK",
    authorities: list
  });
}

function confirmManualMatch(e){

    const uniqueId =
      String(e.parameter.uniqueId || "")
      .trim();

    const authority =
      String(e.parameter.authority || "")
      .trim();

    const result =
      verifyUser(uniqueId);

    writeLog(
      result,
      authority
    );

    return json(result);
}

/*
|--------------------------------------------------------------------------
| AUTHORITY LOGIN
|--------------------------------------------------------------------------
*/
function validateAuthority(e) {

  const authority = String(
    e.parameter.authority || ""
  ).trim();

  const passcode = String(
    e.parameter.passcode || ""
  ).trim();

  const sheet = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName("Authorities");

  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    if (
      String(data[i][0]).trim() === authority &&
      String(data[i][1]).trim() === passcode
    ) {

      return json({
        status: "AUTHORIZED"
      });

    }
  }

  return json({
    status: "DENIED"
  });
}

/*
|--------------------------------------------------------------------------
| PROCESS SCAN
|--------------------------------------------------------------------------
*/
function processScan(e) {

  const id = String(
    e.parameter.id || ""
  ).trim();

  const authority = String(
    e.parameter.authority || ""
  ).trim();

  const result = verifyUser(id);

  if (!isDuplicateScan(id, authority)) {
    writeLog(result, authority);
  }

  return json(result);
}

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
    .getSheetByName("User Directory");

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

/*
|--------------------------------------------------------------------------
| DUPLICATE PROTECTION
|--------------------------------------------------------------------------
*/
function isDuplicateScan(id, authority) {

  const sheet = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName("Access Logs");

  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return false;
  }

  const last = sheet
    .getRange(lastRow, 1, 1, 9)
    .getValues()[0];

  const lastId = String(last[0]);
  const lastTime = new Date(last[1]);
  const lastAuthority = String(last[8]);

  const seconds =
    (new Date() - lastTime) / 1000;

  return (
    lastId === id &&
    lastAuthority === authority &&
    seconds < 5
  );
}

/*
|--------------------------------------------------------------------------
| ACCESS LOG WRITE
|--------------------------------------------------------------------------
*/
function writeLog(result, authority) {

  const sheet = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName("Access Logs");

  sheet.appendRow([
    result.id,
    new Date(),
    result.name,
    result.gender,
    result.age,
    result.facilitator,
    result.passcode,
    result.status,
    authority
  ]);
}

/*
|--------------------------------------------------------------------------
| JSON
|--------------------------------------------------------------------------
*/
function json(obj) {

  return ContentService
    .createTextOutput(
      JSON.stringify(obj)
    )
    .setMimeType(
      ContentService.MimeType.JSON
    );
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
    .getSheetByName("User Directory");

  const data = sheet.getDataRange().getValues();
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

function manualVerify(e){

  const uniqueId =
    String(e.parameter.uniqueId || "").trim();

  const name =
    String(e.parameter.name || "").trim().toLowerCase();

  const facilitator =
    String(e.parameter.facilitator || "").trim();

  const passcode =
    String(e.parameter.passcode || "").trim();

  const authority =
    String(e.parameter.authority || "").trim();

  const sheet = SpreadsheetApp
      .openById(SHEET_ID)
      .getSheetByName("User Directory");

  const data = sheet.getDataRange().getValues();
  const headers = data[0];

  const idCol = headers.indexOf("Unique ID");
  const nameCol = headers.indexOf("Name");
  const genderCol = headers.indexOf("Gender");
  const ageCol = headers.indexOf("Age");
  const facilitatorCol = headers.indexOf("Facilitator");
  const passcodeCol = headers.indexOf("Passcode");

  const matches = []

  for(let i=1;i<data.length;i++){

    const row = data[i];

    let match = false;

    // Method 1: Unique ID
    if(uniqueId){

        match = String(row[idCol]).trim() === uniqueId;

    }

    // Method 2: Name + Facilitator + Passcode
    else{
      const rowName = String(row[nameCol]).trim().toLowerCase()

      match =
        rowName.includes(name) &&
        String(row[facilitatorCol]).trim() === facilitator &&
        String(row[passcodeCol]).trim() === passcode;

    }
    Logger.log(match)
    if(match){

      matches.push({
          status: "APPROVED",
          id: row[idCol],
          name: row[nameCol],
          gender: row[genderCol],
          age: row[ageCol],
          facilitator: row[facilitatorCol],
          passcode: row[passcodeCol],
          timestamp:new Date()
      });
    }
  }

  if(matches.length === 0) {

    const denied = {

        status:"DENIED",
        id: uniqueId || name,
        timestamp:new Date()

    };

    writeLog(denied, authority);
    return json(denied);
  }

  else if(matches.length === 1) {
    const approved = matches[0];
    writeLog(approved, authority);
    return json(approved);
  }

  return json({

  status:"MULTIPLE_MATCHES",

  matches:matches.map(m => ({
      id:m.id,
      name:m.name,
      facilitator:m.facilitator,
      passcode:m.passcode
  }))
  });

}


function clearUserCache(){

    CacheService
    .getScriptCache()
    .remove("USER_DIRECTORY");

    Logger.log(
      "USER_DIRECTORY cache cleared"
    );
}

function onEdit(e) {

  const sheet =
    e.source.getActiveSheet();

  if (
    sheet.getName() ===
    "User Directory"
  ) {

    clearUserCache();

  }

}

function checkDuplicateUser(e){

  const name =
    String(e.parameter.name || "")
    .trim()
    .toLowerCase();

  const facilitator =
    String(e.parameter.facilitator || "")
    .trim()
    .toLowerCase();

  const passcode =
    String(e.parameter.passcode || "")
    .trim()
    .toLowerCase();

  const sheet =
    SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName("User Directory");

  const data =
    sheet.getDataRange().getValues();

  const headers = data[0];

  const idCol =
    headers.indexOf("Unique ID");

  const nameCol =
    headers.indexOf("Name");

  const facilitatorCol =
    headers.indexOf("Facilitator");

  const passcodeCol =
    headers.indexOf("Passcode");

  const matches = [];

  for(let i=1;i<data.length;i++){

      const rowName =
        String(data[i][nameCol])
        .trim()
        .toLowerCase();

      const rowFacilitator =
        String(data[i][facilitatorCol])
        .trim()
        .toLowerCase();

      const rowPasscode =
        String(data[i][passcodeCol])
        .trim()
        .toLowerCase();

      if(
          rowFacilitator === facilitator &&
          rowPasscode === passcode &&
          (
            rowName.includes(name) ||
            name.includes(rowName)
          )
      ){

          matches.push({
              id:data[i][idCol],
              name:data[i][nameCol]
          });

      }
  }

  return json({
      status:"OK",
      matches:matches
  });

}

function generateUserId(e){

  const name =
    String(e.parameter.name || "")
    .trim();

  const facilitator =
    String(e.parameter.facilitator || "")
    .trim();

  const facSheet =
    SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName("Facilitators");

  if(!facSheet){
      return json({
          status:"ERROR",
          error:"Facilitators sheet not found"
      });

}

  const facData =
    facSheet.getDataRange().getValues();

  let facCode = "";

  for(let i=1;i<facData.length;i++){

      if(
        String(facData[i][0]).trim() ===
        facilitator
      ){

          facCode =
          String(facData[i][1]).trim();

          break;
      }
  }

  if(!facCode){

      return json({
          status:"ERROR",
          error:"Facilitator not found"
      });

  }

  const nameCode =
    name
    .replace(/[^a-zA-Z]/g,"")
    .toUpperCase()
    .substring(0,4)
    .padEnd(4,"X");

  const sheet =
    SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName("User Directory");

  if(!sheet){

      return json({
          status:"ERROR",
          error:"User Directory sheet not found"
      });

  }
  const data =
    sheet.getDataRange().getValues();

  let maxSeq = 0;

  for(let i=1;i<data.length;i++){

      const existingId =
        String(data[i][0]);

      if(
        existingId.startsWith(
          facCode + "_"
        )
      ){

          const parts =
            existingId.split("_");

          const seq =
            parseInt(parts[2]) || 0;

          if(seq > maxSeq){
              maxSeq = seq;
          }

      }
  }

  const nextSeq =
    String(maxSeq + 1)
    .padStart(3,"0");

  const suggestedId =
    facCode +
    "_" +
    nameCode +
    "_" +
    nextSeq;

  return json({

      status:"OK",
      uniqueId:suggestedId

  });

}

function addUser(e){

  const uniqueId =
    String(e.parameter.uniqueId || "").trim();

  const name =
    String(e.parameter.name || "").trim();

  const gender =
    String(e.parameter.gender || "").trim();

  // const age =
  //   String(e.parameter.age || "").trim();

  const age =
  parseInt(
    String(
      e.parameter.age || ""
    ).trim(),
    10
  );

  if(
    isNaN(age) ||
    age <= 5
  ){

      return json({

          status:"ERROR",

          error:
          "[BE] Users aged 5 years or below need not be registered."

      });

  }

  const facilitator =
    String(e.parameter.facilitator || "").trim();

  const passcode =
    String(e.parameter.passcode || "").trim();

  const sheet =
    SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName("User Directory");

  const qrFormula =
    '=IMAGE("https://quickchart.io/qr?text=' +
    uniqueId +
    '&size=200")';

  sheet.appendRow([

      uniqueId,
      name,
      gender,
      age,
      facilitator,
      passcode,
      qrFormula

  ]);

  clearUserCache();

  return json({

      status:"CREATED",
      uniqueId:uniqueId,
      name:name

  });

}

function getFacilitators(){

    const sheet =
    SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName("Facilitators");

    const data =
    sheet.getDataRange().getValues();

    const facilitators = [];

    for(let i=1;i<data.length;i++){

        const facilitator =
        String(data[i][0]).trim();

        if(facilitator){

            facilitators.push(
                facilitator
            );

        }
    }

    return json({

        status:"OK",
        facilitators:facilitators

    });

}

