
import { supabase } from '../supabaseClient';
import { Post } from '../types';

export const PostService = {
    /**
     * Fetch all posts from Supabase, ordered by creation time descending.
     */
    async getPosts(): Promise<Post[]> {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching posts:', error);
            return [];
        }

        return (data as any[]).map(item => ({
            id: item.id,
            title: item.title,
            content: item.content,
            category: item.category,
            author: {
                name: item.author,
                role: item.role as any, // Simple casting for demo
                badges: []
            },
            date: new Date(item.created_at).toLocaleDateString(),
            likes: Number(item.likes),
            comments: 0, // Not implemented in DB yet
            tags: item.tags || []
        }));
    },

    /**
     * Create a new post in Supabase
     */
    async createPost(post: Omit<Post, 'id' | 'date' | 'likes' | 'comments'>): Promise<Post | null> {
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title: post.title,
                    content: post.content,
                    category: post.category,
                    author: post.author.name,
                    role: post.author.role,
                    tags: post.tags,
                    likes: 0
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating post:', error);
            return null;
        }

        return {
            id: data.id,
            title: data.title,
            content: data.content,
            category: data.category,
            author: {
                name: data.author,
                role: data.role as any,
                badges: []
            },
            date: new Date(data.created_at).toLocaleDateString(),
            likes: data.likes,
            comments: 0,
            tags: data.tags
        };
    }
};
