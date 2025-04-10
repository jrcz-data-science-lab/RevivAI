import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { UploadForm } from './upload-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { FolderUp, Github } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Schema for form validation
const formSchema = z.object({
	uploadType: z.enum(['github', 'files']),
	githubUrl: z.string().url('Please enter a valid URL').optional(),
	description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description is too long'),
});

type UploadFormSchema = z.infer<typeof formSchema>;

export function Upload() {
	const [isOpen, setIsOpen] = useState(false);
	const [uploadType, setUploadType] = useState<'github' | 'files'>('files');

	const form = useForm<UploadFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			uploadType: 'files',
			githubUrl: '',
			description: '',
		},
	});

	const onTabChange = (value: string) => {
		setUploadType(value as 'github' | 'files');
		form.setValue('uploadType', value as 'github' | 'files');
	};

	const onSubmit = (data: UploadFormSchema) => {
		console.log(data);
		setIsOpen(false);
	};

	return (
		<Dialog defaultOpen={true} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" round title="Upload code files">
					<FolderUp />
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-3xl translate-y-0 top-8">
				<DialogHeader className="mb-4">
					<DialogTitle>Let's upload your code!</DialogTitle>
					<DialogDescription>Upload your project files from GitHub or from your local directory.</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<Tabs defaultValue="files" onValueChange={onTabChange}>
							<FormLabel>Code Source</FormLabel>
							<TabsList>
								<TabsTrigger value="files" className="px-3">
									<FolderUp />
									Local Files
								</TabsTrigger>
								<TabsTrigger value="github" className="px-3">
									<Github />
									Repository
								</TabsTrigger>
							</TabsList>

							<TabsContent value="github" className="space-y-4 mt-4">
								<FormField
									control={form.control}
									name="githubUrl"
									render={({ field }) => (
										<FormItem>
											<FormLabel>GitHub Repository URL</FormLabel>
											<FormControl>
												<Input placeholder="https://github.com/username/repository" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</TabsContent>

							<TabsContent value="files" className="space-y-4 mt-4">
								<FormItem>
									<UploadForm />
								</FormItem>
							</TabsContent>
						</Tabs>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Code Description</FormLabel>
									<FormDescription>Describe your code and what it does.</FormDescription>
									<FormControl>
										<Textarea placeholder="This code is an API server for meteorology project, that ..." className="min-h-32 resize-none" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full">
							Upload Project
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
