import { EVENTS, type CallBackProps, type Step } from 'react-joyride';
import { JoyrideLazy } from './joyride-lazy';
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
		spotlightClicks: true,
	},
	{
		target: '[data-onboarding="select-code-source"]',
		title: 'Select your source',
		content: 'Click here to upload your codebase.',
		spotlightClicks: true,
	},
];

type OnboardingState = null | 'skipped' | 'finished';

export function Onboarding() {
	const [isUploadOpen, setIsUploadOpen] = useAtom(isUploadOpenAtom);

	const [isOnboarding, setIsOnboarding] = useState(false);
	const [stepIndex, setStepIndex] = useState(0);

	useEffect(() => {
		if (isOnboarding && stepIndex === 2 && !isUploadOpen) {
			setIsUploadOpen(true);
		}
	}, [isOnboarding, isUploadOpen]);

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

	const handleJoyrideCallback = async (data: CallBackProps) => {
		const { action, index, type, status, step } = data;
		console.log(data);

		// Run code when user clicks "Next" or "Back"
		if (type === EVENTS.STEP_AFTER) {
			console.log(`Completed step ${index}`);
			
			// Run specific code for each step
			switch (index) {
				case 0:
					console.log('Welcome step completed');
					setStepIndex(1);
					break;
				case 1:
					setIsUploadOpen(true);
					// Wait up to 1000ms or until the element appears
					await new Promise<void>((resolve) => {
						const timeout = setTimeout(resolve, 1000);
						const check = () => {
							if (document.querySelector('[data-onboarding="select-code-source"]')) {
								clearTimeout(timeout);
								resolve();
							} else {
								requestAnimationFrame(check);
							}
						};
						check();
					});
					setStepIndex(2);
					// setTimeout(() => {
					// }, 1000);
					console.log('Writer step completed');
					break;
				default:
					break;
			}
			// setStepIndex((prev) => prev + 1);
		}

		// When onboarding is finished
		if (status === 'finished') {
			setIsOnboarding(false);
			localStorage.setItem('onboarding', 'finished');
			return;
		}

		// When onboarding is skipped
		if (status === 'skipped') {
			setIsOnboarding(false);
			localStorage.setItem('onboarding', 'skipped')
			return;
		}
	};

	return (
		<>
			<JoyrideLazy
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
