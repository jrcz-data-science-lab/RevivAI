# RevivAI

RevivAI is an AI-powered code documentation assistant designed to help developers understand and document their codebases effectively. It leverages advanced language models to analyze code and generate meaningful documentation, making it easier for teams to maintain and share knowledge about their projects.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Usage Examples](#usage-examples)
- [Contributing](#contributing)
- [License](#license)

## Overview

RevivAI provides a user-friendly interface for interacting with AI models to generate documentation from codebases. It supports both local file uploads and remote repositories, allowing users to easily document their projects regardless of their source.

## Features

- **AI-Powered Documentation**: Automatically generate documentation from codebases using advanced language models.
- **Local and Remote Support**: Upload code files directly or link to public GitHub repositories.
- **Customizable Settings**: Configure LLM provider settings and adjust documentation parameters.
- **User-Friendly Interface**: Intuitive UI for managing projects and viewing generated documentation.
- **Real-Time Chat Interface**: Interact with the AI in a chat format to ask questions about the code.

## Setup Instructions

To set up RevivAI locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/revivai.git
   cd revivai
   ```

2. **Install Dependencies**:
   Ensure you have [Node.js](https://nodejs.org/) installed, then run:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root directory and add the following variables:
   ```env
   PUBLIC_OLLAMA_API_URL=your_llm_api_url
   PUBLIC_OLLAMA_API_MODEL=your_llm_model
   ```

4. **Run the Application**:
   Start the development server:
   ```bash
   npm run dev
   ```

5. **Access the Application**:
   Open your browser and navigate to `http://localhost:3000`.

## Docker
1. Build the Docker image:
   ```bash
   docker build -t revivai .
   ```

2. Run the Docker container:
   ```bash
   docker run -p 3000:3000 --name revivai-app revivai
   ```

## Usage Examples

### Uploading a Codebase

To upload a codebase, click on the "Upload" button in the navbar. You can choose to upload files from your local machine or provide a URL to a public GitHub repository.

### Interacting with the AI

Once your codebase is uploaded, you can start a chat with the AI. Type your questions in the chat input, such as:
- "What does this function do?"
- "Can you explain the structure of this codebase?"

### Generating Documentation

After analyzing your code, RevivAI will generate documentation based on the provided codebase. You can view and export this documentation for your project.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
