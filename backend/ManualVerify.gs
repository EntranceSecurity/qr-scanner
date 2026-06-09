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
      .getSheetByName(SHEETS.USERS);

	if(!sheet){
		return json({
			status:"ERROR",
			error:"User Directory sheet not found"
		});
	}

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