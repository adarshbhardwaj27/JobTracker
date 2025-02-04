const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const app = express();
require('dotenv').config();
require('./models/dbConnect');
const authRoutes = require('./routes/authRoutes');
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
// const jobApplicationKeywords = [
//     "upload resume", "upload cv", "upload cover letter", "choose file", "submit application",
//     "application form", "job application", "personal details", "contact information",
//     "resume upload", "cv upload", "cover letter upload", "apply now", "submit resume",
//     "submit cv", "attach resume", "attach cv", "job title", "position applied", "desired position",
//     "start date", "availability date", "employment history", "education history", "skills required",
//     "current employer", "previous employer", "work experience", "education level", "certification details",
//     "degree", "major", "references available", "reference contact", "resume summary", "work samples",
//     "portfolio link", "linkedin profile", "online portfolio", "personal statement", "why us",
//     "why you", "how did you hear about us", "desired salary", "expected salary", "salary range",
//     "voluntary disclosure", "equal opportunity employer", "affirmative action", "background check",
//     "pre-employment check", "work authorization", "visa status", "right to work", "interview availability",
//     "job application form", "candidate profile", "employment type", "full-time", "part-time",
//     "contract", "internship", "freelance", "remote work", "location preference", "remote position",
//     "company culture fit", "job offer", "job description", "job posting", "apply today", "send application",
//     "apply via email", "submit via email", "job reference", "referral code", "cover letter details",
//     "job location", "application deadline", "interview process", "application status", "send to recruiter",
//     "contact recruiter", "email recruiter", "job board", "talent acquisition", "recruitment process",
//     "application submitted", "follow-up", "status update", "thank you for applying", "next steps",
//     "job opening", "open position", "open role", "hiring process", "recruitment form", "apply online",
//     "candidate evaluation", "pre-screening questions", "pre-interview questions", "online assessment",
//     "job test", "skills test", "company values", "cultural fit", "career growth", "internal referral",
//     "employee benefits", "workplace flexibility", "employment eligibility", "work experience required",
//     "education requirements", "minimum qualifications", "application instructions", "cover letter instructions"
// ];

const jobApplicationKeywords = [
    "thank you for applying", "application received", "thank you for your submission",
    "your application has been received", "application successful", "application confirmation",
    "thank you for your interest", "we have received your application", "next steps", "we'll be in touch",
    "confirmation email", "you will hear from us soon", "thank you for your time", "application sent",
    "successful submission", "thank you for your application", "submission complete", "application completed",
    "we appreciate your application", "appreciate your interest", "submitted successfully", "we've received your details",
    "thank you for considering us", "reviewing your application", "we are reviewing", "we'll review your application",
    "check your inbox", "confirmation sent", "next steps coming soon", "you'll hear from us soon", "recruitment team review",
    "thank you message", "we are processing your application", "application status", "review process started",
    "status update coming soon", "thank you for your interest in joining", "message sent", "confirmation pending",
    "application acknowledgement", "submission confirmation", "applying complete", "form submitted", "we are evaluating your application",
    "we will contact you", "your details have been submitted", "your application is in progress", "we have received your resume",
    "we will review your details", "we'll be in touch soon", "we look forward to reviewing your application", "thank you for applying to",
    "reviewing your profile", "your application has been submitted successfully", "submission complete", "thank you note"
];

function containsKeywords(text) {
    // Convert text to lowercase once
    const lowerCaseText = text.toLowerCase();

    // Check if any keyword is present in the lowercase text
    return jobApplicationKeywords.some(keyword => lowerCaseText.includes(keyword));
}


app.use('/auth/', authRoutes);
app.post('/ai', async (req, res) => {
    // console.log(req.body.data.text);
    console.log('ai')

    // Check if the text contains any of the keywords
    if (containsKeywords(req.body.data.text)) {

        const prompt = `I will share the content of a website in text format. Based on the content, provide a one-word answer: 'true' if it is a job application website, or 'false' if it is not. The website content is ${req.body.data.text}`;

        try {
            const result = await model.generateContent(prompt);

            const responseText = result.response.text().trim().toLowerCase();

            const booleanResponse = responseText === 'true'; // true if 'true', false if 'false'

            // Send the boolean response as JSON
            // console.log(result.response.text());
            return res.json({ response: booleanResponse });
        } catch (error) {
            console.error("Error generating content:", error);
            return res.status(500).json({ error: "Error generating response" }); // Send error in JSON format
        }
    }

    // If it's not an application page, send a JSON response instead of a plain text message
    return res.json({ response: false });  // Return as JSON
});


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})