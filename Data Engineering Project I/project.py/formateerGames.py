import pandas as pd

import time
import requests
from lxml import html
import pandas as pd
from datetime import datetime

game_columns = ["id", "a_name", "b_name", "a_score", "b_score", "season", "pday", "dt"]
user_agent = "Mozilla/5.0 (X11; U; Linux i686) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/99.0.4891.124 Chrome/99.0.4891.124 Safari/537.36"

def scrape(tree: html.HtmlElement, season: int, pday: int) -> pd.DataFrame:


  games = pd.DataFrame(columns=game_columns)
  game_es = tree.xpath('//tr[descendant::a[starts-with(@href, "/spielbericht/")]]')
  dt: datetime = None
  time_s = "00:00"

  for game_e in game_es:
    
    # ID and Scores
    score_e = game_e.xpath('.//span[starts-with(@id, "ergebnis")]')[0]
    id = score_e.get("id").split("_")[1]
    score_s = score_e.text_content().strip()
    score_l = score_s.split(":")
    a_score, b_score = int(score_l[0]), int(score_l[1])

    # Teams
    idfk_es = game_e.xpath('.//a[contains(@href, "/spielplan/verein/")]')
    a_name = idfk_es[0].get('title')
    b_name = idfk_es[-1].get('title')

    # Datetime
    date_es = game_e.xpath('.//a[contains(@href, "/datum/")]')
    # if date is filled -> new date
    if 0 < len(date_es):
      date_e = date_es[0]
      date_s = date_e.get("href").split("/")[-1]
    
    # if time is filled -> new time  
    time_s2 = game_e.xpath('./td[2]')[0].text_content().strip()
    if time_s2 != "":
      time_s = time_s2

    dt = datetime.strptime(f"{date_s} {time_s}", "%Y-%m-%d %H:%M")      

    # Add
    game = {
      "id": id,
      "a_name": a_name,
      "b_name": b_name,
      "a_score": a_score,
      "b_score": b_score,
      "season": season,
      "pday": pday,
      "dt": dt
    }
    games.loc[len(games)] = game
  
  return games

def is_valid(tree: html.HtmlElement) -> bool:
  return 0 < len(tree.xpath('//tr[descendant::a[starts-with(@href, "/spielbericht/")]]'))

def get(url: str, n_tries: int = 0) -> bytes:
  try:
    return requests.get(url, headers={"User-agent": user_agent}).content
  except Exception as e:
    if n_tries > 10:
      return ""
    time.sleep(2)
    return get(url, n_tries=n_tries+1)

def run():
  games = pd.DataFrame(columns=game_columns)
  for season in range(1960, 2024):
    for pday in range(1, 35):
      url = f"https://www.transfermarkt.be/jupiler-pro-league/spieltagtabelle/wettbewerb/BE1?saison_id={season}&spieltag={pday}"
      content = get(url)
      tree = html.fromstring(content)
      print(f"Got {len(content)} bytes from {url}")
      if is_valid(tree):
        pday_games = scrape(tree, season, pday)
        games = pd.concat([games, pday_games])
        print(f"Added {len(pday_games)} games from {season}:{pday}\n")
  games.to_csv("./games.csv")
if __name__ == "__main__":
  run()



def append_to_games():
  columns = ['club_id', 'mogelijke_naam', 'stamnummer', 'naam']
  sn = pd.read_csv('stamnummers.csv', sep=';', encoding='ISO-8859-1', names=columns)

  def get_sn(club_id):
    return sn[sn['club_id'] == club_id].iloc[0]['stamnummer']
  def get_a_sn(row):
    return get_sn(row["a_club_id"])
  def get_b_sn(row):
    return get_sn(row["b_club_id"])

  df = pd.read_csv('games.csv')
  df["a_sn"] = df.apply(get_a_sn, axis=1)
  df["b_sn"] = df.apply(get_b_sn, axis=1)
  df.to_csv('wedstrijd.csv', index=False)


if __name__ == "__main__":
  append_to_games()

  
df = pd.read_csv('wedstrijd.csv', sep=',', header=0)

df = df[['season', 'pday', 'dt', 'uur', 'id', 'a_sn', 'a_name', 'b_sn', 'b_name', 'a_score', 'b_score']]

df.to_csv('wedstrijd.csv', sep=';', index=False, header=False)
