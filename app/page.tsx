import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#121316] to-[#0a0a0a]">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10" />
				<div className="container mx-auto px-6 py-20 relative">
					<div className="text-center space-y-8 max-w-4xl mx-auto">
						<Badge
							variant="outline"
							className="mb-4 bg-blue-500/10 border-blue-500/20 text-blue-400"
						>
							🚀 New era of networking
						</Badge>

						<h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
							Evoo
						</h1>

						<p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
							AI-powered networking platform for conferences and events
						</p>

						<p className="text-lg text-gray-400 max-w-2xl mx-auto">
							Connect with like-minded entrepreneurs, find investors, and build
							meaningful relationships through intelligent AI replicas
						</p>

						<div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
							<Button
								size="lg"
								className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
							>
								Get Started
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg"
							>
								Learn More
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 bg-gradient-to-b from-transparent to-gray-900/20">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-white mb-4">Key Features</h2>
						<p className="text-xl text-gray-400 max-w-2xl mx-auto">
							Powerful tools for effective networking at conferences
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<Card className="bg-gray-900/50 border-gray-800 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-105">
							<CardContent className="p-8 text-center space-y-4">
								<div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-white">
									Smart Networking
								</h3>
								<p className="text-gray-400">
									AI-powered matching system connects you with the right people
								</p>
							</CardContent>
						</Card>

						<Card className="bg-gray-900/50 border-gray-800 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105">
							<CardContent className="p-8 text-center space-y-4">
								<div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-white">
									Intelligent Matching
								</h3>
								<p className="text-gray-400">
									Advanced algorithms find perfect matches based on your goals
								</p>
							</CardContent>
						</Card>

						<Card className="bg-gray-900/50 border-gray-800 hover:border-pink-500/50 transition-all duration-300 hover:transform hover:scale-105">
							<CardContent className="p-8 text-center space-y-4">
								<div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-white">
									Pitch Cards
								</h3>
								<p className="text-gray-400">
									Create and share digital business cards with AI assistance
								</p>
							</CardContent>
						</Card>

						<Card className="bg-gray-900/50 border-gray-800 hover:border-green-500/50 transition-all duration-300 hover:transform hover:scale-105">
							<CardContent className="p-8 text-center space-y-4">
								<div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
									<svg
										className="w-8 h-8 text-white"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
										/>
									</svg>
								</div>
								<h3 className="text-xl font-semibold text-white">Mentoring</h3>
								<p className="text-gray-400">
									Connect with experienced mentors and industry experts
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Demo Section */}
			<section className="py-20 bg-gradient-to-b from-gray-900/20 to-transparent">
				<div className="container mx-auto px-6">
					<div className="max-w-4xl mx-auto text-center space-y-8">
						<h2 className="text-4xl font-bold text-white mb-4">
							Try AI Assistant
						</h2>
						<p className="text-xl text-gray-400 mb-8">
							Experience the power of AI-powered conversations
						</p>

						<Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border-gray-700 backdrop-blur-sm">
							<CardContent className="p-12">
								<div className="space-y-6">
									<div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
										<svg
											className="w-10 h-10 text-white"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
											/>
										</svg>
									</div>
									<h3 className="text-2xl font-semibold text-white">
										AI Assistant Ready
									</h3>
									<p className="text-gray-400 text-lg">
										Click the button below to start a conversation with AI
										replica and test Evoo capabilities
									</p>
									<Button
										size="lg"
										className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
									>
										Try Now
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Testimonials Section */}
			<section className="py-20">
				<div className="container mx-auto px-6">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-white mb-4">
							What Our Users Say
						</h2>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<Card className="bg-gray-900/50 border-gray-800">
							<CardContent className="p-8">
								<div className="space-y-4">
									<div className="flex items-center space-x-1 text-yellow-400">
										{[...Array(5)].map((_, i) => (
											<svg
												key={i}
												className="w-5 h-5"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
										))}
									</div>
									<p className="text-gray-300 text-lg italic">
										"Evoo completely transformed how I network at conferences.
										The AI matching is incredibly accurate."
									</p>
									<div className="pt-4">
										<p className="font-semibold text-white">Sarah Johnson</p>
										<p className="text-gray-400">Startup Founder</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gray-900/50 border-gray-800">
							<CardContent className="p-8">
								<div className="space-y-4">
									<div className="flex items-center space-x-1 text-yellow-400">
										{[...Array(5)].map((_, i) => (
											<svg
												key={i}
												className="w-5 h-5"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
										))}
									</div>
									<p className="text-gray-300 text-lg italic">
										"As an investor, Evoo helps me find the most promising
										startups efficiently."
									</p>
									<div className="pt-4">
										<p className="font-semibold text-white">Michael Chen</p>
										<p className="text-gray-400">Venture Capitalist</p>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-gray-900/50 border-gray-800">
							<CardContent className="p-8">
								<div className="space-y-4">
									<div className="flex items-center space-x-1 text-yellow-400">
										{[...Array(5)].map((_, i) => (
											<svg
												key={i}
												className="w-5 h-5"
												fill="currentColor"
												viewBox="0 0 20 20"
											>
												<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
											</svg>
										))}
									</div>
									<p className="text-gray-300 text-lg italic">
										"The mentoring feature connected me with industry experts
										who changed my perspective."
									</p>
									<div className="pt-4">
										<p className="font-semibold text-white">Alex Rodriguez</p>
										<p className="text-gray-400">Tech Entrepreneur</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-20 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20">
				<div className="container mx-auto px-6 text-center">
					<div className="max-w-3xl mx-auto space-y-8">
						<h2 className="text-4xl font-bold text-white">
							Ready to Transform Your Networking?
						</h2>
						<p className="text-xl text-gray-300">
							Join thousands of entrepreneurs who already use Evoo to find
							partners and investors
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								size="lg"
								className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
							>
								Start Free
							</Button>
							<Button
								size="lg"
								variant="outline"
								className="border-gray-400 text-gray-300 hover:bg-gray-800 px-8 py-4 text-lg"
							>
								Contact Us
							</Button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
