import Joyride, { type Step, type CallBackProps, EVENTS, ACTIONS } from 'react-joyride';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { OnboardingTooltip } from './onboarding-tooltip';
import { toast } from 'sonner';
import { useAtom } from 'jotai';
import { isUploadOpenAtom } from '../upload/upload';

const steps: Step[] = [
	{
		target: 'body',
		placement: 'center',
		title: 'Welcome to RevivAI',
		content:
			'This quick tutorial will show you how to use this tool to generate documentation for your projects. Click next to continue.',
	},
	{
		target: '[data-onboarding="upload-code"]',
		title: 'Upload code',
		content: 'Click here to upload your codebase.',
		spotlightClicks: true
	},
	{
		target: '[data-onboarding="select-code-source"]',
		title: 'Select your source',
		content: 'Click here to upload your codebase.',
	},
];

type OnboardingState = null | 'skipped' | 'finished';

export function Onboarding() {
	const [isUploadOpen, setIsUploadOpen] = useAtom(isUploadOpenAtom);

	const [isOnboarding, setIsOnboarding] = useState(true);
	const [stepIndex, setStepIndex] = useState(0);

	useEffect(() => {
		if (isUploadOpen) {
			setTimeout(() => {
				setStepIndex(2);
			}, 100);
		}
	}, [isUploadOpen]);


	// Start onboarding if the user is not finished it
	useEffect(() => {
		const onboardingState = localStorage.getItem('onboarding') ?? 'first-time' as OnboardingState;
		// if (onboardingState === 'finished') return;

		setTimeout(() => {
			toast('Tutorial', {
				description: 'Would you like a quick tutorial on how to use this tool?',
				duration: 30000,
				action: (
					<Button variant="default" size="sm" onClick={startOnboarding} className="ml-auto">
						Let's Start!
					</Button>
				),
			});
		}, 1000);
	}, []);

    const startOnboarding = () => {
		toast.dismiss();
        setIsOnboarding(true);
    };

	const handleJoyrideCallback = (data: CallBackProps) => {
		const { action, index, type, status, step } = data;
		console.log(data);

		// Run code when user clicks "Next" or "Back"
		if (type === EVENTS.STEP_AFTER) {
			console.log(`Completed step ${index}`);
			setStepIndex((prev) => prev + 1);
			
			// Run specific code for each step
			switch (index) {
				case 0:
					console.log('Welcome step completed');
					break;
				case 1:
					setIsUploadOpen(true);
					console.log('Writer step completed');
					break;
				default:
					break;
			}
		}

		if (status === 'finished') {
			setIsOnboarding(false);
			localStorage.setItem('onboarding', 'finished');
		}

		if (status === 'skipped') {
			localStorage.setItem('onboarding', 'skipped');
		}
	};

	return (
		<>
			<Joyride
				run={isOnboarding}
				stepIndex={stepIndex}
				continuous={true}
				showProgress={true}
				showSkipButton={true}
				disableOverlayClose={true}
				steps={steps}
				callback={handleJoyrideCallback}
				tooltipComponent={OnboardingTooltip}
				styles={{
					options: {
						overlayColor: 'rgba(0, 0, 0, 0.3)',
						arrowColor: 'var(--accent)',
						zIndex: 1000,
						primaryColor: 'var(--foreground)',
					},
					spotlight: {
						borderRadius: 'calc(var(--radius) - 2px)',
					}
				}}
				locale={{
					back: '← Back',
					close: '',
					last: 'Done ✓',
					next: 'Next →',
					skip: 'Skip',
				}}
			/>
		</>
	);
}
