/** Header the in-app PDF reader sends; plain navigation to the file URL won't have it. */
export const VIEWER_HEADER = "x-jo-viewer";

export const materialFileUrl = (id: string) => `/api/materials/${encodeURIComponent(id)}`;
