async function api(action, params={}){

  const qs =
  new URLSearchParams({
    action,
    ...params
  });

  const res =
  await fetch(
    API_URL + "?" + qs
  );

  return res.json();
}
