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
