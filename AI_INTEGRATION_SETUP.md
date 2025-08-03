# AI Integration Setup Guide

## Google AI Studio (Gemini) Integration

This application now includes dynamic question generation using Google AI Studio's Gemini API. The AI generates contextually relevant questions based on product categories and previous user responses.

## Setup Instructions

### 1. Get Google AI Studio API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key for the next step

### 2. Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Google AI Studio (Gemini) API Configuration
VITE_GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Supabase Configuration (already configured)
VITE_SUPABASE_URL=https://jeqlvlvgfexxhmpekwtq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplcWx2bHZnZmV4eGhtcGVrd3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDgyMDQsImV4cCI6MjA2OTc4NDIwNH0.M73x-5GRC18N0bcZmnA3V4Vh2HU38Q2R6uyFUG9llHY
```

### 3. Install Dependencies

The Google AI SDK has been added to the project. Run:

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

## Features

### Dynamic Question Generation

The AI integration provides:

- **Contextual Questions**: Questions are generated based on the selected product category
- **Adaptive Responses**: Questions adapt based on previous user responses
- **Multiple Question Types**: Text, number, select, multiselect, and boolean questions
- **Fallback System**: Pre-defined questions when AI is unavailable
- **Caching**: Questions are cached to avoid repeated API calls

### Question Categories

1. **Manufacturing & Sourcing** (Step 2)

   - Ingredient/component sourcing
   - Manufacturing processes
   - Supply chain visibility
   - Quality control measures

2. **Testing & Certifications** (Step 3)

   - Quality testing procedures
   - Safety certifications
   - Third-party validation
   - Compliance standards

3. **Environmental Impact** (Step 4)
   - Sustainability practices
   - Packaging materials
   - Carbon footprint
   - Environmental certifications

### Product Categories Supported

- Food & Beverages
- Personal Care
- Electronics
- Clothing & Textiles
- Household Items
- Automotive

## Technical Implementation

### Files Added/Modified

1. **`src/integrations/ai/client.ts`** - AI service module
2. **`src/hooks/use-ai-questions.ts`** - React hook for AI questions
3. **`src/components/AIQuestionForm.tsx`** - Form component for AI questions
4. **`src/pages/Submit.tsx`** - Updated with AI integration
5. **`package.json`** - Added Google AI SDK dependency

### Key Features

- **Error Handling**: Graceful fallback to pre-defined questions
- **Loading States**: User-friendly loading indicators
- **Caching**: Prevents unnecessary API calls
- **Type Safety**: Full TypeScript support
- **Responsive Design**: Works on all screen sizes

## API Usage

The AI service uses the `gemini-pro` model with the following prompt structure:

```typescript
const prompt = `Generate 5-7 relevant questions about ${step} for a ${category} product.
Focus on:
- [Category-specific focus areas]
- [Industry standards]
- [Best practices]

Format as a JSON array of question objects with 'id', 'question', 'type', and 'required' fields.`;
```

## Fallback System

If the AI service is unavailable or fails, the system automatically falls back to pre-defined questions for each category and step. This ensures the application remains functional even without AI.

## Security Considerations

- API keys are stored in environment variables
- No sensitive data is sent to the AI service
- All user responses are handled locally
- API calls are made only when necessary

## Troubleshooting

### Common Issues

1. **"API key not found" error**

   - Ensure `.env` file exists in the root directory
   - Verify the API key is correctly set
   - Restart the development server

2. **Questions not generating**

   - Check browser console for errors
   - Verify API key has proper permissions
   - Check network connectivity

3. **Fallback questions appearing**
   - This is normal when AI is unavailable
   - Check API key configuration
   - Verify Google AI Studio account status

### Debug Mode

To see detailed logs, check the browser console for:

- API call attempts
- Response parsing
- Fallback triggers
- Error messages

## Support

For issues with:

- **Google AI Studio**: Visit [Google AI Studio Support](https://ai.google.dev/support)
- **Application Integration**: Check the browser console and network tab
- **Setup Issues**: Verify environment variables and dependencies

## Cost Considerations

- Google AI Studio has usage-based pricing
- Each question generation costs approximately $0.001-0.005
- Caching reduces API calls and costs
- Fallback system prevents unnecessary charges when AI is unavailable
