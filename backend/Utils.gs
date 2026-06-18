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

function onEdit(e) {

	if(!e) return;

  const sheet =
    e.source.getActiveSheet();
  const name = sheet.getName();

  if (name === SHEETS.USERS) {
    clearUserCache();
  }

  if (
      name === SHEETS.AUTHORITIES ||
      name === SHEETS.FACILITATORS
  ) {
    clearDropdownCache();
  }

}