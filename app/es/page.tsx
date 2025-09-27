export default function Home() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-surface-50 to-background">
			<div className="container mx-auto px-6 py-12">
				<div className="text-center space-y-8">
					<div className="space-y-4">
						<h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent-500 to-primary bg-clip-text text-transparent">
							Sensay dApp
						</h1>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							Experimenta el futuro de las conversaciones impulsadas por IA con nuestra interfaz elegante y moderna
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
						<div className="card-elegant p-6 text-center space-y-4">
							<div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
								<svg
									className="w-6 h-6 text-primary"
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
							<h3 className="text-lg font-semibold">Conversaciones con IA</h3>
							<p className="text-muted-foreground">
								Participa en conversaciones inteligentes con réplicas avanzadas de IA
							</p>
						</div>

						<div className="card-elegant p-6 text-center space-y-4">
							<div className="w-12 h-12 mx-auto bg-accent-500/10 rounded-xl flex items-center justify-center">
								<svg
									className="w-6 h-6 text-accent-500"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 10V3L4 14h7v7l9-11h-7z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold">Chat en Tiempo Real</h3>
							<p className="text-muted-foreground">
								Experimenta comunicación fluida en tiempo real con respuestas instantáneas
							</p>
						</div>

						<div className="card-elegant p-6 text-center space-y-4">
							<div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
								<svg
									className="w-6 h-6 text-primary"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<h3 className="text-lg font-semibold">Seguro y Privado</h3>
							<p className="text-muted-foreground">
								Tus conversaciones están protegidas con seguridad de nivel empresarial
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
