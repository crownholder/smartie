import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { OpenAI } from 'openai';
dotenv.config();

const openai = new OpenAI({ key: process.env.OPENAI_API_KEY });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from VoxAi',
    });
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        // Make the request to GPT-3.5-turbo API
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",  // GPT-3.5-turbo engine
            messages: [{"role": "user", "content":`${prompt}`}],
            temperature: 0,
            max_tokens: 3000,  // Adjust as needed
            top_p: 1,
            frequency_penalty: 0.5,
        });

        console.log(completion.choices[0]);

        // Extract the generated text from the response
        const generatedText = completion.choices[0].message.content;
        console.log(generatedText);

        // Send the generated text in the response
        res.status(200).json({
            generatedText: generatedText,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            error: "Internal Server Error",
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('server on http://localhost:5000');
});
