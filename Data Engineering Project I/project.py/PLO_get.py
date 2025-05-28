import requests
from lxml import html
import pandas as pd

def run():
    df_doelpunten = pd.DataFrame(columns=["id","a_naam","b_naam","uur","date","a_clubid","b_clubid","eindstand","pday","season"])
    for x in range(1, 11):  # Aangepast naar 11 om beide competities te doorlopen
        urls = [
            f"https://www.transfermarkt.be/jupiler-pro-league-champions-play-offs/spieltag/wettbewerb/EJPL/spieltag/{x}/saison_id/2023",
            f"https://www.transfermarkt.be/jupiler-pro-league-europe-play-offs/spieltag/wettbewerb/POBE/spieltag/{x}/saison_id/2023"
        ]  # Toegevoegde URL voor de Europe Play-offs
        for url in urls:
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
                eindstand=row.xpath('./tr[1]/td[5]/span/a/span')[0].text_content()
                df_doelpunten.loc[len(df_doelpunten)] = {"id": id,"a_naam": a_naam,"b_naam":b_naam ,"uur": uur, "date": date, "a_clubid": a_clubid, "b_clubid": b_clubid, "eindstand": eindstand, "pday": x, "season": 2023} 
            print(f"Season 2023 matchday {x} scraped")
    df_doelpunten.to_csv("PLODoel.csv", index=False)

run()
