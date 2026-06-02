import db from "../../db.js"


const overfastServer = "https://overfast-api.tekrop.fr";

async function searchPlayer(req, res) {
    const {query} = req.params;
    try {

        const result = await fetch(`${overfastServer}/players?name=${query}`);
        if (!result.ok) {
            return res.status(404).json({"No Players Found": true});
        }
        const data = await result.json();
        console.log(`Search for ${query} successfull`);

        return res.status(200).json({data})

    } catch (e) {
        throw e;
    }
}

async function summary(req, res) {
    let connection;
    const {playerId} = req.params;
    try {
        console.log(playerId);
        const result = await fetch(`${overfastServer}/players/${playerId}/summary`);
        if (!result.ok) {
            return res.status(404).json({"No Players Found": true});
        }
        const data = await result.json();

        connection = await db.pool.getConnection();
        await connection.beginTransaction();
        await connection.query(`
            INSERT INTO PLAYER (PlayerId, Username, AvatarUrl, NamecardUrl, EndorsementLevel, LastUpdated)
            VALUES (?, ?, ?, ?, ?, FROM_UNIXTIME(?)) ON DUPLICATE KEY
            UPDATE
                AvatarUrl =
            VALUES (AvatarUrl), EndorsementLevel =
            VALUES (EndorsementLevel), LastUpdated =
            VALUES (LastUpdated)
        `, [playerId, data.username, data.avatar, data.namecard, data.endorsement.level, data.last_updated_at]);
        if (data.competitive) {
            for (const platform of ['pc', 'console']) {
                const platformData = data.competitive[platform];
                if (platformData) {
                    // CompStat Eintrag erstellen
                    const compRes = await connection.query(
                        "INSERT INTO COMPETITIVE_STAT (PlayerId, Platform, Season) VALUES (?, ?, ?)",
                        [playerId, platform, platformData.season]
                    );
                    const compStatId = compRes.insertId;

                    // Rollen (Tank, Damage, Support) loopen und in ROLE_RANK schreiben
                    const roles = ['tank', 'damage', 'support'];
                    for (const role of roles) {
                        const roleData = platformData[role];
                        if (roleData) {
                            await connection.query(
                                "INSERT INTO ROLE_RANK (CompStatId, RoleName, Division, Tier) VALUES (?, ?, ?, ?)",
                                [compStatId, role, roleData.division, roleData.tier]
                            );
                        }
                    }

                }
            }
        }
        await connection.commit();
        return res.status(200).json(data);
    } catch (e) {
        throw e;
    }
}

export default {searchPlayer, summary};