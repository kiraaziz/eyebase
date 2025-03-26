"use client"
import MonacoEditor, { loader } from '@monaco-editor/react'

loader.init().then((monaco) => {
    monaco.editor.defineTheme('transparentTheme', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
            'editor.background': '#00000000',
        },
    })
})

const codes = (path: any) => [
    `// Function to fetch all documents
const useGetDocuments = async (apiKey) => {
  const response = await fetch('${path}/api/go/v0.1', {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiKey,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }
  return response.json();
};`,
    `// Function to fetch a single document by ID
const useGetDocument = async (apiKey, documentId) => {
  const response = await fetch(\`${path}/api/go/v0.1/\${documentId}\`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiKey,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch document');
  }
  return response.json();
};`,
    `// Function to create a new document
const useCreateDocument = async (apiKey, data) => {
  const response = await fetch('${path}/api/go/v0.1', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiKey,
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error('Failed to create document');
  }
  return response.json();
};`,
    `// Function to update an existing document
const useUpdateDocument = async (apiKey, documentId, data) => {
  const response = await fetch(\`${path}/api/go/v0.1/\${documentId}\`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiKey,
    },
    body: JSON.stringify({ data }),
  });

  if (!response.ok) {
    throw new Error('Failed to update document');
  }
  return response.json();
};`,
    `// Function to delete a document
const useDeleteDocument = async (apiKey, documentId) => {
  const response = await fetch(\`${path}/api/go/v0.1/\${documentId}\`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      "Authorization": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete document');
  }
  return response.json();
};`
]

export default function Code() {

    return (
        <div className='grid grid-cols-2 gap-2'>
            <div>

            </div>
            {codes("https://eyebase.vercel.app").map((el) => (
                <div className='bg-muted/20 backdrop-blur-xl  border p-3 rounded-lg'>
                    <MonacoEditor
                        height={400}
                        defaultLanguage="javascript"
                        theme="transparentTheme"
                        value={el}
                        options={{
                            wordWrap: "off",
                            
                        }}
                    />
                </div>
            ))}
        </div>
    )
}
