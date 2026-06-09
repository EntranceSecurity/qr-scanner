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

  const sheet =
    e.source.getActiveSheet();

  if (
    sheet.getName() ===
    "User Directory"
  ) {

    clearUserCache();

  }

}