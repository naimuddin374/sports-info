const axios = require('axios');
const fs = require('fs').promises;
require('dotenv').config();

const URLS = [
  {
    url: 'https://flashscore.p.rapidapi.com/v1/sports/events-count',
    params: {
      timezone: '-4',
      locale: 'en_GB',
    },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/rankings/list',
    params: { sport_id: '2', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/rankings/data',
    params: { locale: 'en_GB', ranking_id: 'dSJr14Y8' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/news',
    params: { locale: 'en_GB', event_id: '6ZCocWsb' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/list',
    params: {
      indent_days: '0',
      sport_id: '1',
      timezone: '-4',
      locale: 'en_GB',
    },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/points-history',
    params: { locale: 'en_GB', event_id: '6ZCocWsb' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/fall-of-wickets',
    params: { locale: 'en_GB', event_id: 'tK1xeE9p' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/scorecard',
    params: { event_id: 'tK1xeE9p', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/report',
    params: { event_id: '4U8yxaPL', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/live-update',
    params: { sport_id: '1', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/highlights',
    params: { locale: 'en_GB', event_id: '6ZCocWsb' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/h2h',
    params: { locale: 'en_GB', event_id: 'n9Wtc6KT' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/statistics',
    params: { event_id: 'lzEM9v0K', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/odds',
    params: { locale: 'en_GB', event_id: '6ZCocWsb' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/last-change',
    params: { locale: 'en_GB', event_id: 'nuoDxVbt' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/preview',
    params: { locale: 'en_GB', event_id: '4U8yxaPL' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/ball-by-ball',
    params: { event_id: 'tK1xeE9p', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/missing-players',
    params: { event_id: '6ZCocWsb', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/commentary',
    params: { event_id: '4U8yxaPL', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/lineups',
    params: { locale: 'en_GB', event_id: 'ClXzMwgi' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/commentary-alt',
    params: { locale: 'en_GB', event_id: 'tK1xeE9p' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/summary',
    params: { event_id: '6ZCocWsb', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/data',
    params: { locale: 'en_GB', event_id: '6ZCocWsb' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/live-list',
    params: { timezone: '-4', sport_id: '1', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/teams/results',
    params: { sport_id: '1', team_id: 'Wtn9Stg0', locale: 'en_GB', page: '1' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/teams/fixtures',
    params: { sport_id: '1', team_id: 'Wtn9Stg0', locale: 'en_GB', page: '1' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/teams/news',
    params: { locale: 'en_GB', team_id: 'Wtn9Stg0' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/teams/squad',
    params: { locale: 'en_GB', sport_id: '1', team_id: 'Wtn9Stg0' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/teams/transfers',
    params: { team_id: 'Wtn9Stg0', locale: 'en_GB', page: '1' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/teams/data',
    params: { locale: 'en_GB', team_id: 'Wtn9Stg0', sport_id: '1' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/tournaments/stages/data',
    params: { locale: 'en_GB', tournament_stage_id: '6kJqdMr2' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/tournaments/standings',
    params: {
      standing_type: 'home',
      locale: 'en_GB',
      tournament_stage_id: '6kJqdMr2',
      tournament_season_id: 'tdkpynmB',
    },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/tournaments/seasons/data',
    params: { season_id: 'ryC5w1EL', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/tournaments/results',
    params: { tournament_stage_id: '6kJqdMr2', locale: 'en_GB', page: '1' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/tournaments/stages',
    params: { locale: 'en_GB', sport_id: '1' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/tournaments/list',
    params: { sport_id: '1', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/tournaments/popular',
    params: { locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/players/transfers',
    params: { sport_id: '1', player_id: 'vgOOdZbd', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/players/data',
    params: { sport_id: '1', player_id: 'vgOOdZbd', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/players/career',
    params: { sport_id: '1', player_id: 'vgOOdZbd', locale: 'en_GB' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/players/last-events',
    params: { locale: 'en_GB', player_id: 'vgOOdZbd', sport_id: '1' },
  },
  {
    url: 'https://flashscore.p.rapidapi.com/v1/events/live-odds',
    params: { book_id: '5', event_id: 'fLf0SGQJ', locale: 'en_GB' },
  },
];

async function getdata() {
  for (let i = 0; i < URLS.length; i++) {
    const url = URLS[i].url;
    console.log(url);
    const name =
      'testdata/' +
      url
        .replace('https://flashscore.p.rapidapi.com/v1/', '')
        .replace(/\//g, '-') +
      '.json';

    try {
      await fs.access(name, fs.F_OK);
    } catch (e) {
      console.log(url + ' -> ' + name);
      const response = await axios.get(url, {
        params: URLS[i].params,
        headers: {
          'X-RapidAPI-Host': process.env.API_HOST,
          'X-RapidAPI-Key': process.env.API_KEY,
        },
      });

      await fs.writeFile(name, JSON.stringify(response.data, null, 2));

      await new Promise((resolve) => {
        setTimeout(resolve, 200);
      });
    }
  }
}

getdata().then(() => {
  console.log('Done!');
});
