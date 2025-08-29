// services/aiCache.ts
// Cache in-memory theo session (có thể thay bằng MMKV/AsyncStorage nếu muốn lâu dài)

const aiAnswerCache = new Map<string, string>();

// Tạo key duy nhất dựa vào lessonId + prompt
export const makeAIKey = (lessonId: string, prompt: string) => {
    return `${lessonId}::${prompt.trim().toLowerCase()}`;
};

// Lấy dữ liệu cache
export const getCachedAI = (key: string): string | null => { 
    return aiAnswerCache.get(key) ?? null;
};

// Set dữ liệu cache
export const setCachedAI = (key: string, value: string) => {
    aiAnswerCache.set(key, value);
};
