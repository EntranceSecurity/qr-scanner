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
| DUPLICATE PROTECTION
|--------------------------------------------------------------------------
*/
function isDuplicateScan(id, authority) {

  const sheet = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName(SHEETS.LOGS);

	if(!sheet){
		return false;
	}

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