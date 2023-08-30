import Genius from "genius-lyrics";

export async function getLyrics(title, artist) {
  const Client = new Genius.Client(
    "glUAKQfjq81QqmqX6SCaq3OiUcavY7q1doNvfaLBD469fDKh8WtLIoYyq34r--pF"
  );

  const searches = await Client.songs.search(artist + " " + title);

  let targetSong = "none";
  const artistName = artist.toLowerCase();

  for (let i = 0; i < searches.length; i++) {
    console.log(searches[i].title);
    const nominee = searches[i].artist.name.toLowerCase();
    if (nominee.includes(artistName)) {
      console.log("found");
      targetSong = searches[i];
      break;
    }
  }
  const lyrics = await targetSong.lyrics();
  console.log(lyrics);

  return lyrics;
}
