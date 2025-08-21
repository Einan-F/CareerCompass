export const ALLOWED_DOCUMENT_TYPES = {
  mimeTypes: [
    'application/pdf',                                                    // .pdf
    'application/msword',                                                // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
  ],
  extensions: ['.pdf', '.doc', '.docx']
};

export const isValidDocumentType = (file) => {
  // Check MIME type
  if (ALLOWED_DOCUMENT_TYPES.mimeTypes.includes(file.type)) {
    return true;
  }

  // Fallback to extension check if MIME type check fails
  const fileName = file.name.toLowerCase();
  return ALLOWED_DOCUMENT_TYPES.extensions.some(ext => fileName.endsWith(ext));
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileTypeFromName = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'PDF';
    case 'doc':
      return 'DOC';
    case 'docx':
      return 'DOCX';
    default:
      return ext.toUpperCase();
  }
};
