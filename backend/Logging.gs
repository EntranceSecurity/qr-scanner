/*
|--------------------------------------------------------------------------
| ACCESS LOG WRITE
|--------------------------------------------------------------------------
*/
function writeLog(result, authority) {

  const sheet = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName(SHEETS.LOGS);

  if(!sheet){
		throw new Error(
			"Access Logs sheet not found"
		);
	}
	
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
