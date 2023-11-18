import OpenAI from "openai";
import { RepairTemplate } from "./db/schema/repairTemplates";

const openai = new OpenAI();

export async function classifyPhotoForRepairTemplates(
  photoUrl: string,
  repairTemplates: RepairTemplate[]
) {
  const listOfRepairNamesForPrompt = repairTemplates
    .map((repairTemplate) => repairTemplate.name)
    .join(" OR ");

  const prompt = `
  You will be presented with a photo of a commercial roofing repair and your job is to provide one repair from the following list. Choose ONLY from the list of options provided here and return only that repair name and no other text:
  
  ${listOfRepairNamesForPrompt}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          {
            type: "image_url",
            image_url: {
              url: photoUrl,
            },
          },
        ],
      },
    ],
  });
  return response.choices[0];
}
