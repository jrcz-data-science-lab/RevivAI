import { actions } from 'astro:actions';
import type { PromptifyResult } from '@/actions/promptify';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { GithubIcon } from '@/components/ui/github-icon';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { CodebaseType } from '@/hooks/useCodebase';
import { createFileFilter } from '@/lib/filterFiles';
import { promptifySchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { FolderUp, LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { UploadFiles } from './upload-files';

export type UploadFormSchema = z.infer<typeof promptifySchema>;

interface UploadFormProps {
	initialValues?: UploadFormSchema;
	onUploadSuccess: (data: PromptifyResult, form: UploadFormSchema) => void;
}

/**
 * Code uploading form
 */
export function UploadForm({ onUploadSuccess }: UploadFormProps) {
	const [tab, setTab] = useState<CodebaseType>('files');

	// Initialize the form with the schema and default values
	const form = useForm<UploadFormSchema>({
		resolver: zodResolver(
			tab === 'remote' ? promptifySchema.omit({ files: true }) : promptifySchema.omit({ url: true }),
		),
		defaultValues: { type: 'files', url: '', files: [], ignore: '', compress: false },
	});

	// True if form is submitting
	const isUploading = form.formState.isSubmitting;

	// Handle tab change
	const onTabChange = (value: CodebaseType) => {
		form.setValue('type', value);
		form.setValue('url', '');
		form.setValue('files', []);
		setTab(value);
	};

	/**
	 * Create FormData object from the form data
	 * @param data - The form data
	 * @returns FormData object
	 */
	const createFormData = async (data: UploadFormSchema) => {
		const formData = new FormData();

		formData.append('type', data.type);
		formData.append('compress', String(data.compress));
		formData.append('ignore', data.ignore || '');
		formData.append('include', data.include || '');

		// Append the type of codebase
		if (data.type === 'files' && data.files) {
			const ignores = data.ignore ? data.ignore.split(',').map((s) => s.trim()) : [];
			const includes = data.include ? data.include.split(',').map((s) => s.trim()) : [];
			const matchFile = createFileFilter(ignores, includes);
			let skipCount = 0;

			for (let i = 0; i < data.files.length; i++) {
				const file = data.files[i];
				const filePath = file.webkitRelativePath || file.name;

				// Skip uploading unnecessary files
				if (!matchFile(file)) continue;

				// Skip Replace big files (>20mb)
				if (file.size > 20_000_000) {
					skipCount += 1;
					continue;
				}

				formData.append('files', file, filePath);
			}

			if (skipCount > 0) {
				toast.error(`Skipped ${skipCount} files that are too large or do not match include patterns.`, {
					richColors: true,
				});
			}
		} else if (data.type === 'remote' && data.url) {
			formData.append('url', data.url);
		}

		return formData;
	};

	// Handle form submission
	const onSubmit = async (input: UploadFormSchema) => {
		// Show error if no files are selected
		if (input.type === 'files' && input.files?.length === 0) {
			form.setError('files', { message: 'Please select at least one file' });
			return;
		}

		try {
			const formData = await createFormData(input);
			const { data, error } = await actions.promptify(formData);

			// Handle errors
			if (error) {
				form.setError('root', { message: error.message ?? 'Something went wrong' });
				toast.error('Error uploading repository', { description: `${error}`, richColors: true });
				return;
			}

			// Handle success
			if (data) {
				onUploadSuccess?.(data, input);
				form.reset();
			}
		} catch (error) {
			toast.error('Error submitting the form', { description: `${error}`, richColors: true });
			console.error('Error submitting the form', error);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="space-y-8">
					<Tabs className="w-full" value={tab} onValueChange={(value) => onTabChange(value as CodebaseType)}>
						<FormLabel className="mb-1">Code Source</FormLabel>
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
					</Tabs>

					{tab === 'remote' && (
						<FormField
							control={form.control}
							name="url"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Repository URL</FormLabel>
									<FormDescription>
										Link to the public GitHub repository. The repository must be public and accessible without
										authentication.
									</FormDescription>
									<FormControl>
										<Input placeholder="https://github.com/username/repository" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					)}

					{tab === 'files' && (
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
					)}
				</div>

				<FormField
					control={form.control}
					name="include"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Include Patterns</FormLabel>
							<FormDescription>
								Only files matching these comma-separated glob patterns will be included.
							</FormDescription>
							<FormControl>
								<Input placeholder="src/**/*" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="ignore"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ignore Patterns</FormLabel>
							<FormDescription>Files matching these patterns will be excluded.</FormDescription>
							<FormControl>
								<Input placeholder="node_modules/**/*" {...field} />
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
									Extract key code elements to reduce token count, while maintaining structure. Decreases documentation
									quality, so use carefully.
								</FormDescription>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" className="w-full" disabled={isUploading}>
					{isUploading && <LoaderCircle className="animate-spin" />}
					Upload Code
				</Button>
			</form>
		</Form>
	);
}
