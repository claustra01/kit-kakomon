import {beforeUserCreated, HttpsError} from "firebase-functions/v2/identity";
import {setGlobalOptions} from "firebase-functions/v2";

setGlobalOptions({maxInstances: 10});

export const beforecreated = beforeUserCreated((event) => {
  const user = event.data;
  if (user?.email?.includes("@mail.kyutech.jp")) {
    throw new HttpsError("invalid-argument", "Unauthorized email");
  }
  return;
});
