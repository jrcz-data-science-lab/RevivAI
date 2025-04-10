import { z } from 'zod';
import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ProjectsNewProps {
	onCreate: (data: ProjectNewFormSchema) => void;
}

export type ProjectNewFormSchema = z.infer<typeof formSchema>;

// Schema for form validation
const formSchema = z.object({
	projectName: z
		.string()
        .trim()
		.min(2, {
			message: 'Project name must be at least 2 characters.',
		})
		.max(30, {
			message: 'Project name must be at most 30 characters.',
		}),
});

/**
 * Create a new project form
 */
function ProjectsNew({ onCreate }: ProjectsNewProps) {
	const form = useForm<ProjectNewFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			projectName: '',
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="block ml-auto">New Project</Button>
			</DialogTrigger>

			<DialogContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onCreate)} className="space-y-8">
						<FormField
							control={form.control}
							name="projectName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Project Name</FormLabel>
									<FormControl>
										<Input placeholder="My graduation project" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full">
							Create
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export default memo(ProjectsNew);

