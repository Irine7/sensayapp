import { NextRequest, NextResponse } from 'next/server';

interface Person {
	id: string;
	name: string;
	role: string;
	company: string;
	description: string;
	location: string;
	expertise: string[];
	investmentStage?: string;
	investmentRange?: string;
	portfolioSize?: number;
	matchPercentage?: number;
	profileImage?: string;
	linkedinUrl?: string;
	website?: string;
}

interface PeopleListResponse {
	category: string;
	query: string;
	people: Person[];
	totalCount: number;
}

// People data is obtained only from AI agent through chat
// No hardcoded mocks!

export async function GET(
	request: NextRequest,
	{ params }: { params: { category: string } }
) {
	try {
		const { searchParams } = new URL(request.url);
		const query = searchParams.get('q') || '';
		const category = params.category;

		// Return empty list - data is obtained only from AI agent
		const people: Person[] = [];

		const response: PeopleListResponse = {
			category,
			query,
			people,
			totalCount: 0,
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error('Error in people API:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
}
