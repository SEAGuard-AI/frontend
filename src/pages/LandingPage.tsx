import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ModernMapHero from "@/components/ModernMapHero";

const LandingPage = () => {
	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
			{/* Navigation Bar */}
			<nav className="fixed top-0 w-full z-50 p-4">
				<div className="mx-auto max-w-7xl flex items-center justify-between clay px-6 py-4">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-clay">
							<Shield className="h-5 w-5 text-primary-foreground" />
						</div>
						<span className="text-xl font-bold tracking-tight">
							ADRRS
						</span>
					</div>

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
							<Link to="/login">
								Access System
								<ArrowRight className="ml-2 h-5 w-5" />
							</Link>
						</Button>
						<Button
							asChild
							variant="outline"
							className="clay h-14 px-8 rounded-2xl text-base font-bold bg-card w-full sm:w-auto text-foreground border-transparent hover:bg-accent/50 transition-colors"
						>
							<Link to="/login">Continue as Guest</Link>
						</Button>
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

				{/* Right Column - Map Component (Ordered First on Mobile) */}
				<div
					className="flex-1 w-full max-w-xl lg:max-w-none relative animate-scale-in flex justify-center items-center z-10 order-first md:order-last"
					style={{ animationDelay: "0.2s" }}
				>
					{/* Decorative glowing background blob */}
					<div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full mix-blend-multiply opacity-50 dark:opacity-20 animate-pulse" />

					<div className="relative w-full aspect-square max-w-[600px]">
						<ModernMapHero />
					</div>
				</div>
			</main>

			{/* Decorative background elements */}
			<div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
				<div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
				<div className="absolute top-[40%] -left-[10%] w-[40%] h-[40%] bg-destructive/5 rounded-full blur-[100px]" />
			</div>
		</div>
	);
};

export default LandingPage;
