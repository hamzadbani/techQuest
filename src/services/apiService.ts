export async function fetchChallenges(level: string, count: number = 20, exclude: string[] = []) {
    try {
        const excludeParam = exclude.length > 0 ? `&exclude=${exclude.join(',')}` : '';
        const response = await fetch(`http://localhost:5000/api/challenges?level=${level}&count=${count}${excludeParam}`);
        if (!response.ok) throw new Error('Failed to fetch challenges');
        return await response.json();
    } catch (error) {
        console.error('Error fetching challenges:', error);
        // Return empty array and let the component handle static fallback if needed
        // or we can keep the static json import in Platform.tsx as a hard fallback
        return [];
    }
}
