import http from "http";
import fs from "fs";
import url from "url";
import { getLyrics } from "./modules/getLyrics.js";
import { exec } from "child_process"; // Python 실행을 위한 모듈 추가

const app = http.createServer(async (request, response) => {
  const _url = request.url;
  const pathname = url.parse(_url, true).pathname;

  if (pathname === "/") {
    try {
      // Python 코드 실행
      exec("python modules/spotify.py", async (error, stdout, stderr) => {
        if (error) {
          console.error(error);
          response.writeHead(500);
          response.end("Internal Server Error");
        } else {
          try {
            const spotifyData = fs.readFileSync(
              "assets/spotify_result.json",
              "utf-8"
            );
            const jsonData = JSON.parse(spotifyData);
            const trackName = jsonData.track.track_name;
            const artistName = jsonData.artist.artist_name;

            const lyrics = await getLyrics(trackName, artistName);

            response.writeHead(200, { "Content-Type": "text/plain" });
            response.end(`Track Name: ${trackName}\nLyrics:\n${lyrics}`);
          } catch (jsonError) {
            console.error(jsonError);
            response.writeHead(500);
            response.end("Error reading JSON data");
          }
        }
      });
    } catch (error) {
      console.error(error);
      response.writeHead(500);
      response.end("Internal Server Error");
    }
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});

app.listen(3000);
