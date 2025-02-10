const cron = require("node-cron");
const { SaleSession, Game } = require("./models");
const { Op } = require("sequelize");

const closeExpiredSessions = async () => {
    try {
        const now = new Date();

        // Récupérer toutes les sessions qui viennent de se terminer
        const expiredSessions = await SaleSession.findAll({
            where: {
                endDate: { [Op.lt]: now } // Sessions dont la date de fin est dépassée
            }
        });

        if (expiredSessions.length === 0) {
            console.log("Aucune session expirée à clôturer.");
            return;
        }

        for (const session of expiredSessions) {
            // Mettre à jour les jeux liés à cette session
            await Game.update(
                { status: "retiré" },
                {
                    where: {
                        saleSessionId: session.id,
                        status: { [Op.or]: ["en vente", "depot"] }
                    }
                }
            );

            console.log(`Session ${session.id} clôturée automatiquement et jeux mis à jour.`);
        }
    } catch (error) {
        console.error("Erreur lors de la clôture automatique des sessions :", error);
    }
};

// Planifier l'exécution toutes les heures (modifiable selon besoin)
cron.schedule("0 * * * *", () => {
    console.log("🔄 Vérification des sessions expirées...");
    closeExpiredSessions();
});

module.exports = { closeExpiredSessions };
