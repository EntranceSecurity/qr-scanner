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

  if (uniqueId) {
    const result = verifyUser(uniqueId);
    if (result.status === "APPROVED") {
      writeLog(result, authority);
      return json(result);
    }
  }

  const usersIndex = getUsersIndex();
  const facilitatorKey = facilitator.toLowerCase() + "|" + passcode.toLowerCase();
  const candidates = usersIndex.byFacilitatorPasscode[facilitatorKey] || [];

  const matches = candidates.filter(user => {
    const userName = user.nameLower;
    return (
      userName.includes(name) ||
      name.includes(userName)
    );
  });

  if(matches.length === 0) {
    const denied = {
      status:"DENIED",
      id: uniqueId || name,
      timestamp:new Date()
    };

    writeLog(denied, authority);
    return json(denied);
  }

  if(matches.length === 1) {
    const approved = matches[0];
    const result = {
      status: "APPROVED",
      id: approved.id,
      name: approved.name,
      gender: approved.gender,
      age: approved.age,
      facilitator: approved.facilitator,
      passcode: approved.passcode,
      timestamp: new Date()
    };
    writeLog(result, authority);
    return json(result);
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