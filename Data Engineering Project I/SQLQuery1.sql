-- (4)In hoeveel procent van de wedstrijden wordt er niet gescoord?

WITH EindUitslag AS (
    SELECT WedstrijdKey, MAX(MinuutInWedstrijd) AS einduitslag
    FROM FactScore
    GROUP BY WedstrijdKey
)
SELECT COUNT(*) AS TotaalAantalWedstrijden,
    SUM(CASE WHEN ThuisScore = 0 AND UitScore = 0 THEN 1 ELSE 0 END) AS AantalWedZonderDoel,
    (SUM(CASE WHEN ThuisScore = 0 AND UitScore = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS PercWedZonderDoel
	FROM FactScore f
JOIN EindUitslag u ON u.WedstrijdKey = f.WedstrijdKey AND u.einduitslag = f.MinuutInWedstrijd;

-- (5)In hoeveel procent van de wedstrijden wordt er maar door 1 ploeg gescoord?

WITH EindUitslag AS (
    SELECT WedstrijdKey, MAX(MinuutInWedstrijd) AS einduitslag
    FROM FactScore
    GROUP BY WedstrijdKey
)
SELECT 
    COUNT(*) AS TotaalAantalWedstrijden,
    SUM(CASE WHEN (ThuisScore > 0 AND UitScore = 0) OR (ThuisScore = 0 AND UitScore > 0) THEN 1 ELSE 0 END) AS AantalWedéénTeamScoort,
    (SUM(CASE WHEN (ThuisScore > 0 AND UitScore = 0) OR (ThuisScore = 0 AND UitScore > 0) THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) AS PercAantalWedéénTeamScoort
FROM FactScore f
JOIN EindUitslag u ON u.WedstrijdKey = f.WedstrijdKey AND u.einduitslag = f.MinuutInWedstrijd;


-- (5)Is er in de historische voetbaldata een ploeg terug te vinden die geen enkele of 1match gewonnen heeft gedurende de volledige competitie van één seizoen?
WITH MaxAantalPerSeizoen AS (
    SELECT d.Seizoen, MAX(f.AantalWedstrijden) AS MaxAantalWedstrijden
    FROM FactKlassement f
    JOIN dimDate d ON f.EindeSpeeldagDateKey = d.DateKey
    GROUP BY d.Seizoen
)
SELECT f.*
FROM FactKlassement f
JOIN dimDate d ON f.EindeSpeeldagDateKey = d.DateKey
JOIN MaxAantalPerSeizoen m ON d.Seizoen = m.Seizoen AND f.AantalWedstrijden = m.MaxAantalWedstrijden
where f.AantalGewonnen<=1

