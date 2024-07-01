import models from "db/models";

export async function getEventTargets(targets?: Pick<typeof models.user, "email" | "id" | "settings">[]) {
  targets =
    (targets?.length
        ? targets.filter(u => u.settings?.notifications)
        : (await models.user.findAll({
          include: [{association: "user_settings", where: {notifications: true}, required: true}],
          raw: true
        }))
    );

  const reduceTargetToRecipientIds = (p: {
    recipients: string[],
    ids: number[]
  }, c: Pick<typeof models.user, "email" | "id" | "settings">) =>
    ({recipients: [...p.recipients, c.email], ids: [...p.ids, c.id]}) as { recipients: string[], ids: number[] };

  return targets.reduce(reduceTargetToRecipientIds, {recipients: [], ids: []});
}