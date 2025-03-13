import { FileUploadForm } from '../file-upload/file-upload-form';
import Navbar from '../navbar';
import { ProjectsContainer } from './projects-container';

export function ProjectsNew() {
    return (
        <ProjectsContainer>
            <FileUploadForm />
        </ProjectsContainer>
	);
}
