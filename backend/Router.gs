/*
|--------------------------------------------------------------------------
| MAIN ENTRY
|--------------------------------------------------------------------------
*/
function doGet(e) {

  try {

    const action = String(e.parameter.action || "").trim();

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

    if(action === "init"){
        return initData();
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