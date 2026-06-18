
function checkDuplicateUser(e){

  const name =
    String(e.parameter.name || "")
    .trim()
    .toLowerCase();

  const facilitator =
    String(e.parameter.facilitator || "")
    .trim();

  const passcode =
    String(e.parameter.passcode || "")
    .trim();

  const usersIndex = getUsersIndex();
  const facilitatorKey = facilitator.toLowerCase() + "|" + passcode.toLowerCase();
  const candidates = usersIndex.byFacilitatorPasscode[facilitatorKey] || [];

  const matches = candidates.filter(user => {
    const userName = user.nameLower;
    return (
      userName.includes(name) ||
      name.includes(userName)
    );
  }).map(user => ({
    id: user.id,
    name: user.name
  }));

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
    .getSheetByName(SHEETS.FACILITATORS);

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

    const usersIndex = getUsersIndex();
    const maxSeq = usersIndex.maxSeqByFacilitator[facCode] || 0;

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
    .getSheetByName(SHEETS.USERS);

	if(!sheet){
		return json({
			status:"ERROR",
			error:"User Directory sheet not found"
		});
	}

  const qrFormula =
    '=IMAGE("https://quickchart.io/qr?text=' +
    uniqueId +
    '&size=200")';

  const usersById = getUsersCache();

  if (usersById[uniqueId]) {
    return json({
      status:"ERROR",
      error:"Unique ID already exists"
    });
  }

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


