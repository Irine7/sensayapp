# Dynamic People Lists Feature

## Description

Implemented dynamic people lists system with AI chat integration. Users can request lists of investors, mentors, or founders, and the AI agent will automatically redirect to the corresponding dynamic page.

## Components

### 1. Dynamic Page `/people/[category]/page.tsx`

- Displays people lists by categories (investors, mentors, founders)
- Supports search and filtering
- Shows detailed information about each person
- Includes statistics and compatibility metrics

### 2. API `/api/people/[category]/route.ts`

- Returns people list by category
- Supports search by query
- Contains mock data for demonstration

### 3. Components

- `PeopleListTrigger` - button to navigate to people list
- `AITriggerDemo` - demonstration of AI triggers

### 4. Utilities

- `generatePeopleListTrigger.ts` - generates triggers for AI
- `parseTrigger.ts` - updated to support new trigger type

## How it works

### 1. User requests people list in chat

```
User: "Show investors for pre-seed startup"
```

### 2. AI agent generates trigger

```javascript
const trigger = {
	action: 'showPeopleList',
	payload: {
		category: 'investors',
		query: 'pre-seed startup',
	},
};
```

### 3. Trigger is processed and user is redirected

```javascript
// In parseTrigger.ts
if (trigger.action === 'showPeopleList') {
	const { category, query } = trigger.payload;
	router.push(`/people/${category}?q=${encodeURIComponent(query)}`);
}
```

### 4. Dynamic page displays results

The page automatically:

- Loads people by category
- Applies search filters
- Shows relevant results

## Categories

### Investors

- Angel investors
- VC funds
- Corporate investors
- Investment criteria and focus areas

### Mentors

- Industry experts
- Successful entrepreneurs
- Technical advisors
- Mentorship areas

### Founders

- Successful entrepreneurs
- Serial founders
- Industry leaders
- Experience and expertise

## Search and Filtering

- **Text search**: Search by name, company, or description
- **Category filter**: Filter by specific categories
- **Compatibility**: Match based on user profile and needs
- **Location**: Filter by geographic location
- **Industry**: Filter by industry focus

## AI Integration

The system uses AI triggers to:

- Understand user intent
- Generate appropriate queries
- Navigate to relevant pages
- Provide contextual information

## Mock Data

Currently uses mock data for demonstration:

- 50+ investors
- 30+ mentors
- 20+ founders
- Realistic profiles and information

## Future Enhancements

- Real API integration
- User authentication
- Personalized recommendations
- Advanced filtering options
- Contact and communication features

## Usage Examples

### Basic Usage

```tsx
import { PeopleListTrigger } from '@/components/people-list-trigger';

function MyComponent() {
	return <PeopleListTrigger category="investors" query="fintech startup" />;
}
```

### AI Integration

```tsx
// In chat interface
const handleAITrigger = (trigger) => {
	if (trigger.action === 'showPeopleList') {
		const { category, query } = trigger.payload;
		router.push(`/people/${category}?q=${query}`);
	}
};
```

## API Endpoints

### GET /api/people/[category]

**Parameters:**

- `category`: investors | mentors | founders
- `q`: search query (optional)

**Response:**

```json
{
	"category": "investors",
	"query": "fintech",
	"people": [
		{
			"id": "1",
			"name": "John Doe",
			"company": "Tech Ventures",
			"description": "Early stage investor...",
			"focus": ["fintech", "AI"],
			"location": "San Francisco"
		}
	],
	"totalCount": 25
}
```

## Styling

Uses Tailwind CSS with:

- Responsive grid layout
- Card-based design
- Search and filter components
- Loading states
- Empty states

## Performance

- Lazy loading of people data
- Efficient search and filtering
- Optimized re-renders
- Cached API responses
