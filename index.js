import http from "http";
import fs from "fs";
import url from "url";
import { getLyrics } from "./modules/getLyrics.js";
import { fetchImageURL } from "./modules/image.js";
import { exec } from "child_process"; // Python 실행을 위한 모듈 추가
import { connectDB } from "./util/database.js";

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

            // openAI image 불러오기
            const imageURL = await fetchImageURL(trackName);

            const db = (await connectDB).db("JourneySummer");
            let result = await db
              .collection("image_url")
              .insertOne({ _id: { $oid: "1" }, img_url: { imageURL } });

            console.log(result);

            response.writeHead(200, { "Content-Type": "text/plain" });
            response.end(
              `Track Name: ${trackName}\n\nimageURL: ${imageURL}\n\nLyrics:\n${lyrics}`
            );
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

app.listen(3001);
