type ReminderContext = {
  employeeName: string;
  itemName: string;
  expirationDate: Date | null;
};

export type ReminderDraft = {
  emailSubject: string;
  emailBody: string;
  smsBody: string;
};

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function generateExpiredReminder(ctx: ReminderContext): ReminderDraft {
  const expStr = ctx.expirationDate
    ? ` on ${formatDate(ctx.expirationDate)}`
    : "";

  return {
    emailSubject: `Action Required: ${ctx.itemName} has expired`,
    emailBody: [
      `Hi ${ctx.employeeName},`,
      "",
      `Our records show that your ${ctx.itemName} has expired${expStr}. Please submit an updated version as soon as possible so we can keep your file current.`,
      "",
      "If you have already renewed this item, please send a copy to our office at your earliest convenience.",
      "",
      "Thank you,",
      "CareOps Admin",
    ].join("\n"),
    smsBody: `Hi ${ctx.employeeName}, your ${ctx.itemName} has expired. Please renew and submit ASAP. Thank you!`,
  };
}

export function generateExpiringSoonReminder(
  ctx: ReminderContext,
): ReminderDraft {
  const expStr = ctx.expirationDate
    ? ` on ${formatDate(ctx.expirationDate)}`
    : " soon";

  return {
    emailSubject: `Reminder: ${ctx.itemName} expiring${expStr}`,
    emailBody: [
      `Hi ${ctx.employeeName},`,
      "",
      `This is a friendly reminder that your ${ctx.itemName} is set to expire${expStr}. Please begin the renewal process so there is no gap in your compliance records.`,
      "",
      "If you have any questions about the renewal process, please contact our office.",
      "",
      "Thank you,",
      "CareOps Admin",
    ].join("\n"),
    smsBody: `Reminder: ${ctx.employeeName}, your ${ctx.itemName} expires${expStr}. Please renew soon. Thank you!`,
  };
}

export function generateMissingReminder(ctx: ReminderContext): ReminderDraft {
  return {
    emailSubject: `Action Required: ${ctx.itemName} needed`,
    emailBody: [
      `Hi ${ctx.employeeName},`,
      "",
      `Our records show that we still need your ${ctx.itemName} on file. This is a required compliance item and we need it submitted as soon as possible.`,
      "",
      "Please contact our office if you need guidance on how to obtain this document.",
      "",
      "Thank you,",
      "CareOps Admin",
    ].join("\n"),
    smsBody: `Hi ${ctx.employeeName}, we need your ${ctx.itemName} on file. Please submit ASAP. Thank you!`,
  };
}

export function generateReminder(
  type: "expired" | "expiring" | "missing",
  ctx: ReminderContext,
): ReminderDraft {
  switch (type) {
    case "expired":
      return generateExpiredReminder(ctx);
    case "expiring":
      return generateExpiringSoonReminder(ctx);
    case "missing":
      return generateMissingReminder(ctx);
  }
}
