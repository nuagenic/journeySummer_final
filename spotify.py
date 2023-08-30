# authentification
SPOTIFY_CLIENT_ID="0be6da6b7294432d9545984f45c51b95"
SPOTIFY_CLIENT_SECRET="0b6b0ca6d4814e3499623359cd5df5b3"
SPOTIFY_REDIRECT_URI="http://localhost:8888/callback"

# logging in
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
client_credentials_manager = SpotifyClientCredentials(client_id = SPOTIFY_CLIENT_ID, client_secret = SPOTIFY_CLIENT_SECRET)
sp = spotipy.Spotify(client_credentials_manager = client_credentials_manager)
playlists = sp.playlist('37i9dQZEVXbNxXF4SkHj9F')['tracks']['items']

# load data
chart = {'title':[]}
for song in playlists:
    chart['title'].append(song['track']['name'])

import random
track = random.choice(playlists)['track']

# track info
import os, json
artist_name = track['artists'][0]['name']
track_popularity = track['popularity']
track_name = track['name']
track_cover_image = track['album']['images'][0]
track_duration_ms = track['duration_ms']

# data preprocessing
idx = track_name.lower().find('feat')
if idx != -1:
    track_name = track_name[:idx-1].strip()

# s
track_info = {'artist': {'artist_name': artist_name},
            'track': {'track_popularity': track_popularity, 
                        'track_name': track_name, 
                        'track_cover_image': track_cover_image, 
                        'track_duration': track_duration_ms}
}

with open(os.path.join(os.getcwd(), 'assets/chart.json'), 'w') as f:
    json.dump(chart, f)
with open(os.path.join(os.getcwd(), 'assets/spotify_result.json'), 'w') as f:
    json.dump(track_info, f)
