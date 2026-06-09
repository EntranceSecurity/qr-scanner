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