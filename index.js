import http from "http";
import fs from "fs";
import url from "url";
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

            // openAI imageURL 불러오기
            const imageURL = await fetchImageURL(trackName);

            // db에 imageURL 넣기
            const db = (await connectDB).db("JourneySummer");
            let result = await db
              .collection("image_url")
              .insertOne({ img_url: { imageURL } });

            console.log(result);

            // db에서 imageURL 불러오기
            let dbImage = await db.collection("image_url").find().toArray();

            console.log(dbImage);

            response.writeHead(200);
            response.end(
              `Track Name: ${trackName}\n\nimageURL: ${imageURL}\n\n ${dbImage}`
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

app.listen(3000);
