import { T as TSS_SERVER_FUNCTION, c as createServerFn } from "./index.mjs";
import { s as supabase } from "./client-BDew0MgD.mjs";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const joinWaitlist_createServerFn_handler = createServerRpc({
  id: "daf741e214855209cd35d47beb18eeafa95e1b16a4e7710c123cbe24436ceacb",
  name: "joinWaitlist",
  filename: "src/lib/waitlist-server.ts"
}, (opts) => joinWaitlist.__executeServer(opts));
const joinWaitlist = createServerFn({
  method: "POST"
}).validator((d) => d).handler(joinWaitlist_createServerFn_handler, async ({
  data
}) => {
  const {
    email,
    source,
    locale
  } = data;
  const normalized = email.trim().toLowerCase();
  const {
    error
  } = await supabase.from("waitlist").insert({
    email: normalized,
    source,
    locale
  });
  if (error) {
    if (error.code === "23505") {
      return {
        success: true,
        alreadyJoined: true
      };
    }
    console.error("Server-side Waitlist insert failed:", error);
    throw error;
  }
  return {
    success: true
  };
});
export {
  joinWaitlist_createServerFn_handler
};
