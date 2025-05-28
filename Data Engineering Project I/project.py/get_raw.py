import requests
from lxml import html
import pandas as pd

def run():
    df_doelpunten = pd.DataFrame(columns=["id","a_naam","b_naam","team_scoort", "tijd","stand","uur","date","a_clubid","b_clubid","id_scorend_team"])
    
    days = pd.read_csv("game_days.csv")
    for i, r in days.iterrows():
        y, x = r["season"], r["pday"]
        url= f"https://www.transfermarkt.be/jupiler-pro-league/spieltag/wettbewerb/BE1/plus/?saison_id={y}&spieltag={x}"
        
        html_string = requests.get(url, headers={"User-agent": "Mozilla/5.0 (X11; Linux armv7l) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Odin/88.4324.2.10 Safari/537.36 Model/Hisense-MT9602 VIDAA/6.0(Hisense;SmartTV;43A53FUV;MTK9602/V0000.06.12A.N0406;UHD;HU43A6100F;)"}).content
        tree = html.fromstring(html_string)
        rows = tree.xpath('//tbody[descendant::a[starts-with(@href, "/spielbericht/")]]')
        for row in rows:
            id = row.xpath('./tr[1]/td[5]/span/a')[0].get("href").split('/')[-1]
            a_naam = row.xpath('./tr[1]/td[1]/a')[0].text_content()
            b_naam = row.xpath('./tr[1]/td[8]/a')[0].text_content()
            uur = row.xpath('./tr[2]/td')[0].text_content().strip().replace('\n', '').replace('\xa0', '').replace('    ', '').replace('    ', '').replace(' - ', ' - ')
            date = row.xpath('./tr[2]/td/a')[0].text_content().strip().replace('\n', '').replace('\xa0', '').replace('    ', '').replace('    ', '').replace(' - ', ' - ')
            a_clubid=row.xpath('./tr[1]/td[1]/a')[0].get("href").split('/')[-3]
            b_clubid=row.xpath('./tr[1]/td[8]/a')[0].get("href").split('/')[-3]
            rij = row.xpath('./tr[contains(@class, "spieltagsansicht-aktionen")]')   
            for ri in rij:
                stand_elements = ri.xpath('./td[@class="zentriert hauptlink"]')
                a_tijd_elements = ri.xpath('./td[@class="zentriert no-border-links"]')
                b_tijd_elements = ri.xpath('./td[@class="zentriert no-border-rechts"]')

                if stand_elements:
                    stand_s = stand_elements[0].text_content()
                else:
                    continue

                if a_tijd_elements:
                    a_tijd = a_tijd_elements[0].text_content()
                else:
                    continue

                if b_tijd_elements:
                    b_tijd = b_tijd_elements[0].text_content()
                else:
                    continue

                if a_tijd.endswith("'"):
                    team_scoort = a_naam
                    tijdstipgoal= a_tijd
                    id_scorend_team = a_clubid
                elif b_tijd.endswith("'"):
                    team_scoort = b_naam
                    tijdstipgoal= b_tijd
                    id_scorend_team = b_clubid
                df_doelpunten.loc[len(df_doelpunten)] = {"id": id,"a_naam": a_naam,"b_naam":b_naam , "team_scoort": team_scoort, "tijd": tijdstipgoal, "stand": stand_s, "uur": uur, "date": date, "a_clubid": a_clubid, "b_clubid": b_clubid,"id_scorend_team": id_scorend_team} 
        print(f"Season {y} matchday {x} scraped")
    df_doelpunten.to_csv("doel.csv", index=False)

run()

