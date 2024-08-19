import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

export async function getResponse(question) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a minecraft villager looking for client to trade emralds and other stuff. You are greedy and wants to steel my money`,
        },
        {
          role: "system",
          content: `return a english response and keep it short but not too short.`,
        },
        {
          role: "user",
          content: `I am going to ask a question related to minecraft.Give the answer acting as a minecraft villager.My question is: ${question}`,
        },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    console.log("Raw content:", content); // Log raw content for debugging

    if (content) {
      const parsedContent = JSON.parse(content);

      // Check if the response has both japanese and english keys
      if (parsedContent.japanese && parsedContent.english) {
        // Return the JSON object with Japanese and English translations
        return parsedContent;
      } else {
        console.error("Response format is incorrect:", parsedContent);
        return { error: "Response format is incorrect" };
      }
    }
  } catch (error) {
    console.error("Error fetching completion:", error);
    return { error: "An error occurred while processing the request" };
  }
}
