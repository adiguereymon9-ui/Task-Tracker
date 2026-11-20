export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return false;
  }

  const permission = await Notification.requestPermission();

  return permission === "granted";
}

export function notify(title, message) {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission !== "granted") {
    return;
  }

  new Notification(title, {
    body: message
  });
}
