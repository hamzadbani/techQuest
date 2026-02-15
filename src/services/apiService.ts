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

export async function fetchPendingChallenges() {
    try {
        const response = await fetch('http://localhost:5000/api/admin/pending');
        if (!response.ok) throw new Error('Failed to fetch pending');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function approveChallenge(id: string, updates: any) {
    try {
        const response = await fetch(`http://localhost:5000/api/admin/approve/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function adminLogin(password: string) {
    try {
        const response = await fetch('http://localhost:5000/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return { success: false };
    }
}

export async function fetchBlogs() {
    try {
        const response = await fetch('http://localhost:5000/api/blogs');
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

export async function fetchBlogBySlug(slug: string) {
    try {
        const response = await fetch(`http://localhost:5000/api/blogs/${slug}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function saveBlog(blogData: any) {
    try {
        const response = await fetch('http://localhost:5000/api/admin/blogs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(blogData),
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

export async function submitChallenge(challengeData: any) {
    try {
        const response = await fetch('http://localhost:5000/api/challenges/contribute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(challengeData),
        });
        if (!response.ok) throw new Error('Failed to submit challenge');
        return await response.json();
    } catch (error) {
        console.error('Error submitting challenge:', error);
        return null;
    }
}
