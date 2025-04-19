import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GithubIcon } from '@/components/ui/github-icon';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { FolderUp, LoaderCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { actions } from 'astro:actions';
import { Checkbox } from '@/components/ui/checkbox';
import { UploadFiles } from './upload-files';
import type { CodebaseType } from '@/hooks/useDb';
import type { PromptifyFilesResult } from '@/actions/promptifyFiles';

export type UploadFormSchema = z.infer<typeof formSchema>;

// Schema for form validation
const formSchema = z.object({
	type: z.enum(['remote', 'files']),
	files: z.array(z.instanceof(File)).optional(),
	url: z.string().url('Please enter a valid repository URL').optional(),
	compress: z.boolean(),
	ignore: z.string().optional(),
	description: z.string().max(500, 'Description is too long'),
});

interface UploadFormProps {
	onUploadSuccess: (data: PromptifyFilesResult, form: UploadFormSchema) => void;
}

/**
 * Code uploading form
 */
export function UploadForm({ onUploadSuccess }: UploadFormProps) {
	const form = useForm<UploadFormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: { type: 'files', compress: false, description: '' },
	});

	// True if form is submitting
	const isUploading = form.formState.isSubmitting;

	// Handle form submission
	const onSubmit = async (formData: UploadFormSchema) => {
		try {
			console.log('Form data:', formData);

			if (formData.type === 'remote' && formData.url) {
				const { data, error } = await actions.promptifyRemote({
					url: formData.url,
					compress: formData.compress,
					ignore: formData.ignore,
				});

				if (error) form.setError('root', { message: error.message ?? 'Something went wrong' });
				if (data) {
					onUploadSuccess?.(data, formData);
					form.reset();
				}
				
				console.log(data, error);
			}

			if (formData.type === 'files' && formData.files) {
				const formDataToSend = new FormData();
				for (const file of formData.files) {
					formDataToSend.append('files', file, file.webkitRelativePath || file.name);
				}

				formDataToSend.append('compress', String(formData.compress));
				formDataToSend.append('ignore', formData.ignore || '');
				formDataToSend.append('description', formData.description);

				const { data, error } = await actions.promptifyFiles(formDataToSend);

				if (error) form.setError('root', { message: error.message ?? 'Something went wrong' });
				if (data) {
					onUploadSuccess?.(data, formData);
					form.reset();
				}
				
				console.log(data, error);
			}
		} catch (error) {
			console.error('Error uploading files:', error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<Tabs className="w-full" value={form.watch('type')} onValueChange={(value) => !isUploading && form.setValue('type', value as CodebaseType)}>
					<FormLabel>Code Source</FormLabel>
					<TabsList>
						<TabsTrigger value="files" className="px-3">
							<FolderUp />
							Local Files
						</TabsTrigger>
						<TabsTrigger value="remote" className="px-3">
							<GithubIcon />
							Repository
						</TabsTrigger>
					</TabsList>

					<TabsContent value="remote" className="space-y-8 mt-8">
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Repository URL</FormLabel>
									<FormDescription>Link to the public GitHub repository. The repository must be public and accessible without authentication.</FormDescription>
									<FormControl>
										<Input placeholder="https://github.com/username/repository" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</TabsContent>

					<TabsContent value="files" className="space-y-4 mt-4">
						<FormField
							control={form.control}
							name="files"
							render={({ field }) => (
								<FormItem>
									<UploadFiles
										onChange={(files) => form.setValue('files', [...files])}
										message={field.value?.length ? `${field.value.length} files selected` : undefined}
									/>
									<FormMessage />
								</FormItem>
							)}
						/>
					</TabsContent>
				</Tabs>

				<FormField
					control={form.control}
					name="ignore"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ignore Patterns</FormLabel>
							<FormDescription>Comma-separated patterns to ignore.</FormDescription>
							<FormControl>
								<Input placeholder="**/*.gif" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="compress"
					render={({ field }) => (
						<FormItem className="flex gap-2">
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>

							<div className="flex flex-col gap-1.5 leading-none">
								<FormLabel>Compress Code</FormLabel>
								<FormDescription>
									Extract key code elements to reduce token count, while maintaining structure. Decreases documentation quality, so use carefully.
								</FormDescription>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* <FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Code Description</FormLabel>
							<FormDescription>Describe your code and what it does.</FormDescription>
							<FormControl>
								<Textarea placeholder="This code is an API server for meteorology project, that ..." className="min-h-24 resize-none" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/> */}

				<Button type="submit" className="w-full" disabled={isUploading}>
					{isUploading && <LoaderCircle className="animate-spin" />}
					Upload Code
				</Button>
			</form>
		</Form>
	);
}
