/*
|--------------------------------------------------------------------------
| AUTHORITIES DROPDOWN
|--------------------------------------------------------------------------
*/
const DROPDOWN_CACHE_TTL = 86400; // fallback TTL only; invalidation is event-driven via edits

function cacheDropdownData(key, data) {
    try {
        const cache = CacheService.getScriptCache();
        cache.put(key, JSON.stringify(data), DROPDOWN_CACHE_TTL);
    } catch (err) {
        // ignore caching issue
    }
}

function getCachedDropdownData(key) {
    try {
        const cache = CacheService.getScriptCache();
        const cached = cache.get(key);
        return cached ? JSON.parse(cached) : null;
    } catch (err) {
        return null;
    }
}

function getAuthoritiesList() {
    const cached = getCachedDropdownData("authorities");
    if (cached) {
        return cached;
    }

    const sheet = SpreadsheetApp
        .openById(SHEET_ID)
        .getSheetByName(SHEETS.AUTHORITIES);

    if (!sheet) {
        return [];
    }

    const data = sheet.getDataRange().getValues();
    const list = [];

    for (let i = 1; i < data.length; i++) {
        const authority = String(data[i][0]).trim();
        if (authority) {
            list.push(authority);
        }
    }

    cacheDropdownData("authorities", list);
    return list;
}

function getFacilitatorsList() {
    const cached = getCachedDropdownData("facilitators");
    if (cached) {
        return cached;
    }

    const sheet = SpreadsheetApp
        .openById(SHEET_ID)
        .getSheetByName(SHEETS.FACILITATORS);

    if (!sheet) {
        return [];
    }

    const data = sheet.getDataRange().getValues();
    const list = [];

    for (let i = 1; i < data.length; i++) {
        const facilitator = String(data[i][0]).trim();
        if (facilitator) {
            list.push(facilitator);
        }
    }

    cacheDropdownData("facilitators", list);
    return list;
}

function getAuthorities() {

  const authorities = getAuthoritiesList();

  return json({
    status: "OK",
    authorities: authorities
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
    .getSheetByName(SHEETS.AUTHORITIES);

	if(!sheet){
		return json({
			status:"ERROR",
			error:"Authorities sheet not found"
		});
	}
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

function clearDropdownCache() {
    try {
        const cache = CacheService.getScriptCache();
        cache.remove("authorities");
        cache.remove("facilitators");
    } catch (err) {
        // ignore cache clear issues
    }
}

function getFacilitators(){

    const cached = getCachedDropdownData("facilitators");
    if (cached) {
        return json({ status: "OK", facilitators: cached });
    }

    const sheet =
    SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName(SHEETS.FACILITATORS);

		if(!sheet){
			return json({
				status:"ERROR",
				error:"Facilitators sheet not found"
			});
		}

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

    cacheDropdownData("facilitators", facilitators);

    return json({

        status:"OK",
        facilitators:facilitators

    });

}

function initData(){
    return json({
        status: "OK",
        authorities: getAuthoritiesList(),
        facilitators: getFacilitatorsList(),
        userIndex: getUsersIndex()
    });
}