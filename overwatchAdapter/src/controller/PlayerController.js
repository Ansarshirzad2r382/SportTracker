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

async function stats(req, res) {
    let connection;
    const { playerId } = req.params;

    try {
        console.log(`Fetching stats for Player: ${playerId}`);

        const result = await fetch(`${overfastServer}/players/${playerId}/stats/summary`);
        if (!result.ok) {
            return res.status(404).json({ "No Stats Found": true });
        }
        const data = await result.json();

        connection = await db.pool.getConnection();
        await connection.beginTransaction();

        const snapshotRes = await connection.query(
            "INSERT INTO STATS_SNAPSHOT (PlayerId, CreatedAt) VALUES (?, NOW())",
            [playerId]
        );
        const snapshotId = snapshotRes.insertId;

        //prepared SQL params
        const getStatBlockParams = (snapshotId, categoryType, categoryName, blockData) => {
            return [
                //general data
                snapshotId,
                categoryType,
                categoryName,
                blockData.games_played || 0,
                blockData.games_won || 0,
                blockData.games_lost || 0,
                blockData.time_played || 0,
                blockData.winrate || 0,
                blockData.kda || 0,

                //all data
                blockData.total?.eliminations || 0,
                blockData.total?.assists || 0,
                blockData.total?.deaths || 0,
                blockData.total?.damage || 0,
                blockData.total?.healing || 0,

                //average data
                blockData.average?.eliminations || 0,
                blockData.average?.assists || 0,
                blockData.average?.deaths || 0,
                blockData.average?.damage || 0,
                blockData.average?.healing || 0
            ];
        };

        const insertQuery = `
            INSERT INTO STAT_BLOCK (
                SnapshotId, CategoryType, CategoryName, GamesPlayed, GamesWon, GamesLost, TimePlayed, Winrate, Kda,
                TotalEliminations, TotalAssists, TotalDeaths, TotalDamage, TotalHealing,
                AvgEliminations, AvgAssists, AvgDeaths, AvgDamage, AvgHealing
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;


        if (data.general) {
            const params = getStatBlockParams(snapshotId, 'general', 'all', data.general);
            await connection.query(insertQuery, params);
        }


        if (data.roles) {
            for (const [roleName, roleData] of Object.entries(data.roles)) {
                const params = getStatBlockParams(snapshotId, 'role', roleName, roleData);
                await connection.query(insertQuery, params);
            }
        }

        if (data.heroes) {
            for (const [heroName, heroData] of Object.entries(data.heroes)) {
                const params = getStatBlockParams(snapshotId, 'hero', heroName, heroData);
                await connection.query(insertQuery, params);
            }
        }

        await connection.commit();
        return res.status(200).json(data);

    } catch (e) {
        if (connection) {
            await connection.rollback();
        }
        return res.status(500).json({ error: e.message });
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

export default {searchPlayer, summary, stats};