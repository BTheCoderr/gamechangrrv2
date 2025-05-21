# GameChanger 2.0

An AI-powered utility research platform to help representatives manage leads, conduct AI-assisted outreach, and book appointments.

## MVP Features

- **Lead Management**
  - Create, view, update, and delete leads
  - Track lead status and appointment booking
  - Visual status badges

- **AI Assistant**
  - Conversational AI for lead interactions
  - Multiple conversation types (introduction, appointment booking, etc.)
  - Voice generation for AI responses
  - Smart context tracking

- **Booking System**
  - Calendar-based appointment scheduling
  - Status tracking
  - Confirmation notifications

- **Multi-Provider AI Support**
  - OpenAI
  - Hugging Face
  - LocalAI
  - Anthropic
  - Mock provider for demo purposes

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **APIs**: RESTful API design with Next.js API routes
- **AI Services**: Multiple provider integration
- **Storage**: Currently using localStorage (to be replaced with a database)

## Setup Instructions

1. Clone the repository
   ```
   git clone https://github.com/yourusername/gamechanger-2.0.git
   cd gamechanger-2.0
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env.local` file with the following variables:
   ```
   # OpenAI
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key

   # ElevenLabs (for voice generation)
   NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_key

   # Optional: Twilio (for real phone calls)
   NEXT_PUBLIC_TWILIO_ACCOUNT_SID=your_twilio_sid
   NEXT_PUBLIC_TWILIO_AUTH_TOKEN=your_twilio_token
   NEXT_PUBLIC_TWILIO_PHONE_NUMBER=your_twilio_phone
   ```

4. Run the development server
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Next Steps for Production

1. **Database Integration**
   - Set up a PostgreSQL or MongoDB database
   - Create Prisma or Mongoose models
   - Migrate from localStorage to the database

2. **Authentication**
   - Implement Next-Auth for user login
   - Set up role-based access control (admin, manager, rep)

3. **API Enhancement**
   - Add input validation with Zod or Yup
   - Implement rate limiting
   - Add error logging

4. **Testing**
   - Add unit tests with Jest
   - Add integration tests for API
   - Add E2E tests with Cypress

5. **DevOps**
   - Set up CI/CD pipeline
   - Configure proper environment variables
   - Deploy to Vercel or similar

## License

This project is proprietary and confidential.

## Contact

For support or inquiries, please contact your project manager. # gamechangrrv2
