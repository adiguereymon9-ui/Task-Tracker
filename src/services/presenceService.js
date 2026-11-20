import { supabase } from "../lib/supabase";

export function startPresence(userId, username, callback) {
  const channel = supabase.channel("online-users", {
    config: {
      presence: {
        key: userId
      }
    }
  });

  channel
    .on("presence", { event: "sync" }, () => {
      callback(channel.presenceState());
    })
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          user_id: userId,
          username,
          online_at: new Date().toISOString()
        });
      }
    });

  return () => {
    supabase.removeChannel(channel);
  };
}
