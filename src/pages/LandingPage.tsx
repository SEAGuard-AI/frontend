import { ArrowRight, Shield, MapPin, Bell, Radio, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ModernMapHero from "@/components/ModernMapHero";
import { useAuth } from "@/contexts/AuthContext";
import { usePreferences } from "@/contexts/UserPreferencesContext";

const features = [
	{
		icon: Bell,
		title: "Real-time Alerts",
		description:
			"Instant push notifications for earthquakes, tsunamis, floods, and other natural disasters across ASEAN nations.",
	},
	{
		icon: MapPin,
		title: "Evacuation Routes",
		description:
			"AI-powered safe route planning with live traffic data and shelter mapping for rapid emergency evacuation.",
	},
	{
		icon: Shield,
		title: "Risk Assessment",
		description:
			"Country-level risk forecasts with historical data analysis and predictive modeling for disaster preparedness.",
	},
	{
		icon: Radio,
		title: "Emergency Contacts",
		description:
			"One-tap access to local emergency services, embassies, and relief organizations in every ASEAN country.",
	},
	{
		icon: BookOpen,
		title: "Survival Guides",
		description:
			"Step-by-step disaster response guides with offline access — from earthquake safety to flood survival.",
	},
	{
		icon: Users,
		title: "Community Network",
		description:
			"Connect with nearby users, share real-time conditions, and coordinate mutual aid during emergencies.",
	},
];

const LandingPage = () => {
	const { isAuthenticated, user, logout } = useAuth();
	const { preferences } = usePreferences();
	const appEntryPath = preferences.setupComplete ? "/dashboard" : "/setup";
	const appEntryLabel = preferences.setupComplete ? "Open Dashboard" : "Continue Setup";

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
			{/* Navigation Bar */}
			<nav className="fixed top-0 w-full z-50 p-4">
				<div className="mx-auto max-w-7xl flex items-center justify-between clay px-6 py-4">
					<div className="flex items-center gap-3">
						<img
							src="/logo-1.png"
							alt="SeaGUARD logo"
							className="h-10 w-10 rounded-xl object-cover shadow-clay"
						/>
						<span className="text-xl font-bold tracking-tight">
							SeaGUARD
						</span>
					</div>

					{isAuthenticated ? (
						<div className="flex items-center gap-3">
							<span className="hidden sm:block text-sm text-muted-foreground">
								Signed in as <span className="font-semibold text-foreground">{user?.name || "User"}</span>
							</span>
							<Button
								asChild
								className="clay-btn clay-primary h-10 px-6 rounded-xl font-bold"
							>
								<Link to={appEntryPath}>
									{appEntryLabel}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button
								variant="outline"
								onClick={logout}
								className="h-10 rounded-xl border-transparent bg-card text-foreground hover:bg-accent/60"
							>
								Log out
							</Button>
						</div>
					) : (
						<div className="flex items-center gap-4">
							<Link
								to="/login"
								className="text-sm font-medium hover:text-primary transition-colors"
							>
								Log in
							</Link>
							<Button
								asChild
								className="clay-btn clay-primary h-10 px-6 rounded-xl font-bold hidden sm:flex"
							>
								<Link to="/login">
									Get Started
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					)}
				</div>
			</nav>

			{/* Hero Section */}
			<main className="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-7xl mx-auto px-6 pt-32 pb-16 gap-12 lg:gap-24 relative z-10">
				{/* Left Column - Text Content */}
				<div className="flex-1 space-y-8 max-w-2xl animate-fade-in z-20">
					<div className="inline-flex items-center gap-2 rounded-full clay-sm bg-accent/50 px-4 py-2 text-sm font-medium text-primary">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
						</span>
						Real-time Disaster Monitoring
					</div>

					<h1 className="text-5xl lg:text-7xl font-black tracking-tight leading-tight">
						ASEAN Disaster{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive drop-shadow-sm">
							Response &
						</span>{" "}
						Recovery
					</h1>

					<p className="text-lg text-muted-foreground leading-relaxed">
						A centralized, intelligent platform for coordinating
						emergency response, navigating safe evacuation zones,
						and providing real-time alerts across Southeast Asia.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 pt-4">
						<Button
							asChild
							className="clay-btn clay-primary h-14 px-8 rounded-2xl text-base font-bold w-full sm:w-auto"
						>
							<Link to={isAuthenticated ? appEntryPath : "/login"}>
								{isAuthenticated ? appEntryLabel : "Access System"}
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						{isAuthenticated ? (
							<Button
								variant="outline"
								onClick={logout}
								className="clay h-14 px-8 rounded-2xl text-base font-bold bg-card w-full sm:w-auto text-foreground border-transparent hover:bg-accent/50 transition-colors"
							>
								Log out
							</Button>
						) : (
							<Button
								asChild
								variant="outline"
								className="clay h-14 px-8 rounded-2xl text-base font-bold bg-card w-full sm:w-auto text-foreground border-transparent hover:bg-accent/50 transition-colors"
							>
							</Button>
						)}
					</div>

					<div className="pt-8 flex items-center gap-8 text-sm font-semibold text-muted-foreground">
						<div className="flex flex-col gap-1">
							<span className="text-new-foreground text-3xl font-black text-foreground">
								10+
							</span>
							<span>Active Zones</span>
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-new-foreground text-3xl font-black text-foreground">
								24/7
							</span>
							<span>Monitoring</span>
						</div>
					</div>
				</div>

				{/* Right Column - Map Component */}
				<div
					className="flex-1 w-full max-w-xl lg:max-w-none relative animate-scale-in flex justify-center items-center z-10 order-first md:order-last"
					style={{ animationDelay: "0.2s" }}
				>
					<div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full mix-blend-multiply opacity-50 dark:opacity-20 animate-pulse" />
					<div className="relative w-full aspect-square max-w-[600px]">
						<ModernMapHero />
					</div>
				</div>
			</main>

			{/* Features Section */}
			<section className="relative w-full max-w-7xl mx-auto px-6 py-16 lg:py-24 z-10">
				<div className="text-center mb-12 lg:mb-16">
					<div className="inline-flex items-center gap-2 rounded-full clay-sm bg-accent/50 px-4 py-2 text-sm font-medium text-primary mb-6">
						Platform Features
					</div>
					<h2 className="text-3xl lg:text-5xl font-black tracking-tight max-w-3xl mx-auto">
						Everything you need for{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive">
							disaster resilience
						</span>
					</h2>
					<p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
						Built for ASEAN communities — from early warning to recovery coordination.
					</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature) => (
						<div
							key={feature.title}
							className="clay rounded-2xl p-6 flex flex-col gap-4 hover:scale-[1.02] transition-transform duration-200"
						>
							<div className="clay-sm h-12 w-12 rounded-xl flex items-center justify-center bg-primary/10">
								<feature.icon className="h-6 w-6 text-primary" />
							</div>
							<h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
							<p className="text-sm text-muted-foreground leading-relaxed">
								{feature.description}
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Demo Video Section */}
			<section className="relative w-full max-w-7xl mx-auto px-6 py-16 lg:py-24 z-10">
				<div className="text-center mb-10">
					<div className="inline-flex items-center gap-2 rounded-full clay-sm bg-accent/50 px-4 py-2 text-sm font-medium text-primary mb-6">
						See It In Action
					</div>
					<h2 className="text-3xl lg:text-5xl font-black tracking-tight max-w-3xl mx-auto">
						Watch the{" "}
						<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive">
							platform demo
						</span>
					</h2>
					<p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
						See how SeaGUARD helps communities prepare, respond, and recover from natural disasters.
					</p>
				</div>

				<div className="clay rounded-3xl p-3 sm:p-4 max-w-4xl mx-auto">
					<div className="relative w-full rounded-2xl overflow-hidden bg-muted aspect-video flex items-center justify-center">
						{/* Replace the src below with your actual video embed URL */}
						<iframe
							className="absolute inset-0 w-full h-full"
							src=""
							title="SeaGUARD Demo Video"
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
						/>
						{/* Placeholder overlay shown when no video src is set */}
						<div className="relative z-10 flex flex-col items-center gap-4 text-muted-foreground">
							<div className="clay h-16 w-16 rounded-full flex items-center justify-center bg-primary/10">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
									<path d="M8 5v14l11-7z" />
								</svg>
							</div>
							<span className="text-sm font-semibold">Demo video coming soon</span>
						</div>
					</div>
				</div>
			</section>

			{/* App Showcase Section */}
			<section className="relative w-full max-w-7xl mx-auto px-6 py-16 lg:py-28 z-10 flex flex-col items-center overflow-hidden">
				{/* Decorative glow behind devices */}
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

				<div className="inline-flex items-center gap-2 rounded-full clay-sm bg-accent/50 px-4 py-2 text-sm font-medium text-primary mb-6">
					Available Everywhere
				</div>

				<h2 className="text-3xl lg:text-5xl font-black tracking-tight text-center max-w-3xl mb-3 px-4">
					One platform,{" "}
					<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-destructive">
						every device
					</span>
				</h2>
				<p className="text-muted-foreground text-lg text-center max-w-xl mb-12">
					Access critical disaster information on desktop or mobile — anytime, anywhere across Southeast Asia.
				</p>

				<div className="relative w-full max-w-5xl mx-auto flex justify-center items-center px-4 sm:px-8 pb-16">
					<img
						src="/macbook.png"
						alt="Dashboard on Macbook"
						className="relative w-full md:w-[75%] object-contain drop-shadow-2xl z-10 animate-float ml-auto"
					/>
					<img
						src="/phone.png"
						alt="Mobile app on Phone"
						className="absolute left-[5%] sm:left-[10%] lg:left-[15%] bottom-[30%] sm:bottom-[40%] lg:bottom-[35%] w-[50%] md:w-[40%] lg:w-[35%] max-w-[280px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-20 animate-float-reverse"
					/>
				</div>

				{/* Trust badges */}
				<div className="flex flex-wrap justify-center gap-6 mt-4">
					{["10 ASEAN Nations", "Multi-language"].map((badge) => (
						<div key={badge} className="clay-sm rounded-full px-5 py-2 text-sm font-semibold text-muted-foreground">
							{badge}
						</div>
					))}
				</div>
			</section>

			{/* Decorative background elements */}
			<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
				<div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
				<div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-destructive/5 rounded-full blur-[100px]" />
			</div>
		</div>
	);
};

export default LandingPage;
