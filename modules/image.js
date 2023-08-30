import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

// OpenAI API 환경 변수 설정
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function fetchImageURL(title) {
  try {
    const response = await openai.images.generate({
      prompt: title,
      n: 1,
      size: "256x256",
    });
    const imageUrl = response.data[0].url;
    return imageUrl;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
    return null;
  }
}
